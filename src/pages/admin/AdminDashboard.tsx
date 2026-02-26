import { memo, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, UserRole, PublishedJournal, PublishedBook, UploadRequest, Paper, ProfessorSubmission } from "@/context/JMRHContext";
import { supabase } from "@/integrations/supabase/client";
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
    Unlock
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

const AdminDashboard = memo(() => {
    const { 
        users, papers, professors, assignPaper, updatePaperStatus, publishPaper, createUser,
        publishedJournals, publishedBooks, uploadRequests, professorSubmissions,
        createPublishedJournal, updatePublishedJournal, deletePublishedJournal,
        createPublishedBook, updatePublishedBook, deletePublishedBook,
        updateUploadRequest, deleteUploadRequest, banUser, unbanUser, refreshData,
        approveProfessorSubmission, updateProfessorSubmission
    } = useJMRH();
    const [activeTab, setActiveTab] = useState<"papers" | "users" | "professors" | "upload" | "overview">("overview");
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
    
    const journalPapers = papers.filter(p => p.paperType === 'JOURNAL' && p.status === 'PUBLISHED');
    const bookPapers = papers.filter(p => p.paperType === 'BOOK' && p.status === 'PUBLISHED');

    const pendingRequests = uploadRequests.filter(r => r.status === 'PENDING');
    const approvedRequests = uploadRequests.filter(r => r.status === 'APPROVED');
    const rejectedRequests = uploadRequests.filter(r => r.status === 'REJECTED');

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
        { label: "Total Users", value: users.length, icon: Users, color: "text-blue-400", sub: `${admins.length} admins, ${professorsList.length} professors` },
        { label: "Total Papers", value: papers.length, icon: FileText, color: "text-purple-400", sub: `${submittedPapers.length} submitted` },
        { label: "Published Journals", value: publishedJournals.length + journalPapers.length, icon: Library, color: "text-gold", sub: "Articles online" },
        { label: "Published Books", value: publishedBooks.length + bookPapers.length, icon: BookOpen, color: "text-teal-400", sub: "Books available" },
        { label: "Pending Review", value: submittedPapers.length, icon: Clock, color: "text-orange-400", sub: "Awaiting action" },
        { label: "Upload Requests", value: pendingRequests.length, icon: Inbox, color: "text-purple-400", sub: "Pending approval" },
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
        
        const { data: { publicUrl } } = supabase.storage
            .from('publications')
            .getPublicUrl(fileName);
        
        return publicUrl;
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
            <div className="space-y-8">
                {/* Header */}
                <div className="flex justify-between items-end border-b border-white/5 pb-6">
                    <div className="space-y-2">
                        <p className="section-label">Admin Control Panel</p>
                        <h1 className="text-4xl font-serif font-bold text-oxford">Dashboard</h1>
                    </div>
                    <Button variant="outline" onClick={() => refreshData()} className="gap-2">
                        <RefreshCw size={16} /> Refresh
                    </Button>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="p-4 bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <p className="text-2xl font-bold text-oxford">{stat.value}</p>
                            <p className="text-xs text-oxford/50">{stat.label}</p>
                            <p className="text-xs text-oxford/30">{stat.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-black/10 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === "overview" ? "border-gold text-oxford" : "border-transparent text-oxford/50"}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("papers")}
                        className={`px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === "papers" ? "border-gold text-oxford" : "border-transparent text-oxford/50"}`}
                    >
                        Papers
                    </button>
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === "users" ? "border-gold text-oxford" : "border-transparent text-oxford/50"}`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab("professors")}
                        className={`px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === "professors" ? "border-gold text-oxford" : "border-transparent text-oxford/50"}`}
                    >
                        Professors
                    </button>
                    <button
                        onClick={() => setActiveTab("upload")}
                        className={`px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === "upload" ? "border-gold text-oxford" : "border-transparent text-oxford/50"}`}
                    >
                        Upload & Requests
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Recent Papers */}
                            <div className="bg-white border border-black/5">
                                <div className="p-4 border-b border-black/5 flex justify-between items-center">
                                    <h3 className="font-bold text-oxford">Recent Papers</h3>
                                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("papers")}>View All</Button>
                                </div>
                                <div className="divide-y divide-black/5">
                                    {papers.slice(0, 5).map(paper => (
                                        <div key={paper.id} className="p-4 hover:bg-oxford/5">
                                            <p className="font-medium text-oxford line-clamp-1 text-sm">{paper.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-oxford/50">{paper.authorName}</span>
                                                <span className={`px-2 py-0.5 text-xs font-bold uppercase ${
                                                    paper.status === 'SUBMITTED' ? 'bg-orange-100 text-orange-600' :
                                                    paper.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-600' :
                                                    paper.status === 'ACCEPTED' ? 'bg-green-100 text-green-600' :
                                                    paper.status === 'PUBLISHED' ? 'bg-gold/20 text-gold' :
                                                    'bg-red-100 text-red-600'
                                                }`}>
                                                    {paper.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {papers.length === 0 && (
                                        <p className="p-4 text-center text-oxford/50 text-sm">No papers yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white border border-black/5 p-6">
                                <h3 className="font-bold text-oxford mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setIsUploadJournalOpen(true)}>
                                        <Upload className="w-6 h-6 text-gold" />
                                        <span className="text-xs">Upload Journal</span>
                                    </Button>
                                    <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setIsUploadBookOpen(true)}>
                                        <BookOpen className="w-6 h-6 text-teal-500" />
                                        <span className="text-xs">Upload Book</span>
                                    </Button>
                                    <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setIsCreateUserOpen(true)}>
                                        <Plus className="w-6 h-6 text-blue-500" />
                                        <span className="text-xs">Add User</span>
                                    </Button>
                                    <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => refreshData()}>
                                        <RefreshCw className="w-6 h-6 text-purple-500" />
                                        <span className="text-xs">Refresh Data</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Pending Actions */}
                        {(submittedPapers.length > 0 || pendingRequests.length > 0) && (
                            <div className="bg-orange-50 border border-orange-200 p-6">
                                <h3 className="font-bold text-orange-800 flex items-center gap-2">
                                    <AlertCircle size={20} />
                                    Pending Actions ({submittedPapers.length + pendingRequests.length})
                                </h3>
                                <div className="mt-4 grid md:grid-cols-2 gap-4">
                                    {submittedPapers.length > 0 && (
                                        <div className="bg-white p-4">
                                            <p className="font-medium text-oxford">{submittedPapers.length} papers awaiting review</p>
                                            <Button size="sm" className="mt-2" onClick={() => setActiveTab("papers")}>Review Now</Button>
                                        </div>
                                    )}
                                    {pendingRequests.length > 0 && (
                                        <div className="bg-white p-4">
                                            <p className="font-medium text-oxford">{pendingRequests.length} upload requests pending</p>
                                            <Button size="sm" className="mt-2" onClick={() => setActiveTab("upload")}>Review Now</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Papers Tab */}
                {activeTab === "papers" && (
                    <div className="space-y-4">
                        {/* Search and Filter */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
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

                        <div className="bg-white border border-black/5 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-oxford/5">
                                    <tr>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Title</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Type</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Author</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Status</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Date</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    {filteredPapers.map((paper) => (
                                        <tr key={paper.id} className="hover:bg-oxford/5 transition-colors">
                                            <td className="p-4">
                                                <p className="font-medium text-oxford line-clamp-1 max-w-xs">{paper.title}</p>
                                                <p className="text-xs text-oxford/50">{paper.discipline}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-bold uppercase ${paper.paperType === 'JOURNAL' ? 'bg-gold/10 text-gold' : 'bg-teal-500/10 text-teal-600'}`}>
                                                    {paper.paperType}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-oxford/70 max-w-32 line-clamp-1">{paper.authorName}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-bold uppercase ${
                                                    paper.status === 'SUBMITTED' ? 'bg-orange-100 text-orange-600' :
                                                    paper.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-600' :
                                                    paper.status === 'REVISION_REQUIRED' ? 'bg-yellow-100 text-yellow-600' :
                                                    paper.status === 'ACCEPTED' ? 'bg-green-100 text-green-600' :
                                                    paper.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                                    paper.status === 'PUBLISHED' ? 'bg-gold/20 text-gold' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {paper.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-oxford/50">
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
                                                            <Button size="sm" variant="outline" className="text-orange-600" onClick={() => handleRejectPaper(paper)}>
                                                                <X size={12} />
                                                            </Button>
                                                        </>
                                                    )}
                                                    
                                                    {paper.status === 'UNDER_REVIEW' && (
                                                        <>
                                                            <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handleAcceptPaper(paper)}>
                                                                <Check size={12} className="mr-1" /> Accept
                                                            </Button>
                                                            <Button size="sm" variant="outline" className="text-yellow-600" onClick={() => handleRequestRevision(paper)}>
                                                                <RefreshCw size={12} />
                                                            </Button>
                                                            <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleRejectPaper(paper)}>
                                                                <X size={12} />
                                                            </Button>
                                                        </>
                                                    )}
                                                    
                                                    {paper.status === 'REVISION_REQUIRED' && (
                                                        <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handleAcceptPaper(paper)}>
                                                            <Check size={12} className="mr-1" /> Accept
                                                        </Button>
                                                    )}
                                                    
                                                    {paper.status === 'ACCEPTED' && (
                                                        <Button size="sm" className="bg-gold hover:bg-gold/80" onClick={() => handlePublishPaper(paper)}>
                                                            <Globe size={12} className="mr-1" /> Publish
                                                        </Button>
                                                    )}
                                                    
                                                    {paper.status === 'PUBLISHED' && (
                                                        <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                                                            <CheckCircle size={14} /> Published
                                                        </span>
                                                    )}
                                                    
                                                    {paper.status === 'REJECTED' && (
                                                        <span className="text-xs text-red-600 font-bold flex items-center gap-1">
                                                            <X size={14} /> Rejected
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPapers.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-oxford/50">
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
                                    <Button className="bg-oxford hover:bg-gold">
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

                        <div className="bg-white border border-black/5 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-oxford/5">
                                    <tr>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Name</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Email</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Role</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Status</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Papers</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-oxford/5">
                                            <td className="p-4 font-medium text-oxford">{user.name}</td>
                                            <td className="p-4 text-sm text-oxford/70">{user.email}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-bold uppercase ${
                                                    user.role === 'ADMIN' ? 'bg-red-100 text-red-600' :
                                                    user.role === 'PROFESSOR' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-bold uppercase ${
                                                    user.status === 'ACTIVE' ? 'bg-green-100 text-green-600' :
                                                    'bg-red-100 text-red-600'
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-oxford/70">
                                                {papers.filter(p => p.authorId === user.id).length}
                                            </td>
                                            <td className="p-4">
                                                <Button 
                                                    size="sm" 
                                                    variant="ghost"
                                                    onClick={() => handleToggleUserBan(user)}
                                                    className={user.status === 'ACTIVE' ? 'text-red-500' : 'text-green-500'}
                                                >
                                                    {user.status === 'ACTIVE' ? <Ban size={14} /> : <Unlock size={14} />}
                                                </Button>
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
                                    <Button className="bg-oxford hover:bg-gold">
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
                                    <div key={prof.id} className="p-6 bg-white border border-black/5 hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-oxford/10 rounded-full flex items-center justify-center">
                                                <GraduationCap className="w-6 h-6 text-oxford" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-oxford">{prof.name}</h3>
                                                <p className="text-sm text-oxford/60">{prof.email}</p>
                                                <p className="text-xs text-oxford/50 mt-1">{prof.affiliation}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-black/5 flex justify-between text-sm">
                                            <span className="text-oxford/60">Papers Assigned:</span>
                                            <span className="font-bold text-oxford">{profPapers.length}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {professorsList.length === 0 && (
                                <div className="col-span-full p-8 text-center text-oxford/50">
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
                            <div className="bg-white border border-black/5 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                                        <Library className="w-6 h-6 text-gold" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-oxford">Upload Journal Article</h3>
                                        <p className="text-xs text-oxford/50">Publish a new journal article</p>
                                    </div>
                                </div>
                                <Dialog open={isUploadJournalOpen} onOpenChange={setIsUploadJournalOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-oxford hover:bg-gold">
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
                                            <div className="grid grid-cols-2 gap-4">
                                                <Select onValueChange={(v) => setJournalForm(prev => ({ ...prev, discipline: v }))} value={journalForm.discipline}>
                                                    <SelectTrigger><SelectValue placeholder="Discipline *" /></SelectTrigger>
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
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-oxford/60">PDF File</label>
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
                                            <Button className="bg-gold hover:bg-oxford" onClick={handlePublishJournal}>Publish Journal</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Upload Book */}
                            <div className="bg-white border border-black/5 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-teal-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-oxford">Upload Book</h3>
                                        <p className="text-xs text-oxford/50">Publish a new book</p>
                                    </div>
                                </div>
                                <Dialog open={isUploadBookOpen} onOpenChange={setIsUploadBookOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-oxford hover:bg-gold">
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
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input placeholder="ISBN" value={bookForm.isbn} onChange={(e) => setBookForm(prev => ({ ...prev, isbn: e.target.value }))} />
                                                <Input placeholder="Publisher" value={bookForm.publisher} onChange={(e) => setBookForm(prev => ({ ...prev, publisher: e.target.value }))} />
                                            </div>
                                            <Textarea placeholder="Description" value={bookForm.description} onChange={(e) => setBookForm(prev => ({ ...prev, description: e.target.value }))} />
                                            <div className="grid grid-cols-2 gap-4">
                                                <Select onValueChange={(v) => setBookForm(prev => ({ ...prev, discipline: v }))} value={bookForm.discipline}>
                                                    <SelectTrigger><SelectValue placeholder="Discipline *" /></SelectTrigger>
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
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-oxford/60">PDF File</label>
                                                <input ref={bookFileRef} type="file" accept=".pdf" onChange={handleBookFileUpload} className="hidden" />
                                                <Button type="button" variant="outline" onClick={() => bookFileRef.current?.click()} className="w-full">
                                                    {isUploadingBook ? "Uploading..." : bookForm.pdfUrl ? "PDF Uploaded ✓" : "Choose PDF"}
                                                </Button>
                                            </div>
                                            <Input placeholder="PDF URL (if already hosted)" value={bookForm.pdfUrl} onChange={(e) => setBookForm(prev => ({ ...prev, pdfUrl: e.target.value }))} />
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsUploadBookOpen(false)}>Cancel</Button>
                                            <Button className="bg-gold hover:bg-oxford" onClick={handlePublishBook}>Publish Book</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        {/* Published Content */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Published Journals */}
                            <div className="bg-white border border-black/5">
                                <div className="p-4 border-b border-black/5">
                                    <h3 className="font-bold text-oxford">Published Journals ({publishedJournals.length})</h3>
                                </div>
                                <div className="divide-y divide-black/5 max-h-80 overflow-y-auto">
                                    {publishedJournals.map(journal => (
                                        <div key={journal.id} className="p-4 hover:bg-oxford/5">
                                            <p className="font-medium text-oxford line-clamp-1">{journal.title}</p>
                                            <p className="text-xs text-oxford/50">{journal.authors}</p>
                                            <div className="flex gap-2 mt-2">
                                                {journal.pdfUrl && (
                                                    <a href={journal.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline flex items-center gap-1">
                                                        <ExternalLink size={12} /> View
                                                    </a>
                                                )}
                                                <button onClick={() => openEditJournal(journal)} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                                    <Edit size={12} /> Edit
                                                </button>
                                                <button onClick={() => deletePublishedJournal(journal.id)} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                                                    <Trash2 size={12} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {publishedJournals.length === 0 && (
                                        <p className="p-4 text-center text-oxford/50 text-sm">No journals published yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Published Books */}
                            <div className="bg-white border border-black/5">
                                <div className="p-4 border-b border-black/5">
                                    <h3 className="font-bold text-oxford">Published Books ({publishedBooks.length})</h3>
                                </div>
                                <div className="divide-y divide-black/5 max-h-80 overflow-y-auto">
                                    {publishedBooks.map(book => (
                                        <div key={book.id} className="p-4 hover:bg-oxford/5">
                                            <p className="font-medium text-oxford line-clamp-1">{book.title}</p>
                                            <p className="text-xs text-oxford/50">{book.authors} {book.isbn && `(ISBN: ${book.isbn})`}</p>
                                            <div className="flex gap-2 mt-2">
                                                {book.pdfUrl && (
                                                    <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline flex items-center gap-1">
                                                        <ExternalLink size={12} /> View
                                                    </a>
                                                )}
                                                {book.purchaseLink && (
                                                    <a href={book.purchaseLink} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-500 hover:underline flex items-center gap-1">
                                                        <ExternalLink size={12} /> Purchase
                                                    </a>
                                                )}
                                                <button onClick={() => openEditBook(book)} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                                    <Edit size={12} /> Edit
                                                </button>
                                                <button onClick={() => deletePublishedBook(book.id)} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                                                    <Trash2 size={12} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {publishedBooks.length === 0 && (
                                        <p className="p-4 text-center text-oxford/50 text-sm">No books published yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Professor Submissions */}
                        <div className="bg-white border border-black/5">
                            <div className="p-4 border-b border-black/5 flex justify-between items-center">
                                <h3 className="font-bold text-oxford">Professor Submissions ({pendingProfessorSubmissions.length} pending)</h3>
                            </div>
                            <div className="divide-y divide-black/5">
                                {professorSubmissions.map(submission => (
                                    <div key={submission.id} className="p-4 hover:bg-oxford/5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-0.5 text-xs font-bold uppercase ${
                                                        submission.submissionType === 'JOURNAL' ? 'bg-gold/10 text-gold' : 'bg-teal-500/10 text-teal-600'
                                                    }`}>
                                                        {submission.submissionType}
                                                    </span>
                                                    <span className={`px-2 py-0.5 text-xs font-bold uppercase ${
                                                        submission.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                                        submission.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                                        'bg-red-100 text-red-600'
                                                    }`}>
                                                        {submission.status}
                                                    </span>
                                                </div>
                                                <p className="font-medium text-oxford">{submission.title}</p>
                                                <p className="text-xs text-oxford/50">By: {submission.professorName}</p>
                                                <p className="text-xs text-oxford/50">Authors: {submission.authors}</p>
                                                {submission.discipline && <p className="text-xs text-oxford/50">Discipline: {submission.discipline}</p>}
                                                {submission.keywords && <p className="text-xs text-oxford/50">Keywords: {submission.keywords}</p>}
                                                {submission.abstract && <p className="text-xs text-oxford/50 mt-1 line-clamp-2">{submission.abstract}</p>}
                                                {submission.pdfUrl && (
                                                    <a href={submission.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline flex items-center gap-1 mt-2">
                                                        <ExternalLink size={12} /> View PDF
                                                    </a>
                                                )}
                                            </div>
                                            {submission.status === 'PENDING' && (
                                                <div className="flex gap-2 ml-4">
                                                    <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handleProfessorSubmissionAction(submission, 'approve')}>
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
                                    <p className="p-8 text-center text-oxford/50">No professor submissions</p>
                                )}
                            </div>
                        </div>

                        {/* Upload Requests from Users */}
                        <div className="bg-white border border-black/5">
                            <div className="p-4 border-b border-black/5">
                                <h3 className="font-bold text-oxford">User Upload Requests ({pendingRequests.length} pending)</h3>
                            </div>
                            <div className="divide-y divide-black/5">
                                {uploadRequests.map(request => (
                                    <div key={request.id} className="p-4 hover:bg-oxford/5">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 text-xs font-bold uppercase ${
                                                        request.requestType === 'JOURNAL' ? 'bg-gold/10 text-gold' : 'bg-teal-500/10 text-teal-600'
                                                    }`}>
                                                        {request.requestType}
                                                    </span>
                                                    <span className={`px-2 py-0.5 text-xs font-bold uppercase ${
                                                        request.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                                        request.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                                        'bg-red-100 text-red-600'
                                                    }`}>
                                                        {request.status}
                                                    </span>
                                                </div>
                                                <p className="font-medium text-oxford mt-2">{request.title}</p>
                                                {request.authors && <p className="text-xs text-oxford/50">Authors: {request.authors}</p>}
                                                {request.isbn && <p className="text-xs text-oxford/50">ISBN: {request.isbn}</p>}
                                                {request.description && <p className="text-xs text-oxford/50 mt-1">{request.description}</p>}
                                                {request.link && <a href={request.link} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline">View Source</a>}
                                            </div>
                                            {request.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handleRequestAction(request, 'APPROVED')}>
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
                                    <p className="p-8 text-center text-oxford/50">No upload requests</p>
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
                            <Button className="bg-gold hover:bg-oxford" onClick={handleUpdateJournal}>Save Changes</Button>
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
                            <Button className="bg-gold hover:bg-oxford" onClick={handleUpdateBook}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
});

export default AdminDashboard;
