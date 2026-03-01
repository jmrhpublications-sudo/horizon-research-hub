
-- =============================================
-- JMRH Full Schema: Tables, RLS, Triggers, Storage
-- =============================================

-- 1. Role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'professor', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role function (SECURITY DEFINER, fixed search_path)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
    )
$$;

-- user_roles RLS
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 2. Profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    phone_number TEXT,
    university TEXT,
    department TEXT,
    specialization TEXT,
    degree TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''), NEW.email);
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 3. Papers table
CREATE TABLE public.papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL DEFAULT '',
    author_email TEXT,
    title TEXT NOT NULL,
    abstract TEXT NOT NULL DEFAULT '',
    discipline TEXT NOT NULL DEFAULT '',
    paper_type TEXT NOT NULL DEFAULT 'JOURNAL',
    manuscript_type TEXT,
    keywords TEXT,
    co_authors TEXT,
    status TEXT NOT NULL DEFAULT 'SUBMITTED',
    assigned_professor_id UUID,
    assigned_professor_name TEXT,
    submission_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    revision_comments TEXT,
    attachments TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authors can view own papers" ON public.papers FOR SELECT TO authenticated USING (author_id = auth.uid());
CREATE POLICY "Authors can insert papers" ON public.papers FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "Admins can manage all papers" ON public.papers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Professors can view assigned papers" ON public.papers FOR SELECT TO authenticated USING (assigned_professor_id = auth.uid());
CREATE POLICY "Professors can update assigned papers" ON public.papers FOR UPDATE TO authenticated USING (assigned_professor_id = auth.uid());

CREATE TRIGGER papers_updated_at BEFORE UPDATE ON public.papers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Paper validation trigger
CREATE OR REPLACE FUNCTION public.validate_paper()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF char_length(NEW.title) < 5 OR char_length(NEW.title) > 500 THEN
        RAISE EXCEPTION 'Title must be 5-500 characters';
    END IF;
    IF char_length(NEW.abstract) > 5000 THEN
        RAISE EXCEPTION 'Abstract must be under 5000 characters';
    END IF;
    IF char_length(NEW.discipline) > 200 THEN
        RAISE EXCEPTION 'Discipline must be under 200 characters';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER validate_paper_trigger BEFORE INSERT OR UPDATE ON public.papers FOR EACH ROW EXECUTE FUNCTION public.validate_paper();

-- 4. Reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user_name TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all reviews" ON public.reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Review validation trigger
CREATE OR REPLACE FUNCTION public.validate_review()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.rating < 1 OR NEW.rating > 5 THEN
        RAISE EXCEPTION 'Rating must be between 1 and 5';
    END IF;
    IF char_length(NEW.content) < 5 OR char_length(NEW.content) > 1000 THEN
        RAISE EXCEPTION 'Review content must be 5-1000 characters';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER validate_review_trigger BEFORE INSERT OR UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.validate_review();

-- 5. Published journals
CREATE TABLE public.published_journals (
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
    publication_date TIMESTAMPTZ DEFAULT now(),
    cover_image TEXT,
    pdf_url TEXT,
    status TEXT NOT NULL DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.published_journals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published journals" ON public.published_journals FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage journals" ON public.published_journals FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Professors can manage journals" ON public.published_journals FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'professor'));

CREATE TRIGGER published_journals_updated_at BEFORE UPDATE ON public.published_journals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 6. Published books
CREATE TABLE public.published_books (
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

CREATE POLICY "Anyone can view published books" ON public.published_books FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage books" ON public.published_books FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Professors can manage books" ON public.published_books FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'professor'));

CREATE TRIGGER published_books_updated_at BEFORE UPDATE ON public.published_books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 7. Upload requests
CREATE TABLE public.upload_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    request_type TEXT NOT NULL DEFAULT 'JOURNAL',
    title TEXT NOT NULL,
    authors TEXT,
    description TEXT,
    isbn TEXT,
    publisher TEXT,
    link TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.upload_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests" ON public.upload_requests FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert requests" ON public.upload_requests FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage all requests" ON public.upload_requests FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER upload_requests_updated_at BEFORE UPDATE ON public.upload_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 8. Professor submissions
CREATE TABLE public.professor_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    professor_name TEXT NOT NULL DEFAULT '',
    submission_type TEXT NOT NULL DEFAULT 'JOURNAL',
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
    publication_date TIMESTAMPTZ,
    cover_image TEXT,
    pdf_url TEXT,
    purchase_link TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.professor_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professors can view own submissions" ON public.professor_submissions FOR SELECT TO authenticated USING (professor_id = auth.uid());
CREATE POLICY "Professors can insert submissions" ON public.professor_submissions FOR INSERT TO authenticated WITH CHECK (professor_id = auth.uid());
CREATE POLICY "Professors can update own submissions" ON public.professor_submissions FOR UPDATE TO authenticated USING (professor_id = auth.uid());
CREATE POLICY "Admins can manage all submissions" ON public.professor_submissions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER professor_submissions_updated_at BEFORE UPDATE ON public.professor_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 9. Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('manuscripts', 'manuscripts', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('publications', 'publications', false);

-- Manuscripts: authors upload to own folder
CREATE POLICY "Authors can upload manuscripts" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'manuscripts' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authors can view own manuscripts" ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'manuscripts' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Admins can view all manuscripts" ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'manuscripts' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authors can delete own manuscripts" ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'manuscripts' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Publications: admins/professors upload, authenticated view
CREATE POLICY "Admins can upload publications" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'publications' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Professors can upload publications" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'publications' AND public.has_role(auth.uid(), 'professor'));

CREATE POLICY "Authenticated can view publications" ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'publications');

CREATE POLICY "Admins can delete publications" ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'publications' AND public.has_role(auth.uid(), 'admin'));
