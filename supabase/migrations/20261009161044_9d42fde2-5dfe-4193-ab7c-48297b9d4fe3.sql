CREATE OR REPLACE FUNCTION public.papers_author_field_guard()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'SUBMITTED';
    NEW.assigned_professor_id := NULL;
    NEW.revision_comments := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Assigned reviewing professor (not the author) may update review fields
    IF OLD.assigned_professor_id = auth.uid() AND OLD.author_id <> auth.uid()
       AND public.has_role(auth.uid(), 'professor'::app_role) THEN
      RETURN NEW;
    END IF;
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'Authors cannot change paper status';
    END IF;
    IF NEW.assigned_professor_id IS DISTINCT FROM OLD.assigned_professor_id THEN
      RAISE EXCEPTION 'Authors cannot change assigned reviewer';
    END IF;
    IF NEW.revision_comments IS DISTINCT FROM OLD.revision_comments THEN
      RAISE EXCEPTION 'Authors cannot change revision comments';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;