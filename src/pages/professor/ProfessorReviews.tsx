import { memo, useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, PaperStatus, Paper } from "@/context/JMRHContext";
import { supabase } from "@/integrations/supabase/client";
import {
    BookOpen, CheckCircle, Clock, FileText, Send, AlertCircle,
    MessageSquare, Search, Download, Eye, RefreshCw, ArrowRight,
    Calendar, User, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
    DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const statusColors: Record<string, string> = {
    SUBMITTED: "bg-orange-100 text-orange-700",
    UNDER_REVIEW: "bg-blue-100 text-blue-700",
    REVISION_REQUIRED: "bg-yellow-100 text-yellow-700",
    ACCEPTED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-red-100 text-red-700",
    PUBLISHED: "bg-green-100 text-green-700",
};

const ProfessorReviews = memo(() => {
    const { papers, currentUser, updatePaperStatus, refreshData } = useJMRH();
    const [reviewComments, setReviewComments] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
    const { toast } = useToast();

    const assignedPapers = useMemo(() =>
        papers.filter(p => p.assignedProfessorId === currentUser?.id), [papers, currentUser]);

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
            const { data } = await supabase.storage.from('papers').createSignedUrl(paper.attachments[0], 3600);
            if (data?.signedUrl) { window.open(data.signedUrl, '_blank'); return; }
        }
        toast({ title: "No File", description: "No downloadable manuscript found.", variant: "destructive" });
    };

    const displayPapers = activeTab === "pending" ? pendingReviews : completedReviews;

    return (
        <DashboardLayout role="PROFESSOR">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-border">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Professor Portal</p>
                        <h1 className="text-3xl font-serif font-bold text-foreground">My Reviews</h1>
                        <p className="text-sm text-muted-foreground">
                            {assignedPapers.length} assigned • {pendingReviews.length} pending
                        </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => refreshData()} className="gap-2">
                        <RefreshCw size={14} /> Refresh
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Clock size={16} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-foreground">{pendingReviews.length}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Pending</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <CheckCircle size={16} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-foreground">{completedReviews.length}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Completed</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                                <BookOpen size={16} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-foreground">
                                    {assignedPapers.filter(p => p.status === 'ACCEPTED' || p.status === 'PUBLISHED').length}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Accepted</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
                                <XCircle size={16} className="text-red-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-foreground">
                                    {assignedPapers.filter(p => p.status === 'REJECTED').length}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Rejected</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs + Search */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex gap-1 border-b border-border sm:border-none">
                        <button onClick={() => setActiveTab("pending")}
                            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 sm:border-b-0 sm:rounded-lg transition-colors ${
                                activeTab === "pending" 
                                    ? "border-accent text-foreground sm:bg-accent sm:text-accent-foreground" 
                                    : "border-transparent text-muted-foreground hover:text-foreground sm:hover:bg-muted"
                            }`}>
                            Pending ({pendingReviews.length})
                        </button>
                        <button onClick={() => setActiveTab("completed")}
                            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 sm:border-b-0 sm:rounded-lg transition-colors ${
                                activeTab === "completed" 
                                    ? "border-accent text-foreground sm:bg-accent sm:text-accent-foreground" 
                                    : "border-transparent text-muted-foreground hover:text-foreground sm:hover:bg-muted"
                            }`}>
                            Completed ({completedReviews.length})
                        </button>
                    </div>
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search papers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 h-11" />
                    </div>
                </div>

                {/* Paper List */}
                <div className="space-y-3">
                    <AnimatePresence>
                        {displayPapers.map((paper) => (
                            <motion.div key={paper.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="bg-card border border-border rounded-lg p-4 sm:p-5 hover:border-accent/30 transition-all">
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge className={`text-[9px] uppercase tracking-widest ${statusColors[paper.status]}`}>{paper.status.replace('_', ' ')}</Badge>
                                            <span className="text-[10px] text-muted-foreground">{paper.discipline}</span>
                                        </div>
                                        <h3 className="font-serif font-bold text-foreground text-lg leading-tight">{paper.title}</h3>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><User size={12} /> {paper.authorName}</span>
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {paper.submissionDate}</span>
                                            {paper.attachments?.length ? (
                                                <span className="flex items-center gap-1"><FileText size={12} /> {paper.attachments.length} file(s)</span>
                                            ) : null}
                                        </div>
                                        {paper.revisionComments && (
                                            <div className="bg-muted/50 p-3 rounded text-xs text-muted-foreground italic border-l-2 border-accent mt-2">
                                                "{paper.revisionComments}"
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2 shrink-0">
                                        {paper.attachments?.length ? (
                                            <Button variant="outline" size="sm" className="gap-1" onClick={() => handleDownload(paper)}>
                                                <Download size={14} /> Download
                                            </Button>
                                        ) : null}

                                        {(paper.status === 'SUBMITTED' || paper.status === 'UNDER_REVIEW') && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" className="gap-1 bg-accent text-accent-foreground">
                                                        <Send size={14} /> Submit Review
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-lg">
                                                    <DialogHeader>
                                                        <DialogTitle className="font-serif">Review: {paper.title}</DialogTitle>
                                                        <DialogDescription>by {paper.authorName}</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 pt-2">
                                                        <div className="bg-muted/50 p-3 rounded text-xs">
                                                            <p className="font-bold text-foreground mb-1">Abstract</p>
                                                            <p className="text-muted-foreground line-clamp-4">{paper.abstract}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold uppercase text-muted-foreground">Review Comments *</label>
                                                            <Textarea
                                                                value={reviewComments}
                                                                onChange={(e) => setReviewComments(e.target.value)}
                                                                placeholder="Provide detailed feedback on methodology, findings, and recommendations..."
                                                                className="h-32 mt-1"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <Button onClick={() => handleSubmitReview(paper.id, 'ACCEPTED')} className="bg-green-600 hover:bg-green-700 text-white text-xs">
                                                                <CheckCircle size={14} className="mr-1" /> Accept
                                                            </Button>
                                                            <Button onClick={() => handleSubmitReview(paper.id, 'REVISION_REQUIRED')} className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                                                                <AlertCircle size={14} className="mr-1" /> Revision
                                                            </Button>
                                                            <Button onClick={() => handleSubmitReview(paper.id, 'REJECTED')} variant="destructive" className="text-xs">
                                                                <XCircle size={14} className="mr-1" /> Reject
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {displayPapers.length === 0 && (
                        <div className="py-16 text-center border-2 border-dashed border-border rounded-lg">
                            <FileText size={48} className="text-muted-foreground/20 mx-auto mb-4" />
                            <p className="font-serif italic text-muted-foreground text-lg">
                                {activeTab === "pending" ? "No pending reviews" : "No completed reviews yet"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {activeTab === "pending" ? "You're all caught up!" : "Reviews will appear here after you submit them."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
});

export default ProfessorReviews;
