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

-- 2. Execute elevation for the project owner account.
-- REPLACE '__TARGET_OWNER_EMAIL__' with your registered email (e.g. 'ekanshgharde16@gmail.com'):
DO $$
DECLARE
  v_target_email TEXT := '__TARGET_OWNER_EMAIL__';
BEGIN
  IF v_target_email != '__TARGET_OWNER_EMAIL__' AND v_target_email != '' THEN
    PERFORM public.bootstrap_superadmin(v_target_email);
  END IF;
END $$;
