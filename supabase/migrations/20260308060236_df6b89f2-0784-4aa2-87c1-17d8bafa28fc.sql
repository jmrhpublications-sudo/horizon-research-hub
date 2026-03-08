
-- 1. Create published_journals table
CREATE TABLE public.published_journals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    authors text NOT NULL DEFAULT '',
    abstract text,
    discipline text NOT NULL DEFAULT '',
    keywords text,
    volume text,
    issue text,
    pages text,
    doi text,
    publication_date date DEFAULT CURRENT_DATE,
    cover_image text,
    pdf_url text,
    status text NOT NULL DEFAULT 'PUBLISHED',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create published_books table
CREATE TABLE public.published_books (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    authors text NOT NULL DEFAULT '',
    editors text,
    isbn text,
    publisher text,
    description text,
    discipline text NOT NULL DEFAULT '',
    keywords text,
    edition text,
    publication_year text,
    cover_image text,
    pdf_url text,
    purchase_link text,
    status text NOT NULL DEFAULT 'PUBLISHED',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Create upload_requests table
CREATE TABLE public.upload_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    request_type text NOT NULL DEFAULT 'JOURNAL',
    title text NOT NULL,
    authors text,
    description text,
    isbn text,
    publisher text,
    link text,
    status text NOT NULL DEFAULT 'PENDING',
    admin_notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Create professor_submissions table
CREATE TABLE public.professor_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    professor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    professor_name text NOT NULL DEFAULT '',
    submission_type text NOT NULL DEFAULT 'JOURNAL',
    title text NOT NULL,
    authors text NOT NULL DEFAULT '',
    abstract text,
    discipline text NOT NULL DEFAULT '',
    keywords text,
    volume text,
    issue text,
    pages text,
    doi text,
    editors text,
    isbn text,
    publisher text,
    description text,
    edition text,
    publication_year text,
    publication_date date,
    cover_image text,
    pdf_url text,
    purchase_link text,
    status text NOT NULL DEFAULT 'PENDING',
    admin_notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Enable RLS on all tables
ALTER TABLE public.published_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.published_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upload_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professor_submissions ENABLE ROW LEVEL SECURITY;

-- 6. published_journals: anyone can read, admins can manage
CREATE POLICY "Anyone can view published journals" ON public.published_journals
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage journals" ON public.published_journals
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 7. published_books: anyone can read, admins can manage
CREATE POLICY "Anyone can view published books" ON public.published_books
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage books" ON public.published_books
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 8. upload_requests: users can insert/view own, admins can manage all
CREATE POLICY "Users can insert own requests" ON public.upload_requests
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own requests" ON public.upload_requests
    FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all requests" ON public.upload_requests
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 9. professor_submissions: professors can insert/view own, admins can manage all
CREATE POLICY "Professors can insert own submissions" ON public.professor_submissions
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = professor_id);
CREATE POLICY "Professors can view own submissions" ON public.professor_submissions
    FOR SELECT TO authenticated USING (auth.uid() = professor_id);
CREATE POLICY "Professors can delete own submissions" ON public.professor_submissions
    FOR DELETE TO authenticated USING (auth.uid() = professor_id);
CREATE POLICY "Admins can manage all submissions" ON public.professor_submissions
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 10. Create public storage bucket for publications
INSERT INTO storage.buckets (id, name, public) VALUES ('publications', 'publications', true);

-- 11. Storage policies for publications bucket
CREATE POLICY "Anyone can read publications" ON storage.objects
    FOR SELECT USING (bucket_id = 'publications');
CREATE POLICY "Admins can upload publications" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'publications' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Professors can upload publications" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'publications' AND public.has_role(auth.uid(), 'professor'));
CREATE POLICY "Admins can delete publications" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'publications' AND public.has_role(auth.uid(), 'admin'));

-- 12. Updated_at triggers
CREATE TRIGGER update_published_journals_updated_at BEFORE UPDATE ON public.published_journals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_published_books_updated_at BEFORE UPDATE ON public.published_books FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_upload_requests_updated_at BEFORE UPDATE ON public.upload_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_professor_submissions_updated_at BEFORE UPDATE ON public.professor_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
