import { supabase } from '@/integrations/supabase/client';

const db = supabase as any;

export type DocumentType = 'MANUSCRIPT' | 'JOURNAL' | 'BOOK' | 'REVIEW';
export type DocumentStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
export type ReviewDecision = 'ACCEPT' | 'REVISION_REQUIRED' | 'REJECTED';
export type UserRole = 'ADMIN' | 'PROFESSOR' | 'USER';

export interface Document {
    id: string;
    uploader_id: string | null;
    uploader_name: string;
    uploader_role: UserRole;
    title: string;
    description: string | null;
    file_path: string;
    file_name: string;
    file_type: 'doc' | 'docx';
    file_hash: string | null;
    file_size: number | null;
    document_type: DocumentType;
    status: DocumentStatus;
    related_document_id: string | null;
    review_notes: string | null;
    review_decision: ReviewDecision | null;
    reviewer_id: string | null;
    reviewer_name: string | null;
    created_at: string;
    updated_at: string;
}

export interface DuplicateCheckResult {
    is_duplicate: boolean;
    existing_document_id: string | null;
    existing_title: string | null;
    existing_file_name: string | null;
    existing_uploaded_by: string | null;
}

export interface DocumentUploadResult {
    success: boolean;
    document?: Document;
    error?: string;
    isDuplicate?: boolean;
    duplicateOf?: {
        id: string;
        title: string;
        file_name: string;
        uploaded_by: string;
    };
}

