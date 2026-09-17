-- ============================================================================
-- DETOX Platform V2 — Authoritative Backend Schema & Database Security
-- Migration: 20260918000001_initial_schema.sql
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked 1:1 with auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT '',
    username TEXT UNIQUE,
    email TEXT NOT NULL,
    avatar TEXT,
    bio TEXT,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'superadmin')),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PENDING', 'SUSPENDED')),
    skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ----------------------------------------------------------------------------
-- 2. SECURITY DEFINER HELPER FUNCTIONS (Bypasses RLS recursion safely)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'superadmin'
  );
$$;

-- ----------------------------------------------------------------------------
-- 3. ROLE PROTECTION TRIGGER (Database enforcement: members cannot self-promote)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_profile_security()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Prevent user_id mutation
  IF NEW.user_id != OLD.user_id THEN
    RAISE EXCEPTION 'Cannot modify profile user_id.';
  END IF;

  -- Only superadmins can modify role or status
  IF (NEW.role != OLD.role OR NEW.status != OLD.status) THEN
    IF NOT public.is_superadmin() THEN
      RAISE EXCEPTION 'Unauthorized: Only Super Admins are permitted to modify member roles or account status.';
    END IF;
  END IF;

  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_profile_security ON public.profiles;
CREATE TRIGGER trg_enforce_profile_security
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_profile_security();

-- ----------------------------------------------------------------------------
-- 4. AUTOMATIC PROFILE CREATION ON USER REGISTRATION
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name TEXT;
  v_username TEXT;
BEGIN
  v_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );

  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1) || '_' || substr(replace(NEW.id::text, '-', ''), 1, 4)
  );

  INSERT INTO public.profiles (user_id, name, username, email, role, status)
  VALUES (
    NEW.id,
    v_name,
    v_username,
    NEW.email,
    'member', -- Always default new users to regular member
    'ACTIVE'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 5. SUPER ADMIN BOOTSTRAP FUNCTION
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.bootstrap_superadmin(target_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT user_id INTO v_user_id FROM public.profiles WHERE lower(email) = lower(target_email);

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No profile found for email: %', target_email;
  END IF;

  UPDATE public.profiles
  SET role = 'superadmin', updated_at = now()
  WHERE user_id = v_user_id;

  RETURN 'Successfully elevated ' || target_email || ' to superadmin.';
END;
$$;

-- ----------------------------------------------------------------------------
-- 6. CONTENT TABLES (Projects, Events, People, Media, Accomplishments, Announcements)
-- ----------------------------------------------------------------------------

-- PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('STUDENT', 'RESEARCH', 'OSS', 'CODING')),
    description TEXT NOT NULL DEFAULT '',
    visual_url TEXT,
    visual_label TEXT DEFAULT '',
    visual_caption TEXT DEFAULT '',
    contributors TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'REVIEW', 'PUBLISHED')),
    git_url TEXT DEFAULT '',
    specs TEXT[] DEFAULT '{}',
    metrics JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- EVENTS
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    code TEXT DEFAULT '',
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('WORKSHOP', 'PAPER SALON', 'WEEKEND BUILD', 'SECURITY AUDIT')),
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

-- PEOPLE / MINDS BEHIND DETOX
CREATE TABLE IF NOT EXISTS public.people (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    role_area TEXT NOT NULL DEFAULT 'Technical',
    focus_tag TEXT DEFAULT '',
    one_sentence TEXT DEFAULT '',
    biography TEXT DEFAULT '',
    area_of_contribution TEXT DEFAULT '',
    active_project TEXT DEFAULT '',
    contributed_project_ids TEXT[] DEFAULT '{}',
    participated_event_ids TEXT[] DEFAULT '{}',
    github_url TEXT DEFAULT '',
    email TEXT DEFAULT '',
    social_links JSONB DEFAULT '{}'::jsonb,
    photo_url TEXT,
    photo_label TEXT DEFAULT '',
    photo_caption TEXT DEFAULT '',
    cutout_url TEXT,
    original_photo_url TEXT,
    stage_position JSONB DEFAULT '{"x": 50, "y": 10}'::jsonb,
    stage_scale DOUBLE PRECISION DEFAULT 1.0,
    stage_rotation DOUBLE PRECISION DEFAULT 0.0,
    stage_z_index INTEGER DEFAULT 10,
    is_foreground_anchor BOOLEAN DEFAULT false,
    cutout_contour TEXT DEFAULT 'natural',
    collage_size TEXT DEFAULT 'md',
    aspect_ratio TEXT DEFAULT 'portrait',
    palette_accent TEXT DEFAULT '#38B2A2',
    tag_variant TEXT DEFAULT 'teal',
    status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'REVIEW', 'PUBLISHED')),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- COLLAGE STAGE SETTINGS
