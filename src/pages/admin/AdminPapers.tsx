import { useState, memo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, Paper } from "@/context/JMRHContext";
import {
    BookOpen, CheckCircle, Clock, User as UserIcon, Search, Filter,
    GraduationCap, ArrowRight, Eye, Download, Trash2, X, Mail, Phone,
    MapPin, FileText, Calendar, AlertTriangle, Building2, Globe, PenLine, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import JSZip from "jszip";
import { parseDriveAttachment, DriveFileInfo } from "@/lib/google-drive";

const isDriveAttachment = (attachment: string): boolean => {
    try {
        const parsed = JSON.parse(attachment);
        return !!(parsed.id && (parsed.viewLink || parsed.downloadLink));
    } catch {
        return false;
    }
};

const parseAttachment = (attachment: string): { type: 'supabase' | 'drive'; data: string | DriveFileInfo } => {
    const driveInfo = parseDriveAttachment(attachment);
    if (driveInfo) {
        return { type: 'drive', data: driveInfo };
    }
    return { type: 'supabase', data: attachment };
};

const statusColors: Record<string, string> = {
    SUBMITTED: "bg-orange-100 text-orange-700 border-orange-200",
    UNDER_REVIEW: "bg-blue-100 text-blue-700 border-blue-200",
    REVISION_REQUIRED: "bg-yellow-100 text-yellow-700 border-yellow-200",
    ACCEPTED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    REJECTED: "bg-red-100 text-red-700 border-red-200",
    PUBLISHED: "bg-green-100 text-green-700 border-green-200",
    ARCHIVED: "bg-gray-100 text-gray-700 border-gray-200",
};

const AdminPapers = memo(() => {
    const { papers, users, assignPaper, updatePaperStatus, deletePaper } = useJMRH();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [inspectPaper, setInspectPaper] = useState<Paper | null>(null);
    const [downloading, setDownloading] = useState<string | null>(null);
    const { toast } = useToast();

    const professors = users.filter(u => u.role === 'PROFESSOR');

    const filteredPapers = papers.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.authorEmail || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statuses = ["ALL", "SUBMITTED", "UNDER_REVIEW", "ACCEPTED", "REJECTED", "PUBLISHED", "ARCHIVED"];

    const handleAssign = (paperId: string, professorId: string) => {
        const prof = professors.find(p => p.id === professorId);
        assignPaper(paperId, professorId, prof?.name || 'Unknown');
        toast({ title: "Manuscript Assigned", description: `Assigned to ${prof?.name}` });
    };

    const handleDelete = async (paperId: string) => {
        try {
            await deletePaper(paperId);
            setInspectPaper(null);
        } catch (err: any) {
            toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
        }
    };

    const handleDownloadZip = async (paper: Paper) => {
        setDownloading(paper.id);
        try {
            const zip = new JSZip();

            // Add submission details as a text file
            const details = [
                `JMRH Manuscript Submission Details`,
                `${'='.repeat(40)}`,
                ``,
                `Title: ${paper.title}`,
                `Paper Type: ${paper.paperType}`,
                `Manuscript Type: ${paper.manuscriptType || 'N/A'}`,
                `Discipline: ${paper.discipline}`,
                `Status: ${paper.status}`,
                `Submission Date: ${paper.submissionDate}`,
                ``,
                `--- AUTHOR INFORMATION ---`,
                `Name: ${paper.authorName}`,
                `Email: ${paper.authorEmail || 'N/A'}`,
                `Phone: ${paper.phone || 'N/A'}`,
                `Affiliation: ${paper.affiliation || 'N/A'}`,
                `Designation: ${paper.designation || 'N/A'}`,
                `ORCID: ${paper.orcid || 'N/A'}`,
                ``,
                `--- MANUSCRIPT DETAILS ---`,
                `Keywords: ${paper.keywords || 'N/A'}`,
                `Co-Authors: ${paper.coAuthors || 'N/A'}`,
                ``,
                `--- ABSTRACT ---`,
                paper.abstract,
                ``,
                `--- COVER LETTER ---`,
                paper.coverLetter || 'N/A',
                ``,
                `--- ADDITIONAL NOTES ---`,
                paper.additionalNotes || 'N/A',
                ``,
                `--- REVIEW ---`,
                `Assigned Professor: ${paper.assignedProfessorName || 'Not assigned'}`,
                `Revision Comments: ${paper.revisionComments || 'None'}`,
            ].join('\n');

            zip.file("submission-details.txt", details);

            // Download and add attachments
            if (paper.attachments && paper.attachments.length > 0) {
                const attachmentsFolder = zip.folder("attachments");
                for (const attachment of paper.attachments) {
                    const parsed = parseAttachment(attachment);
                    if (parsed.type === 'drive') {
                        const driveFile = parsed.data as DriveFileInfo;
                        if (driveFile.webContentLink) {
                            try {
                                const response = await fetch(driveFile.webContentLink);
                                const blob = await response.blob();
                                attachmentsFolder?.file(driveFile.name, blob);
                            } catch (err) {
                                console.warn(`Failed to download Drive file: ${driveFile.name}`, err);
                            }
                        }
                    } else {
                        const filePath = parsed.data as string;
                        try {
                            const { data, error } = await supabase.storage
                                .from('papers')
                                .download(filePath);
                            if (data && !error) {
                                const fileName = filePath.split('/').pop() || filePath;
                                attachmentsFolder?.file(fileName, data);
                            }
                        } catch (err) {
                            console.warn(`Failed to download attachment: ${filePath}`, err);
                        }
                    }
                }
            }

            const blob = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${paper.authorName.replace(/\s+/g, '_')}_${paper.title.substring(0, 30).replace(/\s+/g, '_')}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast({ title: "Download Complete", description: "ZIP file with all submission details and documents." });
        } catch (err: any) {
            toast({ title: "Download Failed", description: err.message, variant: "destructive" });
        } finally {
            setDownloading(null);
        }
    };

    const DetailRow = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) => {
        if (!value) return null;
        return (
            <div className="flex items-start gap-3 py-2">
                <Icon size={14} className="text-accent mt-0.5 shrink-0" />
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{label}</p>
                    <p className="text-sm text-foreground">{value}</p>
                </div>
            </div>
        );
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Editorial Vetting Desk</p>
                        <h1 className="text-4xl font-serif font-bold text-foreground leading-tight">Manuscript Repository</h1>
                        <p className="text-sm text-muted-foreground">{papers.length} total submissions</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search by title, author, email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 h-12" />
                    </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                    {statuses.map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border transition-all ${statusFilter === s ? 'bg-accent text-accent-foreground border-accent' : 'bg-card text-muted-foreground border-border hover:border-accent/30'}`}>
                            {s.replace('_', ' ')} {s !== "ALL" && `(${papers.filter(p => p.status === s).length})`}
                            {s === "ALL" && `(${papers.length})`}
                        </button>
                    ))}
                </div>

                {/* Papers List */}
                <div className="space-y-3">
                    <AnimatePresence>
                        {filteredPapers.map((paper) => (
                            <motion.div key={paper.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="p-5 bg-card border border-border group hover:border-accent/30 transition-all duration-300 hover:shadow-md">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                                    <div className="flex-1 space-y-2 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant="outline" className={`text-[9px] uppercase tracking-widest font-bold ${statusColors[paper.status] || ''}`}>
                                                {paper.status.replace('_', ' ')}
                                            </Badge>
                                            <Badge variant="outline" className="text-[9px] uppercase tracking-widest">{paper.paperType}</Badge>
                                            {paper.attachments && paper.attachments.length > 0 && (
                                                <Badge variant="secondary" className="text-[9px] gap-1">
                                                    {paper.attachments[0] && isDriveAttachment(paper.attachments[0]) ? (
                                                        <>
                                                            <ExternalLink size={10} /> {paper.attachments.length} file{paper.attachments.length > 1 ? 's' : ''}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FileText size={10} /> {paper.attachments.length} file{paper.attachments.length > 1 ? 's' : ''}
                                                        </>
                                                    )}
                                                </Badge>
                                            )}
                                        </div>
                                        <h3 className="font-serif text-lg font-bold text-foreground leading-tight truncate">{paper.title}</h3>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><UserIcon size={12} /> {paper.authorName}</span>
                                            {paper.authorEmail && <span className="flex items-center gap-1"><Mail size={12} /> {paper.authorEmail}</span>}
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {paper.submissionDate}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {/* Inspect */}
                                        <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => setInspectPaper(paper)}>
                                            <Eye size={14} /> Inspect
                                        </Button>

                                        {/* Download ZIP */}
                                        <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => handleDownloadZip(paper)} disabled={downloading === paper.id}>
                                            <Download size={14} /> {downloading === paper.id ? "..." : "ZIP"}
                                        </Button>

                                        {/* Assign */}
                                        {!paper.assignedProfessorId && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" className="gap-1 text-xs bg-accent text-accent-foreground hover:bg-foreground hover:text-background">
                                                        <GraduationCap size={14} /> Assign
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader><DialogTitle className="font-serif">Assign Reviewer</DialogTitle></DialogHeader>
                                                    <div className="space-y-2 pt-2">
                                                        {professors.map((prof) => (
                                                            <button key={prof.id} onClick={() => handleAssign(paper.id, prof.id)}
                                                                className="w-full p-3 bg-muted border border-border hover:border-accent hover:bg-accent/5 transition-all text-left flex items-center gap-3">
                                                                <GraduationCap size={16} className="text-accent" />
                                                                <div>
                                                                    <p className="text-sm font-bold">{prof.name}</p>
                                                                    <p className="text-[10px] text-muted-foreground">{prof.email}</p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                        {professors.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No professors available</p>}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )}

                                        {/* Delete */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="gap-1 text-xs text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground">
                                                    <Trash2 size={14} />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive" size={18} /> Delete Submission</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete "{paper.title}" by {paper.authorName}, including all uploaded documents. This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(paper.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                        Delete Permanently
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredPapers.length === 0 && (
                        <div className="py-24 text-center border-2 border-dashed border-border flex flex-col items-center justify-center space-y-4">
                            <BookOpen size={48} className="text-muted-foreground/30" />
                            <p className="font-serif italic text-muted-foreground text-xl">No manuscripts found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Inspect Dialog */}
            <Dialog open={!!inspectPaper} onOpenChange={(open) => !open && setInspectPaper(null)}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    {inspectPaper && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className={`text-[9px] uppercase tracking-widest font-bold ${statusColors[inspectPaper.status] || ''}`}>
                                        {inspectPaper.status.replace('_', ' ')}
                                    </Badge>
                                    <Badge variant="outline" className="text-[9px] uppercase">{inspectPaper.paperType}</Badge>
                                </div>
                                <DialogTitle className="font-serif text-xl leading-tight">{inspectPaper.title}</DialogTitle>
                                <DialogDescription className="text-xs">Submitted on {inspectPaper.submissionDate}</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 mt-4">
                                {/* Author Info */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Author Information</h4>
                                    <div className="bg-muted/50 p-4 rounded space-y-1 border border-border">
                                        <DetailRow icon={UserIcon} label="Name" value={inspectPaper.authorName} />
                                        <DetailRow icon={Mail} label="Email" value={inspectPaper.authorEmail} />
                                        <DetailRow icon={Phone} label="Phone" value={inspectPaper.phone} />
                                        <DetailRow icon={Building2} label="Affiliation" value={inspectPaper.affiliation} />
                                        <DetailRow icon={PenLine} label="Designation" value={inspectPaper.designation} />
                                        <DetailRow icon={Globe} label="ORCID" value={inspectPaper.orcid} />
                                    </div>
                                </div>

                                <Separator />

                                {/* Manuscript Details */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Manuscript Details</h4>
                                    <div className="bg-muted/50 p-4 rounded space-y-1 border border-border">
                                        <DetailRow icon={BookOpen} label="Manuscript Type" value={inspectPaper.manuscriptType} />
                                        <DetailRow icon={FileText} label="Discipline" value={inspectPaper.discipline} />
                                        <DetailRow icon={FileText} label="Keywords" value={inspectPaper.keywords} />
                                        <DetailRow icon={UserIcon} label="Co-Authors" value={inspectPaper.coAuthors} />
                                    </div>
                                </div>

                                <Separator />

                                {/* Abstract */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Abstract</h4>
                                    <p className="text-sm text-foreground leading-relaxed bg-muted/50 p-4 rounded border border-border whitespace-pre-wrap">{inspectPaper.abstract}</p>
                                </div>

                                {/* Cover Letter */}
                                {inspectPaper.coverLetter && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Cover Letter</h4>
                                            <p className="text-sm text-foreground leading-relaxed bg-muted/50 p-4 rounded border border-border whitespace-pre-wrap">{inspectPaper.coverLetter}</p>
                                        </div>
                                    </>
                                )}

                                {/* Additional Notes */}
                                {inspectPaper.additionalNotes && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Additional Notes</h4>
                                            <p className="text-sm text-foreground leading-relaxed bg-muted/50 p-4 rounded border border-border whitespace-pre-wrap">{inspectPaper.additionalNotes}</p>
                                        </div>
                                    </>
                                )}

                                {/* Attachments */}
                                <Separator />
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Uploaded Documents</h4>
                                    {inspectPaper.attachments && inspectPaper.attachments.length > 0 ? (
                                        <div className="space-y-2">
                                            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                                {JSON.stringify(inspectPaper.attachments, null, 2)}
                                            </pre>
                                            {inspectPaper.attachments.map((attachment, idx) => {
                                                const parsed = parseAttachment(attachment);
                                                if (parsed.type === 'drive') {
                                                    const driveFile = parsed.data as DriveFileInfo;
                                                    return (
                                                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <FileText size={14} className="text-green-600 shrink-0" />
                                                                <span className="text-sm truncate">{driveFile.name}</span>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                {driveFile.webViewLink && (
                                                                    <Button variant="ghost" size="sm" className="text-xs shrink-0" onClick={() => window.open(driveFile.webViewLink, '_blank')}>
                                                                        <Eye size={14} />
                                                                    </Button>
                                                                )}
                                                                {driveFile.webContentLink && (
                                                                    <Button variant="ghost" size="sm" className="text-xs shrink-0" onClick={() => window.open(driveFile.webContentLink, '_blank')}>
                                                                        <Download size={14} />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                const filePath = parsed.data as string;
                                                const fileName = filePath.split('/').pop() || filePath;
                                                return (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <FileText size={14} className="text-accent shrink-0" />
                                                            <span className="text-sm truncate">{fileName}</span>
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="text-xs shrink-0" onClick={async () => {
                                                            console.log('Downloading file:', filePath);
                                                            const { data, error } = await supabase.storage.from('papers').createSignedUrl(filePath, 3600);
                                                            if (data?.signedUrl) {
                                                                console.log('Signed URL:', data.signedUrl);
                                                                window.open(data.signedUrl, '_blank');
                                                            } else {
                                                                console.error('Error:', error);
                                                                toast({ title: "Error", description: error?.message || "Could not generate download link", variant: "destructive" });
                                                            }
                                                        }}>
                                                            <Download size={14} />
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No documents uploaded</p>
                                    )}
                                </div>

                                {/* Review Info */}
                                {(inspectPaper.assignedProfessorName || inspectPaper.revisionComments) && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Review Information</h4>
                                            <div className="bg-muted/50 p-4 rounded space-y-1 border border-border">
                                                <DetailRow icon={GraduationCap} label="Assigned Reviewer" value={inspectPaper.assignedProfessorName} />
                                                <DetailRow icon={FileText} label="Revision Comments" value={inspectPaper.revisionComments} />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <DialogFooter className="mt-4 gap-2">
                                <Button variant="outline" onClick={() => handleDownloadZip(inspectPaper)} disabled={downloading === inspectPaper.id} className="gap-1">
                                    <Download size={14} /> Download as ZIP
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="gap-1"><Trash2 size={14} /> Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete this submission?</AlertDialogTitle>
                                            <AlertDialogDescription>This will permanently remove the paper and all attached documents.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(inspectPaper.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
});

export default AdminPapers;
