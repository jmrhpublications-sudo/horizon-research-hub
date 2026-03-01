import { supabase } from "@/integrations/supabase/client";

/**
 * Generate a signed URL for a file in a private Supabase storage bucket.
 * If the stored value is already a full URL (legacy data), return it as-is.
 */
export const getSignedFileUrl = async (
  bucket: string,
  filePath: string,
  expiresIn: number = 3600
): Promise<string | null> => {
  if (!filePath) return null;

  // Legacy: if it's already a full URL, return as-is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    console.error(`Signed URL error for ${bucket}/${filePath}:`, error);
    return null;
  }

  return data.signedUrl;
};
