import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || 'https://hesflcaaupmphtorfqij.supabase.co').trim();
const SUPABASE_ANON_KEY = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhlc2ZsY2FhdXBtcGh0b3JmcWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NTY2MDksImV4cCI6MjEwNTIzMjYwOX0.VOVHsvH5GuU7W63e7aiu_eXUizaSj3iM0qimHuYzqSM'
).trim();

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
