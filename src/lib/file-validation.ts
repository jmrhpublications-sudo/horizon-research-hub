export const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const MIN_FILE_SIZE = 100 * 1024; // 100 KB
export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(file: File): FileValidationResult {
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { 
      valid: false, 
      error: `Invalid file type. Only PDF and DOC files are allowed. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}` 
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type) && file.type !== '') {
    return { 
      valid: false, 
      error: 'Invalid file type. Only PDF and DOC files are allowed.' 
    };
  }

  if (file.size < MIN_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File is too small. Minimum size is 100 KB. Your file: ${(file.size / 1024).toFixed(1)} KB` 
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File is too large. Maximum size is 20 MB. Your file: ${(file.size / (1024 * 1024)).toFixed(1)} MB` 
    };
  }

  return { valid: true };
}

export function validateFiles(files: FileList | File[]): FileValidationResult {
  const fileArray = Array.from(files);
  
  if (fileArray.length === 0) {
    return { 
      valid: false, 
      error: 'At least one file is required' 
    };
  }

  if (fileArray.length > 5) {
    return { 
      valid: false, 
      error: 'Maximum 5 files allowed per submission' 
    };
  }

  for (const file of fileArray) {
    const result = validateFile(file);
    if (!result.valid) {
      return result;
    }
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}

export function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}

export function generateDriveFileName(originalName: string): string {
  const timestamp = Date.now();
  const extension = originalName.substring(originalName.lastIndexOf('.'));
  const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '_');
  return `${sanitizedName}_${timestamp}${extension}`;
}