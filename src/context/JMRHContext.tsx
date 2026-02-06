import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'ADMIN' | 'PROFESSOR' | 'USER';
export type UserStatus = 'ACTIVE' | 'BANNED';
export type PaperStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'REVISION_REQUIRED' | 'ACCEPTED' | 'REJECTED' | 'PUBLISHED' | 'ARCHIVED';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    // Extended Profile
    pincode?: string;
    city?: string;
    dob?: string;
    address?: string;
    phoneNumber?: string;
    age?: string;
    degree?: string;
    university?: string;
    college?: string;
    department?: string;
    studyType?: string;
    specialization?: string;
    bio?: string;
}

export interface Paper {
    id: string;
    authorId: string;
    authorName: string;
    title: string;
    abstract: string;
    discipline: string;
    status: PaperStatus;
    assignedProfessorId?: string;
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

interface JMRHContextType {
    users: User[];
    papers: Paper[];
    reviews: Review[];
    currentUser: User | null;
    isLoading: boolean;
    setCurrentUser: (user: User | null) => void;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (
        name: string,
        email: string,
        pass: string,
        details: any
    ) => Promise<void>;
    updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
    banUser: (userId: string) => Promise<void>;
    unbanUser: (userId: string) => Promise<void>;
    createProfessor: (
        name: string,
        email: string,
        details: any
    ) => Promise<void>;
    assignPaper: (paperId: string, professorId: string) => Promise<void>;
    submitPaper: (title: string, abstract: string, discipline: string, authorName: string, attachments: string[]) => Promise<void>;
    updatePaper: (paperId: string, updates: any) => Promise<void>;
    updatePaperStatus: (paperId: string, status: PaperStatus, comments?: string) => Promise<void>;
    addReview: (content: string, rating: number) => Promise<void>;
    updateReview: (reviewId: string, content: string, rating: number) => Promise<void>;
    deleteReview: (reviewId: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshData: () => Promise<void>;
}

const JMRHContext = createContext<JMRHContextType | undefined>(undefined);

export const JMRHProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [papers, setPapers] = useState<Paper[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        // Initial session check
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    setCurrentUser(profile as User);
                }
            }
            setIsLoading(false);
        };

        checkSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                setCurrentUser(profile as User);
            } else {
                setCurrentUser(null);
            }
        });

        refreshData();

        return () => subscription.unsubscribe();
    }, []);

    const refreshData = async () => {
        const { data: profiles } = await supabase.from('profiles').select('*');
        const { data: papersData } = await supabase.from('papers').select('*');
        const { data: reviewsData } = await supabase.from('reviews').select('*');

        if (profiles) setUsers(profiles as User[]);
        if (papersData) setPapers(papersData as Paper[]);
        if (reviewsData) setReviews(reviewsData as Review[]);
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
            options: {
                data: { full_name: name, ...details }
            }
        });
        if (error) throw error;

        // Note: The profile creation typically happens via a DB trigger in Supabase,
        // but if not, we would manually insert it here.
        if (data.user) {
            const { error: profileError } = await supabase.from('profiles').insert({
                id: data.user.id,
                name,
                email,
                role: 'USER',
                status: 'ACTIVE',
                ...details
            });
            if (profileError) console.error("Profile creation error:", profileError);
        }

        toast({ title: "Registration Success", description: "Please check your email for verification link." });
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setCurrentUser(null);
    };

    const updateUser = async (userId: string, updates: Partial<User>) => {
        const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
        if (error) throw error;
        refreshData();
    };

    const banUser = async (userId: string) => {
        await updateUser(userId, { status: 'BANNED' });
    };

    const unbanUser = async (userId: string) => {
        await updateUser(userId, { status: 'ACTIVE' });
    };

    const createProfessor = async (name: string, email: string, details: any) => {
        // Since we can't create Auth users directly from frontend without admin key,
        // we'll insert into a 'pending_invites' or handle it via a secure edge function.
        // For this demo, we insert into profiles and assume auth is handled separately or by admin.
        const { error } = await supabase.from('profiles').insert({
            name,
            email,
            role: 'PROFESSOR',
            status: 'ACTIVE',
            ...details
        });
        if (error) throw error;
        refreshData();
    };

    const assignPaper = async (paperId: string, professorId: string) => {
        const { error } = await supabase.from('papers').update({
            status: 'UNDER_REVIEW',
            assigned_professor_id: professorId
        }).eq('id', paperId);
        if (error) throw error;
        refreshData();
    };

    const submitPaper = async (title: string, abstract: string, discipline: string, authorName: string, attachments: string[]) => {
        if (!currentUser) return;
        const { error } = await supabase.from('papers').insert({
            author_id: currentUser.id,
            author_name: authorName || currentUser.name,
            title,
            abstract,
            discipline,
            status: 'SUBMITTED',
            submission_date: new Date().toISOString().split('T')[0],
            attachments
        });
        if (error) throw error;
        refreshData();
    };

    const updatePaper = async (paperId: string, updates: any) => {
        const { error } = await supabase.from('papers').update(updates).eq('id', paperId);
        if (error) throw error;
        refreshData();
    };

    const updatePaperStatus = async (paperId: string, status: PaperStatus, comments?: string) => {
        const { error } = await supabase.from('papers').update({ status, revision_comments: comments }).eq('id', paperId);
        if (error) throw error;
        refreshData();
    };

    const addReview = async (content: string, rating: number) => {
        if (!currentUser) return;
        const { error } = await supabase.from('reviews').insert({
            user_id: currentUser.id,
            user_name: currentUser.name,
            content,
            rating,
            created_at: new Date().toISOString()
        });
        if (error) throw error;
        refreshData();
    };

    const updateReview = async (reviewId: string, content: string, rating: number) => {
        const { error } = await supabase.from('reviews').update({ content, rating, updated_at: new Date().toISOString() }).eq('id', reviewId);
        if (error) throw error;
        refreshData();
    };

    const deleteReview = async (reviewId: string) => {
        const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
        if (error) throw error;
        refreshData();
    };

    return (
        <JMRHContext.Provider value={{
            users, papers, reviews, currentUser, isLoading, setCurrentUser, signIn, signUp, updateUser,
            banUser, unbanUser, createProfessor, assignPaper,
            submitPaper, updatePaper, updatePaperStatus, addReview, updateReview, deleteReview, logout, refreshData
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

