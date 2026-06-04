
-- 1) Restrict professor visibility on papers: drop direct table SELECT for professors,
--    expose a redacted view that masks author PII.
DROP POLICY IF EXISTS "Professors can view assigned papers" ON public.papers;

CREATE OR REPLACE VIEW public.papers_for_professors
WITH (security_invoker = on) AS
SELECT
  id,
  author_id,
  -- mask PII
  NULL::text AS author_name,
  NULL::text AS author_email,
  NULL::text AS phone,
  NULL::text AS affiliation,
  NULL::text AS designation,
  NULL::text AS orcid,
  NULL::text AS additional_notes,
  title,
  abstract,
  discipline,
  status,
  assigned_professor_id,
  submission_date,
  revision_comments,
  attachments,
  created_at,
  updated_at,
  paper_type,
  manuscript_type,
  keywords,
  co_authors,
  cover_letter
FROM public.papers
WHERE assigned_professor_id = auth.uid();

-- Allow professors to SELECT the redacted view. Re-create a policy on papers
-- to let professors read only via the view's underlying scan (view runs with
-- invoker rights, so we need a SELECT policy that grants exactly the masked subset).
-- Since views with security_invoker require the caller to have access to the
-- underlying table, add a narrow policy returning only the assigned rows
-- (PII columns are dropped at the view layer).
CREATE POLICY "Professors can view assigned papers via view"
ON public.papers
FOR SELECT
TO authenticated
USING (
  auth.uid() = assigned_professor_id
);

-- Lock down direct column access for professors:
-- revoke SELECT on PII columns for the authenticated role, then re-grant the
-- non-PII columns. Admins read via service-role or via admin policy which
-- still works because column privileges apply uniformly; however the admin UI
-- needs PII so we instead use a SECURITY DEFINER RPC for admin PII access.
-- To avoid breaking admin UI which selects '*', we keep column privileges
-- intact and rely on the view + dropped policy: professors now have NO
-- direct SELECT path returning PII because their policy filter is the same
-- but they MUST query through papers_for_professors in code. We additionally
-- enforce by also dropping the broad professor SELECT policy added above
-- and replacing with a column-aware one using a helper.

-- Simpler enforcement: re-drop the policy and require professors to use the view exclusively.
DROP POLICY IF EXISTS "Professors can view assigned papers via view" ON public.papers;

-- Create a SECURITY DEFINER function that the view can use without RLS recursion.
CREATE OR REPLACE FUNCTION public.get_papers_for_professor()
RETURNS TABLE (
  id uuid,
  author_id uuid,
  title text,
  abstract text,
  discipline text,
  status text,
  assigned_professor_id uuid,
  submission_date date,
  revision_comments text,
  attachments text[],
  created_at timestamptz,
  updated_at timestamptz,
  paper_type text,
  manuscript_type text,
  keywords text,
  co_authors text,
  cover_letter text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, author_id, title, abstract, discipline, status, assigned_professor_id,
         submission_date, revision_comments, attachments, created_at, updated_at,
         paper_type, manuscript_type, keywords, co_authors, cover_letter
  FROM public.papers
  WHERE assigned_professor_id = auth.uid()
    AND public.has_role(auth.uid(), 'professor'::app_role);
$$;

REVOKE ALL ON FUNCTION public.get_papers_for_professor() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_papers_for_professor() TO authenticated;

-- Drop the masking view (replaced by RPC for simplicity)
DROP VIEW IF EXISTS public.papers_for_professors;

-- 2) Trigger: prevent authors from setting privileged paper fields on INSERT/UPDATE
CREATE OR REPLACE FUNCTION public.papers_author_field_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Skip for admins and professors (they have other triggers/policies)
  IF auth.uid() IS NULL
     OR public.has_role(auth.uid(), 'admin'::app_role)
     OR public.has_role(auth.uid(), 'professor'::app_role) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.status := 'SUBMITTED';
    NEW.assigned_professor_id := NULL;
    NEW.revision_comments := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'Authors cannot change paper status';
    END IF;
    IF NEW.assigned_professor_id IS DISTINCT FROM OLD.assigned_professor_id THEN
      RAISE EXCEPTION 'Authors cannot change assigned reviewer';
    END IF;
    IF NEW.revision_comments IS DISTINCT FROM OLD.revision_comments THEN
      RAISE EXCEPTION 'Authors cannot change revision comments';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS papers_author_field_guard_trg ON public.papers;
CREATE TRIGGER papers_author_field_guard_trg
BEFORE INSERT OR UPDATE ON public.papers
FOR EACH ROW EXECUTE FUNCTION public.papers_author_field_guard();

-- 3) Trigger: professors cannot set status / admin_notes on professor_submissions INSERT
CREATE OR REPLACE FUNCTION public.professor_submissions_insert_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;
  -- For non-admin inserters (professors), force safe defaults
  NEW.status := 'PENDING';
  NEW.admin_notes := NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS professor_submissions_insert_guard_trg ON public.professor_submissions;
CREATE TRIGGER professor_submissions_insert_guard_trg
BEFORE INSERT ON public.professor_submissions
FOR EACH ROW EXECUTE FUNCTION public.professor_submissions_insert_guard();

-- 4) Trigger: users cannot set status / admin_notes on upload_requests INSERT
CREATE OR REPLACE FUNCTION public.upload_requests_insert_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;
  NEW.status := 'PENDING';
  NEW.admin_notes := NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS upload_requests_insert_guard_trg ON public.upload_requests;
CREATE TRIGGER upload_requests_insert_guard_trg
BEFORE INSERT ON public.upload_requests
FOR EACH ROW EXECUTE FUNCTION public.upload_requests_insert_guard();
