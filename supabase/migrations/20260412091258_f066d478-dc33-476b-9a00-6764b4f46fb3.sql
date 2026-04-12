-- Fix storage policy that references non-existent 'manuscripts' bucket
-- Change it to reference the actual 'papers' bucket

DROP POLICY IF EXISTS "Professors can view assigned manuscripts" ON storage.objects;

CREATE POLICY "Professors can view assigned manuscripts"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'papers'
  AND public.has_role(auth.uid(), 'professor'::public.app_role)
  AND public.professor_can_view_manuscript(name)
);