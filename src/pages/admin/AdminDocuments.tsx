import { memo, useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, Document, User } from "@/context/JMRHContext";
import {
    FileText, Upload, Download, Eye, Trash2, Search, Clock, CheckCircle, XCircle,
    User as UserIcon, Calendar, FolderOpen, Plus, X, FileIcon, RefreshCw, ExternalLink,
    GraduationCap, Send, Archive, Filter
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

const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700",
    PROFESSOR: "bg-blue-100 text-blue-700",
    USER: "bg-gray-100 text-gray-700",
};

const AdminDocuments = memo(() => {
    const { documents, users, currentUser, getDocumentUrl, assignReviewer, submitDocumentReview, updateDocumentStatus, deleteDocument, archiveDocument, refreshData } = useJMRH();
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("ALL");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [roleFilter, setRoleFilter] = useState<string>("ALL");
    const [inspectDoc, setInspectDoc] = useState<Document | null>(null);
    const [assignDialogDoc, setAssignDialogDoc] = useState<Document | null>(null);
    const [reviewDialogDoc, setReviewDialogDoc] = useState<Document | null>(null);
    const [reviewNotes, setReviewNotes] = useState("");
    const { toast } = useToast();

    const professors = useMemo(() => users.filter(u => u.role === 'PROFESSOR'), [users]);

    const filteredDocs = useMemo(() => {
        return documents.filter(doc => {
            const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.uploaderName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === "ALL" || doc.documentType === typeFilter;
            const matchesStatus = statusFilter === "ALL" || doc.status === statusFilter;
            const matchesRole = roleFilter === "ALL" || doc.uploaderRole === roleFilter;
            return matchesSearch && matchesType && matchesStatus && matchesRole;
        });
    }, [documents, searchTerm, typeFilter, statusFilter, roleFilter]);

    const stats = useMemo(() => ({
        total: documents.length,
        pending: documents.filter(d => d.status === 'PENDING').length,
        underReview: documents.filter(d => d.status === 'UNDER_REVIEW').length,
        approved: documents.filter(d => d.status === 'APPROVED').length,
        archived: documents.filter(d => d.status === 'ARCHIVED').length,
    }), [documents]);

    const handleDownload = async (doc: Document) => {
        const url = await getDocumentUrl(doc.id);
        if (url) {
            window.open(url, '_blank');
        } else {
            toast({ title: "Error", description: "Could not generate download link", variant: "destructive" });
        }
    };

    const handleAssign = async (documentId: string, professorId: string, professorName: string) => {
        try {
            await assignReviewer(documentId, professorId, professorName);
            setAssignDialogDoc(null);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const handleReview = async (documentId: string, decision: Document['reviewDecision']) => {
        if (!reviewNotes.trim()) {
            toast({ title: "Notes Required", description: "Please provide review notes", variant: "destructive" });
            return;
        }
        try {
            await submitDocumentReview(documentId, decision, reviewNotes);
            setReviewDialogDoc(null);
            setReviewNotes("");
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const handleStatusChange = async (documentId: string, status: Document['status']) => {
        try {
            await updateDocumentStatus(documentId, status);
            setInspectDoc(null);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const handleArchive = async (documentId: string) => {
        try {
            await archiveDocument(documentId);
            setInspectDoc(null);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const handleDelete = async (documentId: string) => {
        try {
            await deleteDocument(documentId);
            setInspectDoc(null);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-border">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Document Management</p>
                        <h1 className="text-3xl font-serif font-bold text-foreground">Document Repository</h1>
                        <p className="text-sm text-muted-foreground">{documents.length} total documents</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => refreshData()} className="gap-2">
                        <RefreshCw size={14} /> Refresh
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText size={18} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                                <p className="text-xs text-muted-foreground">Total</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Clock size={18} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                                <p className="text-xs text-muted-foreground">Pending</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Eye size={18} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.underReview}</p>
                                <p className="text-xs text-muted-foreground">Under Review</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle size={18} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
                                <p className="text-xs text-muted-foreground">Approved</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Archive size={18} className="text-gray-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.archived}</p>
                                <p className="text-xs text-muted-foreground">Archived</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col lg:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search documents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-11"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="h-11 px-3 rounded-lg border border-border bg-card text-sm"
                        >
                            <option value="ALL">All Types</option>
                            <option value="MANUSCRIPT">Manuscript</option>
                            <option value="JOURNAL">Journal</option>
                            <option value="BOOK">Book</option>
                            <option value="REVIEW">Review</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-11 px-3 rounded-lg border border-border bg-card text-sm"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="UNDER_REVIEW">Under Review</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="h-11 px-3 rounded-lg border border-border bg-card text-sm"
                        >
                            <option value="ALL">All Roles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="PROFESSOR">Professor</option>
                            <option value="USER">User</option>
                        </select>
                    </div>
                </div>

                {/* Documents List */}
                <div className="space-y-3">
                    <AnimatePresence>
                        {filteredDocs.length > 0 ? (
                            filteredDocs.map((doc) => (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-card border border-border rounded-lg p-4 hover:border-accent/30 transition-all"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <Badge variant="outline" className={`text-[9px] uppercase ${statusColors[doc.status]}`}>
                                                    {doc.status.replace('_', ' ')}
                                                </Badge>
                                                <Badge variant="secondary" className="text-[9px] uppercase">
                                                    {documentTypeLabels[doc.documentType]}
                                                </Badge>
                                                <Badge variant="outline" className={`text-[9px] uppercase ${roleColors[doc.uploaderRole]}`}>
                                                    {doc.uploaderRole}
                                                </Badge>
                                            </div>
                                            <h3 className="font-semibold text-foreground truncate">{doc.title}</h3>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <UserIcon size={12} /> {doc.uploaderName}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FileIcon size={12} /> {doc.fileName}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} /> {new Date(doc.createdAt).toLocaleDateString()}
                                                </span>
                                                {doc.reviewerName && (
                                                    <span className="flex items-center gap-1">
                                                        <GraduationCap size={12} /> Reviewer: {doc.reviewerName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1"
                                                onClick={() => setInspectDoc(doc)}
                                            >
                                                <Eye size={14} /> Inspect
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1"
                                                onClick={() => handleDownload(doc)}
                                            >
                                                <Download size={14} />
                                            </Button>
                                            {doc.status === 'PENDING' && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            className="gap-1 bg-accent text-accent-foreground"
                                                            onClick={() => setAssignDialogDoc(doc)}
                                                        >
                                                            <GraduationCap size={14} /> Assign
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Assign Reviewer</DialogTitle>
                                                            <DialogDescription>Select a professor to review this document</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-2 pt-2">
                                                            {professors.length > 0 ? (
                                                                professors.map((prof) => (
                                                                    <button
                                                                        key={prof.id}
                                                                        onClick={() => handleAssign(doc.id, prof.id, prof.name)}
                                                                        className="w-full p-3 bg-muted border border-border hover:border-accent hover:bg-accent/5 transition-all text-left flex items-center gap-3 rounded-lg"
                                                                    >
                                                                        <GraduationCap size={16} className="text-accent" />
                                                                        <div>
                                                                            <p className="text-sm font-bold">{prof.name}</p>
                                                                            <p className="text-[10px] text-muted-foreground">{prof.email}</p>
                                                                        </div>
                                                                    </button>
                                                                ))
                                                            ) : (
                                                                <p className="text-sm text-muted-foreground text-center py-4">No professors available</p>
                                                            )}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                            {(doc.status === 'UNDER_REVIEW' || doc.reviewerId === currentUser?.id) && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            className="gap-1 bg-green-600 hover:bg-green-700"
                                                            onClick={() => { setReviewDialogDoc(doc); setReviewNotes(doc.reviewNotes || ""); }}
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
                                                                    placeholder="Provide feedback and notes..."
                                                                    className="h-32 mt-1"
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                <Button
                                                                    onClick={() => handleReview(doc.id, 'ACCEPT')}
                                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                                >
                                                                    <CheckCircle size={14} className="mr-1" /> Accept
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleReview(doc.id, 'REVISION_REQUIRED')}
                                                                    className="bg-orange-500 hover:bg-orange-600 text-white"
                                                                >
                                                                    <RefreshCw size={14} className="mr-1" /> Revision
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleReview(doc.id, 'REJECTED')}
                                                                    variant="destructive"
                                                                >
                                                                    <XCircle size={14} className="mr-1" /> Reject
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="gap-1 text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground">
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently delete "{doc.title}". This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(doc.id)} className="bg-destructive">Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                    {doc.reviewNotes && (
                                        <div className="mt-3 pt-3 border-t border-border">
                                            <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Latest Review Notes</p>
                                            <p className="text-sm text-foreground bg-muted p-3 rounded">{doc.reviewNotes}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-border rounded-lg">
                                <FileText size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                                <p className="font-serif text-lg text-muted-foreground">No documents found</p>
                                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Inspect Dialog */}
                <Dialog open={!!inspectDoc} onOpenChange={(open) => !open && setInspectDoc(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className={statusColors[inspectDoc?.status || 'PENDING']}>
                                    {inspectDoc?.status.replace('_', ' ')}
                                </Badge>
                                <Badge variant="secondary">
                                    {inspectDoc && documentTypeLabels[inspectDoc.documentType]}
                                </Badge>
                            </div>
                            <DialogTitle>{inspectDoc?.title}</DialogTitle>
                            <DialogDescription className="text-xs">
                                Uploaded by {inspectDoc?.uploaderName} ({inspectDoc?.uploaderRole}) on {inspectDoc && new Date(inspectDoc.createdAt).toLocaleDateString()}
                            </DialogDescription>
                        </DialogHeader>
                        {inspectDoc && (
                            <div className="space-y-4 py-4">
                                <div className="bg-muted p-4 rounded-lg space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">File Name:</span>
                                        <span className="font-medium">{inspectDoc.fileName}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">File Type:</span>
                                        <span className="font-medium">{inspectDoc.fileType.toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">File Size:</span>
                                        <span className="font-medium">{inspectDoc.fileSize ? `${(inspectDoc.fileSize / 1024).toFixed(1)} KB` : 'N/A'}</span>
                                    </div>
                                    {inspectDoc.description && (
                                        <div className="pt-2 border-t border-border">
                                            <span className="text-muted-foreground text-sm">Description:</span>
                                            <p className="mt-1">{inspectDoc.description}</p>
                                        </div>
                                    )}
                                </div>

                                {inspectDoc.reviewerName && (
                                    <div className="bg-muted p-4 rounded-lg">
                                        <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Review Information</p>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Reviewer:</span>
                                            <span className="font-medium">{inspectDoc.reviewerName}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Decision:</span>
                                            <Badge variant="outline" className={statusColors[inspectDoc.status]}>
                                                {inspectDoc.reviewDecision?.replace('_', ' ') || 'Pending'}
                                            </Badge>
                                        </div>
                                    </div>
                                )}

                                {inspectDoc.reviewNotes && (
                                    <div>
                                        <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Review Notes</p>
                                        <p className="text-sm bg-muted p-4 rounded-lg">{inspectDoc.reviewNotes}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => handleDownload(inspectDoc!)} className="gap-2">
                                <Download size={14} /> Download
                            </Button>
                            {inspectDoc?.status === 'APPROVED' && (
                                <Button variant="outline" onClick={() => handleArchive(inspectDoc.id)} className="gap-2">
                                    <Archive size={14} /> Archive
                                </Button>
                            )}
                            {inspectDoc?.status !== 'ARCHIVED' && (
                                <>
                                    <Button variant="outline" onClick={() => handleStatusChange(inspectDoc.id, 'APPROVED')} className="gap-2 text-green-600">
                                        <CheckCircle size={14} /> Approve
                                    </Button>
                                    <Button variant="outline" onClick={() => handleStatusChange(inspectDoc.id, 'REJECTED')} className="gap-2 text-red-600">
                                        <XCircle size={14} /> Reject
                                    </Button>
                                </>
                            )}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="gap-2">
                                        <Trash2 size={14} /> Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete this document. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(inspectDoc!.id)} className="bg-destructive">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
});

export default AdminDocuments;