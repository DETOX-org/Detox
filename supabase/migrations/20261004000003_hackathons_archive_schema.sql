-- ============================================================================
-- DETOX Platform V2 — Hackathons & Projects Archive Schema
-- Migration: 20261004000003_hackathons_archive_schema.sql
-- ============================================================================

-- 1. Create clean Hackathons archive table
CREATE TABLE IF NOT EXISTS public.hackathons (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tagline TEXT DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    date TEXT NOT NULL DEFAULT '',
    cover_image TEXT DEFAULT '',
    location TEXT DEFAULT '',
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create clean Hackathon Projects table
CREATE TABLE IF NOT EXISTS public.hackathon_projects (
    id TEXT PRIMARY KEY,
    hackathon_id TEXT NOT NULL REFERENCES public.hackathons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    team_name TEXT DEFAULT '',
    team_members TEXT[] DEFAULT '{}',
    cover_image TEXT DEFAULT '',
    screenshots TEXT[] DEFAULT '{}',
    tech_stack TEXT[] DEFAULT '{}',
    repository_url TEXT DEFAULT '',
    demo_url TEXT DEFAULT '',
    placement TEXT DEFAULT '',
    is_winner BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_hackathon_project_slug UNIQUE (hackathon_id, slug)
);

-- 3. Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_hackathons_slug ON public.hackathons(slug);
CREATE INDEX IF NOT EXISTS idx_hackathons_published ON public.hackathons(is_published);
CREATE INDEX IF NOT EXISTS idx_hackathon_projects_hackathon_id ON public.hackathon_projects(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_projects_slug ON public.hackathon_projects(slug);
CREATE INDEX IF NOT EXISTS idx_hackathon_projects_published ON public.hackathon_projects(published);
CREATE INDEX IF NOT EXISTS idx_hackathon_projects_winner ON public.hackathon_projects(is_winner);

-- 4. Row Level Security (RLS)
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathon_projects ENABLE ROW LEVEL SECURITY;

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

-- Hackathon Projects RLS Policies
DROP POLICY IF EXISTS "Public can view published hackathon projects" ON public.hackathon_projects;
CREATE POLICY "Public can view published hackathon projects"
  ON public.hackathon_projects FOR SELECT
  USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage hackathon projects" ON public.hackathon_projects;
CREATE POLICY "Admins can manage hackathon projects"
  ON public.hackathon_projects FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
