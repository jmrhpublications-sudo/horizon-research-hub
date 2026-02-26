import { memo, useState, useMemo, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, PaperStatus, Paper, ProfessorSubmission } from "@/context/JMRHContext";
import { supabase } from "@/integrations/supabase/client";
import {
    BookOpen,
    CheckCircle,
    Clock,
    FileText,
    Send,
    ArrowRight,
    AlertCircle,
    MessageSquare,
    Search,
    Filter,
    Download,
    Eye,
    Upload,
    Library,
    Plus,
    Trash2,
    Edit,
    ExternalLink,
    Check,
    X,
    User,
    Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const ProfessorDashboard = memo(() => {
    const { 
        papers, 
        currentUser, 
        updatePaperStatus, 
        professorSubmissions,
        createProfessorSubmission,
        deleteProfessorSubmission
    } = useJMRH();
    const [reviewComments, setReviewComments] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
    const [isUploadJournalOpen, setIsUploadJournalOpen] = useState(false);
    const [isUploadBookOpen, setIsUploadBookOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    // Form states
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
    const bookFileRef = useRef<HTMLInputElement>(null);
    const [isUploadingJournal, setIsUploadingJournal] = useState(false);
    const [isUploadingBook, setIsUploadingBook] = useState(false);

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

    const assignedPapers = useMemo(() =>
        papers.filter(p => p.assignedProfessorId === currentUser?.id),
        [papers, currentUser]);

    const mySubmissions = useMemo(() =>
        professorSubmissions.filter(s => s.professorId === currentUser?.id),
        [professorSubmissions, currentUser]);

    const pendingMySubmissions = mySubmissions.filter(s => s.status === 'PENDING');
    const approvedMySubmissions = mySubmissions.filter(s => s.status === 'APPROVED');
    const rejectedMySubmissions = mySubmissions.filter(s => s.status === 'REJECTED');

    const filteredPapers = useMemo(() => {
        return assignedPapers.filter(p =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.discipline.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [assignedPapers, searchTerm]);

    const pendingReviews = filteredPapers.filter(p => p.status === 'UNDER_REVIEW');
    const completedReviews = filteredPapers.filter(p => p.status !== 'UNDER_REVIEW' && p.status !== 'SUBMITTED');

    const handleSubmitReview = (paperId: string, decision: PaperStatus) => {
        if (!reviewComments.trim()) {
            toast({
                title: "Feedback Required",
                description: "Please provide academic commentary before submitting your decision.",
                variant: "destructive"
            });
            return;
        }
        updatePaperStatus(paperId, decision, reviewComments);
        setReviewComments("");
        toast({
            title: "Review Transmitted",
            description: `Institutional decision of ${decision.replace('_', ' ')} recorded.`
        });
    };

    const handleDownload = (paper: Paper) => {
        toast({
            title: "Accessing Archive",
            description: `Downloading manuscript: ${paper.title}`
        });
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

    const handleSubmitJournal = async () => {
        if (!journalForm.title || !journalForm.authors || !journalForm.discipline) {
            toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);
        try {
            await createProfessorSubmission({
                submissionType: 'JOURNAL',
                ...journalForm
            });
            setIsUploadJournalOpen(false);
            setJournalForm({
                title: "", authors: "", abstract: "", discipline: "", keywords: "",
                volume: "", issue: "", pages: "", doi: "", publicationDate: new Date().toISOString().split('T')[0],
                pdfUrl: "", coverImage: ""
            });
            toast({ title: "Journal Submitted", description: "Waiting for admin approval" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to submit", variant: "destructive" });
        }
        setIsSubmitting(false);
    };

    const handleSubmitBook = async () => {
        if (!bookForm.title || !bookForm.authors || !bookForm.discipline) {
            toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);
        try {
            await createProfessorSubmission({
                submissionType: 'BOOK',
                ...bookForm
            });
            setIsUploadBookOpen(false);
            setBookForm({
                title: "", authors: "", editors: "", isbn: "", publisher: "",
                description: "", discipline: "", keywords: "", edition: "",
                publicationYear: "", pdfUrl: "", coverImage: "", purchaseLink: ""
            });
            toast({ title: "Book Submitted", description: "Waiting for admin approval" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to submit", variant: "destructive" });
        }
        setIsSubmitting(false);
    };

    return (
        <DashboardLayout role="PROFESSOR">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Executive Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-gold" />
                            <p className="section-label text-gold uppercase tracking-[0.3em] text-[10px] font-bold">Editorial Workspace</p>
                        </div>
                        <h1 className="text-6xl font-serif font-bold italic text-white leading-tight tracking-tight">Peer Review Console</h1>
                    </div>

                    <div className="grid grid-cols-2 gap-8 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <div className="space-y-1">
                            <p className="text-[9px] uppercase font-bold text-white/40 tracking-widest">Active Queue</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                <p className="text-2xl font-serif italic font-bold text-white">{pendingReviews.length}</p>
                            </div>
                        </div>
                        <div className="space-y-1 border-l border-white/10 pl-8">
                            <p className="text-[9px] uppercase font-bold text-white/40 tracking-widest">Completed</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-teal-400" />
                                <p className="text-2xl font-serif italic font-bold text-white">{completedReviews.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions - Upload Section */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div 
                        className="bg-white/5 border border-white/10 p-6 rounded-2xl cursor-pointer hover:border-gold/40 transition-all"
                        onClick={() => setIsUploadJournalOpen(true)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                                <Library className="w-6 h-6 text-gold" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Submit Journal Article</h3>
                                <p className="text-xs text-white/40">Upload for admin approval</p>
                            </div>
                        </div>
                    </div>
                    <div 
                        className="bg-white/5 border border-white/10 p-6 rounded-2xl cursor-pointer hover:border-gold/40 transition-all"
                        onClick={() => setIsUploadBookOpen(true)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-teal-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Submit Book</h3>
                                <p className="text-xs text-white/40">Upload for admin approval</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Submissions Status */}
                {(pendingMySubmissions.length > 0 || approvedMySubmissions.length > 0) && (
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <h3 className="font-bold text-white mb-4">My Submissions Status</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-orange-500/10 border border-orange-500/20 p-4">
                                <p className="text-orange-400 font-bold">{pendingMySubmissions.length}</p>
                                <p className="text-xs text-white/40">Pending Approval</p>
                            </div>
                            <div className="bg-green-500/10 border border-green-500/20 p-4">
                                <p className="text-green-400 font-bold">{approvedMySubmissions.length}</p>
                                <p className="text-xs text-white/40">Approved & Published</p>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/20 p-4">
                                <p className="text-red-400 font-bold">{rejectedMySubmissions.length}</p>
                                <p className="text-xs text-white/40">Rejected</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search & Filter Bar */}
                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
                    <Input
                        placeholder="Search by title, author, or discipline..."
                        className="h-16 pl-16 bg-white/5 border-white/10 text-white font-serif italic text-lg focus:ring-gold/20 focus:border-gold/50 rounded-2xl transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Tabs defaultValue="pending" className="space-y-8">
                    <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl h-14">
                        <TabsTrigger value="pending" className="rounded-lg px-8 font-bold tracking-widest text-[10px] uppercase data-[state=active]:bg-gold data-[state=active]:text-oxford">
                            Pending Evaluations ({pendingReviews.length})
                        </TabsTrigger>
                        <TabsTrigger value="history" className="rounded-lg px-8 font-bold tracking-widest text-[10px] uppercase data-[state=active]:bg-gold data-[state=active]:text-oxford">
                            Scholarly Record ({completedReviews.length})
                        </TabsTrigger>
                        <TabsTrigger value="submissions" className="rounded-lg px-8 font-bold tracking-widest text-[10px] uppercase data-[state=active]:bg-gold data-[state=active]:text-oxford">
                            My Submissions ({mySubmissions.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="space-y-6 outline-none">
                        {pendingReviews.length > 0 ? (
                            pendingReviews.map((paper) => (
                                <div key={paper.id} className="p-8 bg-white/5 rounded-[32px] border border-white/10 hover:border-gold/40 transition-all duration-500 group">
                                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                                        <div className="space-y-6 flex-1">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Protocol {paper.id.slice(0, 8)}</span>
                                                    <span className="h-1 w-1 rounded-full bg-white/20" />
                                                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{paper.discipline}</span>
                                                </div>
                                                <h4 className="font-serif text-3xl font-bold text-white group-hover:text-gold transition-colors leading-snug">{paper.title}</h4>
                                                <p className="text-white/40 font-ui text-sm italic flex items-center gap-2">
                                                    <FileText size={14} className="text-gold/50" /> Submitted by {paper.authorName}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="h-14 rounded-xl border-white/10 text-white/60 hover:text-white hover:bg-white/5 px-6 text-[10px] uppercase font-bold tracking-widest">
                                                        <Eye size={16} className="mr-2" /> Preview
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-oxford border-white/10 text-white max-w-4xl h-[80vh] flex flex-col">
                                                    <DialogHeader>
                                                        <DialogTitle className="font-serif italic text-3xl text-gold">{paper.title}</DialogTitle>
                                                        <DialogDescription className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Manuscript Preview Mode</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="flex-1 bg-white/5 rounded-xl p-8 overflow-y-auto font-serif italic text-lg leading-relaxed text-white/80 border border-white/5">
                                                        {paper.abstract || "The full manuscript content is currently being processed for secure viewing. Please refer to the downloaded PDF for complete technical details and citations."}
                                                    </div>
                                                    <DialogFooter className="pt-4 border-t border-white/5">
                                                        <Button onClick={() => handleDownload(paper)} className="bg-white/10 hover:bg-white/20 text-white border-none rounded-lg">
                                                            <Download size={16} className="mr-2" /> Download Full PDF
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className="h-14 rounded-xl bg-gold text-oxford px-8 font-bold tracking-widest hover:bg-white transition-all shadow-xl group border-none text-[10px] uppercase">
                                                        Submit Decision <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-oxford border-white/10 text-white max-w-2xl">
                                                    <DialogHeader>
                                                        <DialogTitle className="font-serif italic text-3xl text-gold mb-2">Reviewer's Transmittal</DialogTitle>
                                                        <p className="text-white/40 text-xs font-ui">Final evaluation for: <span className="text-white italic">{paper.title}</span></p>
                                                    </DialogHeader>
                                                    <div className="space-y-8 pt-6">
                                                        <div className="space-y-4">
                                                            <label className="text-[10px] uppercase tracking-widest font-bold text-teal-400 flex items-center gap-3">
                                                                <MessageSquare size={14} /> Academic Commentary
                                                            </label>
                                                            <Textarea
                                                                placeholder="Provide rigorous feedback for the author..."
                                                                className="bg-white/5 border-white/10 text-white font-serif italic h-48 focus:border-gold rounded-xl resize-none"
                                                                value={reviewComments}
                                                                onChange={(e) => setReviewComments(e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-4 pb-2">
                                                            {[
                                                                { label: "Accept", status: 'ACCEPTED', color: 'bg-teal-500' },
                                                                { label: "Revision", status: 'REVISION_REQUIRED', color: 'bg-orange-500' },
                                                                { label: "Reject", status: 'REJECTED', color: 'bg-red-500' }
                                                            ].map((opt) => (
                                                                <Button
                                                                    key={opt.status}
                                                                    onClick={() => handleSubmitReview(paper.id, opt.status as PaperStatus)}
                                                                    className={`h-14 rounded-xl font-bold tracking-widest text-[10px] uppercase shadow-lg border-none ${opt.color} text-white hover:opacity-80 transition-all`}
                                                                >
                                                                    {opt.label}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center space-y-6">
                                <div className="p-6 bg-white/5 rounded-full">
                                    <CheckCircle size={40} className="text-teal-400/40" />
                                </div>
                                <div className="space-y-2">
                                    <p className="font-serif italic text-white/40 text-2xl">Queue Cleared</p>
                                    <p className="text-white/20 text-xs uppercase tracking-[0.2em] font-bold">No manuscripts currently awaiting your command.</p>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="history" className="outline-none">
                        <div className="bg-white/5 rounded-[32px] border border-white/5 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-white/40 text-left">
                                            <th className="p-8 font-bold">Manuscript Details</th>
                                            <th className="p-8 font-bold">Status</th>
                                            <th className="p-8 font-bold text-right">Archive Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {completedReviews.map((paper) => (
                                            <tr key={paper.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="p-8">
                                                    <div className="space-y-1">
                                                        <p className="font-serif italic text-xl text-white font-bold group-hover:text-gold transition-colors">{paper.title}</p>

                                                        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/20 font-bold">
                                                            <span>{paper.authorName}</span>
                                                            <span className="w-1 h-1 rounded-full bg-white/10" />
                                                            <span>{paper.discipline}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-8">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${paper.status === 'ACCEPTED' ? 'bg-teal-500/10 text-teal-400' :
                                                            paper.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                                                                'bg-orange-500/10 text-orange-400'
                                                        }`}>
                                                        {paper.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="p-8 text-right">
                                                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                                                        {new Date(paper.submissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="submissions" className="outline-none">
                        <div className="bg-white/5 rounded-[32px] border border-white/5 overflow-hidden">
                            {mySubmissions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-white/40 text-left">
                                                <th className="p-8 font-bold">Content</th>
                                                <th className="p-8 font-bold">Type</th>
                                                <th className="p-8 font-bold">Status</th>
                                                <th className="p-8 font-bold text-right">Submitted</th>
                                                <th className="p-8 font-bold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {mySubmissions.map((sub) => (
                                                <tr key={sub.id} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-8">
                                                        <div className="space-y-1">
                                                            <p className="font-serif italic text-xl text-white font-bold group-hover:text-gold transition-colors">{sub.title}</p>
                                                            <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/20 font-bold">
                                                                <span>{sub.authors}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-8">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${sub.submissionType === 'JOURNAL' ? 'bg-gold/10 text-gold' : 'bg-teal-500/10 text-teal-500'}`}>
                                                            {sub.submissionType}
                                                        </span>
                                                    </td>
                                                    <td className="p-8">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${sub.status === 'APPROVED' ? 'bg-green-500/10 text-green-400' :
                                                                sub.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                                                                    'bg-orange-500/10 text-orange-400'
                                                            }`}>
                                                            {sub.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-8 text-right">
                                                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                                                            {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </td>
                                                    <td className="p-8 text-right">
                                                        {sub.status === 'PENDING' && (
                                                            <Button 
                                                                size="sm" 
                                                                variant="ghost" 
                                                                className="text-red-400 hover:text-red-300"
                                                                onClick={() => deleteProfessorSubmission(sub.id)}
                                                            >
                                                                <Trash2 size={14} />
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center space-y-6">
                                    <div className="p-6 bg-white/5 rounded-full">
                                        <Upload size={40} className="text-white/20" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-serif italic text-white/40 text-2xl">No Submissions Yet</p>
                                        <p className="text-white/20 text-xs uppercase tracking-[0.2em] font-bold">Use the buttons above to submit journals or books.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Upload Journal Dialog */}
                <Dialog open={isUploadJournalOpen} onOpenChange={setIsUploadJournalOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Submit Journal Article</DialogTitle>
                            <DialogDescription>Your submission will require admin approval before being published.</DialogDescription>
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
                                <label className="text-xs font-bold uppercase text-oxford/60">PDF File (Optional)</label>
                                <input ref={journalFileRef} type="file" accept=".pdf" onChange={handleJournalFileUpload} className="hidden" />
                                <Button type="button" variant="outline" onClick={() => journalFileRef.current?.click()} className="w-full">
                                    {isUploadingJournal ? "Uploading..." : journalForm.pdfUrl ? "PDF Uploaded ✓" : "Choose PDF"}
                                </Button>
                            </div>
                            <Input placeholder="PDF URL (if already hosted)" value={journalForm.pdfUrl} onChange={(e) => setJournalForm(prev => ({ ...prev, pdfUrl: e.target.value }))} />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsUploadJournalOpen(false)}>Cancel</Button>
                            <Button className="bg-gold hover:bg-oxford" onClick={handleSubmitJournal} disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit for Approval"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Upload Book Dialog */}
                <Dialog open={isUploadBookOpen} onOpenChange={setIsUploadBookOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Submit Book</DialogTitle>
                            <DialogDescription>Your submission will require admin approval before being published.</DialogDescription>
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
                                <label className="text-xs font-bold uppercase text-oxford/60">PDF File (Optional)</label>
                                <input ref={bookFileRef} type="file" accept=".pdf" onChange={handleBookFileUpload} className="hidden" />
                                <Button type="button" variant="outline" onClick={() => bookFileRef.current?.click()} className="w-full">
                                    {isUploadingBook ? "Uploading..." : bookForm.pdfUrl ? "PDF Uploaded ✓" : "Choose PDF"}
                                </Button>
                            </div>
                            <Input placeholder="PDF URL (if already hosted)" value={bookForm.pdfUrl} onChange={(e) => setBookForm(prev => ({ ...prev, pdfUrl: e.target.value }))} />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsUploadBookOpen(false)}>Cancel</Button>
                            <Button className="bg-gold hover:bg-oxford" onClick={handleSubmitBook} disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit for Approval"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
});

export default ProfessorDashboard;
