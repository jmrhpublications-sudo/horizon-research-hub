
ALTER TABLE public.papers 
  ADD COLUMN IF NOT EXISTS author_email text DEFAULT '',
  ADD COLUMN IF NOT EXISTS paper_type text DEFAULT 'JOURNAL',
  ADD COLUMN IF NOT EXISTS manuscript_type text DEFAULT '',
  ADD COLUMN IF NOT EXISTS keywords text DEFAULT '',
  ADD COLUMN IF NOT EXISTS co_authors text DEFAULT '',
  ADD COLUMN IF NOT EXISTS cover_letter text DEFAULT '',
  ADD COLUMN IF NOT EXISTS phone text DEFAULT '',
  ADD COLUMN IF NOT EXISTS affiliation text DEFAULT '',
  ADD COLUMN IF NOT EXISTS designation text DEFAULT '',
  ADD COLUMN IF NOT EXISTS orcid text DEFAULT '',
  ADD COLUMN IF NOT EXISTS additional_notes text DEFAULT '';
