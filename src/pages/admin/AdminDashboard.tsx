import { memo, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, UserRole, PublishedJournal, PublishedBook, UploadRequest, Paper, ProfessorSubmission } from "@/context/JMRHContext";
import { supabase } from "@/integrations/supabase/client";
import { getSignedFileUrl } from "@/lib/storage-utils";
import AdminReviews from "@/components/sections/AdminReviews";
import {
    Users,
    BookOpen,
    GraduationCap,
    Clock,
    CheckCircle,
    Plus,
    Trash2,
    Edit,
    Send,
    Eye,
    Download,
    Globe,
    Shield,
    Upload,
    FileText,
    Library,
    Inbox,
    Check,
    X,
    ExternalLink,
    Image,
    Search,
    Filter,
    MoreVertical,
    AlertCircle,
    RefreshCw,
    Ban,
    Unlock,
    Star,
    TrendingUp,
    Activity,
    BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";


const AdminDashboard = memo(() => {
    const { 
        users, papers, assignPaper, updatePaperStatus, publishPaper, createUser,
        publishedJournals, publishedBooks, uploadRequests, professorSubmissions,
        createPublishedJournal, updatePublishedJournal, deletePublishedJournal,
        createPublishedBook, updatePublishedBook, deletePublishedBook,
        updateUploadRequest, deleteUploadRequest, banUser, unbanUser, refreshData,
        approveProfessorSubmission, updateProfessorSubmission,
        deleteUser, updateUserRole, reviews
    } = useJMRH();
    const [activeTab, setActiveTab] = useState<"papers" | "users" | "professors" | "upload" | "overview" | "reviews">("overview");
    const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [isUploadJournalOpen, setIsUploadJournalOpen] = useState(false);
    const [isUploadBookOpen, setIsUploadBookOpen] = useState(false);
    const [isEditJournalOpen, setIsEditJournalOpen] = useState(false);
    const [isEditBookOpen, setIsEditBookOpen] = useState(false);
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
    const [selectedProfessor, setSelectedProfessor] = useState("");
    const [selectedJournal, setSelectedJournal] = useState<PublishedJournal | null>(null);
    const [selectedBook, setSelectedBook] = useState<PublishedBook | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [paperStatusFilter, setPaperStatusFilter] = useState("all");
    
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const [newUserRole, setNewUserRole] = useState<UserRole>("USER");
    const [newUserAffiliation, setNewUserAffiliation] = useState("");
    
    const [journalForm, setJournalForm] = useState({
        title: "",
        authors: "",
        abstract: "",
        discipline: "",
        keywords: "",
        volume: "",
        issue: "",
        pages: "",
        doi: "",
        publicationDate: new Date().toISOString().split('T')[0],
        pdfUrl: "",
        coverImage: ""
    });
    
    const [bookForm, setBookForm] = useState({
        title: "",
        authors: "",
        editors: "",
        isbn: "",
        publisher: "",
        description: "",
        discipline: "",
        keywords: "",
        edition: "",
        publicationYear: "",
        pdfUrl: "",
        coverImage: "",
        purchaseLink: ""
    });

    const journalFileRef = useRef<HTMLInputElement>(null);
    const bookCoverRef = useRef<HTMLInputElement>(null);
    const journalCoverRef = useRef<HTMLInputElement>(null);
    const bookFileRef = useRef<HTMLInputElement>(null);
    const [isUploadingJournal, setIsUploadingJournal] = useState(false);
    const [isUploadingBook, setIsUploadingBook] = useState(false);

    const { toast } = useToast();

    const professorsList = users.filter(u => u.role === 'PROFESSOR');
    const regularUsers = users.filter(u => u.role === 'USER');
    const admins = users.filter(u => u.role === 'ADMIN');
    
    const submittedPapers = papers.filter(p => p.status === 'SUBMITTED');
    const underReviewPapers = papers.filter(p => p.status === 'UNDER_REVIEW');
    const revisionPapers = papers.filter(p => p.status === 'REVISION_REQUIRED');
    const acceptedPapers = papers.filter(p => p.status === 'ACCEPTED');
    const rejectedPapers = papers.filter(p => p.status === 'REJECTED');
    const publishedPapers = papers.filter(p => p.status === 'PUBLISHED');
    const assignedPapers = papers.filter(p => p.assignedProfessorId);
    const completedReviews = papers.filter(p => p.status !== 'UNDER_REVIEW' && p.status !== 'SUBMITTED');
    
    const journalPapers = papers.filter(p => p.paperType === 'JOURNAL' && p.status === 'PUBLISHED');
    const bookPapers = papers.filter(p => p.paperType === 'BOOK' && p.status === 'PUBLISHED');

    const pendingRequests = uploadRequests.filter(r => r.status === 'PENDING');
    const approvedRequests = uploadRequests.filter(r => r.status === 'APPROVED');
    const rejectedRequests = uploadRequests.filter(r => r.status === 'REJECTED');

    // Analytics calculations
    const monthlyPaperData = useMemo(() => {
        const last12Months = Array.from({ length: 12 }, (_, i) => {
            const date = subMonths(new Date(), 11 - i);
            return {
                month: format(date, 'MMM'),
                fullDate: startOfMonth(date),
                papers: 0,
                published: 0,
                reviews: 0
            };
        });
        
        papers.forEach(paper => {
            try {
                const paperDate = parseISO(paper.submissionDate);
                const monthIndex = monthlyPaperData.findIndex(m => 
                    isWithinInterval(paperDate, { start: m.fullDate, end: endOfMonth(m.fullDate) })
                );
                if (monthIndex !== -1) {
                    monthlyPaperData[monthIndex].papers++;
                    if (paper.status === 'PUBLISHED') {
                        monthlyPaperData[monthIndex].published++;
                    }
                }
            } catch {}
        });

        reviews.forEach(review => {
            try {
                const reviewDate = parseISO(review.createdAt);
                const monthIndex = monthlyPaperData.findIndex(m => 
                    isWithinInterval(reviewDate, { start: m.fullDate, end: endOfMonth(m.fullDate) })
                );
                if (monthIndex !== -1) {
                    monthlyPaperData[monthIndex].reviews++;
                }
            } catch {}
        });

        return monthlyPaperData.map(({ month, papers: p, published: pb, reviews: r }) => ({ month, papers: p, published: pb, reviews: r }));
    }, [papers, reviews]);

    const disciplineData = useMemo(() => {
        const counts: Record<string, number> = {};
        papers.forEach(p => {
            const d = p.discipline || 'Other';
            counts[d] = (counts[d] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name: name.length > 20 ? name.slice(0, 20) + '...' : name, value })).slice(0, 6);
    }, [papers]);

    const userGrowthData = useMemo(() => {
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const date = subMonths(new Date(), 5 - i);
            return {
                month: format(date, 'MMM'),
                fullDate: startOfMonth(date),
                users: 0,
                professors: 0
            };
        });
        
        users.forEach(user => {
            try {
                const userDate = new Date(user.createdAt);
                const monthIndex = userGrowthData.findIndex(m => 
                    isWithinInterval(userDate, { start: m.fullDate, end: endOfMonth(m.fullDate) })
                );
                if (monthIndex !== -1) {
                    userGrowthData[monthIndex].users++;
                    if (user.role === 'PROFESSOR') {
                        userGrowthData[monthIndex].professors++;
                    }
                }
            } catch {}
        });

        let cumulative = 0;
        let profCumulative = 0;
        return userGrowthData.map(m => {
            cumulative += m.users;
            profCumulative += m.professors;
            return { month: m.month, users: cumulative, professors: profCumulative };
        });
    }, [users]);

    const reviewStats = useMemo(() => {
        const total = reviews.length;
        const avgRating = total > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : '0';
        const fiveStar = reviews.filter(r => r.rating === 5).length;
        const fourStar = reviews.filter(r => r.rating === 4).length;
        const threeStar = reviews.filter(r => r.rating === 3).length;
        const twoStar = reviews.filter(r => r.rating === 2).length;
        const oneStar = reviews.filter(r => r.rating === 1).length;
        return { total, avgRating, distribution: [fiveStar, fourStar, threeStar, twoStar, oneStar] };
    }, [reviews]);

    const paperSuccessRate = papers.length > 0 ? ((acceptedPapers.length + publishedPapers.length) / papers.length * 100).toFixed(1) : '0';
    const reviewCompletionRate = assignedPapers.length > 0 ? ((completedReviews.length / assignedPapers.length) * 100).toFixed(1) : '0';

    const disciplines = [
        "Commerce and Management",
        "Economics and Finance", 
        "Education and Psychology",
        "Social Sciences and Humanities",
        "Science and Technology",
        "Environmental Studies and Sustainability",
        "Digital Transformation and Information Systems",
        "Entrepreneurship and Innovation",
        "Public Policy and Governance",
        "Other"
    ];

    const stats = [
        { label: "Total Users", value: users.length, icon: Users, color: "text-secondary", sub: `${admins.length} admins, ${professorsList.length} professors`, trend: "+12%" },
        { label: "Total Papers", value: papers.length, icon: FileText, color: "text-accent", sub: `${submittedPapers.length} submitted`, trend: "+8%" },
        { label: "Published Journals", value: publishedJournals.length + journalPapers.length, icon: Library, color: "text-accent", sub: "Articles online", trend: "+5%" },
        { label: "Published Books", value: publishedBooks.length + bookPapers.length, icon: BookOpen, color: "text-secondary", sub: "Books available", trend: "+3%" },
        { label: "Pending Review", value: submittedPapers.length, icon: Clock, color: "text-orange-500", sub: "Awaiting action", trend: null },
        { label: "Upload Requests", value: pendingRequests.length, icon: Inbox, color: "text-accent", sub: "Pending approval", trend: null },
        { label: "Success Rate", value: paperSuccessRate + "%", icon: TrendingUp, color: "text-green-500", sub: "Paper acceptance", trend: "+2%" },
        { label: "Avg Rating", value: reviewStats.avgRating, icon: Star, color: "text-gold", sub: `${reviewStats.total} reviews`, trend: null },
    ];

    const filteredPapers = papers.filter(paper => {
        const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            paper.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            paper.discipline.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = paperStatusFilter === "all" || paper.status === paperStatusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAssignProfessor = () => {
        if (!selectedPaper || !selectedProfessor) return;
        const professor = professorsList.find(p => p.id === selectedProfessor);
        if (professor) {
            assignPaper(selectedPaper.id, professor.id, professor.name);
            setIsAssignOpen(false);
            setSelectedPaper(null);
            setSelectedProfessor("");
        }
    };

    const handlePublishPaper = (paper: Paper) => {
        publishPaper(paper.id);
    };

    const handleRejectPaper = async (paper: Paper) => {
        await updatePaperStatus(paper.id, 'REJECTED', 'Your manuscript has been rejected.');
        toast({ title: "Paper Rejected", description: "Author has been notified." });
    };

    const handleRequestRevision = async (paper: Paper) => {
        await updatePaperStatus(paper.id, 'REVISION_REQUIRED', 'Please revise your manuscript as per reviewer comments.');
        toast({ title: "Revision Requested", description: "Author has been notified." });
    };

    const handleAcceptPaper = async (paper: Paper) => {
        await updatePaperStatus(paper.id, 'ACCEPTED', 'Congratulations! Your manuscript has been accepted.');
        toast({ title: "Paper Accepted", description: "Status updated to accepted." });
    };

    const handleCreateUser = () => {
        if (!newUserName || !newUserEmail || !newUserPassword) {
            toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
            return;
        }
        createUser(newUserName, newUserEmail, newUserPassword, newUserRole, { affiliation: newUserAffiliation });
        setIsCreateUserOpen(false);
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserRole("USER");
        setNewUserAffiliation("");
    };

    const handleToggleUserBan = async (user: any) => {
        if (user.status === 'ACTIVE') {
            await banUser(user.id);
            toast({ title: "User Banned", description: "User has been banned." });
        } else {
            await unbanUser(user.id);
            toast({ title: "User Unbanned", description: "User has been unbanned." });
        }
    };

    const uploadFile = async (file: File, folder: string): Promise<string | null> => {
        const fileName = `${folder}/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from('publications')
            .upload(fileName, file, { cacheControl: '3600', upsert: false });
        
        if (error) {
            console.error('Upload error:', error);
            return null;
        }
        
        // Store path only; generate signed URLs on demand for downloads
        return fileName;
    };

    const handleJournalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setIsUploadingJournal(true);
            const url = await uploadFile(e.target.files[0], 'journals');
            if (url) {
                setJournalForm(prev => ({ ...prev, pdfUrl: url }));
                toast({ title: "File Uploaded", description: "PDF uploaded successfully" });
            }
            setIsUploadingJournal(false);
        }
    };

    const handleBookFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setIsUploadingBook(true);
            const url = await uploadFile(e.target.files[0], 'books');
            if (url) {
                setBookForm(prev => ({ ...prev, pdfUrl: url }));
                toast({ title: "File Uploaded", description: "PDF uploaded successfully" });
            }
            setIsUploadingBook(false);
        }
    };

    const handleJournalCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const url = await uploadFile(e.target.files[0], 'covers');
            if (url) {
                setJournalForm(prev => ({ ...prev, coverImage: url }));
                toast({ title: "Cover Uploaded", description: "Cover image uploaded successfully" });
            }
        }
    };

    const handleBookCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const url = await uploadFile(e.target.files[0], 'covers');
            if (url) {
                setBookForm(prev => ({ ...prev, coverImage: url }));
                toast({ title: "Cover Uploaded", description: "Cover image uploaded successfully" });
            }
        }
    };

    const handlePublishJournal = async () => {
        if (!journalForm.title || !journalForm.authors || !journalForm.discipline) {
            toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
            return;
        }
        await createPublishedJournal(journalForm);
        setIsUploadJournalOpen(false);
        setJournalForm({
            title: "", authors: "", abstract: "", discipline: "", keywords: "",
            volume: "", issue: "", pages: "", doi: "", publicationDate: new Date().toISOString().split('T')[0],
            pdfUrl: "", coverImage: ""
        });
    };

    const handlePublishBook = async () => {
        if (!bookForm.title || !bookForm.authors || !bookForm.discipline) {
            toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
            return;
        }
        await createPublishedBook(bookForm);
        setIsUploadBookOpen(false);
        setBookForm({
            title: "", authors: "", editors: "", isbn: "", publisher: "",
            description: "", discipline: "", keywords: "", edition: "",
            publicationYear: "", pdfUrl: "", coverImage: "", purchaseLink: ""
        });
    };

    const openEditJournal = (journal: PublishedJournal) => {
        setSelectedJournal(journal);
        setJournalForm({
            title: journal.title,
            authors: journal.authors,
            abstract: journal.abstract || "",
            discipline: journal.discipline,
            keywords: journal.keywords || "",
            volume: journal.volume || "",
            issue: journal.issue || "",
            pages: journal.pages || "",
            doi: journal.doi || "",
            publicationDate: journal.publicationDate,
            pdfUrl: journal.pdfUrl || "",
            coverImage: journal.coverImage || ""
        });
        setIsEditJournalOpen(true);
    };

    const openEditBook = (book: PublishedBook) => {
        setSelectedBook(book);
        setBookForm({
            title: book.title,
            authors: book.authors,
            editors: book.editors || "",
            isbn: book.isbn || "",
            publisher: book.publisher || "",
            description: book.description || "",
            discipline: book.discipline,
            keywords: book.keywords || "",
            edition: book.edition || "",
            publicationYear: book.publicationYear || "",
            pdfUrl: book.pdfUrl || "",
            coverImage: book.coverImage || "",
            purchaseLink: book.purchaseLink || ""
        });
        setIsEditBookOpen(true);
    };

    const handleUpdateJournal = async () => {
        if (!selectedJournal) return;
        await updatePublishedJournal(selectedJournal.id, journalForm);
        setIsEditJournalOpen(false);
        setSelectedJournal(null);
        toast({ title: "Journal Updated", description: "Changes saved successfully." });
    };

    const handleUpdateBook = async () => {
        if (!selectedBook) return;
        await updatePublishedBook(selectedBook.id, bookForm);
        setIsEditBookOpen(false);
        setSelectedBook(null);
        toast({ title: "Book Updated", description: "Changes saved successfully." });
    };

    const handleRequestAction = async (request: UploadRequest, status: 'APPROVED' | 'REJECTED') => {
        await updateUploadRequest(request.id, { status, adminNotes: status === 'APPROVED' ? 'Approved by admin' : 'Rejected by admin' });
        toast({ title: status === 'APPROVED' ? "Request Approved" : "Request Rejected", description: `Request for "${request.title}" has been ${status.toLowerCase()}.` });
    };

    const handleProfessorSubmissionAction = async (submission: ProfessorSubmission, action: 'approve' | 'reject') => {
        if (action === 'approve') {
            await approveProfessorSubmission(submission);
            toast({ title: "Submission Approved", description: `"${submission.title}" is now published.` });
        } else {
            await updateProfessorSubmission(submission.id, { status: 'REJECTED' });
            toast({ title: "Submission Rejected", description: `"${submission.title}" has been rejected.` });
        }
    };

    // Professor submissions
    const pendingProfessorSubmissions = professorSubmissions.filter(s => s.status === 'PENDING');
    const approvedProfessorSubmissions = professorSubmissions.filter(s => s.status === 'APPROVED');

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-border">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Admin Console</p>
                        <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
                        <p className="text-sm text-muted-foreground">{users.length} users • {papers.length} papers • {publishedJournals.length} journals</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => refreshData()} className="gap-2">
                        <RefreshCw size={14} /> Refresh
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    {stats.map((stat, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                            className="p-4 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow hover:border-accent/20">
                            <div className="flex items-center justify-between mb-2">
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                {stat.trend && (
                                    <span className="text-[10px] font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded">{stat.trend}</span>
                                )}
                            </div>
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                            <p className="text-[10px] text-muted-foreground/60">{stat.sub}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 sm:gap-2 border-b border-border overflow-x-auto pb-px -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
                    {[
                        { key: "overview", label: "Overview" },
                        { key: "papers", label: "Papers" },
                        { key: "users", label: "Users" },
                        { key: "professors", label: "Professors" },
                        { key: "upload", label: "Uploads" },
                        { key: "reviews", label: "Reviews" },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                    <AdminReviews />
                )}

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                            {stats.map((stat, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                                    className="p-3 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow hover:border-accent/20">
                                    <div className="flex items-center justify-between mb-1">
                                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                    </div>
                                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-[10px] text-muted-foreground truncate">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Charts Row */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Paper Status Chart */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="bg-card border border-border p-5 lg:col-span-2">
                                <h3 className="font-bold text-foreground text-sm flex items-center gap-2 mb-4">
                                    <BarChart3 size={16} className="text-accent" /> Paper Status Distribution
                                </h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={[
                                        { name: 'Submitted', value: submittedPapers.length, fill: 'hsl(35, 40%, 50%)' },
                                        { name: 'Under Review', value: underReviewPapers.length, fill: 'hsl(200, 10%, 40%)' },
                                        { name: 'Revision', value: revisionPapers.length, fill: 'hsl(45, 90%, 60%)' },
                                        { name: 'Accepted', value: acceptedPapers.length, fill: 'hsl(142, 60%, 40%)' },
                                        { name: 'Published', value: publishedPapers.length, fill: 'hsl(35, 50%, 60%)' },
                                        { name: 'Rejected', value: rejectedPapers.length, fill: 'hsl(0, 84%, 60%)' },
                                    ].filter(d => d.value > 0)}>
                                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </motion.div>

                            {/* User Roles Chart */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="bg-card border border-border p-5">
                                <h3 className="font-bold text-foreground text-sm flex items-center gap-2 mb-4">
                                    <Users size={16} className="text-secondary" /> User Distribution
                                </h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={[
                                        { name: 'Users', count: regularUsers.length },
                                        { name: 'Professors', count: professorsList.length },
                                        { name: 'Admins', count: admins.length },
                                    ]}>
                                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="hsl(35, 40%, 50%)" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </motion.div>

                            {/* Review Rating Distribution */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                                className="bg-card border border-border p-5">
                                <h3 className="font-bold text-foreground text-sm flex items-center gap-2 mb-4">
                                    <Star size={16} className="text-gold" /> Rating Distribution
                                </h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={[
                                        { name: '5★', value: reviewStats.distribution[0] },
                                        { name: '4★', value: reviewStats.distribution[1] },
                                        { name: '3★', value: reviewStats.distribution[2] },
                                        { name: '2★', value: reviewStats.distribution[3] },
                                        { name: '1★', value: reviewStats.distribution[4] },
                                    ]}>
                                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="hsl(45, 80%, 55%)" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </motion.div>
                        </div>

                        {/* Line Charts Row */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Monthly Paper Activity Line Chart */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="bg-card border border-border p-5">
                                <h3 className="font-bold text-foreground text-sm flex items-center gap-2 mb-4">
                                    <TrendingUp size={16} className="text-accent" /> Monthly Activity (Line Graph)
                                </h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={monthlyPaperData}>
                                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                                        <Tooltip />
                                        <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                                        <Line type="monotone" dataKey="papers" stroke="hsl(35, 40%, 50%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(35, 40%, 50%)" }} name="Papers" />
                                        <Line type="monotone" dataKey="published" stroke="hsl(142, 60%, 40%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(142, 60%, 40%)" }} name="Published" />
                                        <Line type="monotone" dataKey="reviews" stroke="hsl(200, 10%, 40%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(200, 10%, 40%)" }} name="Reviews" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </motion.div>

                            {/* User Growth Line Chart */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                                className="bg-card border border-border p-5">
                                <h3 className="font-bold text-foreground text-sm flex items-center gap-2 mb-4">
                                    <Activity size={16} className="text-secondary" /> User Growth (12 Months)
                                </h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={userGrowthData}>
                                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                                        <Tooltip />
                                        <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                                        <Line type="monotone" dataKey="users" stroke="hsl(35, 40%, 50%)" strokeWidth={2} dot={{ r: 3 }} name="Total Users" />
                                        <Line type="monotone" dataKey="professors" stroke="hsl(200, 10%, 40%)" strokeWidth={2} dot={{ r: 3 }} name="Professors" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </motion.div>
                        </div>

                        {/* Discipline Distribution */}
                        {disciplineData.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                className="bg-card border border-border p-5">
                                <h3 className="font-bold text-foreground text-sm flex items-center gap-2 mb-4">
                                    <Library size={16} className="text-accent" /> Papers by Discipline
                                </h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={disciplineData} layout="horizontal">
                                        <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="hsl(35, 40%, 50%)" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </motion.div>
                        )}

                        {/* Activity Summary */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                            className="bg-card border border-border p-5">
                            <h3 className="font-bold text-foreground text-sm flex items-center gap-2 mb-4">
                                <Activity size={16} className="text-accent" /> Performance Metrics
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">Paper Success Rate</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-muted overflow-hidden rounded-full">
                                            <div className="h-full bg-green-500 transition-all" style={{ width: `${paperSuccessRate}%` }} />
                                        </div>
                                        <span className="text-sm font-bold text-foreground">{paperSuccessRate}%</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">Review Completion</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-muted overflow-hidden rounded-full">
                                            <div className="h-full bg-accent transition-all" style={{ width: `${reviewCompletionRate}%` }} />
                                        </div>
                                        <span className="text-sm font-bold text-foreground">{reviewCompletionRate}%</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">Total Reviews</p>
                                    <p className="text-2xl font-bold text-foreground">{reviewStats.total}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                                    <div className="flex items-center gap-1">
                                        <p className="text-2xl font-bold text-foreground">{reviewStats.avgRating}</p>
                                        <Star className="w-5 h-5 fill-gold text-gold" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Additional Analytics Cards */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                className="bg-card border border-border p-5">
                                <h3 className="font-bold text-foreground text-sm flex items-center gap-2 mb-4">
                                    <Clock size={16} className="text-orange-500" /> Pending Actions
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                                        <span className="text-sm text-foreground">Papers to Review</span>
                                        <span className="font-bold text-orange-600">{submittedPapers.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                                        <span className="text-sm text-foreground">Under Review</span>
                                        <span className="font-bold text-blue-600">{underReviewPapers.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                                        <span className="text-sm text-foreground">Revision Needed</span>
                                        <span className="font-bold text-yellow-600">{revisionPapers.length}</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                                className="bg-card border border-border p-5">
                                <h3 className="font-bold text-foreground text-sm flex items-center gap-2 mb-4">
                                    <CheckCircle size={16} className="text-green-500" /> Completed
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                                        <span className="text-sm text-foreground">Accepted</span>
                                        <span className="font-bold text-green-600">{acceptedPapers.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-emerald-50 rounded">
                                        <span className="text-sm text-foreground">Published</span>
                                        <span className="font-bold text-emerald-600">{publishedPapers.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                                        <span className="text-sm text-foreground">Rejected</span>
                                        <span className="font-bold text-red-600">{rejectedPapers.length}</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                                className="bg-card border border-border p-5">
                                <h3 className="font-bold text-foreground text-sm flex items-center gap-2 mb-4">
                                    <Inbox size={16} className="text-accent" /> Requests
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                                        <span className="text-sm text-foreground">Pending Requests</span>
                                        <span className="font-bold text-orange-600">{pendingRequests.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                                        <span className="text-sm text-foreground">Approved</span>
                                        <span className="font-bold text-green-600">{approvedRequests.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                                        <span className="text-sm text-foreground">Rejected</span>
                                        <span className="font-bold text-red-600">{rejectedRequests.length}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Recent Papers */}
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                                className="bg-card border border-border">
                                <div className="p-4 border-b border-border flex justify-between items-center">
                                    <h3 className="font-bold text-foreground flex items-center gap-2">
                                        <FileText size={16} className="text-accent" /> Recent Papers
                                    </h3>
                                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("papers")}>View All</Button>
                                </div>
                                <div className="divide-y divide-border">
                                    {papers.slice(0, 5).map(paper => (
                                        <div key={paper.id} className="p-4 hover:bg-muted transition-colors">
                                            <p className="font-medium text-foreground line-clamp-1 text-sm">{paper.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-muted-foreground">{paper.authorName}</span>
                                                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                                                    paper.status === 'SUBMITTED' ? 'bg-accent/10 text-accent' :
                                                    paper.status === 'UNDER_REVIEW' ? 'bg-secondary/10 text-secondary' :
                                                    paper.status === 'ACCEPTED' ? 'bg-green-100 text-green-600' :
                                                    paper.status === 'PUBLISHED' ? 'bg-accent/10 text-accent' :
                                                    'bg-destructive/10 text-destructive'
                                                }`}>
                                                    {paper.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {papers.length === 0 && (
                                        <p className="p-4 text-center text-muted-foreground text-sm">No papers yet</p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Quick Actions */}
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                className="bg-card border border-border p-6">
                                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                    <TrendingUp size={16} className="text-secondary" /> Quick Actions
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 hover:border-accent/40 transition-all" onClick={() => setIsUploadJournalOpen(true)}>
                                        <Upload className="w-6 h-6 text-accent" />
                                        <span className="text-xs">Upload Journal</span>
                                    </Button>
                                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 hover:border-secondary/40 transition-all" onClick={() => setIsUploadBookOpen(true)}>
                                        <BookOpen className="w-6 h-6 text-secondary" />
                                        <span className="text-xs">Upload Book</span>
                                    </Button>
                                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 hover:border-accent/40 transition-all" onClick={() => setIsCreateUserOpen(true)}>
                                        <Plus className="w-6 h-6 text-accent" />
                                        <span className="text-xs">Add User</span>
                                    </Button>
                                    <Button variant="outline" className="h-auto py-4 flex-col gap-2 hover:border-secondary/40 transition-all" onClick={() => refreshData()}>
                                        <RefreshCw className="w-6 h-6 text-secondary" />
                                        <span className="text-xs">Refresh Data</span>
                                    </Button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Pending Actions */}
                        {(submittedPapers.length > 0 || pendingRequests.length > 0 || pendingProfessorSubmissions.length > 0) && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                                className="bg-accent/5 border border-accent/20 p-6">
                                <h3 className="font-bold text-accent flex items-center gap-2 mb-4">
                                    <AlertCircle size={20} />
                                    Pending Actions ({submittedPapers.length + pendingRequests.length + pendingProfessorSubmissions.length})
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {submittedPapers.length > 0 && (
                                        <div className="bg-card p-4 border border-border">
                                            <p className="font-medium text-foreground text-sm">{submittedPapers.length} papers awaiting review</p>
                                            <Button size="sm" className="mt-2" onClick={() => setActiveTab("papers")}>Review Now</Button>
                                        </div>
                                    )}
                                    {pendingProfessorSubmissions.length > 0 && (
                                        <div className="bg-card p-4 border border-border">
                                            <p className="font-medium text-foreground text-sm">{pendingProfessorSubmissions.length} professor submissions</p>
                                            <Button size="sm" className="mt-2" onClick={() => setActiveTab("upload")}>Review Now</Button>
                                        </div>
                                    )}
                                    {pendingRequests.length > 0 && (
                                        <div className="bg-card p-4 border border-border">
                                            <p className="font-medium text-foreground text-sm">{pendingRequests.length} upload requests</p>
                                            <Button size="sm" className="mt-2" onClick={() => setActiveTab("upload")}>Review Now</Button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
                {/* Papers Tab */}
                {activeTab === "papers" && (
                    <div className="space-y-4">
                        {/* Search and Filter */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                <Input 
                                    placeholder="Search papers..." 
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={paperStatusFilter} onValueChange={setPaperStatusFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                                    <SelectItem value="REVISION_REQUIRED">Revision Required</SelectItem>
                                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="bg-card border border-border overflow-hidden overflow-x-auto -mx-4 sm:mx-0">
                            <table className="w-full min-w-[700px]">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Title</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Type</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Author</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Status</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Date</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredPapers.map((paper) => (
                                        <tr key={paper.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="p-4">
                                                <p className="font-medium text-foreground line-clamp-1 max-w-xs">{paper.title}</p>
                                                <p className="text-xs text-muted-foreground">{paper.discipline}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-bold uppercase ${paper.paperType === 'JOURNAL' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'}`}>
                                                    {paper.paperType}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground max-w-32 line-clamp-1">{paper.authorName}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-bold uppercase ${
                                                    paper.status === 'SUBMITTED' ? 'bg-orange-100 text-orange-600' :
                                                    paper.status === 'UNDER_REVIEW' ? 'bg-secondary/10 text-secondary' :
                                                    paper.status === 'REVISION_REQUIRED' ? 'bg-orange-50 text-orange-500' :
                                                    paper.status === 'ACCEPTED' ? 'bg-green-100 text-green-600' :
                                                    paper.status === 'REJECTED' ? 'bg-destructive/10 text-destructive' :
                                                    paper.status === 'PUBLISHED' ? 'bg-accent/10 text-accent' :
                                                    'bg-muted text-muted-foreground'
                                                }`}>
                                                    {paper.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {paper.submissionDate}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-1 flex-wrap">
                                                    {paper.status === 'SUBMITTED' && (
                                                        <>
                                                            <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                                                                <DialogTrigger asChild>
                                                                    <Button size="sm" variant="outline" onClick={() => setSelectedPaper(paper)}>
                                                                        <Send size={12} className="mr-1" /> Assign
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Assign to Professor</DialogTitle>
                                                                    </DialogHeader>
                                                                    <div className="py-4">
                                                                        <Select onValueChange={setSelectedProfessor} value={selectedProfessor}>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select Professor" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {professorsList.map(p => (
                                                                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <DialogFooter>
                                                                        <Button onClick={handleAssignProfessor}>Assign</Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                            <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleRejectPaper(paper)}>
                                                                <X size={12} />
                                                            </Button>
                                                        </>
                                                    )}
                                                    
                                                    {paper.status === 'UNDER_REVIEW' && (
                                                        <>
                                                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAcceptPaper(paper)}>
                                                                <Check size={12} className="mr-1" /> Accept
                                                            </Button>
                                                            <Button size="sm" variant="outline" className="text-orange-500" onClick={() => handleRequestRevision(paper)}>
                                                                <RefreshCw size={12} />
                                                            </Button>
                                                            <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleRejectPaper(paper)}>
                                                                <X size={12} />
                                                            </Button>
                                                        </>
                                                    )}
                                                    
                                                    {paper.status === 'REVISION_REQUIRED' && (
                                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAcceptPaper(paper)}>
                                                            <Check size={12} className="mr-1" /> Accept
                                                        </Button>
                                                    )}
                                                    
                                                    {paper.status === 'ACCEPTED' && (
                                                        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/80" onClick={() => handlePublishPaper(paper)}>
                                                            <Globe size={12} className="mr-1" /> Publish
                                                        </Button>
                                                    )}
                                                    
                                                    {paper.status === 'PUBLISHED' && (
                                                        <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                                                            <CheckCircle size={14} /> Published
                                                        </span>
                                                    )}
                                                    
                                                    {paper.status === 'REJECTED' && (
                                                        <span className="text-xs text-destructive font-bold flex items-center gap-1">
                                                            <X size={14} /> Rejected
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPapers.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                No papers found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === "users" && (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-foreground text-background hover:bg-accent hover:text-accent-foreground">
                                        <Plus size={16} className="mr-2" /> Create User
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create New User</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <Input placeholder="Full Name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
                                        <Input placeholder="Email" type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
                                        <Input placeholder="Password" type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} />
                                        <Select onValueChange={(v) => setNewUserRole(v as UserRole)} value={newUserRole}>
                                            <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USER">User</SelectItem>
                                                <SelectItem value="PROFESSOR">Professor</SelectItem>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input placeholder="Affiliation" value={newUserAffiliation} onChange={(e) => setNewUserAffiliation(e.target.value)} />
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleCreateUser}>Create User</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="bg-card border border-border overflow-hidden overflow-x-auto -mx-4 sm:mx-0">
                            <table className="w-full min-w-[640px]">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Name</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Email</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Role</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Status</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Papers</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="p-4 font-medium text-foreground">{user.name}</td>
                                            <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-bold uppercase ${
                                                    user.role === 'ADMIN' ? 'bg-destructive/10 text-destructive' :
                                                    user.role === 'PROFESSOR' ? 'bg-secondary/10 text-secondary' :
                                                    'bg-muted text-muted-foreground'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-bold uppercase ${
                                                    user.status === 'ACTIVE' ? 'bg-green-100 text-green-600' :
                                                    'bg-destructive/10 text-destructive'
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {papers.filter(p => p.authorId === user.id).length}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-1">
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost"
                                                        onClick={() => handleToggleUserBan(user)}
                                                        className={user.status === 'ACTIVE' ? 'text-destructive' : 'text-green-600'}
                                                    >
                                                        {user.status === 'ACTIVE' ? <Ban size={14} /> : <Unlock size={14} />}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-destructive"
                                                        onClick={async () => {
                                                            if (confirm(`Delete ${user.name}? This cannot be undone.`)) {
                                                                await deleteUser(user.id);
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Professors Tab */}
                {activeTab === "professors" && (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-foreground text-background hover:bg-accent hover:text-accent-foreground">
                                        <Plus size={16} className="mr-2" /> Add Professor
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create Professor Account</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <Input placeholder="Full Name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
                                        <Input placeholder="Email" type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
                                        <Input placeholder="Password" type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} />
                                        <Input placeholder="Affiliation" value={newUserAffiliation} onChange={(e) => setNewUserAffiliation(e.target.value)} />
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={() => { setNewUserRole("PROFESSOR"); handleCreateUser(); }}>Create Professor</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {professorsList.map((prof) => {
                                const profPapers = papers.filter(p => p.assignedProfessorId === prof.id);
                                return (
                                    <div key={prof.id} className="p-6 bg-card border border-border hover:shadow-md transition-shadow hover:border-accent/20">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-muted flex items-center justify-center">
                                                <GraduationCap className="w-6 h-6 text-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-foreground">{prof.name}</h3>
                                                <p className="text-sm text-muted-foreground">{prof.email}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{prof.affiliation}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm">
                                            <span className="text-muted-foreground">Papers Assigned:</span>
                                            <span className="font-bold text-foreground">{profPapers.length}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {professorsList.length === 0 && (
                                <div className="col-span-full p-8 text-center text-muted-foreground">
                                    No professors added yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Upload & Requests Tab */}
                {activeTab === "upload" && (
                    <div className="space-y-8">
                        {/* Upload Section */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Upload Journal */}
                            <div className="bg-card border border-border p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-accent/10 flex items-center justify-center">
                                        <Library className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Upload Journal Article</h3>
                                        <p className="text-xs text-muted-foreground">Publish a new journal article</p>
                                    </div>
                                </div>
                                <Dialog open={isUploadJournalOpen} onOpenChange={setIsUploadJournalOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-foreground text-background hover:bg-accent hover:text-accent-foreground">
                                            <Upload size={16} className="mr-2" /> Upload Journal
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Publish Journal Article</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <Input placeholder="Article Title *" value={journalForm.title} onChange={(e) => setJournalForm(prev => ({ ...prev, title: e.target.value }))} />
                                            <Input placeholder="Authors *" value={journalForm.authors} onChange={(e) => setJournalForm(prev => ({ ...prev, authors: e.target.value }))} />
                                            <Textarea placeholder="Abstract" value={journalForm.abstract} onChange={(e) => setJournalForm(prev => ({ ...prev, abstract: e.target.value }))} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Select onValueChange={(v) => setJournalForm(prev => ({ ...prev, discipline: v }))} value={journalForm.discipline}>
                                                    <SelectTrigger><SelectValue placeholder="Discipline *" /></SelectTrigger>
                                                    <SelectContent>
                                                        {disciplines.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <Input placeholder="Keywords" value={journalForm.keywords} onChange={(e) => setJournalForm(prev => ({ ...prev, keywords: e.target.value }))} />
                                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <Input placeholder="Volume" value={journalForm.volume} onChange={(e) => setJournalForm(prev => ({ ...prev, volume: e.target.value }))} />
                                                <Input placeholder="Issue" value={journalForm.issue} onChange={(e) => setJournalForm(prev => ({ ...prev, issue: e.target.value }))} />
                                                <Input placeholder="Pages" value={journalForm.pages} onChange={(e) => setJournalForm(prev => ({ ...prev, pages: e.target.value }))} />
                                            </div>
                                            <Input placeholder="DOI" value={journalForm.doi} onChange={(e) => setJournalForm(prev => ({ ...prev, doi: e.target.value }))} />
                                            <Input type="date" value={journalForm.publicationDate} onChange={(e) => setJournalForm(prev => ({ ...prev, publicationDate: e.target.value }))} />
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-muted-foreground">PDF File</label>
                                                <input ref={journalFileRef} type="file" accept=".pdf" onChange={handleJournalFileUpload} className="hidden" />
                                                <div className="flex gap-2">
                                                    <Button type="button" variant="outline" onClick={() => journalFileRef.current?.click()} className="flex-1">
                                                        {isUploadingJournal ? "Uploading..." : journalForm.pdfUrl ? "PDF Uploaded ✓" : "Choose PDF"}
                                                    </Button>
                                                </div>
                                            </div>
                                            <Input placeholder="PDF URL (if already hosted)" value={journalForm.pdfUrl} onChange={(e) => setJournalForm(prev => ({ ...prev, pdfUrl: e.target.value }))} />
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsUploadJournalOpen(false)}>Cancel</Button>
                                            <Button className="bg-accent text-accent-foreground hover:bg-foreground hover:text-background" onClick={handlePublishJournal}>Publish Journal</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Upload Book */}
                            <div className="bg-card border border-border p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Upload Book</h3>
                                        <p className="text-xs text-muted-foreground">Publish a new book</p>
                                    </div>
                                </div>
                                <Dialog open={isUploadBookOpen} onOpenChange={setIsUploadBookOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-foreground text-background hover:bg-accent hover:text-accent-foreground">
                                            <Upload size={16} className="mr-2" /> Upload Book
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Publish Book</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <Input placeholder="Book Title *" value={bookForm.title} onChange={(e) => setBookForm(prev => ({ ...prev, title: e.target.value }))} />
                                            <Input placeholder="Authors *" value={bookForm.authors} onChange={(e) => setBookForm(prev => ({ ...prev, authors: e.target.value }))} />
                                            <Input placeholder="Editors" value={bookForm.editors} onChange={(e) => setBookForm(prev => ({ ...prev, editors: e.target.value }))} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Input placeholder="ISBN" value={bookForm.isbn} onChange={(e) => setBookForm(prev => ({ ...prev, isbn: e.target.value }))} />
                                                <Input placeholder="Publisher" value={bookForm.publisher} onChange={(e) => setBookForm(prev => ({ ...prev, publisher: e.target.value }))} />
                                            </div>
                                            <Textarea placeholder="Description" value={bookForm.description} onChange={(e) => setBookForm(prev => ({ ...prev, description: e.target.value }))} />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Select onValueChange={(v) => setBookForm(prev => ({ ...prev, discipline: v }))} value={bookForm.discipline}>
                                                    <SelectTrigger><SelectValue placeholder="Discipline *" /></SelectTrigger>
                                                    <SelectContent>
                                                        {disciplines.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <Input placeholder="Keywords" value={bookForm.keywords} onChange={(e) => setBookForm(prev => ({ ...prev, keywords: e.target.value }))} />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Input placeholder="Edition" value={bookForm.edition} onChange={(e) => setBookForm(prev => ({ ...prev, edition: e.target.value }))} />
                                                <Input placeholder="Publication Year" value={bookForm.publicationYear} onChange={(e) => setBookForm(prev => ({ ...prev, publicationYear: e.target.value }))} />
                                            </div>
                                            <Input placeholder="Purchase Link" value={bookForm.purchaseLink} onChange={(e) => setBookForm(prev => ({ ...prev, purchaseLink: e.target.value }))} />
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-muted-foreground">PDF File</label>
                                                <input ref={bookFileRef} type="file" accept=".pdf" onChange={handleBookFileUpload} className="hidden" />
                                                <Button type="button" variant="outline" onClick={() => bookFileRef.current?.click()} className="w-full">
                                                    {isUploadingBook ? "Uploading..." : bookForm.pdfUrl ? "PDF Uploaded ✓" : "Choose PDF"}
                                                </Button>
                                            </div>
                                            <Input placeholder="PDF URL (if already hosted)" value={bookForm.pdfUrl} onChange={(e) => setBookForm(prev => ({ ...prev, pdfUrl: e.target.value }))} />
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsUploadBookOpen(false)}>Cancel</Button>
                                            <Button className="bg-accent text-accent-foreground hover:bg-foreground hover:text-background" onClick={handlePublishBook}>Publish Book</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        {/* Published Content */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-card border border-border">
                                <div className="p-4 border-b border-border">
                                    <h3 className="font-bold text-foreground">Published Journals ({publishedJournals.length})</h3>
                                </div>
                                <div className="divide-y divide-border max-h-80 overflow-y-auto">
                                    {publishedJournals.map(journal => (
                                        <div key={journal.id} className="p-4 hover:bg-muted transition-colors">
                                            <p className="font-medium text-foreground line-clamp-1">{journal.title}</p>
                                            <p className="text-xs text-muted-foreground">{journal.authors}</p>
                                            <div className="flex gap-2 mt-2">
                                                {journal.pdfUrl && (
                                                    <button onClick={async () => {
                                                        const url = await getSignedFileUrl('publications', journal.pdfUrl!);
                                                        if (url) window.open(url, '_blank');
                                                    }} className="text-xs text-accent hover:underline flex items-center gap-1">
                                                        <ExternalLink size={12} /> View
                                                    </button>
                                                )}
                                                <button onClick={() => openEditJournal(journal)} className="text-xs text-secondary hover:underline flex items-center gap-1">
                                                    <Edit size={12} /> Edit
                                                </button>
                                                <button onClick={() => deletePublishedJournal(journal.id)} className="text-xs text-destructive hover:underline flex items-center gap-1">
                                                    <Trash2 size={12} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {publishedJournals.length === 0 && (
                                        <p className="p-4 text-center text-muted-foreground text-sm">No journals published yet</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-card border border-border">
                                <div className="p-4 border-b border-border">
                                    <h3 className="font-bold text-foreground">Published Books ({publishedBooks.length})</h3>
                                </div>
                                <div className="divide-y divide-border max-h-80 overflow-y-auto">
                                    {publishedBooks.map(book => (
                                        <div key={book.id} className="p-4 hover:bg-muted transition-colors">
                                            <p className="font-medium text-foreground line-clamp-1">{book.title}</p>
                                            <p className="text-xs text-muted-foreground">{book.authors} {book.isbn && `(ISBN: ${book.isbn})`}</p>
                                            <div className="flex gap-2 mt-2">
                                                {book.pdfUrl && (
                                                    <button onClick={async () => {
                                                        const url = await getSignedFileUrl('publications', book.pdfUrl!);
                                                        if (url) window.open(url, '_blank');
                                                    }} className="text-xs text-accent hover:underline flex items-center gap-1">
                                                        <ExternalLink size={12} /> View
                                                    </button>
                                                )}
                                                {book.purchaseLink && (
                                                    <a href={book.purchaseLink} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary hover:underline flex items-center gap-1">
                                                        <ExternalLink size={12} /> Purchase
                                                    </a>
                                                )}
                                                <button onClick={() => openEditBook(book)} className="text-xs text-secondary hover:underline flex items-center gap-1">
                                                    <Edit size={12} /> Edit
                                                </button>
                                                <button onClick={() => deletePublishedBook(book.id)} className="text-xs text-destructive hover:underline flex items-center gap-1">
                                                    <Trash2 size={12} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {publishedBooks.length === 0 && (
                                        <p className="p-4 text-center text-muted-foreground text-sm">No books published yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Professor Submissions */}
                        <div className="bg-card border border-border">
                            <div className="p-4 border-b border-border flex justify-between items-center">
                                <h3 className="font-bold text-foreground">Professor Submissions ({pendingProfessorSubmissions.length} pending)</h3>
                            </div>
                            <div className="divide-y divide-border">
                                {professorSubmissions.map(submission => (
                                    <div key={submission.id} className="p-4 hover:bg-muted transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-0.5 text-xs font-bold uppercase ${
                                                        submission.submissionType === 'JOURNAL' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'
                                                    }`}>
                                                        {submission.submissionType}
                                                    </span>
                                                    <span className={`px-2 py-0.5 text-xs font-bold uppercase ${
                                                        submission.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                                        submission.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                                        'bg-destructive/10 text-destructive'
                                                    }`}>
                                                        {submission.status}
                                                    </span>
                                                </div>
                                                <p className="font-medium text-foreground">{submission.title}</p>
                                                <p className="text-xs text-muted-foreground">By: {submission.professorName}</p>
                                                <p className="text-xs text-muted-foreground">Authors: {submission.authors}</p>
                                                {submission.discipline && <p className="text-xs text-muted-foreground">Discipline: {submission.discipline}</p>}
                                                {submission.keywords && <p className="text-xs text-muted-foreground">Keywords: {submission.keywords}</p>}
                                                {submission.abstract && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{submission.abstract}</p>}
                                                {submission.pdfUrl && (
                                                    <button onClick={async () => {
                                                        const url = await getSignedFileUrl('publications', submission.pdfUrl!);
                                                        if (url) window.open(url, '_blank');
                                                    }} className="text-xs text-accent hover:underline flex items-center gap-1 mt-2">
                                                        <ExternalLink size={12} /> View PDF
                                                    </button>
                                                )}
                                            </div>
                                            {submission.status === 'PENDING' && (
                                                <div className="flex gap-2 ml-4">
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleProfessorSubmissionAction(submission, 'approve')}>
                                                        <Check size={14} className="mr-1" /> Approve & Publish
                                                    </Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleProfessorSubmissionAction(submission, 'reject')}>
                                                        <X size={14} />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {professorSubmissions.length === 0 && (
                                    <p className="p-8 text-center text-muted-foreground">No professor submissions</p>
                                )}
                            </div>
                        </div>

                        {/* Upload Requests */}
                        <div className="bg-card border border-border">
                            <div className="p-4 border-b border-border">
                                <h3 className="font-bold text-foreground">User Upload Requests ({pendingRequests.length} pending)</h3>
                            </div>
                            <div className="divide-y divide-border">
                                {uploadRequests.map(request => (
                                    <div key={request.id} className="p-4 hover:bg-muted transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 text-xs font-bold uppercase ${
                                                        request.requestType === 'JOURNAL' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'
                                                    }`}>
                                                        {request.requestType}
                                                    </span>
                                                    <span className={`px-2 py-0.5 text-xs font-bold uppercase ${
                                                        request.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                                        request.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                                        'bg-destructive/10 text-destructive'
                                                    }`}>
                                                        {request.status}
                                                    </span>
                                                </div>
                                                <p className="font-medium text-foreground mt-2">{request.title}</p>
                                                {request.authors && <p className="text-xs text-muted-foreground">Authors: {request.authors}</p>}
                                                {request.isbn && <p className="text-xs text-muted-foreground">ISBN: {request.isbn}</p>}
                                                {request.description && <p className="text-xs text-muted-foreground mt-1">{request.description}</p>}
                                                {request.link && <a href={request.link} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">View Source</a>}
                                            </div>
                                            {request.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleRequestAction(request, 'APPROVED')}>
                                                        <Check size={14} />
                                                    </Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleRequestAction(request, 'REJECTED')}>
                                                        <X size={14} />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {uploadRequests.length === 0 && (
                                    <p className="p-8 text-center text-muted-foreground">No upload requests</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Journal Dialog */}
                <Dialog open={isEditJournalOpen} onOpenChange={setIsEditJournalOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Journal Article</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input placeholder="Article Title *" value={journalForm.title} onChange={(e) => setJournalForm(prev => ({ ...prev, title: e.target.value }))} />
                            <Input placeholder="Authors *" value={journalForm.authors} onChange={(e) => setJournalForm(prev => ({ ...prev, authors: e.target.value }))} />
                            <Textarea placeholder="Abstract" value={journalForm.abstract} onChange={(e) => setJournalForm(prev => ({ ...prev, abstract: e.target.value }))} />
                            <div className="grid grid-cols-2 gap-4">
                                <Select onValueChange={(v) => setJournalForm(prev => ({ ...prev, discipline: v }))} value={journalForm.discipline}>
                                    <SelectTrigger><SelectValue placeholder="Discipline" /></SelectTrigger>
                                    <SelectContent>
                                        {disciplines.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Input placeholder="Keywords" value={journalForm.keywords} onChange={(e) => setJournalForm(prev => ({ ...prev, keywords: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <Input placeholder="Volume" value={journalForm.volume} onChange={(e) => setJournalForm(prev => ({ ...prev, volume: e.target.value }))} />
                                <Input placeholder="Issue" value={journalForm.issue} onChange={(e) => setJournalForm(prev => ({ ...prev, issue: e.target.value }))} />
                                <Input placeholder="Pages" value={journalForm.pages} onChange={(e) => setJournalForm(prev => ({ ...prev, pages: e.target.value }))} />
                            </div>
                            <Input placeholder="DOI" value={journalForm.doi} onChange={(e) => setJournalForm(prev => ({ ...prev, doi: e.target.value }))} />
                            <Input type="date" value={journalForm.publicationDate} onChange={(e) => setJournalForm(prev => ({ ...prev, publicationDate: e.target.value }))} />
                            <Input placeholder="PDF URL" value={journalForm.pdfUrl} onChange={(e) => setJournalForm(prev => ({ ...prev, pdfUrl: e.target.value }))} />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditJournalOpen(false)}>Cancel</Button>
                            <Button className="bg-accent text-accent-foreground hover:bg-foreground hover:text-background" onClick={handleUpdateJournal}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Book Dialog */}
                <Dialog open={isEditBookOpen} onOpenChange={setIsEditBookOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Book</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input placeholder="Book Title *" value={bookForm.title} onChange={(e) => setBookForm(prev => ({ ...prev, title: e.target.value }))} />
                            <Input placeholder="Authors *" value={bookForm.authors} onChange={(e) => setBookForm(prev => ({ ...prev, authors: e.target.value }))} />
                            <Input placeholder="Editors" value={bookForm.editors} onChange={(e) => setBookForm(prev => ({ ...prev, editors: e.target.value }))} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="ISBN" value={bookForm.isbn} onChange={(e) => setBookForm(prev => ({ ...prev, isbn: e.target.value }))} />
                                <Input placeholder="Publisher" value={bookForm.publisher} onChange={(e) => setBookForm(prev => ({ ...prev, publisher: e.target.value }))} />
                            </div>
                            <Textarea placeholder="Description" value={bookForm.description} onChange={(e) => setBookForm(prev => ({ ...prev, description: e.target.value }))} />
                            <div className="grid grid-cols-2 gap-4">
                                <Select onValueChange={(v) => setBookForm(prev => ({ ...prev, discipline: v }))} value={bookForm.discipline}>
                                    <SelectTrigger><SelectValue placeholder="Discipline" /></SelectTrigger>
                                    <SelectContent>
                                        {disciplines.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Input placeholder="Keywords" value={bookForm.keywords} onChange={(e) => setBookForm(prev => ({ ...prev, keywords: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="Edition" value={bookForm.edition} onChange={(e) => setBookForm(prev => ({ ...prev, edition: e.target.value }))} />
                                <Input placeholder="Publication Year" value={bookForm.publicationYear} onChange={(e) => setBookForm(prev => ({ ...prev, publicationYear: e.target.value }))} />
                            </div>
                            <Input placeholder="Purchase Link" value={bookForm.purchaseLink} onChange={(e) => setBookForm(prev => ({ ...prev, purchaseLink: e.target.value }))} />
                            <Input placeholder="PDF URL" value={bookForm.pdfUrl} onChange={(e) => setBookForm(prev => ({ ...prev, pdfUrl: e.target.value }))} />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditBookOpen(false)}>Cancel</Button>
                            <Button className="bg-accent text-accent-foreground hover:bg-foreground hover:text-background" onClick={handleUpdateBook}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
});

export default AdminDashboard;
