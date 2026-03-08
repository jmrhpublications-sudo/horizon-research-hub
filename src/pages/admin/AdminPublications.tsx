import { memo, useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, PublishedJournal, PublishedBook, ProfessorSubmission } from "@/context/JMRHContext";
import { supabase } from "@/integrations/supabase/client";
import { getSignedFileUrl } from "@/lib/storage-utils";
import {
    Library, BookOpen, Upload, Edit, Trash2, ExternalLink, Check, X, Plus,
    Search, Eye, GraduationCap, FileText, Image
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const disciplines = [
    "Commerce and Management", "Economics and Finance", "Education and Psychology",
    "Social Sciences and Humanities", "Science and Technology",
    "Environmental Studies and Sustainability", "Digital Transformation and Information Systems",
    "Entrepreneurship and Innovation", "Public Policy and Governance", "Other"
];

const AdminPublications = memo(() => {
    const {
        publishedJournals, publishedBooks, professorSubmissions,
        createPublishedJournal, updatePublishedJournal, deletePublishedJournal,
        createPublishedBook, updatePublishedBook, deletePublishedBook,
        approveProfessorSubmission, updateProfessorSubmission,
    } = useJMRH();
    const { toast } = useToast();

    const [activeTab, setActiveTab] = useState<"journals" | "books" | "submissions">("journals");
    const [searchTerm, setSearchTerm] = useState("");

    // Journal form
    const [isJournalOpen, setIsJournalOpen] = useState(false);
    const [editingJournal, setEditingJournal] = useState<PublishedJournal | null>(null);
    const [journalForm, setJournalForm] = useState({
        title: "", authors: "", abstract: "", discipline: "", keywords: "",
        volume: "", issue: "", pages: "", doi: "",
        publicationDate: new Date().toISOString().split('T')[0],
        pdfUrl: "", coverImage: ""
    });

    // Book form
    const [isBookOpen, setIsBookOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<PublishedBook | null>(null);
    const [bookForm, setBookForm] = useState({
        title: "", authors: "", editors: "", isbn: "", publisher: "",
        description: "", discipline: "", keywords: "", edition: "",
        publicationYear: "", pdfUrl: "", coverImage: "", purchaseLink: ""
    });

    const [isUploadingPdf, setIsUploadingPdf] = useState(false);
    const journalFileRef = useRef<HTMLInputElement>(null);
    const bookFileRef = useRef<HTMLInputElement>(null);
    const journalCoverRef = useRef<HTMLInputElement>(null);
    const bookCoverRef = useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File, folder: string): Promise<string | null> => {
        const fileName = `${folder}/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage.from('publications').upload(fileName, file, { cacheControl: '3600', upsert: false });
        if (error) { console.error('Upload error:', error); return null; }
        return fileName;
    };

    const resetJournalForm = () => setJournalForm({ title: "", authors: "", abstract: "", discipline: "", keywords: "", volume: "", issue: "", pages: "", doi: "", publicationDate: new Date().toISOString().split('T')[0], pdfUrl: "", coverImage: "" });
    const resetBookForm = () => setBookForm({ title: "", authors: "", editors: "", isbn: "", publisher: "", description: "", discipline: "", keywords: "", edition: "", publicationYear: "", pdfUrl: "", coverImage: "", purchaseLink: "" });

    const openEditJournal = (j: PublishedJournal) => {
        setEditingJournal(j);
        setJournalForm({ title: j.title, authors: j.authors, abstract: j.abstract || "", discipline: j.discipline, keywords: j.keywords || "", volume: j.volume || "", issue: j.issue || "", pages: j.pages || "", doi: j.doi || "", publicationDate: j.publicationDate, pdfUrl: j.pdfUrl || "", coverImage: j.coverImage || "" });
        setIsJournalOpen(true);
    };

    const openEditBook = (b: PublishedBook) => {
        setEditingBook(b);
        setBookForm({ title: b.title, authors: b.authors, editors: b.editors || "", isbn: b.isbn || "", publisher: b.publisher || "", description: b.description || "", discipline: b.discipline, keywords: b.keywords || "", edition: b.edition || "", publicationYear: b.publicationYear || "", pdfUrl: b.pdfUrl || "", coverImage: b.coverImage || "", purchaseLink: b.purchaseLink || "" });
        setIsBookOpen(true);
    };

    const handleSaveJournal = async () => {
        if (!journalForm.title || !journalForm.authors || !journalForm.discipline) {
            toast({ title: "Error", description: "Title, authors, and discipline are required", variant: "destructive" }); return;
        }
        if (editingJournal) {
            await updatePublishedJournal(editingJournal.id, journalForm);
            toast({ title: "Updated", description: "Journal article updated." });
        } else {
            await createPublishedJournal(journalForm);
        }
        setIsJournalOpen(false); setEditingJournal(null); resetJournalForm();
    };

    const handleSaveBook = async () => {
        if (!bookForm.title || !bookForm.authors || !bookForm.discipline) {
            toast({ title: "Error", description: "Title, authors, and discipline are required", variant: "destructive" }); return;
        }
        if (editingBook) {
            await updatePublishedBook(editingBook.id, bookForm);
            toast({ title: "Updated", description: "Book updated." });
        } else {
            await createPublishedBook(bookForm);
        }
        setIsBookOpen(false); setEditingBook(null); resetBookForm();
    };

    const handleProfSubmission = async (s: ProfessorSubmission, action: 'approve' | 'reject') => {
        if (action === 'approve') {
            await approveProfessorSubmission(s);
            toast({ title: "Approved & Published", description: `"${s.title}" is now live.` });
        } else {
            await updateProfessorSubmission(s.id, { status: 'REJECTED' });
            toast({ title: "Rejected", description: `"${s.title}" has been rejected.` });
        }
    };

    const filteredJournals = publishedJournals.filter(j => j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.authors.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredBooks = publishedBooks.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.authors.toLowerCase().includes(searchTerm.toLowerCase()));
    const pendingSubs = professorSubmissions.filter(s => s.status === 'PENDING');

    const tabs = [
        { key: "journals", label: `Journals (${publishedJournals.length})`, icon: Library },
        { key: "books", label: `Books (${publishedBooks.length})`, icon: BookOpen },
        { key: "submissions", label: `Prof. Submissions (${pendingSubs.length})`, icon: GraduationCap },
    ];

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-border">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Content Library</p>
                        <h1 className="text-3xl font-serif font-bold text-foreground">Publications</h1>
                        <p className="text-sm text-muted-foreground">{publishedJournals.length} journals • {publishedBooks.length} books • {pendingSubs.length} pending</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => { resetJournalForm(); setEditingJournal(null); setIsJournalOpen(true); }} className="gap-2 bg-accent text-accent-foreground hover:bg-foreground hover:text-background text-xs uppercase tracking-widest font-bold">
                            <Plus size={16} /> Journal
                        </Button>
                        <Button onClick={() => { resetBookForm(); setEditingBook(null); setIsBookOpen(true); }} variant="outline" className="gap-2 text-xs uppercase tracking-widest font-bold">
                            <Plus size={16} /> Book
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-border overflow-x-auto pb-px scrollbar-none">
                    {tabs.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab.key ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                            <tab.icon size={14} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search publications..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>

                {/* Journals Tab */}
                {activeTab === "journals" && (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {filteredJournals.map((journal) => (
                                <motion.div key={journal.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="p-4 bg-card border border-border hover:border-accent/20 transition-all group">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <Badge variant="outline" className="text-[9px] uppercase tracking-widest">{journal.discipline}</Badge>
                                                {journal.volume && <span className="text-[10px] text-muted-foreground">Vol. {journal.volume}{journal.issue ? `, Issue ${journal.issue}` : ''}</span>}
                                            </div>
                                            <h3 className="font-serif font-bold text-foreground truncate">{journal.title}</h3>
                                            <p className="text-xs text-muted-foreground">{journal.authors} • {journal.publicationDate}</p>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            {journal.pdfUrl && (
                                                <Button variant="ghost" size="sm" onClick={async () => { const url = await getSignedFileUrl('publications', journal.pdfUrl!); if (url) window.open(url, '_blank'); }}>
                                                    <ExternalLink size={14} />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="sm" onClick={() => openEditJournal(journal)}><Edit size={14} /></Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-destructive"><Trash2 size={14} /></Button></AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Delete "{journal.title}"?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deletePublishedJournal(journal.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {filteredJournals.length === 0 && <p className="py-16 text-center text-muted-foreground font-serif italic">No journals published yet.</p>}
                    </div>
                )}

                {/* Books Tab */}
                {activeTab === "books" && (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {filteredBooks.map((book) => (
                                <motion.div key={book.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="p-4 bg-card border border-border hover:border-accent/20 transition-all group">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <Badge variant="outline" className="text-[9px] uppercase tracking-widest">{book.discipline}</Badge>
                                                {book.isbn && <span className="text-[10px] text-muted-foreground">ISBN: {book.isbn}</span>}
                                            </div>
                                            <h3 className="font-serif font-bold text-foreground truncate">{book.title}</h3>
                                            <p className="text-xs text-muted-foreground">{book.authors} {book.publisher && `• ${book.publisher}`}</p>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            {book.pdfUrl && (
                                                <Button variant="ghost" size="sm" onClick={async () => { const url = await getSignedFileUrl('publications', book.pdfUrl!); if (url) window.open(url, '_blank'); }}>
                                                    <ExternalLink size={14} />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="sm" onClick={() => openEditBook(book)}><Edit size={14} /></Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-destructive"><Trash2 size={14} /></Button></AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Delete "{book.title}"?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deletePublishedBook(book.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {filteredBooks.length === 0 && <p className="py-16 text-center text-muted-foreground font-serif italic">No books published yet.</p>}
                    </div>
                )}

                {/* Professor Submissions Tab */}
                {activeTab === "submissions" && (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {professorSubmissions.map((sub) => (
                                <motion.div key={sub.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="p-4 bg-card border border-border hover:border-accent/20 transition-all">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge variant="outline" className={`text-[9px] uppercase tracking-widest ${sub.submissionType === 'JOURNAL' ? 'border-accent/30 text-accent' : 'border-secondary/30 text-secondary'}`}>{sub.submissionType}</Badge>
                                                <Badge variant="outline" className={`text-[9px] uppercase tracking-widest ${sub.status === 'PENDING' ? 'border-orange-300 text-orange-600' : sub.status === 'APPROVED' ? 'border-green-300 text-green-600' : 'border-destructive/30 text-destructive'}`}>{sub.status}</Badge>
                                            </div>
                                            <h3 className="font-serif font-bold text-foreground">{sub.title}</h3>
                                            <p className="text-xs text-muted-foreground">By: {sub.professorName} • {sub.authors} • {sub.discipline}</p>
                                            {sub.abstract && <p className="text-xs text-muted-foreground line-clamp-2">{sub.abstract}</p>}
                                        </div>
                                        {sub.status === 'PENDING' && (
                                            <div className="flex gap-2 shrink-0">
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1" onClick={() => handleProfSubmission(sub, 'approve')}>
                                                    <Check size={14} /> Approve
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleProfSubmission(sub, 'reject')}>
                                                    <X size={14} />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {professorSubmissions.length === 0 && <p className="py-16 text-center text-muted-foreground font-serif italic">No professor submissions yet.</p>}
                    </div>
                )}
            </div>

            {/* Journal Dialog */}
            <Dialog open={isJournalOpen} onOpenChange={(open) => { if (!open) { setIsJournalOpen(false); setEditingJournal(null); } }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-2xl">{editingJournal ? 'Edit' : 'Publish'} Journal Article</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Input placeholder="Article Title *" value={journalForm.title} onChange={(e) => setJournalForm(p => ({ ...p, title: e.target.value }))} />
                        <Input placeholder="Authors *" value={journalForm.authors} onChange={(e) => setJournalForm(p => ({ ...p, authors: e.target.value }))} />
                        <Textarea placeholder="Abstract" value={journalForm.abstract} onChange={(e) => setJournalForm(p => ({ ...p, abstract: e.target.value }))} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Select onValueChange={(v) => setJournalForm(p => ({ ...p, discipline: v }))} value={journalForm.discipline}>
                                <SelectTrigger><SelectValue placeholder="Discipline *" /></SelectTrigger>
                                <SelectContent>{disciplines.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                            </Select>
                            <Input placeholder="Keywords" value={journalForm.keywords} onChange={(e) => setJournalForm(p => ({ ...p, keywords: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <Input placeholder="Volume" value={journalForm.volume} onChange={(e) => setJournalForm(p => ({ ...p, volume: e.target.value }))} />
                            <Input placeholder="Issue" value={journalForm.issue} onChange={(e) => setJournalForm(p => ({ ...p, issue: e.target.value }))} />
                            <Input placeholder="Pages" value={journalForm.pages} onChange={(e) => setJournalForm(p => ({ ...p, pages: e.target.value }))} />
                        </div>
                        <Input placeholder="DOI" value={journalForm.doi} onChange={(e) => setJournalForm(p => ({ ...p, doi: e.target.value }))} />
                        <Input type="date" value={journalForm.publicationDate} onChange={(e) => setJournalForm(p => ({ ...p, publicationDate: e.target.value }))} />
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">PDF File</label>
                            <input ref={journalFileRef} type="file" accept=".pdf" className="hidden" onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                    setIsUploadingPdf(true);
                                    const url = await uploadFile(e.target.files[0], 'journals');
                                    if (url) setJournalForm(p => ({ ...p, pdfUrl: url }));
                                    setIsUploadingPdf(false);
                                }
                            }} />
                            <Button type="button" variant="outline" onClick={() => journalFileRef.current?.click()} className="w-full">
                                {isUploadingPdf ? "Uploading..." : journalForm.pdfUrl ? "PDF Uploaded ✓" : "Choose PDF"}
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Cover Image</label>
                            <input ref={journalCoverRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                    const url = await uploadFile(e.target.files[0], 'covers');
                                    if (url) setJournalForm(p => ({ ...p, coverImage: url }));
                                }
                            }} />
                            <Button type="button" variant="outline" onClick={() => journalCoverRef.current?.click()} className="w-full">
                                {journalForm.coverImage ? "Cover Uploaded ✓" : "Choose Cover Image"}
                            </Button>
                        </div>
                        <Input placeholder="PDF URL (if already hosted)" value={journalForm.pdfUrl} onChange={(e) => setJournalForm(p => ({ ...p, pdfUrl: e.target.value }))} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setIsJournalOpen(false); setEditingJournal(null); }}>Cancel</Button>
                        <Button className="bg-accent text-accent-foreground" onClick={handleSaveJournal}>{editingJournal ? 'Update' : 'Publish'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Book Dialog */}
            <Dialog open={isBookOpen} onOpenChange={(open) => { if (!open) { setIsBookOpen(false); setEditingBook(null); } }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-2xl">{editingBook ? 'Edit' : 'Publish'} Book</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Input placeholder="Book Title *" value={bookForm.title} onChange={(e) => setBookForm(p => ({ ...p, title: e.target.value }))} />
                        <Input placeholder="Authors *" value={bookForm.authors} onChange={(e) => setBookForm(p => ({ ...p, authors: e.target.value }))} />
                        <Input placeholder="Editors" value={bookForm.editors} onChange={(e) => setBookForm(p => ({ ...p, editors: e.target.value }))} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input placeholder="ISBN" value={bookForm.isbn} onChange={(e) => setBookForm(p => ({ ...p, isbn: e.target.value }))} />
                            <Input placeholder="Publisher" value={bookForm.publisher} onChange={(e) => setBookForm(p => ({ ...p, publisher: e.target.value }))} />
                        </div>
                        <Textarea placeholder="Description" value={bookForm.description} onChange={(e) => setBookForm(p => ({ ...p, description: e.target.value }))} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Select onValueChange={(v) => setBookForm(p => ({ ...p, discipline: v }))} value={bookForm.discipline}>
                                <SelectTrigger><SelectValue placeholder="Discipline *" /></SelectTrigger>
                                <SelectContent>{disciplines.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                            </Select>
                            <Input placeholder="Keywords" value={bookForm.keywords} onChange={(e) => setBookForm(p => ({ ...p, keywords: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input placeholder="Edition" value={bookForm.edition} onChange={(e) => setBookForm(p => ({ ...p, edition: e.target.value }))} />
                            <Input placeholder="Publication Year" value={bookForm.publicationYear} onChange={(e) => setBookForm(p => ({ ...p, publicationYear: e.target.value }))} />
                        </div>
                        <Input placeholder="Purchase Link" value={bookForm.purchaseLink} onChange={(e) => setBookForm(p => ({ ...p, purchaseLink: e.target.value }))} />
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">PDF File</label>
                            <input ref={bookFileRef} type="file" accept=".pdf" className="hidden" onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                    setIsUploadingPdf(true);
                                    const url = await uploadFile(e.target.files[0], 'books');
                                    if (url) setBookForm(p => ({ ...p, pdfUrl: url }));
                                    setIsUploadingPdf(false);
                                }
                            }} />
                            <Button type="button" variant="outline" onClick={() => bookFileRef.current?.click()} className="w-full">
                                {isUploadingPdf ? "Uploading..." : bookForm.pdfUrl ? "PDF Uploaded ✓" : "Choose PDF"}
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Cover Image</label>
                            <input ref={bookCoverRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                    const url = await uploadFile(e.target.files[0], 'covers');
                                    if (url) setBookForm(p => ({ ...p, coverImage: url }));
                                }
                            }} />
                            <Button type="button" variant="outline" onClick={() => bookCoverRef.current?.click()} className="w-full">
                                {bookForm.coverImage ? "Cover Uploaded ✓" : "Choose Cover Image"}
                            </Button>
                        </div>
                        <Input placeholder="PDF URL (if already hosted)" value={bookForm.pdfUrl} onChange={(e) => setBookForm(p => ({ ...p, pdfUrl: e.target.value }))} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setIsBookOpen(false); setEditingBook(null); }}>Cancel</Button>
                        <Button className="bg-accent text-accent-foreground" onClick={handleSaveBook}>{editingBook ? 'Update' : 'Publish'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
});

export default AdminPublications;