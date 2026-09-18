import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const SUPABASE_URL = typeof rawUrl === 'string' ? rawUrl.trim() : '';
const SUPABASE_ANON_KEY = typeof rawAnonKey === 'string' ? rawAnonKey.trim() : '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  SUPABASE_URL !== 'https://placeholder.supabase.co' &&
  !SUPABASE_URL.includes('your-project')
);

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.warn(
    '[DETOX Configuration] Missing Supabase environment variables (VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY). ' +
    'Live backend synchronization and authentication are disabled until configured.'
  );
}

// Fallback dummy parameters prevent the Supabase client constructor from throwing at module initialization time
export const supabase = createClient(
  SUPABASE_URL || 'https://unconfigured.supabase.co',
  SUPABASE_ANON_KEY || 'unconfigured-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export type DbProfile = {
  id: string;
  user_id: string;
  name: string;
  username: string | null;
  email: string;
  avatar: string | null;
  bio: string | null;
  role: 'member' | 'admin' | 'superadmin';
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  skills: string[];
  created_at: string;
  updated_at: string;
};
