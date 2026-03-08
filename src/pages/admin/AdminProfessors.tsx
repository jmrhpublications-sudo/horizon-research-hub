import { useState, memo, FormEvent } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, User } from "@/context/JMRHContext";
import {
    GraduationCap, Plus, Trash2, Edit, Ban, CheckCircle, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const AdminProfessors = memo(() => {
    const { users, papers, createUser, banUser, unbanUser, updateUser, deleteUser, assignPaper } = useJMRH();
    const { toast } = useToast();

    const [openCreate, setOpenCreate] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [dept, setDept] = useState("");
    const [university, setUniversity] = useState("");
    const [degree, setDegree] = useState("");

    const [editingProf, setEditingProf] = useState<User | null>(null);
    const [editName, setEditName] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editDept, setEditDept] = useState("");
    const [editUniversity, setEditUniversity] = useState("");
    const [editDegree, setEditDegree] = useState("");

    // Assign work
    const [assignOpen, setAssignOpen] = useState(false);
    const [assignProfId, setAssignProfId] = useState("");
    const [assignPaperId, setAssignPaperId] = useState("");

    const professors = users.filter(u => u.role === 'PROFESSOR');
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
            });
            setName(""); setEmail(""); setPassword(""); setPhone("");
            setDept(""); setUniversity(""); setDegree("");
            setOpenCreate(false);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const startEdit = (prof: User) => {
        setEditingProf(prof);
        setEditName(prof.name);
        setEditPhone(prof.phone || "");
        setEditDept(prof.department || "");
        setEditUniversity(prof.affiliation || "");
        setEditDegree(prof.degree || "");
    };

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingProf) return;
        try {
            await updateUser(editingProf.id, {
                name: editName, phone: editPhone, department: editDept,
                affiliation: editUniversity, degree: editDegree,
            });
            toast({ title: "Updated", description: "Professor profile updated." });
            setEditingProf(null);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const handleAssign = async () => {
        if (!assignProfId || !assignPaperId) return;
        const prof = professors.find(p => p.id === assignProfId);
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
                    <div className="space-y-2">
                        <p className="section-label">Editorial Council</p>
                        <h1 className="text-4xl font-serif font-bold text-foreground leading-tight">Professor Management</h1>
                        <p className="text-sm text-muted-foreground">{professors.length} professors registered</p>
                    </div>

                    <div className="flex gap-3">
                        {/* Assign Work */}
                        <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-12 px-6 font-bold tracking-widest text-xs uppercase gap-2">
                                    <Send size={16} /> Assign Work
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="font-serif text-2xl text-accent">Assign Paper to Professor</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Select Professor</label>
                                        <Select onValueChange={setAssignProfId} value={assignProfId}>
                                            <SelectTrigger className="h-11"><SelectValue placeholder="Choose professor" /></SelectTrigger>
                                            <SelectContent>
                                                {professors.map(p => (
                                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Select Paper</label>
                                        <Select onValueChange={setAssignPaperId} value={assignPaperId}>
                                            <SelectTrigger className="h-11"><SelectValue placeholder="Choose paper" /></SelectTrigger>
                                            <SelectContent>
                                                {unassignedPapers.map(p => (
                                                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
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
                                    <Button onClick={handleAssign} disabled={!assignProfId || !assignPaperId}>Assign</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Create Professor */}
                        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                            <DialogTrigger asChild>
                                <Button className="h-12 bg-accent text-accent-foreground px-6 font-bold tracking-widest hover:bg-foreground hover:text-background transition-all text-xs uppercase gap-2">
                                    <Plus size={18} /> Add Professor
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="font-serif text-2xl text-accent">Create Professor Account</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Full Name *</label>
                                            <Input required placeholder="Dr. Name" value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Email *</label>
                                            <Input required type="email" placeholder="professor@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Password *</label>
                                            <Input required type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Phone</label>
                                            <Input placeholder="+91 ..." value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11" />
                                        </div>
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
                                    </div>
                                    <Button type="submit" className="w-full h-12 bg-accent text-accent-foreground font-bold tracking-[0.2em] hover:bg-foreground hover:text-background transition-all uppercase text-xs">
                                        Create Professor Account
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Professors Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {professors.map((prof) => {
                        const profPapers = papers.filter(p => p.assignedProfessorId === prof.id);
                        return (
                            <div key={prof.id} className="p-6 bg-card border border-border group hover:border-accent/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[280px] hover:shadow-md">
                                <div className="absolute top-0 right-0 p-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="sm" variant="ghost" onClick={() => startEdit(prof)} title="Edit">
                                        <Edit size={14} />
                                    </Button>
                                    <Button
                                        size="sm" variant="ghost"
                                        onClick={() => prof.status === 'ACTIVE' ? banUser(prof.id) : unbanUser(prof.id)}
                                        className={prof.status === 'ACTIVE' ? 'text-orange-500' : 'text-green-600'}
                                        title={prof.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}
                                    >
                                        {prof.status === 'ACTIVE' ? <Ban size={14} /> : <CheckCircle size={14} />}
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="ghost" className="text-destructive" title="Delete">
                                                <Trash2 size={14} />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Professor: {prof.name}?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete this professor's account and auth credentials.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => deleteUser(prof.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>

                                <div className="space-y-5">
                                    <div className="w-14 h-14 bg-muted flex items-center justify-center group-hover:bg-accent transition-all duration-500 border border-border">
                                        <GraduationCap size={28} className="text-foreground group-hover:text-accent-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-accent transition-colors">{prof.name}</h3>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{prof.degree} • {prof.affiliation}</p>
                                        <p className="text-[10px] italic text-secondary">{prof.department}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 mt-auto border-t border-border">
                                    <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.15em] font-bold">
                                        <span className="text-muted-foreground">Status</span>
                                        <span className={prof.status === 'ACTIVE' ? "text-secondary" : "text-destructive"}>{prof.status}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.15em] font-bold">
                                        <span className="text-muted-foreground">Papers Assigned</span>
                                        <span className="text-foreground">{profPapers.length}</span>
                                    </div>
                                    {profPapers.length > 0 && (
                                        <div className="space-y-1 max-h-24 overflow-y-auto">
                                            {profPapers.map(p => (
                                                <p key={p.id} className="text-[9px] text-muted-foreground truncate">• {p.title} ({p.status})</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {professors.length === 0 && (
                        <div className="col-span-full py-24 text-center border-2 border-dashed border-border flex flex-col items-center justify-center space-y-4">
                            <GraduationCap size={48} className="text-muted-foreground/30" />
                            <p className="font-serif italic text-muted-foreground text-xl">No professors in the registry.</p>
                        </div>
                    )}
                </div>

                {/* Edit Professor Dialog */}
                <Dialog open={!!editingProf} onOpenChange={(open) => !open && setEditingProf(null)}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-2xl text-accent">Edit: {editingProf?.name}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-4 pt-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Name</label>
                                <Input required value={editName} onChange={(e) => setEditName(e.target.value)} className="h-11" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Phone</label>
                                    <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="h-11" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Degree</label>
                                    <Input value={editDegree} onChange={(e) => setEditDegree(e.target.value)} className="h-11" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">University</label>
                                    <Input value={editUniversity} onChange={(e) => setEditUniversity(e.target.value)} className="h-11" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Department</label>
                                    <Input value={editDept} onChange={(e) => setEditDept(e.target.value)} className="h-11" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingProf(null)}>Cancel</Button>
                                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-foreground hover:text-background">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
});

export default AdminProfessors;
