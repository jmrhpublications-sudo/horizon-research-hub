-- Unified Document Management System
-- Tracks all .doc/.docx files with deduplication and role-based access

-- Create documents table for unified document management
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploader_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    uploader_name TEXT NOT NULL,
    uploader_role TEXT NOT NULL CHECK (uploader_role IN ('ADMIN', 'PROFESSOR', 'USER')),
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('doc', 'docx')),
    file_hash TEXT,
    file_size INTEGER,
    document_type TEXT NOT NULL, -- 'MANUSCRIPT', 'JOURNAL', 'BOOK', 'REVIEW'
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED')),
    related_document_id UUID REFERENCES public.documents(id),
    review_notes TEXT,
    review_decision TEXT CHECK (review_decision IN ('ACCEPT', 'REVISION_REQUIRED', 'REJECTED')),
    reviewer_id UUID REFERENCES auth.users(id),
    reviewer_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies for documents
-- Anyone can view APPROVED documents
CREATE POLICY "Anyone can view approved documents" ON public.documents 
    FOR SELECT USING (status = 'APPROVED' OR status = 'ARCHIVED');

-- Users can view their own documents
CREATE POLICY "Users can view own documents" ON public.documents 
    FOR SELECT USING (auth.uid() = uploader_id);

-- Professors can view documents assigned to them
CREATE POLICY "Professors can view assigned documents" ON public.documents 
    FOR SELECT USING (auth.uid() = reviewer_id);

-- Authors can insert documents
CREATE POLICY "Users can insert documents" ON public.documents 
    FOR INSERT WITH CHECK (auth.uid() = uploader_id OR uploader_id IS NULL);

-- Uploaders can update their own PENDING documents
CREATE POLICY "Users can update own pending documents" ON public.documents 
    FOR UPDATE USING (auth.uid() = uploader_id AND status = 'PENDING');

-- Professors can update review decisions on their assigned documents
CREATE POLICY "Professors can update reviews" ON public.documents 
    FOR UPDATE USING (auth.uid() = reviewer_id);

-- Admins can do everything
CREATE POLICY "Admins can manage all documents" ON public.documents 
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Add uploaded_by column to published_journals
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'published_journals' AND column_name = 'uploaded_by') THEN
        ALTER TABLE public.published_journals ADD COLUMN uploaded_by TEXT;
    END IF;
END $$;

-- Add uploaded_by column to published_books
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'published_books' AND column_name = 'uploaded_by') THEN
        ALTER TABLE public.published_books ADD COLUMN uploaded_by TEXT;
    END IF;
END $$;

-- Add updated_at trigger for documents
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_documents_file_hash ON documents(file_hash);
CREATE INDEX IF NOT EXISTS idx_documents_uploader_id ON documents(uploader_id);
CREATE INDEX IF NOT EXISTS idx_documents_reviewer_id ON documents(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents(document_type);

-- Storage bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, file_type_limit, created_at, updated_at)
VALUES ('documents', 'documents', true, 20971520, ARRAY['doc', 'docx'], NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Storage policies for documents bucket
DROP POLICY IF EXISTS "Anyone can view documents" ON storage.objects;
CREATE POLICY "Anyone can view documents" ON storage.objects 
    FOR SELECT USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
CREATE POLICY "Authenticated users can upload documents" ON storage.objects 
    FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Owners can manage own documents" ON storage.objects;
CREATE POLICY "Owners can manage own documents" ON storage.objects 
    FOR ALL USING (bucket_id = 'documents' AND auth.uid() = (storage.foldername(name)[1])::uuid)
    WITH CHECK (bucket_id = 'documents' AND auth.uid() = (storage.foldername(name)[1])::uuid);

-- Function to check for duplicate files
CREATE OR REPLACE FUNCTION public.check_duplicate_document(file_hash_param TEXT)
RETURNS TABLE(
    is_duplicate BOOLEAN,
    existing_document_id UUID,
    existing_title TEXT,
    existing_file_name TEXT,
    existing_uploaded_by TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE WHEN d.id IS NOT NULL THEN TRUE ELSE FALSE END,
        d.id,
        d.title,
        d.file_name,
        d.uploader_name
    FROM public.documents d
    WHERE d.file_hash = file_hash_param
    ORDER BY d.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;