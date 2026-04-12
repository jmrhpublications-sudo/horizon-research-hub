
-- 1. Fix storage policy: professors should only access assigned papers
DROP POLICY IF EXISTS "Authors can view own paper attachments" ON storage.objects;

CREATE POLICY "Authors can view own paper attachments"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'papers' AND (
        auth.uid()::text = (storage.foldername(name))[1] OR
        has_role(auth.uid(), 'admin'::app_role) OR
        (has_role(auth.uid(), 'professor'::app_role) AND professor_can_view_manuscript(name))
    )
);

-- 2. Fix professor update policy: restrict which columns professors can modify
DROP POLICY IF EXISTS "Professors can update assigned papers" ON public.papers;

-- Create a function to validate professor updates (only allow revision_comments and status changes)
CREATE OR REPLACE FUNCTION public.professor_update_check()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- If the updater is a professor (not admin), restrict field changes
    IF has_role(auth.uid(), 'professor'::app_role) AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
        -- Prevent changing sensitive fields
        IF NEW.author_id IS DISTINCT FROM OLD.author_id THEN
            RAISE EXCEPTION 'Professors cannot change author_id';
        END IF;
        IF NEW.assigned_professor_id IS DISTINCT FROM OLD.assigned_professor_id THEN
            RAISE EXCEPTION 'Professors cannot change assigned_professor_id';
        END IF;
        IF NEW.author_name IS DISTINCT FROM OLD.author_name THEN
            RAISE EXCEPTION 'Professors cannot change author_name';
        END IF;
        IF NEW.author_email IS DISTINCT FROM OLD.author_email THEN
            RAISE EXCEPTION 'Professors cannot change author_email';
        END IF;
        IF NEW.title IS DISTINCT FROM OLD.title THEN
            RAISE EXCEPTION 'Professors cannot change title';
        END IF;
        IF NEW.abstract IS DISTINCT FROM OLD.abstract THEN
            RAISE EXCEPTION 'Professors cannot change abstract';
        END IF;
        IF NEW.attachments IS DISTINCT FROM OLD.attachments THEN
            RAISE EXCEPTION 'Professors cannot change attachments';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS check_professor_update ON public.papers;
CREATE TRIGGER check_professor_update
BEFORE UPDATE ON public.papers
FOR EACH ROW
EXECUTE FUNCTION public.professor_update_check();

-- Re-create the professor update policy
CREATE POLICY "Professors can update assigned papers"
ON public.papers
FOR UPDATE
TO authenticated
USING (auth.uid() = assigned_professor_id)
WITH CHECK (auth.uid() = assigned_professor_id);

-- 3. Standardize review validation to 10-2000 chars
CREATE OR REPLACE FUNCTION public.validate_review_content()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF char_length(NEW.content) < 10 THEN
        RAISE EXCEPTION 'Review content must be at least 10 characters';
    END IF;
    IF char_length(NEW.content) > 2000 THEN
        RAISE EXCEPTION 'Review content must be under 2000 characters';
    END IF;
    IF NEW.rating < 1 OR NEW.rating > 5 THEN
        RAISE EXCEPTION 'Rating must be between 1 and 5';
    END IF;
    RETURN NEW;
END;
$$;

-- Drop any conflicting triggers and re-create with consistent function
DROP TRIGGER IF EXISTS validate_review ON public.reviews;
DROP TRIGGER IF EXISTS validate_review_content ON public.reviews;

CREATE TRIGGER validate_review_content
BEFORE INSERT OR UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.validate_review_content();
