-- ============================================================================
-- DETOX Platform V2 — Super Admin Bootstrap & Verification Migration
-- Migration: 20260918000003_superadmin_bootstrap.sql
-- ============================================================================

-- 1. Helper function to elevate an account to superadmin safely
CREATE OR REPLACE FUNCTION public.bootstrap_superadmin(target_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Disallow calling this privileged function via RPC / client sessions
  IF auth.uid() IS NOT NULL THEN
    RAISE EXCEPTION 'Unauthorized: bootstrap_superadmin can only be executed via backend migrations or direct database administrator SQL.';
  END IF;

  -- First ensure profile exists from auth.users if not already created
  INSERT INTO public.profiles (user_id, email, name, role, status)
  SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
    'member', 
    'ACTIVE'
  FROM auth.users
  WHERE lower(email) = lower(target_email)
  ON CONFLICT (user_id) DO NOTHING;

  -- Lookup user_id
  SELECT user_id INTO v_user_id FROM public.profiles WHERE lower(email) = lower(target_email);

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user account found in auth.users or profiles for email: %', target_email;
  END IF;

  -- Update role to superadmin
  UPDATE public.profiles
  SET role = 'superadmin', updated_at = now()
  WHERE user_id = v_user_id;

  RETURN 'Successfully elevated ' || target_email || ' to superadmin.';
END;
$$;

-- 2. Restrict function execution permissions to prevent unauthorized execution
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon;

REVOKE EXECUTE ON FUNCTION public.bootstrap_superadmin(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.bootstrap_superadmin(TEXT) TO service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

REVOKE EXECUTE ON FUNCTION public.enforce_profile_security() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.enforce_profile_security() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_current_user_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.is_superadmin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_superadmin() TO authenticated, service_role;

-- 3. Grant schema, table, and sequence permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT, UPDATE, DELETE ON TABLES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 4. Execute elevation for both owner/administrator accounts if present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = 'ekanshgharde16@gmail.com') THEN
    PERFORM public.bootstrap_superadmin('ekanshgharde16@gmail.com');
  END IF;
  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = 'patilesha387@gmail.com') THEN
    PERFORM public.bootstrap_superadmin('patilesha387@gmail.com');
  END IF;
END $$;
