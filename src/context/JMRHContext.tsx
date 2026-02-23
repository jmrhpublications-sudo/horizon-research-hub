import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'ADMIN' | 'PROFESSOR' | 'USER';
export type UserStatus = 'ACTIVE' | 'BANNED';
export type PaperStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'REVISION_REQUIRED' | 'ACCEPTED' | 'REJECTED' | 'PUBLISHED' | 'ARCHIVED';
export type PaperType = 'JOURNAL' | 'BOOK';

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

// Helper to cast supabase client for untyped tables
const db = supabase as any;

interface JMRHContextType {
    users: User[];
    papers: Paper[];
    reviews: Review[];
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
    deleteReview: (reviewId: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshData: () => Promise<void>;
}

const JMRHContext = createContext<JMRHContextType | undefined>(undefined);

const mapProfile = (p: any): User => ({
    id: p.id,
    name: p.name || '',
    email: p.email || '',
    role: (p.role || 'USER') as UserRole,
    status: (p.status || 'ACTIVE') as UserStatus,
    createdAt: p.created_at || '',
    phone: p.phone,
    affiliation: p.affiliation,
    department: p.department,
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

export const JMRHProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [papers, setPapers] = useState<Paper[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
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
                if (profile) setCurrentUser(profile);
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
        const [profilesRes, papersRes, reviewsRes] = await Promise.all([
            db.from('profiles').select('*'),
            db.from('papers').select('*'),
            db.from('reviews').select('*'),
        ]);

        if (profilesRes.data) setUsers(profilesRes.data.map(mapProfile));
        if (papersRes.data) setPapers(papersRes.data.map(mapPaper));
        if (reviewsRes.data) setReviews(reviewsRes.data.map(mapReview));
    };

    const signIn = async (email: string, pass: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
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
    };

    const updateUser = async (userId: string, updates: Partial<User>) => {
        const dbUpdates: any = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.email !== undefined) dbUpdates.email = updates.email;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
        if (updates.affiliation !== undefined) dbUpdates.affiliation = updates.affiliation;
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
                phone: details?.phone,
                affiliation: details?.affiliation,
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

    const deleteReview = async (reviewId: string) => {
        const { error } = await db.from('reviews').delete().eq('id', reviewId);
        if (error) throw error;
        await refreshData();
    };

    return (
        <JMRHContext.Provider value={{
            users, papers, reviews, currentUser, isLoading, setCurrentUser, signIn, signUp, updateUser,
            banUser, unbanUser, createUser, assignPaper,
            submitPaper, updatePaper, updatePaperStatus, publishPaper, addReview, deleteReview, logout, refreshData
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
