-- Allow anonymous/public users to upload paper attachments
-- This policy allows uploads to papers bucket with 'anonymous/' prefix for non-authenticated users
CREATE POLICY "Anonymous users can upload paper attachments"
ON storage.objects FOR INSERT TO anonymous
WITH CHECK (
    bucket_id = 'papers' AND
    (storage.foldername(name))[1] LIKE 'anonymous/%'
);

-- Allow all authenticated users to view all paper attachments (for admin/professor dashboard)
CREATE POLICY "All authenticated can view papers"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'papers'
);

-- Allow all authenticated users to view publications bucket
CREATE POLICY "All authenticated can view publications"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'publications'
);