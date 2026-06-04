-- Revoke public/anon EXECUTE on SECURITY DEFINER functions; grant only to authenticated where needed
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_papers_for_professor() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_papers_for_professor() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.professor_can_view_manuscript(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.professor_can_view_manuscript(text) TO authenticated, service_role;

-- Trigger functions: revoke from everyone except service_role (triggers run regardless of EXECUTE grants)
REVOKE EXECUTE ON FUNCTION public.enforce_admin_role_insert() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.professor_update_check() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.professor_submission_update_check() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.papers_author_field_guard() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.professor_submissions_insert_guard() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.upload_requests_insert_guard() FROM PUBLIC, anon, authenticated;