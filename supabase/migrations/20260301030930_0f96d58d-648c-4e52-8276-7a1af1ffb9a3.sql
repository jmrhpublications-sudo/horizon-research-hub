
-- Fix search_path for validation functions
CREATE OR REPLACE FUNCTION public.validate_paper()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.validate_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;
