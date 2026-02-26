-- Add source column to track submission origin (ADMIN, PROFESSOR, or USER)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'published_journals' AND column_name = 'source') THEN
        ALTER TABLE public.published_journals ADD COLUMN source TEXT NOT NULL DEFAULT 'ADMIN';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'published_books' AND column_name = 'source') THEN
        ALTER TABLE public.published_books ADD COLUMN source TEXT NOT NULL DEFAULT 'ADMIN';
    END IF;
END $$;

-- Professor submission requests table (for professor uploads that need admin approval)
CREATE TABLE IF NOT EXISTS public.professor_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    professor_name TEXT NOT NULL,
    submission_type TEXT NOT NULL, -- 'JOURNAL' or 'BOOK'
    title TEXT NOT NULL,
    authors TEXT NOT NULL DEFAULT '',
    abstract TEXT,
    discipline TEXT NOT NULL DEFAULT '',
    keywords TEXT,
    volume TEXT,
    issue TEXT,
    pages TEXT,
    doi TEXT,
    editors TEXT,
    isbn TEXT,
    publisher TEXT,
    description TEXT,
    edition TEXT,
    publication_year TEXT,
    publication_date DATE,
    cover_image TEXT,
    pdf_url TEXT,
    purchase_link TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.professor_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved submissions
CREATE POLICY "Anyone can view approved professor submissions" ON public.professor_submissions FOR SELECT USING (status = 'APPROVED');
-- Professors can view their own submissions
CREATE POLICY "Professors can view own submissions" ON public.professor_submissions FOR SELECT USING (auth.uid() = professor_id);
-- Professors can create submissions
CREATE POLICY "Professors can create submissions" ON public.professor_submissions FOR INSERT WITH CHECK (auth.uid() = professor_id);
-- Professors can update their own submissions when pending
CREATE POLICY "Professors can update own pending submissions" ON public.professor_submissions FOR UPDATE USING (auth.uid() = professor_id AND status = 'PENDING');
-- Admins can view all
CREATE POLICY "Admins can view all professor submissions" ON public.professor_submissions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
-- Admins can manage all
CREATE POLICY "Admins can manage all professor submissions" ON public.professor_submissions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Add updated_at trigger
CREATE TRIGGER update_professor_submissions_updated_at BEFORE UPDATE ON public.professor_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
