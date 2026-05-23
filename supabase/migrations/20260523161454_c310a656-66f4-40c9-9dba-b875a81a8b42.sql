
-- Revoke EXECUTE from anon/public on all SECURITY DEFINER helpers
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.professor_can_view_manuscript(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_review_content() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.professor_update_check() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.professor_submission_update_check() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_admin_role_insert() FROM PUBLIC, anon, authenticated;

-- Drop overly broad SELECT policy on publications bucket that enables listing.
-- Public URLs (object-level) continue to work without an RLS policy.
DROP POLICY IF EXISTS "Anyone can read publications" ON storage.objects;
