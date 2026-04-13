import { memo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, Document } from "@/context/JMRHContext";
import {
    FileText, Upload, Download, Eye, Trash2, Search, Clock, CheckCircle, XCircle, AlertCircle,
    User, Calendar, FolderOpen, Plus, X, FileIcon, RefreshCw, ExternalLink
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

const MyDocumentsPage = memo(() => {
    const { documents, currentUser, uploadDocument, getDocumentUrl, deleteDocument, refreshData } = useJMRH();
    const [searchTerm, setSearchTerm] = useState("");
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadDescription, setUploadDescription] = useState("");
    const [uploadType, setUploadType] = useState<Document['documentType']>("MANUSCRIPT");
    const [isUploading, setIsUploading] = useState(false);
    const [viewingDoc, setViewingDoc] = useState<Document | null>(null);
    const { toast } = useToast();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const myDocuments = documents.filter(d => d.uploaderId === currentUser?.id);

    const filteredDocs = myDocuments.filter(d =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const ext = file.name.split('.').pop()?.toLowerCase();
            if (!['doc', 'docx'].includes(ext || '')) {
                toast({ title: "Invalid File", description: "Only .doc and .docx files allowed", variant: "destructive" });
                return;
            }
            if (file.size > 20 * 1024 * 1024) {
                toast({ title: "File Too Large", description: "Maximum 20MB allowed", variant: "destructive" });
                return;
            }
            setSelectedFile(file);
            if (!uploadTitle) {
                setUploadTitle(file.name.replace(/\.(doc|docx)$/i, ''));
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !uploadTitle.trim()) {
            toast({ title: "Error", description: "Please select file and provide title", variant: "destructive" });
            return;
        }

        setIsUploading(true);
        try {
            const result = await uploadDocument(selectedFile, uploadTitle, uploadType, uploadDescription);
            
            if (result.isDuplicate && result.duplicateOf) {
                toast({ 
                    title: "Duplicate Detected", 
                    description: `This file was already uploaded by ${result.duplicateOf.uploaderName}`,
                    variant: "destructive"
                });
                return;
            }

            if (!result.success) {
                toast({ title: "Upload Failed", description: result.error, variant: "destructive" });
                return;
            }

            setIsUploadOpen(false);
            setSelectedFile(null);
            setUploadTitle("");
            setUploadDescription("");
            setUploadType("MANUSCRIPT");
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownload = async (doc: Document) => {
        const url = await getDocumentUrl(doc.id);
        if (url) {
            window.open(url, '_blank');
        } else {
            toast({ title: "Error", description: "Could not generate download link", variant: "destructive" });
        }
    };

    const handleDelete = async (docId: string) => {
        try {
            await deleteDocument(docId);
            setViewingDoc(null);
        } catch (err: any) {
            toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
        }
    };

    const stats = {
        total: myDocuments.length,
        pending: myDocuments.filter(d => d.status === 'PENDING').length,
        underReview: myDocuments.filter(d => d.status === 'UNDER_REVIEW').length,
        approved: myDocuments.filter(d => d.status === 'APPROVED' || d.status === 'ARCHIVED').length,
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-border">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">My Documents</p>
                        <h1 className="text-3xl font-serif font-bold text-foreground">Document Center</h1>
                        <p className="text-sm text-muted-foreground">Manage your submitted documents</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => refreshData()} className="gap-2">
                            <RefreshCw size={14} /> Refresh
                        </Button>
                        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-2 bg-accent text-accent-foreground">
                                    <Plus size={14} /> Upload Document
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Upload Document</DialogTitle>
                                    <DialogDescription>Upload a .doc or .docx file to the system</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Select File *</label>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".doc,.docx"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`mt-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                                                selectedFile ? 'border-green-400 bg-green-50' : 'border-border hover:border-accent'
                                            }`}
                                        >
                                            {selectedFile ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <FileText className="w-5 h-5 text-green-600" />
                                                    <span className="text-sm font-medium">{selectedFile.name}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                                        className="ml-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">Click to select .doc or .docx file</p>
                                                    <p className="text-xs text-muted-foreground">Max 20MB</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Document Title *</label>
                                        <Input
                                            value={uploadTitle}
                                            onChange={(e) => setUploadTitle(e.target.value)}
                                            placeholder="Enter document title"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Document Type</label>
                                        <div className="flex gap-2 mt-1">
                                            {(['MANUSCRIPT', 'JOURNAL', 'BOOK', 'REVIEW'] as const).map((type) => (
                                                <Button
                                                    key={type}
                                                    variant={uploadType === type ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setUploadType(type)}
                                                    className="text-xs"
                                                >
                                                    {documentTypeLabels[type]}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Description</label>
                                        <Textarea
                                            value={uploadDescription}
                                            onChange={(e) => setUploadDescription(e.target.value)}
                                            placeholder="Optional description..."
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                                    <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
                                        {isUploading ? 'Uploading...' : 'Upload Document'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                </div>

                {/* Search */}
                <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-11"
                    />
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
                                                {doc.reviewerName && (
                                                    <span className="flex items-center gap-1">
                                                        <User size={12} /> Reviewer: {doc.reviewerName}
                                                    </span>
                                                )}
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
                                                onClick={() => setViewingDoc(doc)}
                                            >
                                                <Eye size={14} /> Details
                                            </Button>
                                            {doc.status === 'PENDING' && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="gap-1 text-destructive border-destructive/20">
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
                                                            <AlertDialogAction onClick={() => handleDelete(doc.id)} className="bg-destructive">
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
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
                                <FileText size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                                <p className="font-serif text-lg text-muted-foreground">No documents found</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {myDocuments.length === 0 ? 'Upload your first document to get started' : 'No documents match your search'}
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* View Details Dialog */}
                <Dialog open={!!viewingDoc} onOpenChange={(open) => !open && setViewingDoc(null)}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{viewingDoc?.title}</DialogTitle>
                        </DialogHeader>
                        {viewingDoc && (
                            <div className="space-y-4 py-4">
                                <div className="flex gap-2">
                                    <Badge variant="outline" className={statusColors[viewingDoc.status]}>
                                        {viewingDoc.status.replace('_', ' ')}
                                    </Badge>
                                    <Badge variant="secondary">
                                        {documentTypeLabels[viewingDoc.documentType]}
                                    </Badge>
                                </div>

                                {viewingDoc.description && (
                                    <div>
                                        <p className="text-xs font-bold uppercase text-muted-foreground">Description</p>
                                        <p className="text-sm mt-1">{viewingDoc.description}</p>
                                    </div>
                                )}

                                <div className="bg-muted p-3 rounded space-y-2">
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-bold">File:</span> {viewingDoc.fileName}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-bold">Uploaded:</span> {new Date(viewingDoc.createdAt).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-bold">Role:</span> {viewingDoc.uploaderRole}
                                    </div>
                                    {viewingDoc.reviewerName && (
                                        <div className="text-xs text-muted-foreground">
                                            <span className="font-bold">Reviewer:</span> {viewingDoc.reviewerName}
                                        </div>
                                    )}
                                </div>

                                {viewingDoc.reviewNotes && (
                                    <div>
                                        <p className="text-xs font-bold uppercase text-muted-foreground">Review Notes</p>
                                        <p className="text-sm bg-muted p-3 rounded mt-1">{viewingDoc.reviewNotes}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => viewingDoc && handleDownload(viewingDoc)} className="gap-2">
                                <Download size={14} /> Download
                            </Button>
                            <Button variant="outline" onClick={() => setViewingDoc(null)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
});

export default MyDocumentsPage;