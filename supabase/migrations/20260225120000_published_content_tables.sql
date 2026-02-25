-- Add new tables for published journals, books, and upload requests

-- Published Journals table
CREATE TABLE IF NOT EXISTS public.published_journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    authors TEXT NOT NULL DEFAULT '',
    abstract TEXT,
    discipline TEXT NOT NULL DEFAULT '',
    keywords TEXT,
    volume TEXT,
    issue TEXT,
    pages TEXT,
    doi TEXT,
    publication_date DATE NOT NULL,
    cover_image TEXT,
    pdf_url TEXT,
    status TEXT NOT NULL DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.published_journals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published journals" ON public.published_journals FOR SELECT USING (true);
CREATE POLICY "Admins can manage published journals" ON public.published_journals FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Published Books table
CREATE TABLE IF NOT EXISTS public.published_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    authors TEXT NOT NULL DEFAULT '',
    editors TEXT,
    isbn TEXT,
    publisher TEXT,
    description TEXT,
    discipline TEXT NOT NULL DEFAULT '',
    keywords TEXT,
    edition TEXT,
    publication_year TEXT,
    cover_image TEXT,
    pdf_url TEXT,
    purchase_link TEXT,
    status TEXT NOT NULL DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.published_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published books" ON public.published_books FOR SELECT USING (true);
CREATE POLICY "Admins can manage published books" ON public.published_books FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Upload Requests table (for users to request admin to upload content)
CREATE TABLE IF NOT EXISTS public.upload_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    request_type TEXT NOT NULL, -- 'JOURNAL' or 'BOOK'
    title TEXT NOT NULL,
    authors TEXT,
    description TEXT,
    isbn TEXT,
    publisher TEXT,
    link TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.upload_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests" ON public.upload_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create requests" ON public.upload_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own requests" ON public.upload_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all requests" ON public.upload_requests FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all requests" ON public.upload_requests FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Add paper_type column to papers table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'papers' AND column_name = 'paper_type') THEN
        ALTER TABLE public.papers ADD COLUMN paper_type TEXT NOT NULL DEFAULT 'JOURNAL';
    END IF;
END $$;

-- Add author_email column to papers table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'papers' AND column_name = 'author_email') THEN
        ALTER TABLE public.papers ADD COLUMN author_email TEXT;
    END IF;
END $$;

-- Add manuscript_type column to papers table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'papers' AND column_name = 'manuscript_type') THEN
        ALTER TABLE public.papers ADD COLUMN manuscript_type TEXT;
    END IF;
END $$;

-- Add keywords column to papers table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'papers' AND column_name = 'keywords') THEN
        ALTER TABLE public.papers ADD COLUMN keywords TEXT;
    END IF;
END $$;

-- Add co_authors column to papers table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'papers' AND column_name = 'co_authors') THEN
        ALTER TABLE public.papers ADD COLUMN co_authors TEXT;
    END IF;
END $$;

-- Add updated_at trigger for new tables
CREATE TRIGGER update_published_journals_updated_at BEFORE UPDATE ON public.published_journals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_published_books_updated_at BEFORE UPDATE ON public.published_books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_upload_requests_updated_at BEFORE UPDATE ON public.upload_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
