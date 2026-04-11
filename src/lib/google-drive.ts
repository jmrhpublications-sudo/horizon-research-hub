import { supabase } from '@/integrations/supabase/client';
import { generateDriveFileName } from './file-validation';

export interface DriveFileInfo {
  id: string;
  name: string;
  webViewLink: string;
  webContentLink?: string;
}

export interface DriveUploadResult {
  success: boolean;
  fileId?: string;
  webViewLink?: string;
  downloadLink?: string;
  error?: string;
}

const db = supabase as any;

class GoogleDriveService {
  private rootFolderId: string | null = null;

  async initialize(): Promise<boolean> {
    try {
      const { data, error } = await db.from('app_config').select('value').eq('key', 'google_drive_root_folder_id').maybeSingle();
      
      if (error || !data) {
        console.warn('Google Drive root folder not configured');
        return false;
      }
      
      this.rootFolderId = data.value;
      return !!this.rootFolderId;
    } catch (error) {
      console.error('Failed to initialize Google Drive service:', error);
      return false;
    }
  }

  async getRootFolderId(): Promise<string | null> {
    if (this.rootFolderId) {
      return this.rootFolderId;
    }
    
    const initialized = await this.initialize();
    return initialized ? this.rootFolderId : null;
  }

  private async callEdgeFunction(endpoint: string, body: any): Promise<any> {
    const { data, error } = await supabase.functions.invoke(endpoint, {
      body
    });
    
    if (error) {
      throw new Error(error.message || 'Edge function call failed');
    }
    
    return data;
  }

  async uploadFile(
    userEmail: string,
    file: File,
    submissionId: string,
    onProgress?: (progress: number) => void
  ): Promise<DriveUploadResult> {
    try {
      const rootFolderId = await this.getRootFolderId();
      
      if (!rootFolderId) {
        return {
          success: false,
          error: 'Google Drive is not configured. Please contact support.'
        };
      }

      const fileName = generateDriveFileName(file.name);
      
      const reader = new FileReader();
      
      return new Promise((resolve) => {
        reader.onload = async () => {
          try {
            const base64Data = (reader.result as string).split(',')[1];
            
            if (onProgress) onProgress(30);
            
            const result = await this.callEdgeFunction('google-drive-upload', {
              action: 'upload',
              userEmail,
              fileName,
              mimeType: file.type,
              fileData: base64Data,
              submissionId
            });
            
            if (onProgress) onProgress(90);
            
            if (result.success) {
              resolve({
                success: true,
                fileId: result.fileId,
                webViewLink: result.webViewLink,
                downloadLink: result.downloadLink
              });
            } else {
              resolve({
                success: false,
                error: result.error || 'Upload failed'
              });
            }
          } catch (error: any) {
            resolve({
              success: false,
              error: error.message || 'Upload failed'
            });
          }
        };
        
        reader.onerror = () => {
          resolve({
            success: false,
            error: 'Failed to read file'
          });
        };
        
        reader.readAsDataURL(file);
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Upload failed'
      };
    }
  }

  async createUserFolder(userEmail: string): Promise<string | null> {
    try {
      const result = await this.callEdgeFunction('google-drive-upload', {
        action: 'createFolder',
        userEmail
      });
      
      return result.folderId || null;
    } catch (error) {
      console.error('Failed to create user folder:', error);
      return null;
    }
  }

  async getDownloadLink(fileId: string): Promise<string | null> {
    try {
      const result = await this.callEdgeFunction('google-drive-upload', {
        action: 'getDownloadLink',
        fileId
      });
      
      return result.downloadLink || null;
    } catch (error) {
      console.error('Failed to get download link:', error);
      return null;
    }
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      await this.callEdgeFunction('google-drive-upload', {
        action: 'delete',
        fileId
      });
      return true;
    } catch (error) {
      console.error('Failed to delete file:', error);
      return false;
    }
  }
}

export const googleDriveService = new GoogleDriveService();

export async function uploadManuscriptToDrive(
  userEmail: string,
  files: File[],
  submissionId: string,
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<{ success: boolean; attachments: string[]; errors: string[] }> {
  const attachments: string[] = [];
  const errors: string[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (onProgress) {
      onProgress(i, 10);
    }
    
    const result = await googleDriveService.uploadFile(
      userEmail,
      file,
      submissionId,
      onProgress ? ((progress) => onProgress(i, progress)) : undefined
    );
    
    if (result.success && result.fileId) {
      attachments.push(JSON.stringify({
        id: result.fileId,
        name: file.name,
        viewLink: result.webViewLink,
        downloadLink: result.downloadLink
      }));
    } else {
      errors.push(`${file.name}: ${result.error || 'Upload failed'}`);
    }
  }
  
  return {
    success: errors.length === 0,
    attachments,
    errors
  };
}

export function parseDriveAttachment(attachment: string): DriveFileInfo | null {
  try {
    const parsed = JSON.parse(attachment);
    return {
      id: parsed.id,
      name: parsed.name,
      webViewLink: parsed.viewLink,
      webContentLink: parsed.downloadLink
    };
  } catch {
    return null;
  }
}