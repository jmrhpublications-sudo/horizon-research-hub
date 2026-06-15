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

/**
 * Generate a public URL for a file in a public Supabase storage bucket.
 * If the stored value is already a full URL (legacy data), return it as-is.
 * Properly encodes path segments so filenames with spaces/commas work in browsers.
 */
export const getPublicFileUrl = (
  bucket: string,
  filePath: string
): string | null => {
  if (!filePath) return null;

  // Legacy: if it's already a full URL, return as-is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  if (!data?.publicUrl) return null;

  // Supabase JS returns the URL with raw path segments. Re-encode the
  // path portion so spaces, commas, and other special chars work in
  // <iframe>, <a href> and fetch().
  try {
    const u = new URL(data.publicUrl);
    u.pathname = u.pathname
      .split('/')
      .map((seg, i) => (i === 0 ? seg : encodeURIComponent(decodeURIComponent(seg))))
      .join('/');
    return u.toString();
  } catch {
    return data.publicUrl;
  }
};

/**
 * Force-download a remote file as a blob. Works around browsers ignoring
 * the `download` attribute on cross-origin links.
 */
export const downloadFileFromUrl = async (
  url: string,
  filename: string
): Promise<void> => {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch (err) {
    console.error('Download error:', err);
    // Fallback: open in new tab so the user can save manually
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};



