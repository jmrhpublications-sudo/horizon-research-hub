import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const USER_STORAGE_KEY = 'jmrh_user';

export type UserRole = 'ADMIN' | 'PROFESSOR' | 'USER';
export type UserStatus = 'ACTIVE' | 'BANNED';
export type PaperStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'REVISION_REQUIRED' | 'ACCEPTED' | 'REJECTED' | 'PUBLISHED' | 'ARCHIVED';
export type PaperType = 'JOURNAL' | 'BOOK';
export type RequestType = 'JOURNAL' | 'BOOK';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type SubmissionSource = 'ADMIN' | 'PROFESSOR';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    phone?: string;
    affiliation?: string;
    department?: string;
    degree?: string;
    address?: string;
    city?: string;
    pincode?: string;
    age?: string;
    dob?: string;
    bio?: string;
    college?: string;
    specialization?: string;
    studyType?: string;
    designation?: string;
}

export interface Paper {
    id: string;
    authorId: string;
    authorName: string;
    authorEmail?: string;
    title: string;
    abstract: string;
    discipline: string;
    paperType: PaperType;
    manuscriptType?: string;
    keywords?: string;
    coAuthors?: string;
    phone?: string;
    affiliation?: string;
    designation?: string;
    orcid?: string;
    coverLetter?: string;
    additionalNotes?: string;
    status: PaperStatus;
    assignedProfessorId?: string;
    assignedProfessorName?: string;
    submissionDate: string;
    revisionComments?: string;
    attachments?: string[];
}

