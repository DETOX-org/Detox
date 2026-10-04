-- ============================================================================
-- DETOX Platform V2 — Hackathons & Registrations Schema
-- Migration: 20261004000002_hackathons_schema.sql
-- ============================================================================

-- 1. Create hackathons table
CREATE TABLE IF NOT EXISTS public.hackathons (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    tagline TEXT DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    cover_image TEXT,
    banner_image TEXT,
    status TEXT NOT NULL DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'ONGOING', 'PREVIOUS', 'ARCHIVED')),
    start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    end_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    registration_deadline TIMESTAMPTZ,
    submission_deadline TIMESTAMPTZ,
    rules TEXT DEFAULT '',
    theme TEXT DEFAULT '',
    categories TEXT[] DEFAULT '{}',
    organizer TEXT NOT NULL DEFAULT 'DETOX Engineering Collective',
    location TEXT DEFAULT 'DETOX Hardware Lab & Online Discord',
    capacity TEXT DEFAULT '',
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create hackathon_registrations table
CREATE TABLE IF NOT EXISTS public.hackathon_registrations (
    id TEXT PRIMARY KEY,
    hackathon_id TEXT NOT NULL REFERENCES public.hackathons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    discord_handle TEXT DEFAULT '',
    team_name TEXT DEFAULT '',
    skills TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'REGISTERED' CHECK (status IN ('REGISTERED', 'CONFIRMED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_hackathon_email UNIQUE (hackathon_id, email)
);

-- 3. Ensure submissions table supports hackathon_id
ALTER TABLE public.submissions 
    ADD COLUMN IF NOT EXISTS hackathon_id TEXT REFERENCES public.hackathons(id) ON DELETE CASCADE;

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'submissions' AND column_name = 'event_id'
  ) THEN
    ALTER TABLE public.submissions ALTER COLUMN event_id DROP NOT NULL;
  END IF;
END $$;

-- 4. Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_hackathons_status ON public.hackathons(status);
CREATE INDEX IF NOT EXISTS idx_hackathons_dates ON public.hackathons(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_hackathons_slug ON public.hackathons(slug);
CREATE INDEX IF NOT EXISTS idx_registrations_hackathon ON public.hackathon_registrations(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON public.hackathon_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_hackathon_id ON public.submissions(hackathon_id);

-- 5. Row Level Security (RLS)
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathon_registrations ENABLE ROW LEVEL SECURITY;

-- Hackathons RLS Policies
DROP POLICY IF EXISTS "Public can view published hackathons" ON public.hackathons;
CREATE POLICY "Public can view published hackathons"
  ON public.hackathons FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage hackathons" ON public.hackathons;
CREATE POLICY "Admins can manage hackathons"
  ON public.hackathons FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Hackathon Registrations RLS Policies
DROP POLICY IF EXISTS "Users can view own registration or admins view all" ON public.hackathon_registrations;
CREATE POLICY "Users can view own registration or admins view all"
  ON public.hackathon_registrations FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Anyone can register for hackathons" ON public.hackathon_registrations;
CREATE POLICY "Anyone can register for hackathons"
  ON public.hackathon_registrations FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage registrations" ON public.hackathon_registrations;
CREATE POLICY "Admins can manage registrations"
  ON public.hackathon_registrations FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