CREATE TABLE IF NOT EXISTS public.collage_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    title TEXT DEFAULT 'Minds Behind DETOX',
    category_tag TEXT DEFAULT 'STUDENT ENGINEERING CORPS',
    lead_text TEXT DEFAULT '',
    status_text TEXT DEFAULT '',
    bg_type TEXT DEFAULT 'paper',
    bg_color TEXT DEFAULT '#111215',
    pattern TEXT DEFAULT 'grid',
    hover_behavior JSONB DEFAULT '{}'::jsonb,
    decorative_elements JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- MEDIA ASSET REPOSITORY
CREATE TABLE IF NOT EXISTS public.media (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'COMMUNITY' CHECK (category IN ('ALL', 'EVENTS', 'PROJECTS', 'COMMUNITY', 'PEOPLE')),
    tags TEXT[] DEFAULT '{}',
    size TEXT DEFAULT '',
    dimensions TEXT DEFAULT '',
    uploaded_by TEXT DEFAULT '',
    caption TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ACCOMPLISHMENTS
CREATE TABLE IF NOT EXISTS public.accomplishments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('AWARD', 'HACKATHON', 'SELECTION', 'MILESTONE', 'COLLABORATION')),
    description TEXT NOT NULL DEFAULT '',
    impact TEXT NOT NULL DEFAULT '',
    verified_link TEXT,
    status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'INFO' CHECK (type IN ('INFO', 'URGENT', 'RELEASE')),
    date TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    actor_id TEXT,
    actor_name TEXT,
    actor_role TEXT,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details TEXT NOT NULL
);

-- ----------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collage_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accomplishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Profiles are readable by everyone" ON public.profiles;
CREATE POLICY "Profiles are readable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

DROP POLICY IF EXISTS "Superadmins can delete profiles" ON public.profiles;
CREATE POLICY "Superadmins can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.is_superadmin());

-- PROJECTS POLICIES
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  USING (status = 'PUBLISHED' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
CREATE POLICY "Admins can insert projects"
  ON public.projects FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
CREATE POLICY "Admins can update projects"
  ON public.projects FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;
CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE
  USING (public.is_admin());

-- EVENTS POLICIES
DROP POLICY IF EXISTS "Public can view published events" ON public.events;
CREATE POLICY "Public can view published events"
  ON public.events FOR SELECT
  USING (status = 'PUBLISHED' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
CREATE POLICY "Admins can insert events"
  ON public.events FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  USING (public.is_admin());

-- PEOPLE POLICIES
DROP POLICY IF EXISTS "Public can view published people" ON public.people;
CREATE POLICY "Public can view published people"
  ON public.people FOR SELECT
  USING (status = 'PUBLISHED' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert people" ON public.people;
CREATE POLICY "Admins can insert people"
  ON public.people FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update people" ON public.people;
CREATE POLICY "Admins can update people"
  ON public.people FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete people" ON public.people;
CREATE POLICY "Admins can delete people"
  ON public.people FOR DELETE
  USING (public.is_admin());

-- COLLAGE SETTINGS POLICIES
DROP POLICY IF EXISTS "Public can view collage settings" ON public.collage_settings;
CREATE POLICY "Public can view collage settings"
  ON public.collage_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can update collage settings" ON public.collage_settings;
CREATE POLICY "Admins can update collage settings"
  ON public.collage_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- MEDIA POLICIES
DROP POLICY IF EXISTS "Public can view media items" ON public.media;
CREATE POLICY "Public can view media items"
  ON public.media FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage media" ON public.media;
CREATE POLICY "Admins can manage media"
  ON public.media FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ACCOMPLISHMENTS POLICIES
DROP POLICY IF EXISTS "Public can view published accomplishments" ON public.accomplishments;
CREATE POLICY "Public can view published accomplishments"
  ON public.accomplishments FOR SELECT
  USING (status = 'PUBLISHED' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage accomplishments" ON public.accomplishments;
CREATE POLICY "Admins can manage accomplishments"
  ON public.accomplishments FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ANNOUNCEMENTS POLICIES
DROP POLICY IF EXISTS "Public can view published announcements" ON public.announcements;
CREATE POLICY "Public can view published announcements"
  ON public.announcements FOR SELECT
  USING (status = 'PUBLISHED' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
CREATE POLICY "Admins can manage announcements"
  ON public.announcements FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- AUDIT LOGS POLICIES
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated users can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);
