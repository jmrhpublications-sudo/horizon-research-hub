-- Remove the storage policy that allows professors to directly upload to the publications bucket
-- Professors should submit content through the admin-approved workflow instead
DROP POLICY IF EXISTS "Professors can upload publications" ON storage.objects;