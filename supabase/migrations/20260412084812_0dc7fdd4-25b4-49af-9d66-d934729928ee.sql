-- Add missing UPDATE policy for professors on professor_submissions
CREATE POLICY "Professors can update own submissions"
ON public.professor_submissions
FOR UPDATE
TO authenticated
USING (auth.uid() = professor_id)
WITH CHECK (auth.uid() = professor_id);