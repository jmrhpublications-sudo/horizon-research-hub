
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='app_config') THEN
    EXECUTE 'ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE ALL ON public.app_config FROM PUBLIC';
    BEGIN EXECUTE 'REVOKE ALL ON public.app_config FROM anon'; EXCEPTION WHEN OTHERS THEN NULL; END;
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_config TO authenticated';
    EXECUTE 'GRANT ALL ON public.app_config TO service_role';
    EXECUTE 'DROP POLICY IF EXISTS "Admins manage app_config" ON public.app_config';
    EXECUTE $p$CREATE POLICY "Admins manage app_config" ON public.app_config
      FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::app_role))
      WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role))$p$;
  END IF;
END $$;

-- Harden the config update helper only if the function exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='update_app_config') THEN
    EXECUTE $f$
      CREATE OR REPLACE FUNCTION public.update_app_config(key TEXT, new_value TEXT)
      RETURNS VOID
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $body$
      BEGIN
        IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
          RAISE EXCEPTION 'Only admins can update app_config';
        END IF;
        UPDATE public.app_config
          SET value = new_value, updated_at = NOW()
          WHERE app_config.key = update_app_config.key;
      END;
      $body$;
    $f$;
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.update_app_config(TEXT, TEXT) FROM PUBLIC';
    BEGIN EXECUTE 'REVOKE EXECUTE ON FUNCTION public.update_app_config(TEXT, TEXT) FROM anon'; EXCEPTION WHEN OTHERS THEN NULL; END;
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.update_app_config(TEXT, TEXT) TO authenticated';
  END IF;
END $$;

-- 2) documents insert/update guards
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='documents') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert documents" ON public.documents';
    EXECUTE $p$CREATE POLICY "Users can insert documents" ON public.documents
      FOR INSERT TO authenticated
      WITH CHECK (
        auth.uid() = uploader_id
        AND status = 'PENDING'
        AND reviewer_id IS NULL
        AND review_decision IS NULL
        AND review_notes IS NULL
      )$p$;

    EXECUTE 'DROP POLICY IF EXISTS "Users can update own pending documents" ON public.documents';
    EXECUTE $p$CREATE POLICY "Users can update own pending documents" ON public.documents
      FOR UPDATE TO authenticated
      USING (auth.uid() = uploader_id AND status = 'PENDING')
      WITH CHECK (
        auth.uid() = uploader_id
        AND status = 'PENDING'
        AND reviewer_id IS NULL
        AND review_decision IS NULL
      )$p$;
  END IF;
END $$;

-- 3) reviews masked public view
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Owners and admins can view reviews" ON public.reviews;
CREATE POLICY "Owners and admins can view reviews" ON public.reviews
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE VIEW public.reviews_public
WITH (security_invoker = true) AS
SELECT
  id,
  content,
  rating,
  CASE
    WHEN user_name IS NULL OR length(trim(user_name)) = 0 THEN 'Anonymous'
    WHEN position(' ' IN trim(user_name)) > 0 THEN
      split_part(trim(user_name), ' ', 1) || ' ' ||
      left(split_part(trim(user_name), ' ', 2), 1) || '.'
    ELSE left(trim(user_name), 1) || '.'
  END AS user_name,
  created_at,
  updated_at
FROM public.reviews;

GRANT SELECT ON public.reviews_public TO anon, authenticated;
