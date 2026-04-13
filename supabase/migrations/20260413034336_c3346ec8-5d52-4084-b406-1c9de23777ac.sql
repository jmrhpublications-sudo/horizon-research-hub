-- Fix 1: Prevent privilege escalation on user_roles - restrict INSERT to admins only
-- RLS uses PERMISSIVE model, so with no INSERT policy for non-admins, they cannot insert.
-- But the ALL policy for admins covers INSERT. To be safe, add an explicit restrictive approach:
-- We'll add a restrictive INSERT policy that ensures only trigger/admin can insert.

-- Actually, with PERMISSIVE policies and RLS enabled, if there's no matching INSERT policy for a user, they can't insert.
-- The only INSERT-applicable policy is "Admins can manage roles" (ALL, admin only).
-- So non-admins already cannot insert. But let's make this explicit for clarity.

-- No action needed for user_roles - the current policies are correct.
-- Non-admin users have NO permissive INSERT policy, so they cannot insert.
-- The handle_new_user trigger runs as SECURITY DEFINER bypassing RLS.

-- Fix 2: Add UPDATE policy for papers storage bucket
CREATE POLICY "Authors can update own paper attachments"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'papers' AND (auth.uid())::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'papers' AND (auth.uid())::text = (storage.foldername(name))[1]);
