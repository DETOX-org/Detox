-- ============================================================================
-- DETOX Platform V2 — Storage Buckets & Storage Security Policies
-- Migration: 20260918000002_storage_setup.sql
-- ============================================================================

-- 1. Create Public Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']),
  ('people', 'people', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
  ('projects', 'projects', true, 15728640, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf']),
  ('events', 'events', true, 15728640, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf']),
  ('media', 'media', true, 20971520, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'video/mp4', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Security Policies

-- Public Read Access for all buckets
DROP POLICY IF EXISTS "Public read access for media objects" ON storage.objects;
CREATE POLICY "Public read access for media objects"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('avatars', 'people', 'projects', 'events', 'media'));

-- Authenticated Avatar Uploads (Users can only upload and modify their own avatars)
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
CREATE POLICY "Users can upload their own avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    (
      (storage.foldername(name))[1] = auth.uid()::text OR
      name LIKE (auth.uid()::text || '/%') OR
      name LIKE (auth.uid()::text || '_%') OR
      auth.uid() = owner
    )
  );

DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    (
      (storage.foldername(name))[1] = auth.uid()::text OR
      name LIKE (auth.uid()::text || '/%') OR
      name LIKE (auth.uid()::text || '_%') OR
      auth.uid() = owner
    )
  )
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    (
      (storage.foldername(name))[1] = auth.uid()::text OR
      name LIKE (auth.uid()::text || '/%') OR
      name LIKE (auth.uid()::text || '_%') OR
      auth.uid() = owner
    )
  );

DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    (
      (storage.foldername(name))[1] = auth.uid()::text OR
      name LIKE (auth.uid()::text || '/%') OR
      name LIKE (auth.uid()::text || '_%') OR
      auth.uid() = owner
    )
  );

-- Admins and Superadmins have full upload/update/delete control across all buckets
DROP POLICY IF EXISTS "Admins can upload to any storage bucket" ON storage.objects;
CREATE POLICY "Admins can upload to any storage bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('avatars', 'people', 'projects', 'events', 'media') AND
    public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can update any storage object" ON storage.objects;
CREATE POLICY "Admins can update any storage object"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id IN ('avatars', 'people', 'projects', 'events', 'media') AND
    public.is_admin()
  )
  WITH CHECK (
    bucket_id IN ('avatars', 'people', 'projects', 'events', 'media') AND
    public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can delete any storage object" ON storage.objects;
CREATE POLICY "Admins can delete any storage object"
  ON storage.objects FOR DELETE
  USING (
    bucket_id IN ('avatars', 'people', 'projects', 'events', 'media') AND
    public.is_admin()
  );
