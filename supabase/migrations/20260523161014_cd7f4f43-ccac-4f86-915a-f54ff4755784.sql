
-- Attach professor field-restriction trigger to papers
DROP TRIGGER IF EXISTS papers_professor_update_check ON public.papers;
CREATE TRIGGER papers_professor_update_check
BEFORE UPDATE ON public.papers
FOR EACH ROW
EXECUTE FUNCTION public.professor_update_check();

-- Attach professor field-restriction trigger to professor_submissions
DROP TRIGGER IF EXISTS prof_submissions_update_check ON public.professor_submissions;
CREATE TRIGGER prof_submissions_update_check
BEFORE UPDATE ON public.professor_submissions
FOR EACH ROW
EXECUTE FUNCTION public.professor_submission_update_check();

-- Harden user_roles inserts: deny unless caller is an admin, even when table is empty
CREATE OR REPLACE FUNCTION public.enforce_admin_role_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to assign roles';
  END IF;
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can assign roles';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_roles_admin_only_insert ON public.user_roles;
CREATE TRIGGER user_roles_admin_only_insert
BEFORE INSERT ON public.user_roles
FOR EACH ROW
WHEN (current_setting('role', true) <> 'service_role')
EXECUTE FUNCTION public.enforce_admin_role_insert();
