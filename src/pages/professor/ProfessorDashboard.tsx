import { memo, useState, useMemo, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, PaperStatus, Paper, ProfessorSubmission } from "@/context/JMRHContext";
import { supabase } from "@/integrations/supabase/client";
import { getSignedFileUrl } from "@/lib/storage-utils";
import {
    BookOpen, CheckCircle, Clock, FileText, Send, ArrowRight, AlertCircle,
    MessageSquare, Search, Download, Eye, Upload, Library, Plus, Trash2,
    User, Calendar, GraduationCap, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
    DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const statusColors: Record<string, string> = {
    SUBMITTED: "bg-orange-100 text-orange-700",
    UNDER_REVIEW: "bg-blue-100 text-blue-700",
    REVISION_REQUIRED: "bg-yellow-100 text-yellow-700",
    ACCEPTED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-red-100 text-red-700",
    PUBLISHED: "bg-green-100 text-green-700",
    PENDING: "bg-orange-100 text-orange-700",
    APPROVED: "bg-emerald-100 text-emerald-700",
};

const ProfessorDashboard = memo(() => {
    const { 
        papers, currentUser, updatePaperStatus, refreshData,
        professorSubmissions, createProfessorSubmission, deleteProfessorSubmission
    } = useJMRH();
    const [reviewComments, setReviewComments] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"reviews" | "history" | "submissions">("reviews");
    const [isUploadJournalOpen, setIsUploadJournalOpen] = useState(false);
    const [isUploadBookOpen, setIsUploadBookOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const [journalForm, setJournalForm] = useState({
        title: "", authors: "", abstract: "", discipline: "", keywords: "",
        volume: "", issue: "", pages: "", doi: "",
        publicationDate: new Date().toISOString().split('T')[0], pdfUrl: "", coverImage: ""
    });

    const [bookForm, setBookForm] = useState({
        title: "", authors: "", editors: "", isbn: "", publisher: "",
        description: "", discipline: "", keywords: "", edition: "",
        publicationYear: "", pdfUrl: "", coverImage: "", purchaseLink: ""
    });

    const journalFileRef = useRef<HTMLInputElement>(null);
    const bookFileRef = useRef<HTMLInputElement>(null);
    const [isUploadingJournal, setIsUploadingJournal] = useState(false);
    const [isUploadingBook, setIsUploadingBook] = useState(false);

    const disciplines = [
        "Commerce and Management", "Economics and Finance", "Education and Psychology",
        "Social Sciences and Humanities", "Science and Technology",
        "Environmental Studies and Sustainability", "Digital Transformation and Information Systems",
        "Entrepreneurship and Innovation", "Public Policy and Governance", "Other"
    ];

    const assignedPapers = useMemo(() =>
        papers.filter(p => p.assignedProfessorId === currentUser?.id), [papers, currentUser]);

    const mySubmissions = useMemo(() =>
        professorSubmissions.filter(s => s.professorId === currentUser?.id), [professorSubmissions, currentUser]);

    const filteredPapers = useMemo(() =>
        assignedPapers.filter(p =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.authorName.toLowerCase().includes(searchTerm.toLowerCase())
        ), [assignedPapers, searchTerm]);

    const pendingReviews = filteredPapers.filter(p => p.status === 'UNDER_REVIEW' || p.status === 'SUBMITTED');
    const completedReviews = filteredPapers.filter(p => p.status !== 'UNDER_REVIEW' && p.status !== 'SUBMITTED');

    const handleSubmitReview = (paperId: string, decision: PaperStatus) => {
        if (!reviewComments.trim()) {
            toast({ title: "Feedback Required", description: "Please provide comments before submitting.", variant: "destructive" });
            return;
        }
        updatePaperStatus(paperId, decision, reviewComments);
        setReviewComments("");
        toast({ title: "Review Submitted", description: `Decision: ${decision.replace('_', ' ')}` });
    };

    const handleDownload = async (paper: Paper) => {
        if (paper.attachments?.length) {
            const { data, error } = await supabase.storage.from('papers').createSignedUrl(paper.attachments[0], 3600);
            if (data?.signedUrl) { window.open(data.signedUrl, '_blank'); return; }
        }
        toast({ title: "No File", description: "No downloadable manuscript found.", variant: "destructive" });
    };

    const uploadFile = async (file: File, folder: string): Promise<string | null> => {
        const fileName = `${folder}/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage.from('publications').upload(fileName, file, { cacheControl: '3600', upsert: false });
        if (error) { console.error('Upload error:', error); return null; }
        return fileName;
    };

    const handleJournalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setIsUploadingJournal(true);
        const url = await uploadFile(e.target.files[0], 'journals');
        if (url) { setJournalForm(prev => ({ ...prev, pdfUrl: url })); toast({ title: "Uploaded", description: "PDF ready" }); }
        setIsUploadingJournal(false);
    };

    const handleBookFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setIsUploadingBook(true);
        const url = await uploadFile(e.target.files[0], 'books');
        if (url) { setBookForm(prev => ({ ...prev, pdfUrl: url })); toast({ title: "Uploaded", description: "PDF ready" }); }
        setIsUploadingBook(false);
    };

    const handleSubmitJournal = async () => {
        if (!journalForm.title || !journalForm.authors || !journalForm.discipline) {
            toast({ title: "Error", description: "Fill required fields", variant: "destructive" }); return;
        }
        setIsSubmitting(true);
        try {
            await createProfessorSubmission({ submissionType: 'JOURNAL', ...journalForm });
            setIsUploadJournalOpen(false);
            setJournalForm({ title: "", authors: "", abstract: "", discipline: "", keywords: "", volume: "", issue: "", pages: "", doi: "", publicationDate: new Date().toISOString().split('T')[0], pdfUrl: "", coverImage: "" });
            toast({ title: "Submitted", description: "Awaiting admin approval" });
        } catch { toast({ title: "Error", description: "Submission failed", variant: "destructive" }); }
        setIsSubmitting(false);
    };

    const handleSubmitBook = async () => {
        if (!bookForm.title || !bookForm.authors || !bookForm.discipline) {
            toast({ title: "Error", description: "Fill required fields", variant: "destructive" }); return;
        }
        setIsSubmitting(true);
        try {
            await createProfessorSubmission({ submissionType: 'BOOK', ...bookForm });
            setIsUploadBookOpen(false);
            setBookForm({ title: "", authors: "", editors: "", isbn: "", publisher: "", description: "", discipline: "", keywords: "", edition: "", publicationYear: "", pdfUrl: "", coverImage: "", purchaseLink: "" });
            toast({ title: "Submitted", description: "Awaiting admin approval" });
        } catch { toast({ title: "Error", description: "Submission failed", variant: "destructive" }); }
        setIsSubmitting(false);
    };

    const tabs = [
        { key: "reviews", label: "Pending Reviews", count: pendingReviews.length },
        { key: "history", label: "Review History", count: completedReviews.length },
        { key: "submissions", label: "My Submissions", count: mySubmissions.length },
    ];

    return (
        <DashboardLayout role="PROFESSOR">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-border">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Professor Portal</p>
                        <h1 className="text-3xl font-serif font-bold text-foreground">Peer Review Console</h1>
                        <p className="text-sm text-muted-foreground">Welcome back, {currentUser?.name}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => refreshData()} className="gap-2">
                        <RefreshCw size={14} /> Refresh
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Clock size={18} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{pendingReviews.length}</p>
                                <p className="text-xs text-muted-foreground">Pending Reviews</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                        className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <CheckCircle size={18} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{completedReviews.length}</p>
                                <p className="text-xs text-muted-foreground">Completed</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                                <Library size={18} className="text-accent" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{mySubmissions.filter(s => s.status === 'APPROVED').length}</p>
                                <p className="text-xs text-muted-foreground">Published</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                        className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <BookOpen size={18} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{assignedPapers.length}</p>
                                <p className="text-xs text-muted-foreground">Total Assigned</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-3">
                    <button onClick={() => setIsUploadJournalOpen(true)}
                        className="bg-card border border-border p-4 rounded-lg flex items-center gap-4 hover:border-accent/40 hover:shadow-sm transition-all text-left">
                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                            <Library size={18} className="text-accent" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground text-sm">Submit Journal Article</p>
                            <p className="text-xs text-muted-foreground">Upload for admin approval</p>
                        </div>
                    </button>
                    <button onClick={() => setIsUploadBookOpen(true)}
                        className="bg-card border border-border p-4 rounded-lg flex items-center gap-4 hover:border-accent/40 hover:shadow-sm transition-all text-left">
                        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                            <BookOpen size={18} className="text-secondary" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground text-sm">Submit Book</p>
                            <p className="text-xs text-muted-foreground">Upload for admin approval</p>
                        </div>
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search papers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 h-11" />
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-border overflow-x-auto">
                    {tabs.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                {/* Pending Reviews Tab */}
                {activeTab === "reviews" && (
                    <AnimatePresence>
                        {pendingReviews.length > 0 ? (
                            <div className="space-y-4">
                                {pendingReviews.map((paper) => (
                                    <motion.div key={paper.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className="bg-card border border-border rounded-lg p-5 hover:border-accent/30 hover:shadow-sm transition-all">
                                        <div className="flex flex-col lg:flex-row justify-between gap-4">
                                            <div className="space-y-2 flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className={`text-[9px] uppercase ${statusColors[paper.status] || ''}`}>
                                                        {paper.status.replace('_', ' ')}
                                                    </Badge>
                                                    <span className="text-[10px] text-muted-foreground">{paper.discipline}</span>
                                                </div>
                                                <h3 className="font-serif text-xl font-bold text-foreground leading-tight">{paper.title}</h3>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1"><User size={12} /> {paper.authorName}</span>
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {paper.submissionDate}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                {/* Preview */}
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="gap-1 text-xs"><Eye size={14} /> Preview</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                                                        <DialogHeader>
                                                            <DialogTitle className="font-serif text-xl">{paper.title}</DialogTitle>
                                                            <DialogDescription className="text-xs">by {paper.authorName} • {paper.discipline}</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="flex-1 bg-muted/50 rounded-lg p-6 overflow-y-auto text-sm text-foreground/80 leading-relaxed border border-border">
                                                            <p className="font-bold text-xs uppercase text-accent mb-2">Abstract</p>
                                                            <p className="whitespace-pre-wrap">{paper.abstract || "No abstract provided."}</p>
                                                            {paper.keywords && (
                                                                <div className="mt-4 pt-4 border-t border-border">
                                                                    <p className="font-bold text-xs uppercase text-accent mb-1">Keywords</p>
                                                                    <p className="text-muted-foreground">{paper.keywords}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <DialogFooter className="pt-3 border-t border-border">
                                                            <Button variant="outline" onClick={() => handleDownload(paper)} className="gap-1">
                                                                <Download size={14} /> Download PDF
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>

                                                {/* Review Decision */}
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" className="gap-1 text-xs bg-accent text-accent-foreground hover:bg-foreground hover:text-background">
                                                            <Send size={14} /> Review
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-lg">
                                                        <DialogHeader>
                                                            <DialogTitle className="font-serif">Submit Review</DialogTitle>
                                                            <DialogDescription className="text-xs">for: {paper.title}</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4 pt-2">
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                                                                    <MessageSquare size={12} /> Your Feedback
                                                                </label>
                                                                <Textarea
                                                                    placeholder="Provide detailed academic feedback..."
                                                                    className="h-36 resize-none"
                                                                    value={reviewComments}
                                                                    onChange={(e) => setReviewComments(e.target.value)}
                                                                />
                                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                <Button onClick={() => handleSubmitReview(paper.id, 'ACCEPTED')}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">
                                                    Accept
                                                </Button>
                                                <Button onClick={() => handleSubmitReview(paper.id, 'REVISION_REQUIRED')}
                                                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold">
                                                    Revision
                                                </Button>
                                                <Button onClick={() => handleSubmitReview(paper.id, 'REJECTED')}
                                                    variant="destructive" className="text-xs font-bold">
                                                    Reject
                                                </Button>
                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center space-y-3">
                                <CheckCircle size={36} className="text-muted-foreground/30" />
                                <p className="font-serif text-muted-foreground text-lg">No pending reviews</p>
                                <p className="text-xs text-muted-foreground/60">All caught up!</p>
                            </div>
                        )}
                    </AnimatePresence>
                )}

                {/* History Tab */}
                {activeTab === "history" && (
                    <div className="bg-card border border-border rounded-lg overflow-hidden">
                        {completedReviews.length > 0 ? (
                            <div className="divide-y divide-border">
                                {completedReviews.map((paper) => (
                                    <div key={paper.id} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-foreground text-sm truncate">{paper.title}</p>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                <span>{paper.authorName}</span>
                                                <span>•</span>
                                                <span>{paper.discipline}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <Badge variant="outline" className={`text-[9px] uppercase ${statusColors[paper.status] || ''}`}>
                                                {paper.status.replace('_', ' ')}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground">
                                                {new Date(paper.submissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 text-center">
                                <p className="text-muted-foreground text-sm">No review history yet</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Submissions Tab */}
                {activeTab === "submissions" && (
                    <div className="bg-card border border-border rounded-lg overflow-hidden">
                        {mySubmissions.length > 0 ? (
                            <div className="divide-y divide-border">
                                {mySubmissions.map((sub) => (
                                    <div key={sub.id} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-foreground text-sm truncate">{sub.title}</p>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                <span>{sub.authors}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <Badge variant="outline" className={`text-[9px] uppercase ${sub.submissionType === 'JOURNAL' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'}`}>
                                                {sub.submissionType}
                                            </Badge>
                                            <Badge variant="outline" className={`text-[9px] uppercase ${statusColors[sub.status] || ''}`}>
                                                {sub.status}
                                            </Badge>
                                            {sub.status === 'PENDING' && (
                                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive h-8 w-8 p-0"
                                                    onClick={() => deleteProfessorSubmission(sub.id)}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 text-center space-y-2">
                                <Upload size={32} className="text-muted-foreground/30 mx-auto" />
                                <p className="text-muted-foreground text-sm">No submissions yet</p>
                                <p className="text-xs text-muted-foreground/60">Use the buttons above to submit journals or books.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Upload Journal Dialog */}
                <Dialog open={isUploadJournalOpen} onOpenChange={setIsUploadJournalOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-serif">Submit Journal Article</DialogTitle>
                            <DialogDescription>Requires admin approval before publishing.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input placeholder="Article Title *" value={journalForm.title} onChange={(e) => setJournalForm(prev => ({ ...prev, title: e.target.value }))} />
                            <Input placeholder="Authors *" value={journalForm.authors} onChange={(e) => setJournalForm(prev => ({ ...prev, authors: e.target.value }))} />
                            <Textarea placeholder="Abstract" value={journalForm.abstract} onChange={(e) => setJournalForm(prev => ({ ...prev, abstract: e.target.value }))} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Select onValueChange={(v) => setJournalForm(prev => ({ ...prev, discipline: v }))} value={journalForm.discipline}>
                                    <SelectTrigger><SelectValue placeholder="Discipline *" /></SelectTrigger>
                                    <SelectContent>{disciplines.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                                </Select>
                                <Input placeholder="Keywords" value={journalForm.keywords} onChange={(e) => setJournalForm(prev => ({ ...prev, keywords: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <Input placeholder="Volume" value={journalForm.volume} onChange={(e) => setJournalForm(prev => ({ ...prev, volume: e.target.value }))} />
                                <Input placeholder="Issue" value={journalForm.issue} onChange={(e) => setJournalForm(prev => ({ ...prev, issue: e.target.value }))} />
                                <Input placeholder="Pages" value={journalForm.pages} onChange={(e) => setJournalForm(prev => ({ ...prev, pages: e.target.value }))} />
                            </div>
                            <Input placeholder="DOI" value={journalForm.doi} onChange={(e) => setJournalForm(prev => ({ ...prev, doi: e.target.value }))} />
                            <Input type="date" value={journalForm.publicationDate} onChange={(e) => setJournalForm(prev => ({ ...prev, publicationDate: e.target.value }))} />
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">PDF File</label>
                                <input ref={journalFileRef} type="file" accept=".pdf" onChange={handleJournalFileUpload} className="hidden" />
                                <Button type="button" variant="outline" onClick={() => journalFileRef.current?.click()} className="w-full">
                                    {isUploadingJournal ? "Uploading..." : journalForm.pdfUrl ? "PDF Uploaded ✓" : "Choose PDF"}
                                </Button>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsUploadJournalOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmitJournal} disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit for Approval"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Upload Book Dialog */}
                <Dialog open={isUploadBookOpen} onOpenChange={setIsUploadBookOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-serif">Submit Book</DialogTitle>
                            <DialogDescription>Requires admin approval before publishing.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input placeholder="Book Title *" value={bookForm.title} onChange={(e) => setBookForm(prev => ({ ...prev, title: e.target.value }))} />
                            <Input placeholder="Authors *" value={bookForm.authors} onChange={(e) => setBookForm(prev => ({ ...prev, authors: e.target.value }))} />
                            <Input placeholder="Editors" value={bookForm.editors} onChange={(e) => setBookForm(prev => ({ ...prev, editors: e.target.value }))} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input placeholder="ISBN" value={bookForm.isbn} onChange={(e) => setBookForm(prev => ({ ...prev, isbn: e.target.value }))} />
                                <Input placeholder="Publisher" value={bookForm.publisher} onChange={(e) => setBookForm(prev => ({ ...prev, publisher: e.target.value }))} />
                            </div>
                            <Textarea placeholder="Description" value={bookForm.description} onChange={(e) => setBookForm(prev => ({ ...prev, description: e.target.value }))} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Select onValueChange={(v) => setBookForm(prev => ({ ...prev, discipline: v }))} value={bookForm.discipline}>
                                    <SelectTrigger><SelectValue placeholder="Discipline *" /></SelectTrigger>
                                    <SelectContent>{disciplines.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                                </Select>
                                <Input placeholder="Keywords" value={bookForm.keywords} onChange={(e) => setBookForm(prev => ({ ...prev, keywords: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsUploadBookOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmitBook} disabled={isSubmitting}>
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
