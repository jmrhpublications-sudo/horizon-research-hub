import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type UserRole = 'ADMIN' | 'PROFESSOR' | 'USER';
export type UserStatus = 'ACTIVE' | 'BANNED';
export type PaperStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'REVISION_REQUIRED' | 'ACCEPTED' | 'REJECTED';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
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
}

interface JMRHContextType {
    users: User[];
    papers: Paper[];
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    registerUser: (name: string, email: string) => void;
    banUser: (userId: string) => void;
    unbanUser: (userId: string) => void;
    createProfessor: (name: string, email: string) => void;
    assignPaper: (paperId: string, professorId: string) => void;
    submitPaper: (title: string, abstract: string, discipline: string) => void;
    updatePaperStatus: (paperId: string, status: PaperStatus, comments?: string) => void;
    logout: () => void;
}

const MOCK_USERS: User[] = [
    { id: 'admin-1', name: 'Super Admin', email: 'admin@jmrh.org', role: 'ADMIN', status: 'ACTIVE', createdAt: '2025-01-01' },
    { id: 'prof-1', name: 'Dr. Sarah Wilson', email: 'sarah.w@jmrh.org', role: 'PROFESSOR', status: 'ACTIVE', createdAt: '2025-01-10' },
    { id: 'prof-2', name: 'Prof. James Chen', email: 'james.c@jmrh.org', role: 'PROFESSOR', status: 'ACTIVE', createdAt: '2025-01-12' },
];

const JMRHContext = createContext<JMRHContextType | undefined>(undefined);

export const JMRHProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem('jmrh_users');
        return saved ? JSON.parse(saved) : MOCK_USERS;
    });

    const [papers, setPapers] = useState<Paper[]>(() => {
        const saved = localStorage.getItem('jmrh_papers');
        return saved ? JSON.parse(saved) : [];
    });

    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('jmrh_current_user');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        localStorage.setItem('jmrh_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('jmrh_papers', JSON.stringify(papers));
    }, [papers]);

    useEffect(() => {
        localStorage.setItem('jmrh_current_user', JSON.stringify(currentUser));
    }, [currentUser]);

    const registerUser = (name: string, email: string) => {
        const newUser: User = {
            id: `user-${Math.random().toString(36).substr(2, 9)}`,
            name,
            email,
            role: 'USER',
            status: 'ACTIVE',
            createdAt: new Date().toISOString().split('T')[0]
        };
        setUsers(prev => [...prev, newUser]);
        return newUser;
    };

    const logout = () => setCurrentUser(null);

    const banUser = (userId: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'BANNED' } : u));
    };

    const unbanUser = (userId: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'ACTIVE' } : u));
    };

    const createProfessor = (name: string, email: string) => {
        setUsers(prev => [...prev, {
            id: `prof-${Math.random().toString(36).substr(2, 9)}`,
            name,
            email,
            role: 'PROFESSOR',
            status: 'ACTIVE',
            createdAt: new Date().toISOString().split('T')[0]
        }]);
    };

    const assignPaper = (paperId: string, professorId: string) => {
        setPapers(prev => prev.map(p => p.id === paperId ? {
            ...p,
            status: 'UNDER_REVIEW',
            assignedProfessorId: professorId
        } : p));
    };

    const submitPaper = (title: string, abstract: string, discipline: string) => {
        if (!currentUser) return;
        setPapers(prev => [...prev, {
            id: `paper-${Math.random().toString(36).substr(2, 9)}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            title,
            abstract,
            discipline,
            status: 'SUBMITTED',
            submissionDate: new Date().toISOString().split('T')[0]
        }]);
    };

    const updatePaperStatus = (paperId: string, status: PaperStatus, comments?: string) => {
        setPapers(prev => prev.map(p => p.id === paperId ? { ...p, status, revisionComments: comments } : p));
    };

    return (
        <JMRHContext.Provider value={{
            users, papers, currentUser, setCurrentUser, registerUser,
            banUser, unbanUser, createProfessor, assignPaper,
            submitPaper, updatePaperStatus, logout
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
