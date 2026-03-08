import { memo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, UploadRequest } from "@/context/JMRHContext";
import { Inbox, Check, X, ExternalLink, Search, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const AdminRequests = memo(() => {
    const { uploadRequests, updateUploadRequest, deleteUploadRequest } = useJMRH();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

    const filtered = uploadRequests.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || (r.authors || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const pendingCount = uploadRequests.filter(r => r.status === 'PENDING').length;

    const handleAction = async (request: UploadRequest, status: 'APPROVED' | 'REJECTED') => {
        await updateUploadRequest(request.id, { status, adminNotes: status === 'APPROVED' ? 'Approved by admin' : 'Rejected by admin' });
        toast({ title: status === 'APPROVED' ? "Approved" : "Rejected", description: `"${request.title}" has been ${status.toLowerCase()}.` });
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-border">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Content Requests</p>
                        <h1 className="text-3xl font-serif font-bold text-foreground">Upload Requests</h1>
                        <p className="text-sm text-muted-foreground">{uploadRequests.length} total • {pendingCount} pending</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search requests..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                    <div className="flex gap-1">
                        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                className={`px-3 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${statusFilter === s ? 'bg-accent text-accent-foreground border-accent' : 'bg-card text-muted-foreground border-border hover:border-accent/30'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <AnimatePresence>
                        {filtered.map((request) => (
                            <motion.div key={request.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="p-4 bg-card border border-border hover:border-accent/20 transition-all">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant="outline" className={`text-[9px] uppercase tracking-widest ${request.requestType === 'JOURNAL' ? 'border-accent/30 text-accent' : 'border-secondary/30 text-secondary'}`}>{request.requestType}</Badge>
                                            <Badge variant="outline" className={`text-[9px] uppercase tracking-widest ${request.status === 'PENDING' ? 'border-orange-300 text-orange-600' : request.status === 'APPROVED' ? 'border-green-300 text-green-600' : 'border-destructive/30 text-destructive'}`}>{request.status}</Badge>
                                        </div>
                                        <h3 className="font-serif font-bold text-foreground">{request.title}</h3>
                                        {request.authors && <p className="text-xs text-muted-foreground">Authors: {request.authors}</p>}
                                        {request.isbn && <p className="text-xs text-muted-foreground">ISBN: {request.isbn}</p>}
                                        {request.description && <p className="text-xs text-muted-foreground line-clamp-2">{request.description}</p>}
                                        {request.link && <a href={request.link} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline flex items-center gap-1 mt-1"><ExternalLink size={12} /> Source</a>}
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        {request.status === 'PENDING' && (
                                            <>
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1" onClick={() => handleAction(request, 'APPROVED')}>
                                                    <Check size={14} /> Approve
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleAction(request, 'REJECTED')}>
                                                    <X size={14} />
                                                </Button>
                                            </>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-destructive"><Trash2 size={14} /></Button></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Delete this request?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteUploadRequest(request.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {filtered.length === 0 && (
                        <div className="py-16 text-center border-2 border-dashed border-border">
                            <Inbox size={48} className="text-muted-foreground/20 mx-auto mb-4" />
                            <p className="font-serif italic text-muted-foreground text-lg">No upload requests found.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
});

export default AdminRequests;