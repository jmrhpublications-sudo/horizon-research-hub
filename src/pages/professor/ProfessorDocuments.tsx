import { memo, useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, Document } from "@/context/JMRHContext";
import {
    FileText, Download, Eye, Search, Clock, CheckCircle, XCircle, RefreshCw,
    User, Calendar, FolderOpen, Trash2, FileIcon, Send, GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const statusColors: Record<string, string> = {
    PENDING: "bg-orange-100 text-orange-700 border-orange-200",
    UNDER_REVIEW: "bg-blue-100 text-blue-700 border-blue-200",
    APPROVED: "bg-green-100 text-green-700 border-green-200",
    REJECTED: "bg-red-100 text-red-700 border-red-200",
    ARCHIVED: "bg-gray-100 text-gray-700 border-gray-200",
};

const documentTypeLabels: Record<string, string> = {
    MANUSCRIPT: "Manuscript",
    JOURNAL: "Journal Article",
    BOOK: "Book Publication",
    REVIEW: "Review Document",
};

const ProfessorDocuments = memo(() => {
    const { documents, currentUser, getDocumentUrl, submitDocumentReview, updateDocumentStatus, refreshData } = useJMRH();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"uploaded" | "review">("uploaded");
    const [viewDoc, setViewDoc] = useState<Document | null>(null);
    const [reviewNotes, setReviewNotes] = useState("");
    const { toast } = useToast();

    // Professor's own uploaded documents (journals/books they submitted)
    const myUploads = useMemo(() => 
        documents.filter(d => d.uploaderId === currentUser?.id), 
        [documents, currentUser]
    );

    // Documents assigned to this professor for review
    const myReviews = useMemo(() => 
        documents.filter(d => d.reviewerId === currentUser?.id), 
        [documents, currentUser]
    );

    const filteredUploads = useMemo(() => 
        myUploads.filter(d =>
            d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.fileName.toLowerCase().includes(searchTerm.toLowerCase())
        ), [myUploads, searchTerm]
    );

    const filteredReviews = useMemo(() => 
        myReviews.filter(d =>
            d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.uploaderName.toLowerCase().includes(searchTerm.toLowerCase())
        ), [myReviews, searchTerm]
    );

    const handleDownload = async (doc: Document) => {
        const url = await getDocumentUrl(doc.id);
        if (url) {
            window.open(url, '_blank');
        } else {
            toast({ title: "Error", description: "Could not generate download link", variant: "destructive" });
        }
    };

    const handleSubmitReview = async (docId: string, decision: Document['reviewDecision']) => {
        if (!reviewNotes.trim()) {
            toast({ title: "Feedback Required", description: "Please provide review notes", variant: "destructive" });
            return;
        }
        try {
            await submitDocumentReview(docId, decision, reviewNotes);
            setViewDoc(null);
            setReviewNotes("");
            toast({ title: "Review Submitted", description: `Decision: ${decision}` });
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const stats = {
        uploads: {
            total: myUploads.length,
            pending: myUploads.filter(d => d.status === 'PENDING').length,
            approved: myUploads.filter(d => d.status === 'APPROVED' || d.status === 'ARCHIVED').length,
        },
        reviews: {
            total: myReviews.length,
            pending: myReviews.filter(d => d.status === 'UNDER_REVIEW').length,
            completed: myReviews.filter(d => d.status !== 'UNDER_REVIEW').length,
        }
    };

    return (
        <DashboardLayout role="PROFESSOR">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-border">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Professor Portal</p>
                        <h1 className="text-3xl font-serif font-bold text-foreground">My Documents</h1>
                        <p className="text-sm text-muted-foreground">Manage your uploads and review assignments</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => refreshData()} className="gap-2">
                        <RefreshCw size={14} /> Refresh
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-border">
                    <button
                        onClick={() => setActiveTab("uploaded")}
                        className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === "uploaded" ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                    >
                        My Uploads ({stats.uploads.total})
                    </button>
                    <button
                        onClick={() => setActiveTab("review")}
                        className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === "review" ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                    >
                        Assigned for Review ({stats.reviews.total})
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={activeTab === "uploaded" ? "Search your uploads..." : "Search assigned documents..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-11"
                    />
                </div>

                {/* My Uploads Tab */}
                {activeTab === "uploaded" && (
                    <div className="space-y-4">
                        {filteredUploads.length > 0 ? (
                            filteredUploads.map((doc) => (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-card border border-border rounded-lg p-4 hover:border-accent/30 transition-all"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className={`text-[9px] uppercase ${statusColors[doc.status]}`}>
                                                    {doc.status.replace('_', ' ')}
                                                </Badge>
                                                <Badge variant="secondary" className="text-[9px] uppercase">
                                                    {documentTypeLabels[doc.documentType]}
                                                </Badge>
                                            </div>
                                            <h3 className="font-semibold text-foreground truncate">{doc.title}</h3>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1">
                                                    <FileIcon size={12} /> {doc.fileName}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} /> {new Date(doc.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1"
                                                onClick={() => handleDownload(doc)}
                                            >
                                                <Download size={14} /> Download
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1"
                                                onClick={() => setViewDoc(doc)}
                                            >
                                                <Eye size={14} /> Details
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-border rounded-lg">
                                <FolderOpen size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                                <p className="font-serif text-lg text-muted-foreground">No uploads found</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {myUploads.length === 0 ? 'Submit journals or books from your dashboard' : 'No uploads match your search'}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Assigned for Review Tab */}
                {activeTab === "review" && (
                    <div className="space-y-4">
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((doc) => (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-card border border-border rounded-lg p-4 hover:border-accent/30 transition-all"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className={`text-[9px] uppercase ${statusColors[doc.status]}`}>
                                                    {doc.status.replace('_', ' ')}
                                                </Badge>
                                                <Badge variant="secondary" className="text-[9px] uppercase">
                                                    {documentTypeLabels[doc.documentType]}
                                                </Badge>
                                            </div>
                                            <h3 className="font-semibold text-foreground truncate">{doc.title}</h3>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1">
                                                    <User size={12} /> By: {doc.uploaderName}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FileIcon size={12} /> {doc.fileName}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} /> {new Date(doc.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1"
                                                onClick={() => handleDownload(doc)}
                                            >
                                                <Download size={14} /> Download
                                            </Button>
                                            {doc.status === 'UNDER_REVIEW' && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            className="gap-1 bg-accent text-accent-foreground"
                                                            onClick={() => setViewDoc(doc)}
                                                        >
                                                            <Send size={14} /> Review
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Submit Review</DialogTitle>
                                                            <DialogDescription>for: {doc.title}</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4 pt-2">
                                                            <div>
                                                                <label className="text-xs font-bold uppercase text-muted-foreground">Review Notes</label>
                                                                <Textarea
                                                                    value={reviewNotes}
                                                                    onChange={(e) => setReviewNotes(e.target.value)}
                                                                    placeholder="Provide detailed feedback..."
                                                                    className="h-32 mt-1"
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                <Button
                                                                    onClick={() => handleSubmitReview(doc.id, 'ACCEPT')}
                                                                    className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                                                >
                                                                    <CheckCircle size={14} className="mr-1" /> Accept
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleSubmitReview(doc.id, 'REVISION_REQUIRED')}
                                                                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs"
                                                                >
                                                                    <RefreshCw size={14} className="mr-1" /> Revision
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleSubmitReview(doc.id, 'REJECTED')}
                                                                    variant="destructive"
                                                                    className="text-xs"
                                                                >
                                                                    <XCircle size={14} className="mr-1" /> Reject
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                            {doc.status === 'APPROVED' && (
                                                <Badge variant="outline" className="text-green-600">
                                                    <CheckCircle size={12} className="mr-1" /> Approved
                                                </Badge>
                                            )}
                                            {doc.status === 'REJECTED' && (
                                                <Badge variant="outline" className="text-red-600">
                                                    <XCircle size={12} className="mr-1" /> Rejected
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    {doc.reviewNotes && (
                                        <div className="mt-3 pt-3 border-t border-border">
                                            <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Review Notes</p>
                                            <p className="text-sm text-foreground bg-muted p-3 rounded">{doc.reviewNotes}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-border rounded-lg">
                                <GraduationCap size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                                <p className="font-serif text-lg text-muted-foreground">No documents assigned for review</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Admin will assign documents to you here
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Details Dialog */}
                <Dialog open={!!viewDoc} onOpenChange={(open) => !open && setViewDoc(null)}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{viewDoc?.title}</DialogTitle>
                        </DialogHeader>
                        {viewDoc && (
                            <div className="space-y-4 py-4">
                                <div className="flex gap-2">
                                    <Badge variant="outline" className={statusColors[viewDoc.status]}>
                                        {viewDoc.status.replace('_', ' ')}
                                    </Badge>
                                    <Badge variant="secondary">
                                        {documentTypeLabels[viewDoc.documentType]}
                                    </Badge>
                                </div>

                                {viewDoc.description && (
                                    <div>
                                        <p className="text-xs font-bold uppercase text-muted-foreground">Description</p>
                                        <p className="text-sm mt-1">{viewDoc.description}</p>
                                    </div>
                                )}

                                <div className="bg-muted p-3 rounded space-y-2">
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-bold">File:</span> {viewDoc.fileName}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-bold">Uploaded:</span> {new Date(viewDoc.createdAt).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-bold">Role:</span> {viewDoc.uploaderRole}
                                    </div>
                                </div>

                                {viewDoc.reviewNotes && (
                                    <div>
                                        <p className="text-xs font-bold uppercase text-muted-foreground">Review Notes</p>
                                        <p className="text-sm bg-muted p-3 rounded mt-1">{viewDoc.reviewNotes}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => viewDoc && handleDownload(viewDoc)} className="gap-2">
                                <Download size={14} /> Download
                            </Button>
                            <Button variant="outline" onClick={() => setViewDoc(null)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
});

export default ProfessorDocuments;