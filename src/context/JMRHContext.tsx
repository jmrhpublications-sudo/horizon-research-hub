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
    currentUser: User | null;
    isLoading: boolean;
    setCurrentUser: (user: User | null) => void;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (name: string, email: string, pass: string, details: any) => Promise<void>;
    updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
    banUser: (userId: string) => Promise<void>;
    unbanUser: (userId: string) => Promise<void>;
    createUser: (name: string, email: string, password: string, role: UserRole, details?: any) => Promise<void>;
    assignPaper: (paperId: string, professorId: string, professorName: string) => Promise<void>;
    submitPaper: (title: string, abstract: string, discipline: string, paperType: PaperType, authorName: string, authorEmail?: string, manuscriptType?: string, keywords?: string, coAuthors?: string, attachments?: string[]) => Promise<void>;
    updatePaper: (paperId: string, updates: Partial<Paper>) => Promise<void>;
    updatePaperStatus: (paperId: string, status: PaperStatus, comments?: string) => Promise<void>;
    publishPaper: (paperId: string) => Promise<void>;
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
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchUserProfile = async (userId: string): Promise<User | null> => {
        const { data: profile } = await db.from('profiles').select('*').eq('id', userId).maybeSingle();
        if (!profile) return null;

        const { data: roles } = await db.from('user_roles').select('role').eq('user_id', userId);
        const userRole = roles?.[0]?.role?.toUpperCase() || 'USER';

        return { ...mapProfile(profile), role: userRole as UserRole };
    };

    useEffect(() => {
        const init = async () => {
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
            setIsLoading(false);
        };

        init();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                setCurrentUser(null);
                return;
            }
            if (session?.user) {
                const profile = await fetchUserProfile(session.user.id);
                if (profile) setCurrentUser(profile);
            }
        });

        refreshData();

        return () => subscription.unsubscribe();
    }, []);

    const refreshData = async () => {
        try {
            // Fetch all data in parallel - non-existent tables return error gracefully
            const [profilesRes, papersRes, reviewsRes, journalsRes, booksRes, requestsRes, professorSubsRes] = await Promise.all([
                db.from('profiles').select('*'),
                db.from('papers').select('*'),
                db.from('reviews').select('*'),
                db.from('published_journals').select('*').eq('status', 'PUBLISHED').then((r: any) => r).catch(() => ({ data: null })),
                db.from('published_books').select('*').eq('status', 'PUBLISHED').then((r: any) => r).catch(() => ({ data: null })),
                db.from('upload_requests').select('*').then((r: any) => r).catch(() => ({ data: null })),
                db.from('professor_submissions').select('*').then((r: any) => r).catch(() => ({ data: null })),
            ]);

            if (profilesRes.data) setUsers(profilesRes.data.map(mapProfile));
            if (papersRes.data) setPapers(papersRes.data.map(mapPaper));
            if (reviewsRes.data) setReviews(reviewsRes.data.map(mapReview));
            if (journalsRes?.data) setPublishedJournals(journalsRes.data.map(mapPublishedJournal));
            if (booksRes?.data) setPublishedBooks(booksRes.data.map(mapPublishedBook));
            if (requestsRes?.data) setUploadRequests(requestsRes.data.map(mapUploadRequest));
            if (professorSubsRes?.data) setProfessorSubmissions(professorSubsRes.data.map(mapProfessorSubmission));
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

        const { error } = await db.from('profiles').update(dbUpdates).eq('id', userId);
        if (error) throw error;
        await refreshData();
    };

    const banUser = async (userId: string) => updateUser(userId, { status: 'BANNED' });
    const unbanUser = async (userId: string) => updateUser(userId, { status: 'ACTIVE' });

    const createUser = async (name: string, email: string, password: string, role: UserRole, details?: any) => {
        // Create auth user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name, ...details } }
        });
        if (error) throw error;
        
        if (data.user) {
            // Set role
            await db.from('user_roles').insert({ user_id: data.user.id, role });
            
            // Update profile
            await db.from('profiles').update({ 
                name, 
                email, 
                status: 'ACTIVE',
                phone_number: details?.phone,
                university: details?.affiliation,
                department: details?.department,
                degree: details?.degree
            }).eq('id', data.user.id);
            
            toast({ title: "User Created", description: `${role} account created successfully.` });
        }
        
        await refreshData();
    };

    const assignPaper = async (paperId: string, professorId: string, professorName: string) => {
        const { error } = await db.from('papers').update({ 
            status: 'UNDER_REVIEW', 
            assigned_professor_id: professorId,
            assigned_professor_name: professorName
        }).eq('id', paperId);
        if (error) throw error;
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
        attachments?: string[]
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
            manuscript_type: manuscriptType,
            keywords,
            co_authors: coAuthors,
            status: 'SUBMITTED',
            submission_date: new Date().toISOString().split('T')[0],
            attachments
        });
        if (error) throw error;
        
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
        
        toast({ title: "Published!", description: "Paper is now visible in the journal/book section." });
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
        // Create the published entry
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
        }

        // Update submission status to approved
        await updateProfessorSubmission(submission.id, { status: 'APPROVED' as RequestStatus });
        toast({ title: "Submission Approved", description: "Content is now visible to all users." });
    };

    return (
        <JMRHContext.Provider value={{
            users, papers, reviews, publishedJournals, publishedBooks, uploadRequests, professorSubmissions, currentUser, isLoading, setCurrentUser, signIn, signUp, updateUser,
            banUser, unbanUser, createUser, assignPaper,
            submitPaper, updatePaper, updatePaperStatus, publishPaper, addReview, updateReview, deleteReview, logout, refreshData,
            createPublishedJournal, updatePublishedJournal, deletePublishedJournal,
            createPublishedBook, updatePublishedBook, deletePublishedBook,
            createUploadRequest, updateUploadRequest, deleteUploadRequest,
            createProfessorSubmission, updateProfessorSubmission, deleteProfessorSubmission, approveProfessorSubmission
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
