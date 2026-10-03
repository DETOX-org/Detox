-- ============================================================================
-- DETOX Platform V2 — Hackathon & Event Submissions Schema
-- Migration: 20261004000001_submissions_schema.sql
-- ============================================================================

-- 1. Ensure events table exists for reference
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    code TEXT DEFAULT '',
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL DEFAULT '',
    time TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL DEFAULT '',
    capacity TEXT,
    description TEXT NOT NULL DEFAULT '',
    photo_url TEXT,
    photo_label TEXT DEFAULT '',
    photo_caption TEXT DEFAULT '',
    deliverables TEXT[] DEFAULT '{}',
    resources JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'REVIEW', 'PUBLISHED')),
    is_upcoming BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT,
    description TEXT NOT NULL DEFAULT '',
    cover_image TEXT,
    team_name TEXT,
    participant_names TEXT[] DEFAULT '{}',
    category TEXT DEFAULT '',
    tech_stack TEXT[] DEFAULT '{}',
    demo_url TEXT,
    repository_url TEXT,
    screenshots TEXT[] DEFAULT '{}',
    result_badge TEXT,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_submissions_event_id ON public.submissions(event_id);
CREATE INDEX IF NOT EXISTS idx_submissions_published ON public.submissions(published);
CREATE INDEX IF NOT EXISTS idx_submissions_slug ON public.submissions(slug);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 5. Security & Visibility Policies
-- Public visitors can only view published submissions.
-- Admins and Superadmins can view all submissions (including drafts/unpublished).
DROP POLICY IF EXISTS "Public can view published submissions" ON public.submissions;
CREATE POLICY "Public can view published submissions"
  ON public.submissions FOR SELECT
  USING (published = true OR public.is_admin());

-- Only authorized administrators can insert submissions
DROP POLICY IF EXISTS "Admins can insert submissions" ON public.submissions;
CREATE POLICY "Admins can insert submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (public.is_admin());

-- Only authorized administrators can update submissions
DROP POLICY IF EXISTS "Admins can update submissions" ON public.submissions;
CREATE POLICY "Admins can update submissions"
  ON public.submissions FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only authorized administrators can delete submissions
DROP POLICY IF EXISTS "Admins can delete submissions" ON public.submissions;
CREATE POLICY "Admins can delete submissions"
  ON public.submissions FOR DELETE
  USING (public.is_admin());
