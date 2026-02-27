-- Add author_email column to papers table
ALTER TABLE papers ADD COLUMN IF NOT EXISTS author_email TEXT;

-- Update existing records to populate author_email from profiles
UPDATE papers p
SET author_email = pr.email
FROM profiles pr
WHERE p.author_id = pr.id
AND p.author_email IS NULL;

-- Set default value for new submissions
ALTER TABLE papers ALTER COLUMN author_email SET DEFAULT '';
