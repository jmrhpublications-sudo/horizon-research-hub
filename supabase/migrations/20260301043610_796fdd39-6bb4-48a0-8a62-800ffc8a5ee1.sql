
-- =============================================
-- FIX 1: Convert all RESTRICTIVE policies to PERMISSIVE
-- =============================================

-- ---- PROFILES TABLE ----
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ---- PAPERS TABLE ----
DROP POLICY IF EXISTS "Admins can manage all papers" ON public.papers;
DROP POLICY IF EXISTS "Professors can update assigned papers" ON public.papers;
DROP POLICY IF EXISTS "Professors can view assigned papers" ON public.papers;
DROP POLICY IF EXISTS "Users can insert own papers" ON public.papers;
DROP POLICY IF EXISTS "Users can update own papers" ON public.papers;
DROP POLICY IF EXISTS "Users can view own papers" ON public.papers;

CREATE POLICY "Users can view own papers" ON public.papers
  FOR SELECT TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Users can insert own papers" ON public.papers
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own papers" ON public.papers
  FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Professors can view assigned papers" ON public.papers
  FOR SELECT TO authenticated USING (auth.uid() = assigned_professor_id);

CREATE POLICY "Professors can update assigned papers" ON public.papers
  FOR UPDATE TO authenticated USING (auth.uid() = assigned_professor_id);

CREATE POLICY "Admins can manage all papers" ON public.papers
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ---- USER_ROLES TABLE ----
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ---- REVIEWS TABLE ----
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;

CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own reviews" ON public.reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =============================================
-- FIX 2: Add professor access to assigned manuscripts
-- =============================================

CREATE OR REPLACE FUNCTION public.professor_can_view_manuscript(file_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.papers
    WHERE assigned_professor_id = auth.uid()
      AND (storage.foldername(file_name))[1] = author_id::text
  )
$$;

CREATE POLICY "Professors can view assigned manuscripts"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'manuscripts'
    AND public.has_role(auth.uid(), 'professor'::app_role)
    AND public.professor_can_view_manuscript(name)
  );
