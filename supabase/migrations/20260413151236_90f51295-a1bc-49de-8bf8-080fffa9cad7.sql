
-- Strengthen the professor_update_check trigger to block ALL sensitive fields
-- (currently only blocks: author_id, assigned_professor_id, author_name, author_email, title, abstract, attachments)
-- Adding: phone, affiliation, designation, orcid, additional_notes, discipline, paper_type, manuscript_type, keywords, co_authors, cover_letter, submission_date

CREATE OR REPLACE FUNCTION public.professor_update_check()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    -- If the updater is a professor (not admin), restrict field changes
    IF has_role(auth.uid(), 'professor'::app_role) AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
        -- Prevent changing author identity fields
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
        -- Block additional sensitive fields
        IF NEW.phone IS DISTINCT FROM OLD.phone THEN
            RAISE EXCEPTION 'Professors cannot change phone';
        END IF;
        IF NEW.affiliation IS DISTINCT FROM OLD.affiliation THEN
            RAISE EXCEPTION 'Professors cannot change affiliation';
        END IF;
        IF NEW.designation IS DISTINCT FROM OLD.designation THEN
            RAISE EXCEPTION 'Professors cannot change designation';
        END IF;
        IF NEW.orcid IS DISTINCT FROM OLD.orcid THEN
            RAISE EXCEPTION 'Professors cannot change orcid';
        END IF;
        IF NEW.additional_notes IS DISTINCT FROM OLD.additional_notes THEN
            RAISE EXCEPTION 'Professors cannot change additional_notes';
        END IF;
        IF NEW.discipline IS DISTINCT FROM OLD.discipline THEN
            RAISE EXCEPTION 'Professors cannot change discipline';
        END IF;
        IF NEW.paper_type IS DISTINCT FROM OLD.paper_type THEN
            RAISE EXCEPTION 'Professors cannot change paper_type';
        END IF;
        IF NEW.manuscript_type IS DISTINCT FROM OLD.manuscript_type THEN
            RAISE EXCEPTION 'Professors cannot change manuscript_type';
        END IF;
        IF NEW.keywords IS DISTINCT FROM OLD.keywords THEN
            RAISE EXCEPTION 'Professors cannot change keywords';
        END IF;
        IF NEW.co_authors IS DISTINCT FROM OLD.co_authors THEN
            RAISE EXCEPTION 'Professors cannot change co_authors';
        END IF;
        IF NEW.cover_letter IS DISTINCT FROM OLD.cover_letter THEN
            RAISE EXCEPTION 'Professors cannot change cover_letter';
        END IF;
        IF NEW.submission_date IS DISTINCT FROM OLD.submission_date THEN
            RAISE EXCEPTION 'Professors cannot change submission_date';
        END IF;
        IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
            RAISE EXCEPTION 'Professors cannot change created_at';
        END IF;
    END IF;
    RETURN NEW;
END;
$function$;
