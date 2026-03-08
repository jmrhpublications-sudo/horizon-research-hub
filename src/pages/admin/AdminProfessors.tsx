import { useState, memo, useMemo, FormEvent } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, User } from "@/context/JMRHContext";
import {
    GraduationCap, Plus, Trash2, Edit, Ban, CheckCircle, Send, Search, Eye, X, ArrowUpDown, ChevronUp, ChevronDown
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
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const AdminProfessors = memo(() => {
    const { users, papers, createUser, banUser, unbanUser, updateUser, deleteUser, assignPaper } = useJMRH();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BANNED">("ALL");

    const [openCreate, setOpenCreate] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [dept, setDept] = useState("");
    const [university, setUniversity] = useState("");
    const [degree, setDegree] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [bio, setBio] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");

    const [editingProf, setEditingProf] = useState<User | null>(null);
    const [editForm, setEditForm] = useState<Partial<User>>({});
    const [viewingProf, setViewingProf] = useState<User | null>(null);

    // Assign work
    const [assignOpen, setAssignOpen] = useState(false);
    const [assignProfId, setAssignProfId] = useState("");
    const [assignPaperId, setAssignPaperId] = useState("");

    const professors = useMemo(() => {
        return users.filter(u => u.role === 'PROFESSOR').filter(u => {
            const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.affiliation || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [users, searchTerm, statusFilter]);

    const allProfessors = users.filter(u => u.role === 'PROFESSOR');
    const unassignedPapers = papers.filter(p => p.status === 'SUBMITTED' && !p.assignedProfessorId);

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            toast({ title: "Error", description: "Name, email, and password are required.", variant: "destructive" });
            return;
        }
        try {
            await createUser(name, email, password, 'PROFESSOR', {
                phone, department: dept, affiliation: university, degree,
                specialization, bio, address, city,
            });
            setName(""); setEmail(""); setPassword(""); setPhone("");
            setDept(""); setUniversity(""); setDegree(""); setSpecialization("");
            setBio(""); setAddress(""); setCity("");
            setOpenCreate(false);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const startEdit = (prof: User) => {
        setEditingProf(prof);
        setEditForm({
            name: prof.name, phone: prof.phone, department: prof.department,
            affiliation: prof.affiliation, degree: prof.degree, specialization: prof.specialization,
            bio: prof.bio, address: prof.address, city: prof.city, college: prof.college,
        });
    };

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingProf) return;
        try {
            await updateUser(editingProf.id, editForm);
            toast({ title: "Updated", description: "Professor profile updated." });
            setEditingProf(null);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const handleAssign = async () => {
        if (!assignProfId || !assignPaperId) return;
        const prof = allProfessors.find(p => p.id === assignProfId);
        if (prof) {
            await assignPaper(assignPaperId, prof.id, prof.name);
            setAssignOpen(false);
            setAssignProfId("");
            setAssignPaperId("");
        }
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8"
                >
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">Editorial Council</p>
                        <h1 className="text-4xl font-serif font-bold text-foreground leading-tight">Professor Management</h1>
                        <p className="text-sm text-muted-foreground">
                            {allProfessors.length} professors • {unassignedPapers.length} papers awaiting assignment
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-12 px-5 font-bold tracking-widest text-xs uppercase gap-2 relative">
                                    <Send size={16} /> Assign Work
                                    {unassignedPapers.length > 0 && (
                                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-accent-foreground text-[9px] font-black rounded-full flex items-center justify-center">
                                            {unassignedPapers.length}
                                        </span>
                                    )}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="font-serif text-2xl text-accent">Assign Paper to Professor</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Professor</label>
                                        <Select onValueChange={setAssignProfId} value={assignProfId}>
                                            <SelectTrigger className="h-11"><SelectValue placeholder="Select professor" /></SelectTrigger>
                                            <SelectContent>
                                                {allProfessors.filter(p => p.status === 'ACTIVE').map(p => (
                                                    <SelectItem key={p.id} value={p.id}>{p.name} — {p.affiliation || 'N/A'}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Paper</label>
                                        <Select onValueChange={setAssignPaperId} value={assignPaperId}>
                                            <SelectTrigger className="h-11"><SelectValue placeholder="Select paper" /></SelectTrigger>
                                            <SelectContent>
                                                {unassignedPapers.map(p => (
                                                    <SelectItem key={p.id} value={p.id}>{p.title} — {p.authorName}</SelectItem>
                                                ))}
                                                {unassignedPapers.length === 0 && (
                                                    <SelectItem value="none" disabled>No unassigned papers</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setAssignOpen(false)}>Cancel</Button>
                                    <Button onClick={handleAssign} disabled={!assignProfId || !assignPaperId} className="bg-accent text-accent-foreground">Assign</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                            <DialogTrigger asChild>
                                <Button className="h-12 bg-accent text-accent-foreground px-6 font-bold tracking-widest hover:bg-foreground hover:text-background transition-all text-xs uppercase gap-2 shadow-md">
                                    <Plus size={18} /> Add Professor
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="font-serif text-2xl text-accent">Create Professor Account</DialogTitle>
                                    <p className="text-sm text-muted-foreground">Create an authenticated professor/reviewer account.</p>
                                </DialogHeader>
                                <form onSubmit={handleCreate} className="space-y-6 pt-4">
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent border-b border-border pb-2">Credentials</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Name *</label>
                                                <Input required placeholder="Dr. Name" value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Email *</label>
                                                <Input required type="email" placeholder="email@univ.edu" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
                                            </div>
                                            <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Password *</label>
                                                <Input required type="password" placeholder="Min 6 chars" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent border-b border-border pb-2">Academic Profile</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">University</label>
                                                <Input placeholder="University" value={university} onChange={(e) => setUniversity(e.target.value)} className="h-11" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Department</label>
                                                <Input placeholder="Department" value={dept} onChange={(e) => setDept(e.target.value)} className="h-11" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Degree</label>
                                                <Input placeholder="PhD, MSc..." value={degree} onChange={(e) => setDegree(e.target.value)} className="h-11" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Specialization</label>
                                                <Input placeholder="e.g. AI Ethics" value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="h-11" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Phone</label>
                                                <Input placeholder="+91 ..." value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">City</label>
                                                <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="h-11" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Bio</label>
                                            <Textarea placeholder="Professional bio..." value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full h-12 bg-accent text-accent-foreground font-bold tracking-[0.2em] hover:bg-foreground hover:text-background uppercase text-xs">
                                        Create Professor Account
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </motion.div>

                {/* Search + Filters */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search professors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 h-12" />
                        {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={14} /></button>}
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="h-12 px-4 border border-input bg-background text-sm">
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="BANNED">Deactivated</option>
                    </select>
                </motion.div>

                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    Showing {professors.length} of {allProfessors.length} professors
                </p>

                {/* Professors Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {professors.map((prof, idx) => {
                            const profPapers = papers.filter(p => p.assignedProfessorId === prof.id);
                            const reviewedPapers = profPapers.filter(p => p.status !== 'UNDER_REVIEW');
                            return (
                                <motion.div
                                    key={prof.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-6 bg-card border border-border group hover:border-accent/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[320px] hover:shadow-lg"
                                >
                                    {/* Accent Corner */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-[80px] -mr-12 -mt-12 transition-all group-hover:bg-accent/10" />

                                    {/* Actions */}
                                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <Button size="sm" variant="ghost" onClick={() => setViewingProf(prof)} title="View"><Eye size={14} /></Button>
                                        <Button size="sm" variant="ghost" onClick={() => startEdit(prof)} title="Edit"><Edit size={14} /></Button>
                                        <Button size="sm" variant="ghost"
                                            onClick={() => prof.status === 'ACTIVE' ? banUser(prof.id) : unbanUser(prof.id)}
                                            className={prof.status === 'ACTIVE' ? 'text-orange-500' : 'text-green-600'}>
                                            {prof.status === 'ACTIVE' ? <Ban size={14} /> : <CheckCircle size={14} />}
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="ghost" className="text-destructive"><Trash2 size={14} /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete {prof.name}?</AlertDialogTitle>
                                                    <AlertDialogDescription>Permanently deletes this professor account.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteUser(prof.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>

                                    <div className="space-y-5 relative z-0">
                                        <div className="w-14 h-14 bg-muted flex items-center justify-center group-hover:bg-accent transition-all duration-500 border border-border">
                                            <GraduationCap size={28} className="text-foreground group-hover:text-accent-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-accent transition-colors">{prof.name}</h3>
                                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                                {[prof.degree, prof.affiliation].filter(Boolean).join(' • ') || 'No details'}
                                            </p>
                                            <p className="text-[10px] italic text-secondary">{prof.specialization || prof.department || ''}</p>
                                            <p className="text-[10px] text-muted-foreground">{prof.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-5 mt-auto border-t border-border">
                                        <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.15em] font-bold">
                                            <span className="text-muted-foreground">Status</span>
                                            <span className={`inline-flex items-center gap-1 ${prof.status === 'ACTIVE' ? "text-green-600" : "text-destructive"}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${prof.status === 'ACTIVE' ? 'bg-green-500' : 'bg-destructive'}`} />
                                                {prof.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.15em] font-bold">
                                            <span className="text-muted-foreground">Assigned</span>
                                            <span className="text-foreground">{profPapers.length} papers</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.15em] font-bold">
                                            <span className="text-muted-foreground">Reviewed</span>
                                            <span className="text-secondary">{reviewedPapers.length} completed</span>
                                        </div>
                                        {profPapers.length > 0 && (
                                            <div className="space-y-1 max-h-20 overflow-y-auto pt-2 border-t border-border/50">
                                                {profPapers.slice(0, 3).map(p => (
                                                    <p key={p.id} className="text-[9px] text-muted-foreground truncate">
                                                        • {p.title} <span className={`font-bold ${p.status === 'PUBLISHED' ? 'text-secondary' : 'text-accent'}`}>({p.status})</span>
                                                    </p>
                                                ))}
                                                {profPapers.length > 3 && <p className="text-[9px] text-muted-foreground/60">+{profPapers.length - 3} more</p>}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {professors.length === 0 && (
                        <div className="col-span-full py-24 text-center border-2 border-dashed border-border flex flex-col items-center justify-center space-y-4">
                            <GraduationCap size={48} className="text-muted-foreground/20" />
                            <p className="font-serif italic text-muted-foreground text-xl">No professors found.</p>
                        </div>
                    )}
                </div>

                {/* View Professor Dialog */}
                <Dialog open={!!viewingProf} onOpenChange={(open) => !open && setViewingProf(null)}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        {viewingProf && (
                            <>
                                <DialogHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-accent/10 flex items-center justify-center border border-accent/20">
                                            <GraduationCap size={32} className="text-accent" />
                                        </div>
                                        <div>
                                            <DialogTitle className="font-serif text-2xl">{viewingProf.name}</DialogTitle>
                                            <p className="text-sm text-muted-foreground">{viewingProf.email}</p>
                                        </div>
                                    </div>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-6 py-6">
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent border-b border-border pb-2">Contact</h4>
                                        <InfoRow label="Phone" value={viewingProf.phone} />
                                        <InfoRow label="City" value={viewingProf.city} />
                                        <InfoRow label="Address" value={viewingProf.address} />
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent border-b border-border pb-2">Academic</h4>
                                        <InfoRow label="University" value={viewingProf.affiliation} />
                                        <InfoRow label="Department" value={viewingProf.department} />
                                        <InfoRow label="Degree" value={viewingProf.degree} />
                                        <InfoRow label="Specialization" value={viewingProf.specialization} />
                                    </div>
                                </div>
                                {viewingProf.bio && (
                                    <div className="py-4 border-t border-border">
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-2">Bio</h4>
                                        <p className="text-sm text-muted-foreground italic">{viewingProf.bio}</p>
                                    </div>
                                )}
                                <div className="py-4 border-t border-border">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-3">
                                        Assigned Papers ({papers.filter(p => p.assignedProfessorId === viewingProf.id).length})
                                    </h4>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {papers.filter(p => p.assignedProfessorId === viewingProf.id).map(p => (
                                            <div key={p.id} className="p-3 bg-muted border border-border flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium">{p.title}</p>
                                                    <p className="text-[9px] uppercase text-muted-foreground">{p.authorName} • {p.submissionDate}</p>
                                                </div>
                                                <span className={`text-[8px] px-2 py-0.5 border font-black uppercase ${p.status === 'PUBLISHED' ? 'text-secondary border-secondary/30' : 'text-accent border-accent/30'}`}>
                                                    {p.status}
                                                </span>
                                            </div>
                                        ))}
                                        {papers.filter(p => p.assignedProfessorId === viewingProf.id).length === 0 && (
                                            <p className="text-[10px] text-muted-foreground italic">No papers assigned.</p>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => { setViewingProf(null); startEdit(viewingProf); }}>
                                        <Edit size={14} className="mr-2" /> Edit
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Edit Professor Dialog */}
                <Dialog open={!!editingProf} onOpenChange={(open) => !open && setEditingProf(null)}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-2xl text-accent">Edit: {editingProf?.name}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-6 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Name</label>
                                    <Input required value={editForm.name || ""} onChange={(e) => setEditForm(f => ({...f, name: e.target.value}))} className="h-11" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Phone</label>
                                    <Input value={editForm.phone || ""} onChange={(e) => setEditForm(f => ({...f, phone: e.target.value}))} className="h-11" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">University</label>
                                    <Input value={editForm.affiliation || ""} onChange={(e) => setEditForm(f => ({...f, affiliation: e.target.value}))} className="h-11" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Department</label>
                                    <Input value={editForm.department || ""} onChange={(e) => setEditForm(f => ({...f, department: e.target.value}))} className="h-11" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Degree</label>
                                    <Input value={editForm.degree || ""} onChange={(e) => setEditForm(f => ({...f, degree: e.target.value}))} className="h-11" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Specialization</label>
                                    <Input value={editForm.specialization || ""} onChange={(e) => setEditForm(f => ({...f, specialization: e.target.value}))} className="h-11" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">City</label>
                                    <Input value={editForm.city || ""} onChange={(e) => setEditForm(f => ({...f, city: e.target.value}))} className="h-11" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">College</label>
                                    <Input value={editForm.college || ""} onChange={(e) => setEditForm(f => ({...f, college: e.target.value}))} className="h-11" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Bio</label>
                                <Textarea value={editForm.bio || ""} onChange={(e) => setEditForm(f => ({...f, bio: e.target.value}))} rows={3} />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingProf(null)}>Cancel</Button>
                                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-foreground hover:text-background">Save</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
});

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="space-y-0.5">
        <label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">{label}</label>
        <p className="text-sm text-foreground">{value || <span className="italic text-muted-foreground/50">N/A</span>}</p>
    </div>
);

export default AdminProfessors;
