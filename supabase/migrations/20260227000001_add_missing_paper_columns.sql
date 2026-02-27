-- Add all missing columns to papers table
ALTER TABLE papers ADD COLUMN IF NOT EXISTS author_email TEXT;
ALTER TABLE papers ADD COLUMN IF NOT EXISTS paper_type TEXT DEFAULT 'JOURNAL';
ALTER TABLE papers ADD COLUMN IF NOT EXISTS manuscript_type TEXT;
ALTER TABLE papers ADD COLUMN IF NOT EXISTS keywords TEXT;
ALTER TABLE papers ADD COLUMN IF NOT EXISTS co_authors TEXT;
ALTER TABLE papers ADD COLUMN IF NOT EXISTS assigned_professor_name TEXT;

-- Update existing records to populate paper_type
UPDATE papers SET paper_type = 'JOURNAL' WHERE paper_type IS NULL;

-- Set default values
ALTER TABLE papers ALTER COLUMN paper_type SET DEFAULT 'JOURNAL';
ALTER TABLE papers ALTER COLUMN status SET DEFAULT 'SUBMITTED';
