import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || 'https://hesflcaaupmphtorfqij.supabase.co').trim();
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_unconfigured_init',
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
