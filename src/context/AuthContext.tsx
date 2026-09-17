import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, type DbProfile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: DbProfile | null;
  role: 'member' | 'admin' | 'superadmin' | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isMember: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string, username?: string) => Promise<{ error: Error | null; user: User | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<DbProfile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch the authoritative profile from Supabase profiles table
  const fetchProfile = useCallback(async (userId: string, userEmail?: string, metadata?: any): Promise<DbProfile | null> => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching member profile from Supabase:', error);
        return null;
      }

      if (data) {
        return data as DbProfile;
      }

      // If profile row does not exist yet (e.g. trigger delay), attempt on-demand creation
      const email = userEmail || '';
      const name = metadata?.name || metadata?.full_name || email.split('@')[0] || 'Member';
      const username = metadata?.username || `${email.split('@')[0]}_${userId.slice(0, 4)}`;

      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          email,
          name,
          username,
          role: 'member',
          status: 'ACTIVE',
        })
        .select('*')
        .single();

      if (insertError) {
        console.warn('Profile auto-creation fallback failed:', insertError);
        return null;
      }

      return newProfile as DbProfile;
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    const prof = await fetchProfile(user.id, user.email, user.user_metadata);
    setProfile(prof);
  }, [user, fetchProfile]);

  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Initial session retrieval
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (!isMounted) return;
      if (error) {
        console.error('Error getting initial session:', error);
      }
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        fetchProfile(initialSession.user.id, initialSession.user.email, initialSession.user.user_metadata)
          .then((prof) => {
            if (isMounted) {
              setProfile(prof);
              setIsLoading(false);
            }
          });
      } else {
        setIsLoading(false);
      }
    });

    // Reactive Auth State listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!isMounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const prof = await fetchProfile(currentSession.user.id, currentSession.user.email, currentSession.user.user_metadata);
        if (isMounted) setProfile(prof);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.') };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };
    await refreshProfile();
    return { error: null };
  }, [refreshProfile]);

  const signUp = useCallback(async (email: string, password: string, name: string, username?: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.'), user: null };
    }
    const cleanUsername = username || `${email.split('@')[0]}_${Math.random().toString(36).slice(2, 6)}`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username: cleanUsername,
        },
      },
    });
    if (error) return { error, user: null };
    return { error: null, user: data.user };
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setSession(null);
      setProfile(null);
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    return { error: error ? new Error(error.message) : null };
  }, []);

  const updateProfile = useCallback(async (updates: Partial<DbProfile>) => {
    if (!user || !profile || !isSupabaseConfigured) {
      return { error: new Error('Cannot update profile: not authenticated.') };
    }

    // Never send role/status modifications through standard member updates to avoid trigger rejection
    const sanitizedUpdates = { ...updates };
    delete (sanitizedUpdates as any).role;
    delete (sanitizedUpdates as any).status;
    delete (sanitizedUpdates as any).user_id;
    delete (sanitizedUpdates as any).id;

    const { error } = await supabase
      .from('profiles')
      .update(sanitizedUpdates)
      .eq('user_id', user.id);

    if (error) {
      console.error('Profile update error:', error);
      return { error };
    }

    await refreshProfile();
    return { error: null };
  }, [user, profile, refreshProfile]);

  // Authoritative role evaluation directly from the database profile
  const role = useMemo(() => {
    if (!user || !profile) return null;
    return profile.role || 'member';
  }, [user, profile]);

  const isAdmin = useMemo(() => {
    return role === 'admin' || role === 'superadmin';
  }, [role]);

  const isSuperAdmin = useMemo(() => {
    return role === 'superadmin';
  }, [role]);

  const isMember = useMemo(() => {
    return Boolean(user && profile);
  }, [user, profile]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[Auth Trace] Supabase session user ID:', user?.id ?? 'UNAUTHENTICATED (PUBLIC)');
      console.log('[Auth Trace] Profile lookup result:', profile ? { id: profile.id, role: profile.role, email: profile.email, status: profile.status } : 'NONE');
      console.log('[Auth Trace] Authoritative resolved role:', role ?? 'PUBLIC');
    }
  }, [user, profile, role]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        isAdmin,
        isSuperAdmin,
        isMember,
        isLoading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
