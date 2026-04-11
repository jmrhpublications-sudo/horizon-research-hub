-- Storage policies fix for admin access
-- Ensure admin can access all paper attachments

-- Drop existing view policy if it exists
DROP POLICY IF EXISTS "Authors can view own paper attachments" ON storage.objects;

-- Create simplified view policy for authenticated users (authors, admins, professors)
CREATE POLICY "View paper attachments" 
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'papers'
);

-- Create admin delete policy
CREATE POLICY "Admin can delete paper attachments"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'papers'
);