async function generateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function uploadToStorage(
    file: File,
    userId: string,
    documentType: DocumentType
): Promise<{ success: boolean; filePath?: string; error?: string }> {
    const folderMap: Record<DocumentType, string> = {
        MANUSCRIPT: 'manuscripts',
        JOURNAL: 'journals',
        BOOK: 'books',
        REVIEW: 'reviews'
    };
    
    const folder = folderMap[documentType];
    const fileName = `${userId}/${folder}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
    
    if (error) {
        console.error('Storage upload error:', error);
        return { success: false, error: error.message };
    }
    
    return { success: true, filePath: data.path };
}

async function checkDuplicate(fileHash: string): Promise<DuplicateCheckResult | null> {
    try {
        const { data, error } = await db.rpc('check_duplicate_document', { file_hash_param: fileHash });
        
        if (error || !data || data.length === 0) {
            return null;
        }
        
        return {
            is_duplicate: data[0].is_duplicate,
            existing_document_id: data[0].existing_document_id,
            existing_title: data[0].existing_title,
            existing_file_name: data[0].existing_file_name,
            existing_uploaded_by: data[0].existing_uploaded_by
        };
    } catch (err) {
        console.warn('Duplicate check RPC failed, falling back to query:', err);
        
        const { data, error } = await db.from('documents')
            .select('id, title, file_name, uploader_name')
            .eq('file_hash', fileHash)
            .order('created_at', { ascending: false })
            .limit(1);
        
        if (error || !data || data.length === 0) {
            return null;
        }
        
        return {
            is_duplicate: true,
            existing_document_id: data[0].id,
            existing_title: data[0].title,
            existing_file_name: data[0].file_name,
            existing_uploaded_by: data[0].uploader_name
        };
    }
}

export async function uploadDocument(
    file: File,
    userId: string | null,
    userName: string,
    userRole: UserRole,
    title: string,
    documentType: DocumentType,
    description?: string,
    relatedDocumentId?: string
): Promise<DocumentUploadResult> {
    try {
        const fileHash = await generateFileHash(file);
        const fileSize = file.size;
        const fileExt = file.name.split('.').pop()?.toLowerCase() as 'doc' | 'docx';
        
        if (!['doc', 'docx'].includes(fileExt)) {
            return { success: false, error: 'Only .doc and .docx files are allowed' };
        }
        
        if (fileSize > 20 * 1024 * 1024) {
            return { success: false, error: 'File size must be less than 20MB' };
        }
        
        const duplicateCheck = await checkDuplicate(fileHash);
        
        if (duplicateCheck?.is_duplicate) {
            return {
                success: false,
                error: 'This file already exists in the system',
                isDuplicate: true,
                duplicateOf: {
                    id: duplicateCheck.existing_document_id!,
                    title: duplicateCheck.existing_title!,
                    file_name: duplicateCheck.existing_file_name!,
                    uploaded_by: duplicateCheck.existing_uploaded_by!
                }
            };
        }
        
        const storageResult = await uploadToStorage(file, userId || 'anonymous', documentType);
        
        if (!storageResult.success) {
            return { success: false, error: storageResult.error || 'Upload failed' };
        }
        
        const { error: insertError } = await db.from('documents').insert({
            uploader_id: userId,
            uploader_name: userName,
            uploader_role: userRole,
            title,
            description: description || null,
            file_path: storageResult.filePath,
            file_name: file.name,
            file_type: fileExt,
            file_hash: fileHash,
            file_size: fileSize,
            document_type: documentType,
            status: documentType === 'MANUSCRIPT' ? 'PENDING' : 'PENDING',
            related_document_id: relatedDocumentId || null
        });
        
        if (insertError) {
            console.error('Database insert error:', insertError);
            await supabase.storage.from('documents').remove([storageResult.filePath]);
            return { success: false, error: insertError.message };
        }
        
        const { data: newDoc, error: fetchError } = await db.from('documents')
            .select('*')
            .eq('file_path', storageResult.filePath)
            .single();
        
        if (fetchError || !newDoc) {
            return { success: true };
        }
        
        return { success: true, document: mapDocument(newDoc) };
    } catch (err: any) {
        console.error('Upload error:', err);
        return { success: false, error: err.message || 'Upload failed' };
    }
}

export async function getDocuments(
    filters?: {
        userId?: string;
        reviewerId?: string;
        documentType?: DocumentType;
        status?: DocumentStatus;
        uploaderRole?: UserRole;
    }
): Promise<Document[]> {
    let query = db.from('documents').select('*');
    
    if (filters?.userId) {
        query = query.eq('uploader_id', filters.userId);
    }
    
    if (filters?.reviewerId) {
        query = query.eq('reviewer_id', filters.reviewerId);
    }
    
    if (filters?.documentType) {
        query = query.eq('document_type', filters.documentType);
    }
    
    if (filters?.status) {
        query = query.eq('status', filters.status);
    }
    
    if (filters?.uploaderRole) {
        query = query.eq('uploader_role', filters.uploaderRole);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
        console.error('Fetch documents error:', error);
        return [];
    }
    
    return (data || []).map(mapDocument);
}

export async function getDocumentById(id: string): Promise<Document | null> {
    const { data, error } = await db.from('documents').select('*').eq('id', id).single();
    
    if (error || !data) {
        return null;
    }
    
    return mapDocument(data);
}

export async function assignReviewer(
    documentId: string,
    reviewerId: string,
    reviewerName: string
): Promise<{ success: boolean; error?: string }> {
    const { error } = await db.from('documents').update({
        reviewer_id: reviewerId,
        reviewer_name: reviewerName,
        status: 'UNDER_REVIEW'
    }).eq('id', documentId);
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    return { success: true };
}

export async function submitReview(
    documentId: string,
    decision: ReviewDecision,
    notes: string
): Promise<{ success: boolean; error?: string }> {
    const { error } = await db.from('documents').update({
        review_decision: decision,
        review_notes: notes,
        status: decision === 'ACCEPT' ? 'APPROVED' : decision === 'REVISION_REQUIRED' ? 'UNDER_REVIEW' : 'REJECTED'
    }).eq('id', documentId);
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    return { success: true };
}

export async function updateDocumentStatus(
    documentId: string,
    status: DocumentStatus,
    notes?: string
): Promise<{ success: boolean; error?: string }> {
    const { error } = await db.from('documents').update({
        status,
        review_notes: notes || null
    }).eq('id', documentId);
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    return { success: true };
}

export async function deleteDocument(documentId: string): Promise<{ success: boolean; error?: string }> {
    const doc = await getDocumentById(documentId);
    
    if (!doc) {
        return { success: false, error: 'Document not found' };
    }
    
    const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([doc.file_path]);
    
    if (storageError) {
        console.warn('Storage delete warning:', storageError);
    }
    
    const { error } = await db.from('documents').delete().eq('id', documentId);
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    return { success: true };
}

export async function getSignedDownloadUrl(filePath: string): Promise<string | null> {
    try {
        const { data, error } = await supabase.storage
            .from('documents')
            .createSignedUrl(filePath, 3600);
        
        if (error || !data?.signedUrl) {
            return null;
        }
        
        return data.signedUrl;
    } catch (err) {
        console.error('Get download URL error:', err);
        return null;
    }
}

export async function archiveDocument(documentId: string): Promise<{ success: boolean; error?: string }> {
    return updateDocumentStatus(documentId, 'ARCHIVED');
}

function mapDocument(data: any): Document {
    return {
        id: data.id,
        uploader_id: data.uploader_id,
        uploader_name: data.uploader_name,
        uploader_role: data.uploader_role as UserRole,
        title: data.title,
        description: data.description,
        file_path: data.file_path,
        file_name: data.file_name,
        file_type: data.file_type as 'doc' | 'docx',
        file_hash: data.file_hash,
        file_size: data.file_size,
        document_type: data.document_type as DocumentType,
        status: data.status as DocumentStatus,
        related_document_id: data.related_document_id,
        review_notes: data.review_notes,
        review_decision: data.review_decision as ReviewDecision | null,
        reviewer_id: data.reviewer_id,
        reviewer_name: data.reviewer_name,
        created_at: data.created_at,
        updated_at: data.updated_at
    };
}