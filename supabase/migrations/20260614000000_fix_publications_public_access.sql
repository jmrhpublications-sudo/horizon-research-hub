-- Restore SELECT policy on publications bucket to ensure direct access is fully functional
-- and metadata can be resolved by anyone (including anonymous users and search engine crawlers).
DROP POLICY IF EXISTS "Anyone can read publications" ON storage.objects;

CREATE POLICY "Anyone can read publications"
ON storage.objects FOR SELECT
USING (bucket_id = 'publications');
