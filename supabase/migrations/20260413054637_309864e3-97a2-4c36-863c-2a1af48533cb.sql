-- Fix 1: Prevent non-admin users from inserting roles (privilege escalation)
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Restrict professors from updating status/admin_notes on their own submissions
-- Drop existing policy and recreate with field restrictions via trigger
CREATE OR REPLACE FUNCTION public.professor_submission_update_check()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- If the updater is a professor (not admin), restrict field changes
    IF has_role(auth.uid(), 'professor'::app_role) AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
        IF NEW.status IS DISTINCT FROM OLD.status THEN
            RAISE EXCEPTION 'Professors cannot change submission status';
        END IF;
        IF NEW.admin_notes IS DISTINCT FROM OLD.admin_notes THEN
            RAISE EXCEPTION 'Professors cannot change admin notes';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER professor_submission_update_check
BEFORE UPDATE ON public.professor_submissions
FOR EACH ROW
EXECUTE FUNCTION public.professor_submission_update_check();