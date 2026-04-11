-- Migration: Google Drive Storage Integration
-- Adds support for storing manuscript files in Google Drive

-- Create app_config table for storing configuration
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add Google Drive specific columns to papers table
ALTER TABLE papers 
ADD COLUMN IF NOT EXISTS drive_file_ids JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS drive_folder_id TEXT,
ADD COLUMN IF NOT EXISTS storage_type TEXT DEFAULT 'supabase';

-- Add storage_type to professor_submissions for consistency
ALTER TABLE professor_submissions 
ADD COLUMN IF NOT EXISTS storage_type TEXT DEFAULT 'supabase';

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_papers_storage_type ON papers(storage_type);
CREATE INDEX IF NOT EXISTS idx_papers_author_email ON papers(author_email);

-- Insert default configuration
INSERT INTO app_config (key, value, description) 
VALUES 
  ('google_drive_enabled', 'false', 'Enable Google Drive storage for submissions'),
  ('google_drive_root_folder_id', '', 'Root folder ID in Google Drive for all submissions'),
  ('max_file_size_mb', '20', 'Maximum file size in MB'),
  ('allowed_file_types', '["pdf","doc","docx"]', 'Allowed file types for upload')
ON CONFLICT (key) DO NOTHING;

-- Create a function to update app_config
CREATE OR REPLACE FUNCTION update_app_config(key TEXT, new_value TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE app_config 
  SET value = new_value, updated_at = NOW() 
  WHERE app_config.key = key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;