export interface Review {
    id: string;
    userId: string;
    userName: string;
    content: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

export interface PublishedJournal {
    id: string;
    title: string;
    authors: string;
    abstract?: string;
    discipline: string;
    keywords?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    doi?: string;
    publicationDate: string;
    coverImage?: string;
    pdfUrl?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface PublishedBook {
    id: string;
    title: string;
    authors: string;
    editors?: string;
    isbn?: string;
    publisher?: string;
    description?: string;
    discipline: string;
    keywords?: string;
    edition?: string;
    publicationYear?: string;
    coverImage?: string;
    pdfUrl?: string;
    purchaseLink?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface UploadRequest {
    id: string;
    userId: string;
    requestType: RequestType;
    title: string;
    authors?: string;
    description?: string;
    isbn?: string;
    publisher?: string;
    link?: string;
    status: RequestStatus;
    adminNotes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProfessorSubmission {
    id: string;
    professorId: string;
    professorName: string;
    submissionType: 'JOURNAL' | 'BOOK';
    title: string;
    authors: string;
    abstract?: string;
    discipline: string;
    keywords?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    doi?: string;
    editors?: string;
    isbn?: string;
    publisher?: string;
    description?: string;
    edition?: string;
    publicationYear?: string;
    publicationDate?: string;
    coverImage?: string;
    pdfUrl?: string;
    purchaseLink?: string;
    status: RequestStatus;
    adminNotes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Document {
    id: string;
    uploaderId: string | null;
    uploaderName: string;
    uploaderRole: UserRole;
    title: string;
    description?: string;
    filePath: string;
    fileName: string;
    fileType: 'doc' | 'docx';
    fileHash?: string;
    fileSize?: number;
    documentType: 'MANUSCRIPT' | 'JOURNAL' | 'BOOK' | 'REVIEW';
    status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
    relatedDocumentId?: string;
    reviewNotes?: string;
    reviewDecision?: 'ACCEPT' | 'REVISION_REQUIRED' | 'REJECTED';
    reviewerId?: string;
    reviewerName?: string;
    createdAt: string;
    updatedAt: string;
}

// Helper to cast supabase client for untyped tables
const db = supabase as any;

interface JMRHContextType {
    users: User[];
    papers: Paper[];
    reviews: Review[];
    publishedJournals: PublishedJournal[];
    publishedBooks: PublishedBook[];
    uploadRequests: UploadRequest[];
    professorSubmissions: ProfessorSubmission[];
    documents: Document[];
    currentUser: User | null;
    isLoading: boolean;
    setCurrentUser: (user: User | null) => void;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (name: string, email: string, pass: string, details: any) => Promise<void>;
    updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
    banUser: (userId: string) => Promise<void>;
    unbanUser: (userId: string) => Promise<void>;
    createUser: (name: string, email: string, password: string, role: UserRole, details?: any) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    updateUserRole: (userId: string, role: UserRole) => Promise<void>;
    assignPaper: (paperId: string, professorId: string, professorName: string) => Promise<void>;
    submitPaper: (title: string, abstract: string, discipline: string, paperType: PaperType, authorName: string, authorEmail?: string, manuscriptType?: string, keywords?: string, coAuthors?: string, attachments?: string[], phone?: string, affiliation?: string, designation?: string, orcid?: string, coverLetter?: string, additionalNotes?: string) => Promise<void>;
    submitPaperAnonymous: (title: string, abstract: string, discipline: string, paperType: PaperType, authorName: string, authorEmail?: string, manuscriptType?: string, keywords?: string, coAuthors?: string, attachments?: string[], phone?: string, affiliation?: string, designation?: string, orcid?: string, coverLetter?: string, additionalNotes?: string, submissionId?: string) => Promise<void>;
    updatePaper: (paperId: string, updates: Partial<Paper>) => Promise<void>;
    updatePaperStatus: (paperId: string, status: PaperStatus, comments?: string) => Promise<void>;
    publishPaper: (paperId: string) => Promise<void>;
    deletePaper: (paperId: string) => Promise<void>;
    addReview: (content: string, rating: number) => Promise<void>;
    updateReview: (reviewId: string, content: string, rating: number) => Promise<void>;
    deleteReview: (reviewId: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshData: () => Promise<void>;
    createPublishedJournal: (data: Partial<PublishedJournal>) => Promise<void>;
    updatePublishedJournal: (id: string, data: Partial<PublishedJournal>) => Promise<void>;
    deletePublishedJournal: (id: string) => Promise<void>;
    createPublishedBook: (data: Partial<PublishedBook>) => Promise<void>;
    updatePublishedBook: (id: string, data: Partial<PublishedBook>) => Promise<void>;
    deletePublishedBook: (id: string) => Promise<void>;
    createUploadRequest: (data: Partial<UploadRequest>) => Promise<void>;
    updateUploadRequest: (id: string, data: Partial<UploadRequest>) => Promise<void>;
    deleteUploadRequest: (id: string) => Promise<void>;
    createProfessorSubmission: (data: Partial<ProfessorSubmission>) => Promise<void>;
    updateProfessorSubmission: (id: string, data: Partial<ProfessorSubmission>) => Promise<void>;
    deleteProfessorSubmission: (id: string) => Promise<void>;
    approveProfessorSubmission: (submission: ProfessorSubmission) => Promise<void>;
    uploadDocument: (file: File, title: string, documentType: Document['documentType'], description?: string) => Promise<{ success: boolean; error?: string; isDuplicate?: boolean; duplicateOf?: Document }>;
    getDocumentUrl: (documentId: string) => Promise<string | null>;
    getMyDocuments: () => Promise<Document[]>;
    getAssignedDocuments: () => Promise<Document[]>;
    getAllDocuments: (filters?: { documentType?: Document['documentType']; status?: Document['status']; uploaderRole?: UserRole }) => Promise<Document[]>;
    assignReviewer: (documentId: string, reviewerId: string, reviewerName: string) => Promise<void>;
    submitDocumentReview: (documentId: string, decision: Document['reviewDecision'], notes: string) => Promise<void>;
    updateDocumentStatus: (documentId: string, status: Document['status'], notes?: string) => Promise<void>;
    deleteDocument: (documentId: string) => Promise<void>;
    archiveDocument: (documentId: string) => Promise<void>;
}

const JMRHContext = createContext<JMRHContextType | undefined>(undefined);

const mapProfile = (p: any): User => ({
    id: p.id,
    name: p.name || '',
    email: p.email || '',
    role: (p.role || 'USER') as UserRole,
    status: (p.status || 'ACTIVE') as UserStatus,
    createdAt: p.created_at || '',
    phone: p.phone_number || p.phone,
    affiliation: p.university || p.affiliation,
    department: p.department || p.specialization,
    degree: p.degree,
    address: p.address,
    city: p.city,
    pincode: p.pincode,
    age: p.age,
    dob: p.dob,
    bio: p.bio,
    college: p.college,
    specialization: p.specialization,
    studyType: p.study_type,
});

const mapPaper = (p: any): Paper => ({
    id: p.id,
    authorId: p.author_id,
    authorName: p.author_name || '',
    authorEmail: p.author_email,
    title: p.title || '',
    abstract: p.abstract || '',
    discipline: p.discipline || '',
    paperType: (p.paper_type || 'JOURNAL') as PaperType,
    manuscriptType: p.manuscript_type,
    keywords: p.keywords,
    coAuthors: p.co_authors,
    phone: p.phone,
    affiliation: p.affiliation,
    designation: p.designation,
    orcid: p.orcid,
    coverLetter: p.cover_letter,
    additionalNotes: p.additional_notes,
    status: p.status as PaperStatus,
    assignedProfessorId: p.assigned_professor_id,
    assignedProfessorName: p.assigned_professor_name,
    submissionDate: p.submission_date || '',
    revisionComments: p.revision_comments,
    attachments: p.attachments,
});

const mapReview = (r: any): Review => ({
    id: r.id,
    userId: r.user_id,
    userName: r.user_name || '',
    content: r.content || '',
    rating: r.rating,
    createdAt: r.created_at || '',
    updatedAt: r.updated_at || '',
});

const mapPublishedJournal = (j: any): PublishedJournal => ({
    id: j.id,
    title: j.title || '',
    authors: j.authors || '',
    abstract: j.abstract,
    discipline: j.discipline || '',
    keywords: j.keywords,
    volume: j.volume,
    issue: j.issue,
    pages: j.pages,
    doi: j.doi,
    publicationDate: j.publication_date || '',
    coverImage: j.cover_image,
    pdfUrl: j.pdf_url,
    status: j.status || 'PUBLISHED',
    createdAt: j.created_at || '',
    updatedAt: j.updated_at || '',
});

const mapPublishedBook = (b: any): PublishedBook => ({
    id: b.id,
    title: b.title || '',
    authors: b.authors || '',
    editors: b.editors,
    isbn: b.isbn,
    publisher: b.publisher,
    description: b.description,
    discipline: b.discipline || '',
    keywords: b.keywords,
    edition: b.edition,
    publicationYear: b.publication_year,
    coverImage: b.cover_image,
    pdfUrl: b.pdf_url,
    purchaseLink: b.purchase_link,
    status: b.status || 'PUBLISHED',
    createdAt: b.created_at || '',
    updatedAt: b.updated_at || '',
});

const mapUploadRequest = (r: any): UploadRequest => ({
    id: r.id,
    userId: r.user_id,
    requestType: r.request_type as RequestType,
    title: r.title || '',
    authors: r.authors,
    description: r.description,
    isbn: r.isbn,
    publisher: r.publisher,
    link: r.link,
    status: r.status as RequestStatus,
    adminNotes: r.admin_notes,
    createdAt: r.created_at || '',
    updatedAt: r.updated_at || '',
});

const mapProfessorSubmission = (s: any): ProfessorSubmission => ({
    id: s.id,
    professorId: s.professor_id,
    professorName: s.professor_name || '',
    submissionType: s.submission_type as 'JOURNAL' | 'BOOK',
    title: s.title || '',
    authors: s.authors || '',
    abstract: s.abstract,
    discipline: s.discipline || '',
    keywords: s.keywords,
    volume: s.volume,
    issue: s.issue,
    pages: s.pages,
    doi: s.doi,
    editors: s.editors,
    isbn: s.isbn,
    publisher: s.publisher,
    description: s.description,
    edition: s.edition,
    publicationYear: s.publication_year,
    publicationDate: s.publication_date,
    coverImage: s.cover_image,
    pdfUrl: s.pdf_url,
    purchaseLink: s.purchase_link,
    status: s.status as RequestStatus,
    adminNotes: s.admin_notes,
    createdAt: s.created_at || '',
    updatedAt: s.updated_at || '',
});

export const JMRHProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [papers, setPapers] = useState<Paper[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [publishedJournals, setPublishedJournals] = useState<PublishedJournal[]>([]);
    const [publishedBooks, setPublishedBooks] = useState<PublishedBook[]>([]);
    const [uploadRequests, setUploadRequests] = useState<UploadRequest[]>([]);
    const [professorSubmissions, setProfessorSubmissions] = useState<ProfessorSubmission[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const mapDocument = (d: any): Document => ({
        id: d.id,
        uploaderId: d.uploader_id,
        uploaderName: d.uploader_name,
        uploaderRole: d.uploader_role as UserRole,
        title: d.title,
        description: d.description,
        filePath: d.file_path,
        fileName: d.file_name,
        fileType: d.file_type as 'doc' | 'docx',
        fileHash: d.file_hash,
        fileSize: d.file_size,
        documentType: d.document_type as Document['documentType'],
        status: d.status as Document['status'],
        relatedDocumentId: d.related_document_id,
        reviewNotes: d.revision_comments,
        reviewDecision: d.review_decision as Document['reviewDecision'],
        reviewerId: d.reviewer_id,
        reviewerName: d.reviewer_name,
        createdAt: d.created_at,
        updatedAt: d.updated_at
    });

    const fetchUserProfile = async (userId: string): Promise<User | null> => {
        const { data: profile } = await db.from('profiles').select('*').eq('id', userId).maybeSingle();
        if (!profile) return null;

        const { data: roles } = await db.from('user_roles').select('role').eq('user_id', userId);
        const userRole = roles?.[0]?.role?.toUpperCase() || 'USER';

        return { ...mapProfile(profile), role: userRole as UserRole };
    };

    useEffect(() => {
    const init = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const profile = await fetchUserProfile(session.user.id);
                    if (profile) {
                        setCurrentUser(profile);
                        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
                    }
                } else {
                    // No valid session - clear any cached data
                    localStorage.removeItem(USER_STORAGE_KEY);
                    setCurrentUser(null);
                }
            } catch (err) {
                console.warn('Init auth error:', err);
                localStorage.removeItem(USER_STORAGE_KEY);
                setCurrentUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        init();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setCurrentUser(null);
                return;
            }
            if (session?.user) {
                // Use setTimeout to avoid deadlock with Supabase's internal lock
                setTimeout(async () => {
                    const profile = await fetchUserProfile(session.user.id);
                    if (profile) setCurrentUser(profile);
                }, 0);
            }
        });

        refreshData();

        return () => subscription.unsubscribe();
    }, []);

    const refreshData = async () => {
        try {
            // Fetch all data in parallel - non-existent tables return error gracefully
            const [profilesRes, rolesRes, papersRes, reviewsRes, journalsRes, booksRes, requestsRes, professorSubsRes, docsRes] = await Promise.all([
                db.from('profiles').select('*'),
                db.from('user_roles').select('*'),
                db.from('papers').select('*'),
                db.from('reviews').select('*'),
                db.from('published_journals').select('*'),
                db.from('published_books').select('*'),
                db.from('upload_requests').select('*'),
                db.from('professor_submissions').select('*'),
                db.from('documents').select('*').order('created_at', { ascending: false }),
            ]);

            if (profilesRes.data) {
                const rolesMap: Record<string, string> = {};
                if (rolesRes?.data) {
                    for (const r of rolesRes.data) {
                        // Store the highest-priority role per user (admin > professor > user)
                        const current = rolesMap[r.user_id];
                        const priority: Record<string, number> = { admin: 3, professor: 2, user: 1 };
                        if (!current || (priority[r.role] || 0) > (priority[current] || 0)) {
                            rolesMap[r.user_id] = r.role;
                        }
                    }
                }
                setUsers(profilesRes.data.map((p: any) => ({
                    ...mapProfile(p),
                    role: (rolesMap[p.id]?.toUpperCase() || 'USER') as UserRole,
                })));
            }

            if (papersRes.data) {
                // Build a lookup for professor names from profiles
                const profNames: Record<string, string> = {};
                if (profilesRes.data) {
                    for (const p of profilesRes.data) {
                        profNames[p.id] = p.name || '';
                    }
                }
                setPapers(papersRes.data.map((p: any) => ({
                    ...mapPaper(p),
                    assignedProfessorName: p.assigned_professor_id ? (profNames[p.assigned_professor_id] || 'Unknown') : undefined,
                })));
            }

            if (reviewsRes.data) setReviews(reviewsRes.data.map(mapReview));
            if (journalsRes?.data) setPublishedJournals(journalsRes.data.map(mapPublishedJournal));
            if (booksRes?.data) setPublishedBooks(booksRes.data.map(mapPublishedBook));
            if (requestsRes?.data) setUploadRequests(requestsRes.data.map(mapUploadRequest));
            if (professorSubsRes?.data) setProfessorSubmissions(professorSubsRes.data.map(mapProfessorSubmission));
            if (docsRes?.data && !docsRes.error) {
                setDocuments(docsRes.data.map(mapDocument));
            }
        } catch (err) {
            console.warn('Data refresh error:', err);
        }
    };

    const signIn = async (email: string, pass: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
        
        if (data.user) {
            const profile = await fetchUserProfile(data.user.id);
            if (profile) {
                setCurrentUser(profile);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
            }
        }
        
        toast({ title: "Authentication Success", description: "Welcome back to JMRH" });
    };

    const signUp = async (name: string, email: string, pass: string, details: any) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password: pass,
            options: { data: { full_name: name, ...details } }
        });
        if (error) throw error;
        
        // Set user role
        if (data.user) {
            await db.from('user_roles').insert({ user_id: data.user.id, role: 'USER' });
            
            // Also create profile with extended details
            await db.from('profiles').insert({
                id: data.user.id,
                name: name,
                email: email,
                phone_number: details.phone || '',
                dob: details.dob || '',
                address: details.address || '',
                city: details.city || '',
                pincode: details.pincode || '',
                university: details.affiliation || '',
                college: details.college || '',
                department: details.department || '',
                degree: details.degree || '',
                specialization: details.specialization || '',
                university: details.university || '',
                status: 'ACTIVE'
            });
        }
        
        toast({ title: "Registration Success", description: "Please check your email for verification link." });
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setCurrentUser(null);
        localStorage.removeItem(USER_STORAGE_KEY);
    };

    const updateUser = async (userId: string, updates: Partial<User>) => {
        const dbUpdates: any = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.email !== undefined) dbUpdates.email = updates.email;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.phone !== undefined) dbUpdates.phone_number = updates.phone;
        if (updates.affiliation !== undefined) dbUpdates.university = updates.affiliation;
        if (updates.department !== undefined) dbUpdates.department = updates.department;
        if (updates.degree !== undefined) dbUpdates.degree = updates.degree;
        if (updates.address !== undefined) dbUpdates.address = updates.address;
        if (updates.city !== undefined) dbUpdates.city = updates.city;
        if (updates.pincode !== undefined) dbUpdates.pincode = updates.pincode;
        if (updates.age !== undefined) dbUpdates.age = updates.age;
        if (updates.dob !== undefined) dbUpdates.dob = updates.dob;
        if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
        if (updates.college !== undefined) dbUpdates.college = updates.college;
        if (updates.specialization !== undefined) dbUpdates.specialization = updates.specialization;
        if (updates.studyType !== undefined) dbUpdates.study_type = updates.studyType;

        const { error } = await db.from('profiles').update(dbUpdates).eq('id', userId);
        if (error) throw error;
        await refreshData();
    };

    const banUser = async (userId: string) => updateUser(userId, { status: 'BANNED' });
    const unbanUser = async (userId: string) => updateUser(userId, { status: 'ACTIVE' });

    const createUser = async (name: string, email: string, password: string, role: UserRole, details?: any) => {
        const { data, error } = await supabase.functions.invoke('admin-manage-user', {
            body: {
                action: 'create',
                email,
                password,
                name,
                role: role.toLowerCase(),
                phone: details?.phone,
                department: details?.department,
                affiliation: details?.affiliation,
                degree: details?.degree,
            }
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        
        toast({ title: "User Created", description: `${role} account created successfully.` });
        await refreshData();
    };

    const deleteUser = async (userId: string) => {
        const { data, error } = await supabase.functions.invoke('admin-manage-user', {
            body: { action: 'delete', userId }
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        
        toast({ title: "User Deleted", description: "User account has been permanently removed." });
        await refreshData();
    };

    const updateUserRole = async (userId: string, role: UserRole) => {
        const { data, error } = await supabase.functions.invoke('admin-manage-user', {
            body: { action: 'update_role', userId, role: role.toLowerCase() }
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        
        toast({ title: "Role Updated", description: `User role changed to ${role}.` });
        await refreshData();
    };

    const assignPaper = async (paperId: string, professorId: string, professorName: string) => {
        const { error } = await db.from('papers').update({ 
            status: 'UNDER_REVIEW', 
            assigned_professor_id: professorId,
        }).eq('id', paperId);
        if (error) throw error;
        
        // Also update assigned manuscript document
        try {
            await db.from('documents').update({
                reviewer_id: professorId,
                reviewer_name: professorName,
                status: 'UNDER_REVIEW'
            }).eq('related_document_id', paperId);
        } catch (docErr) {
            console.warn('Document assignment updated failed (non-critical):', docErr);
        }
        
        toast({ title: "Paper Assigned", description: `Assigned to ${professorName}` });
        await refreshData();
    };

    const submitPaper = async (
        title: string, 
        abstract: string, 
        discipline: string, 
        paperType: PaperType,
        authorName: string, 
        authorEmail?: string,
        manuscriptType?: string,
        keywords?: string,
        coAuthors?: string,
        attachments?: string[],
        phone?: string,
        affiliation?: string,
        designation?: string,
        orcid?: string,
        coverLetter?: string,
        additionalNotes?: string
    ) => {
        if (!currentUser) return;
        
        const { error } = await db.from('papers').insert({
            author_id: currentUser.id,
            author_name: authorName,
            author_email: authorEmail || currentUser.email,
            title, 
            abstract, 
            discipline,
            paper_type: paperType,
            manuscript_type: manuscriptType || '',
            keywords: keywords || '',
            co_authors: coAuthors || '',
            phone: phone || '',
            affiliation: affiliation || '',
            designation: designation || '',
            orcid: orcid || '',
            cover_letter: coverLetter || '',
            additional_notes: additionalNotes || '',
            status: 'SUBMITTED',
            submission_date: new Date().toISOString().split('T')[0],
            attachments
        });
        if (error) throw error;
        
        // Also save to documents table for better management
        if (attachments && attachments.length > 0) {
            const filePath = attachments[0];
            const fileName = filePath.split('/').pop() || 'manuscript.docx';
            const fileExt = fileName.split('.').pop()?.toLowerCase();
            
            if (fileExt && ['doc', 'docx'].includes(fileExt)) {
                try {
                    // Update papers entry to get the ID, then create document entry
                    const { data: paperData } = await db.from('papers')
                        .select('id')
                        .eq('author_id', currentUser.id)
                        .eq('title', title)
                        .order('created_at', { ascending: false })
                        .limit(1);
                    
                    if (paperData && paperData.length > 0) {
                        await db.from('documents').insert({
                            uploader_id: currentUser.id,
                            uploader_name: currentUser.name,
                            uploader_role: currentUser.role,
                            title: title,
                            description: `Author: ${authorName}\nEmail: ${authorEmail || currentUser.email}\nDiscipline: ${discipline}`,
                            file_path: filePath,
                            file_name: fileName,
                            file_type: fileExt,
                            document_type: 'MANUSCRIPT',
                            status: 'PENDING',
                            related_document_id: paperData[0].id
                        });
                    }
                } catch (docErr) {
                    console.warn('Document tracking failed (non-critical):', docErr);
                }
            }
        }
        
        // Notify admin via edge function
        try {
            await supabase.functions.invoke('notify-admin-submission', {
                body: { title, authorName, authorEmail: authorEmail || currentUser.email, discipline, paperType }
            });
        } catch (notifyErr) {
            console.warn('Admin notification failed (non-critical):', notifyErr);
        }
        
        toast({ title: "Submission Received", description: "Your manuscript has been submitted for review." });
        await refreshData();
    };

    const     submitPaperAnonymous = async (
        title: string, 
        abstract: string, 
        discipline: string, 
        paperType: PaperType,
        authorName: string, 
        authorEmail?: string,
        manuscriptType?: string,
        keywords?: string,
        coAuthors?: string,
        attachments?: string[],
        phone?: string,
        affiliation?: string,
        designation?: string,
        orcid?: string,
        coverLetter?: string,
        additionalNotes?: string
    ) => {
        const { error } = await db.from('papers').insert({
            author_name: authorName,
            author_email: authorEmail || '',
            title, 
            abstract, 
            discipline,
            paper_type: paperType,
            manuscript_type: manuscriptType || '',
            keywords: keywords || '',
            co_authors: coAuthors || '',
            phone: phone || '',
            affiliation: affiliation || '',
            designation: designation || '',
            orcid: orcid || '',
            cover_letter: coverLetter || '',
            additional_notes: additionalNotes || '',
            status: 'SUBMITTED',
            submission_date: new Date().toISOString().split('T')[0],
            attachments
        });
        if (error) throw error;
        
        // Also save to documents table for anonymous submissions
        if (attachments && attachments.length > 0) {
            const filePath = attachments[0];
            const fileName = filePath.split('/').pop() || 'manuscript.docx';
            const fileExt = fileName.split('.').pop()?.toLowerCase();
            
            if (fileExt && ['doc', 'docx'].includes(fileExt)) {
                try {
                    const { data: paperData } = await db.from('papers')
                        .select('id')
                        .eq('author_name', authorName)
                        .eq('title', title)
                        .order('created_at', { ascending: false })
                        .limit(1);
                    
                    if (paperData && paperData.length > 0) {
                        await db.from('documents').insert({
                            uploader_id: null,
                            uploader_name: authorName,
                            uploader_role: 'USER',
                            title: title,
                            description: `Author: ${authorName}\nEmail: ${authorEmail}\nDiscipline: ${discipline}`,
                            file_path: filePath,
                            file_name: fileName,
                            file_type: fileExt,
                            document_type: 'MANUSCRIPT',
                            status: 'PENDING',
                            related_document_id: paperData[0].id
                        });
                    }
                } catch (docErr) {
                    console.warn('Document tracking failed (non-critical):', docErr);
                }
            }
        }
        
        try {
            await supabase.functions.invoke('notify-admin-submission', {
                body: { title, authorName, authorEmail: authorEmail || '', discipline, paperType }
            });
        } catch (notifyErr) {
            console.warn('Admin notification failed (non-critical):', notifyErr);
        }
        
        toast({ title: "Submission Received", description: "Your manuscript has been submitted for review." });
        await refreshData();
    };

    const updatePaper = async (paperId: string, updates: Partial<Paper>) => {
        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.abstract !== undefined) dbUpdates.abstract = updates.abstract;
        if (updates.discipline !== undefined) dbUpdates.discipline = updates.discipline;
        
        const { error } = await db.from('papers').update(dbUpdates).eq('id', paperId);
        if (error) throw error;
        await refreshData();
    };

    const updatePaperStatus = async (paperId: string, status: PaperStatus, comments?: string) => {
        const { error } = await db.from('papers').update({ 
            status, 
            revision_comments: comments 
        }).eq('id', paperId);
        if (error) throw error;
        
        toast({ title: "Status Updated", description: `Paper status changed to ${status}` });
        await refreshData();
    };

    const publishPaper = async (paperId: string) => {
        const { error } = await db.from('papers').update({ 
            status: 'PUBLISHED'
        }).eq('id', paperId);
        if (error) throw error;
        
        // Also update document status
        try {
            await db.from('documents').update({
                status: 'APPROVED'
            }).eq('related_document_id', paperId);
        } catch (docErr) {
            console.warn('Document publish update failed (non-critical):', docErr);
        }
        
        toast({ title: "Published!", description: "Paper is now visible in the journal/book section." });
        await refreshData();
    };

    const deletePaper = async (paperId: string) => {
        // Find paper to get attachments for cleanup
        const paper = papers.find(p => p.id === paperId);
        
        // Delete attachments from storage
        if (paper?.attachments && paper.attachments.length > 0) {
            await supabase.storage.from('papers').remove(paper.attachments);
        }
        
        // Also delete related documents
        try {
            const { data: relatedDocs } = await db.from('documents')
                .select('file_path')
                .eq('related_document_id', paperId);
            
            if (relatedDocs && relatedDocs.length > 0) {
                await supabase.storage.from('documents').remove(relatedDocs.map(d => d.file_path));
                await db.from('documents').delete().eq('related_document_id', paperId);
            }
        } catch (docErr) {
            console.warn('Document deletion failed (non-critical):', docErr);
        }
        
        const { error } = await db.from('papers').delete().eq('id', paperId);
        if (error) throw error;
        
        toast({ title: "Paper Deleted", description: "Submission and all attachments have been removed." });
        await refreshData();
    };

    const addReview = async (content: string, rating: number) => {
        if (!currentUser) return;
        const { error } = await db.from('reviews').insert({
            user_id: currentUser.id,
            user_name: currentUser.name,
            content, 
            rating,
        });
        if (error) throw error;
        await refreshData();
    };

    const updateReview = async (reviewId: string, content: string, rating: number) => {
        const { error } = await db.from('reviews').update({
            content,
            rating,
            updated_at: new Date().toISOString(),
        }).eq('id', reviewId);
        if (error) throw error;
        await refreshData();
    };

    const deleteReview = async (reviewId: string) => {
        const { error } = await db.from('reviews').delete().eq('id', reviewId);
        if (error) throw error;
        await refreshData();
    };

    const createPublishedJournal = async (data: Partial<PublishedJournal>) => {
        const { error } = await db.from('published_journals').insert({
            title: data.title,
            authors: data.authors,
            abstract: data.abstract,
            discipline: data.discipline,
            keywords: data.keywords,
            volume: data.volume,
            issue: data.issue,
            pages: data.pages,
            doi: data.doi,
            publication_date: data.publicationDate,
            cover_image: data.coverImage,
            pdf_url: data.pdfUrl,
            status: 'PUBLISHED'
        });
        if (error) throw error;
        toast({ title: "Journal Published", description: "Journal article has been published successfully." });
        await refreshData();
    };

    const updatePublishedJournal = async (id: string, data: Partial<PublishedJournal>) => {
        const { error } = await db.from('published_journals').update({
            title: data.title,
            authors: data.authors,
            abstract: data.abstract,
            discipline: data.discipline,
            keywords: data.keywords,
            volume: data.volume,
            issue: data.issue,
            pages: data.pages,
            doi: data.doi,
            publication_date: data.publicationDate,
            cover_image: data.coverImage,
            pdf_url: data.pdfUrl,
        }).eq('id', id);
        if (error) throw error;
        await refreshData();
    };

    const deletePublishedJournal = async (id: string) => {
        const { error } = await db.from('published_journals').delete().eq('id', id);
        if (error) throw error;
        toast({ title: "Deleted", description: "Journal article has been removed." });
        await refreshData();
    };

    const createPublishedBook = async (data: Partial<PublishedBook>) => {
        const { error } = await db.from('published_books').insert({
            title: data.title,
            authors: data.authors,
            editors: data.editors,
            isbn: data.isbn,
            publisher: data.publisher,
            description: data.description,
            discipline: data.discipline,
            keywords: data.keywords,
            edition: data.edition,
            publication_year: data.publicationYear,
            cover_image: data.coverImage,
            pdf_url: data.pdfUrl,
            purchase_link: data.purchaseLink,
            status: 'PUBLISHED'
        });
        if (error) throw error;
        toast({ title: "Book Published", description: "Book has been published successfully." });
        await refreshData();
    };

    const updatePublishedBook = async (id: string, data: Partial<PublishedBook>) => {
        const { error } = await db.from('published_books').update({
            title: data.title,
            authors: data.authors,
            editors: data.editors,
            isbn: data.isbn,
            publisher: data.publisher,
            description: data.description,
            discipline: data.discipline,
            keywords: data.keywords,
            edition: data.edition,
            publication_year: data.publicationYear,
            cover_image: data.coverImage,
            pdf_url: data.pdfUrl,
            purchase_link: data.purchaseLink,
        }).eq('id', id);
        if (error) throw error;
        await refreshData();
    };

    const deletePublishedBook = async (id: string) => {
        const { error } = await db.from('published_books').delete().eq('id', id);
        if (error) throw error;
        toast({ title: "Deleted", description: "Book has been removed." });
        await refreshData();
    };

    const createUploadRequest = async (data: Partial<UploadRequest>) => {
        if (!currentUser) return;
        const { error } = await db.from('upload_requests').insert({
            user_id: currentUser.id,
            request_type: data.requestType,
            title: data.title,
            authors: data.authors,
            description: data.description,
            isbn: data.isbn,
            publisher: data.publisher,
            link: data.link,
            status: 'PENDING'
        });
        if (error) throw error;
        toast({ title: "Request Submitted", description: "Your request has been submitted for review." });
        await refreshData();
    };

    const updateUploadRequest = async (id: string, data: Partial<UploadRequest>) => {
        const { error } = await db.from('upload_requests').update({
            status: data.status,
            admin_notes: data.adminNotes,
        }).eq('id', id);
        if (error) throw error;
        await refreshData();
    };

    const deleteUploadRequest = async (id: string) => {
        const { error } = await db.from('upload_requests').delete().eq('id', id);
        if (error) throw error;
        await refreshData();
    };

    const createProfessorSubmission = async (data: Partial<ProfessorSubmission>) => {
        if (!currentUser) return;
        const { error } = await db.from('professor_submissions').insert({
            professor_id: currentUser.id,
            professor_name: currentUser.name,
            submission_type: data.submissionType,
            title: data.title,
            authors: data.authors,
            abstract: data.abstract,
            discipline: data.discipline,
            keywords: data.keywords,
            volume: data.volume,
            issue: data.issue,
            pages: data.pages,
            doi: data.doi,
            editors: data.editors,
            isbn: data.isbn,
            publisher: data.publisher,
            description: data.description,
            edition: data.edition,
            publication_year: data.publicationYear,
            publication_date: data.publicationDate,
            cover_image: data.coverImage,
            pdf_url: data.pdfUrl,
            purchase_link: data.purchaseLink,
            status: 'PENDING'
        });
        if (error) throw error;
        toast({ title: "Submission Sent", description: "Your submission is pending admin approval." });
        await refreshData();
    };

    const updateProfessorSubmission = async (id: string, data: Partial<ProfessorSubmission>) => {
        const { error } = await db.from('professor_submissions').update({
            title: data.title,
            authors: data.authors,
            abstract: data.abstract,
            discipline: data.discipline,
            keywords: data.keywords,
            volume: data.volume,
            issue: data.issue,
            pages: data.pages,
            doi: data.doi,
            editors: data.editors,
            isbn: data.isbn,
            publisher: data.publisher,
            description: data.description,
            edition: data.edition,
            publication_year: data.publicationYear,
            publication_date: data.publicationDate,
            cover_image: data.coverImage,
            pdf_url: data.pdfUrl,
            purchase_link: data.purchaseLink,
        }).eq('id', id);
        if (error) throw error;
        await refreshData();
    };

    const deleteProfessorSubmission = async (id: string) => {
        const { error } = await db.from('professor_submissions').delete().eq('id', id);
        if (error) throw error;
        await refreshData();
    };

    const approveProfessorSubmission = async (submission: ProfessorSubmission) => {
        // Create the published entry with uploader info
        if (submission.submissionType === 'JOURNAL') {
            await createPublishedJournal({
                title: submission.title,
                authors: submission.authors,
                abstract: submission.abstract,
                discipline: submission.discipline,
                keywords: submission.keywords,
                volume: submission.volume,
                issue: submission.issue,
                pages: submission.pages,
                doi: submission.doi,
                publicationDate: submission.publicationDate || new Date().toISOString().split('T')[0],
                coverImage: submission.coverImage,
                pdfUrl: submission.pdfUrl,
            });
            
            // Update with uploaded_by
            const db = supabase as any;
            await db.from('published_journals').update({ uploaded_by: submission.professorName }).eq('title', submission.title);
        } else {
            await createPublishedBook({
                title: submission.title,
                authors: submission.authors,
                editors: submission.editors,
                isbn: submission.isbn,
                publisher: submission.publisher,
                description: submission.description,
                discipline: submission.discipline,
                keywords: submission.keywords,
                edition: submission.edition,
                publicationYear: submission.publicationYear,
                coverImage: submission.coverImage,
                pdfUrl: submission.pdfUrl,
                purchaseLink: submission.purchaseLink,
            });
            
            // Update with uploaded_by
            const db = supabase as any;
            await db.from('published_books').update({ uploaded_by: submission.professorName }).eq('title', submission.title);
        }

        // Update submission status to approved
        await updateProfessorSubmission(submission.id, { status: 'APPROVED' as RequestStatus });
        toast({ title: "Submission Approved", description: "Content is now visible to all users." });
    };

    const uploadDocument = async (
        file: File,
        title: string,
        documentType: Document['documentType'],
        description?: string
    ): Promise<{ success: boolean; error?: string; isDuplicate?: boolean; duplicateOf?: Document }> => {
        if (!currentUser) {
            return { success: false, error: 'Please sign in to upload documents' };
        }

        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (!['doc', 'docx'].includes(fileExt || '')) {
            return { success: false, error: 'Only .doc and .docx files are allowed' };
        }

        if (file.size > 20 * 1024 * 1024) {
            return { success: false, error: 'File size must be less than 20MB' };
        }

        // Generate file hash for deduplication
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const fileHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

        // Check for duplicates
        const { data: existingDocs } = await db.from('documents')
            .select('id, title, file_name, uploader_name')
            .eq('file_hash', fileHash)
            .limit(1);

        if (existingDocs && existingDocs.length > 0) {
            const dup = existingDocs[0];
            return {
                success: false,
                error: 'This file already exists in the system',
                isDuplicate: true,
                duplicateOf: {
                    id: dup.id,
                    uploaderId: null,
                    uploaderName: dup.uploader_name,
                    uploaderRole: 'USER' as UserRole,
                    title: dup.title,
                    fileName: dup.file_name,
                    filePath: '',
                    fileType: 'doc' as const,
                    documentType: documentType as Document['documentType'],
                    status: 'PENDING' as Document['status'],
                    createdAt: '',
                    updatedAt: ''
                }
            };
        }

        // Upload to storage
        const folderMap: Record<string, string> = {
            MANUSCRIPT: 'manuscripts',
            JOURNAL: 'journals',
            BOOK: 'books',
            REVIEW: 'reviews'
        };
        const folder = folderMap[documentType];
        const fileName = `${currentUser.id}/${folder}/${Date.now()}_${file.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            });

        if (uploadError) {
            return { success: false, error: uploadError.message };
        }

        // Save to database
        const { error: insertError } = await db.from('documents').insert({
            uploader_id: currentUser.id,
            uploader_name: currentUser.name,
            uploader_role: currentUser.role,
            title,
            description: description || null,
            file_path: uploadData.path,
            file_name: file.name,
            file_type: fileExt,
            file_hash: fileHash,
            file_size: file.size,
            document_type: documentType,
            status: 'PENDING'
        });

        if (insertError) {
            await supabase.storage.from('documents').remove([uploadData.path]);
            return { success: false, error: insertError.message };
        }

        toast({ title: "Document Uploaded", description: `${file.name} uploaded successfully` });
        await refreshData();
        return { success: true };
    };

    const getDocumentUrl = async (documentId: string): Promise<string | null> => {
        const doc = documents.find(d => d.id === documentId);
        if (!doc) return null;

        try {
            const { data } = await supabase.storage
                .from('documents')
                .createSignedUrl(doc.filePath, 3600);
            return data?.signedUrl || null;
        } catch {
            return null;
        }
    };

    const getMyDocuments = async (): Promise<Document[]> => {
        if (!currentUser) return [];
        return documents.filter(d => d.uploaderId === currentUser.id);
    };

    const getAssignedDocuments = async (): Promise<Document[]> => {
        if (!currentUser || currentUser.role !== 'PROFESSOR') return [];
        return documents.filter(d => d.reviewerId === currentUser.id);
    };

    const getAllDocuments = async (filters?: {
        documentType?: Document['documentType'];
        status?: Document['status'];
        uploaderRole?: UserRole;
    }): Promise<Document[]> => {
        let filtered = documents;
        if (filters?.documentType) {
            filtered = filtered.filter(d => d.documentType === filters.documentType);
        }
        if (filters?.status) {
            filtered = filtered.filter(d => d.status === filters.status);
        }
        if (filters?.uploaderRole) {
            filtered = filtered.filter(d => d.uploaderRole === filters.uploaderRole);
        }
        return filtered;
    };

    const assignReviewer = async (documentId: string, reviewerId: string, reviewerName: string) => {
        const { error } = await db.from('documents').update({
            reviewer_id: reviewerId,
            reviewer_name: reviewerName,
            status: 'UNDER_REVIEW'
        }).eq('id', documentId);

        if (error) throw error;
        toast({ title: "Reviewer Assigned", description: `Assigned to ${reviewerName}` });
        await refreshData();
    };

    const submitDocumentReview = async (documentId: string, decision: Document['reviewDecision'], notes: string) => {
        const { error } = await db.from('documents').update({
            review_decision: decision,
            review_notes: notes,
            status: decision === 'ACCEPT' ? 'APPROVED' : decision === 'REVISION_REQUIRED' ? 'UNDER_REVIEW' : 'REJECTED'
        }).eq('id', documentId);

        if (error) throw error;
        toast({ title: "Review Submitted", description: `Decision: ${decision}` });
        await refreshData();
    };

    const updateDocumentStatus = async (documentId: string, status: Document['status'], notes?: string) => {
        const { error } = await db.from('documents').update({
            status,
            review_notes: notes || null
        }).eq('id', documentId);

        if (error) throw error;
        toast({ title: "Status Updated", description: `Document status changed to ${status}` });
        await refreshData();
    };

    const deleteDocument = async (documentId: string) => {
        const doc = documents.find(d => d.id === documentId);
        if (!doc) throw new Error('Document not found');

        await supabase.storage.from('documents').remove([doc.filePath]);
        const { error } = await db.from('documents').delete().eq('id', documentId);

        if (error) throw error;
        toast({ title: "Document Deleted", description: "Document has been removed" });
        await refreshData();
    };

    const archiveDocument = async (documentId: string) => {
        return updateDocumentStatus(documentId, 'ARCHIVED');
    };

    return (
        <JMRHContext.Provider value={{
            users, papers, reviews, publishedJournals, publishedBooks, uploadRequests, professorSubmissions, documents, currentUser, isLoading, setCurrentUser, signIn, signUp, updateUser,
            banUser, unbanUser, createUser, deleteUser, updateUserRole, assignPaper,
            submitPaper, submitPaperAnonymous, updatePaper, updatePaperStatus, publishPaper, deletePaper, addReview, updateReview, deleteReview, logout, refreshData,
            createPublishedJournal, updatePublishedJournal, deletePublishedJournal,
            createPublishedBook, updatePublishedBook, deletePublishedBook,
            createUploadRequest, updateUploadRequest, deleteUploadRequest,
            createProfessorSubmission, updateProfessorSubmission, deleteProfessorSubmission, approveProfessorSubmission,
            uploadDocument, getDocumentUrl, getMyDocuments, getAssignedDocuments, getAllDocuments, assignReviewer, submitDocumentReview, updateDocumentStatus, deleteDocument, archiveDocument
        }}>
            {children}
        </JMRHContext.Provider>
    );
};

export const useJMRH = () => {
    const context = useContext(JMRHContext);
    if (!context) throw new Error('useJMRH must be used within a JMRHProvider');
    return context;
};
