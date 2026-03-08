import { useState, memo, FormEvent } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH } from "@/context/JMRHContext";
import {
    GraduationCap,
    Plus,
    Mail,
    Trash2,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const AdminProfessors = memo(() => {
    const { users, createUser, banUser, unbanUser, updateUser } = useJMRH();
    const { toast } = useToast();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [openCreate, setOpenCreate] = useState(false);
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [dept, setDept] = useState("");
    const [university, setUniversity] = useState("");
    const [degree, setDegree] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [bio, setBio] = useState("");

    const [editingProf, setEditingProf] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editAddress, setEditAddress] = useState("");
    const [editDept, setEditDept] = useState("");
    const [editUniversity, setEditUniversity] = useState("");
    const [editDegree, setEditDegree] = useState("");
    const [editSpecialization, setEditSpecialization] = useState("");
    const [editBio, setEditBio] = useState("");

    const professors = users.filter(u => u.role === 'PROFESSOR');

    const handleCreate = (e: FormEvent) => {
        e.preventDefault();
        createUser(name, email, 'defaultPass123!', 'PROFESSOR', {
            phone, department: dept, affiliation: university, degree,
        });
        setName(""); setEmail(""); setPhone(""); setAddress("");
        setDept(""); setUniversity(""); setDegree(""); setSpecialization(""); setBio("");
        setOpenCreate(false);
        toast({ title: "Professor Account Initialized", description: `Access credentials issued for ${name}` });
    };

    const startEdit = (prof: any) => {
        setEditingProf(prof.id);
        setEditName(prof.name); setEditEmail(prof.email);
        setEditPhone(prof.phone || ""); setEditAddress("");
        setEditDept(prof.department || ""); setEditUniversity(prof.affiliation || "");
        setEditDegree(prof.degree || ""); setEditSpecialization(""); setEditBio("");
    };

    const handleUpdate = (e: FormEvent) => {
        e.preventDefault();
        if (!editingProf) return;
        updateUser(editingProf, {
            name: editName, email: editEmail, phone: editPhone,
            department: editDept, affiliation: editUniversity, degree: editDegree,
        });
        setEditingProf(null);
        toast({ title: "Professor Profile Updated", description: "All changes have been saved." });
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
                    <div className="space-y-2">
                        <p className="section-label">Editorial Council</p>
                        <h1 className="text-4xl font-serif font-bold text-foreground leading-tight">Board Management</h1>
                    </div>

                    <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                        <DialogTrigger asChild>
                            <Button className="h-12 bg-accent text-accent-foreground px-6 font-bold tracking-widest hover:bg-foreground hover:text-background transition-all shadow-md flex items-center gap-2 text-xs uppercase">
                                <Plus size={18} /> Initialize Professor
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="font-serif text-2xl text-accent">Assign New Member</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Full Scholarly Name</label>
                                        <Input required placeholder="Dr. Researcher Name" value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Institutional Email</label>
                                        <Input required type="email" placeholder="scholar@institution.edu" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Phone Number</label>
                                        <Input required placeholder="+1 234..." value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Current Address</label>
                                        <Input required placeholder="City, Country" value={address} onChange={(e) => setAddress(e.target.value)} className="h-11" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">University / Institution</label>
                                        <Input required placeholder="University name" value={university} onChange={(e) => setUniversity(e.target.value)} className="h-11" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Department</label>
                                        <Input required placeholder="e.g. Computer Science" value={dept} onChange={(e) => setDept(e.target.value)} className="h-11" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Academic Degree/Title</label>
                                        <Input required placeholder="PhD, MSc, etc." value={degree} onChange={(e) => setDegree(e.target.value)} className="h-11" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Specialization</label>
                                        <Input required placeholder="e.g. AI Ethics" value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="h-11" />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Biography</label>
                                        <Input placeholder="Short professional bio..." value={bio} onChange={(e) => setBio(e.target.value)} className="h-11" />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-12 bg-accent text-accent-foreground font-bold tracking-[0.2em] hover:bg-foreground hover:text-background transition-all uppercase text-xs">
                                    Confirm Account Issuance
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Professors Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {professors.map((prof) => (
                        <div key={prof.id} className="p-6 bg-card border border-border group hover:border-accent/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[280px] hover:shadow-md">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <Dialog open={editingProf === prof.id} onOpenChange={(open) => !open && setEditingProf(null)}>
                                    <DialogTrigger asChild>
                                        <button onClick={() => startEdit(prof)} className="text-muted-foreground hover:text-accent transition-colors">
                                            <CheckCircle size={18} />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle className="font-serif text-2xl text-accent">Edit Member Profile</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleUpdate} className="space-y-4 pt-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2 space-y-1">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Name</label>
                                                    <Input required value={editName} onChange={(e) => setEditName(e.target.value)} className="h-11" />
                                                </div>
                                                <div className="col-span-2 space-y-1">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Email</label>
                                                    <Input required type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="h-11" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Phone</label>
                                                    <Input required value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="h-11" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Address</label>
                                                    <Input required value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="h-11" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">University</label>
                                                    <Input required value={editUniversity} onChange={(e) => setEditUniversity(e.target.value)} className="h-11" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Department</label>
                                                    <Input required value={editDept} onChange={(e) => setEditDept(e.target.value)} className="h-11" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Degree</label>
                                                    <Input required value={editDegree} onChange={(e) => setEditDegree(e.target.value)} className="h-11" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Specialization</label>
                                                    <Input required value={editSpecialization} onChange={(e) => setEditSpecialization(e.target.value)} className="h-11" />
                                                </div>
                                                <div className="col-span-2 space-y-1">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Bio</label>
                                                    <Input value={editBio} onChange={(e) => setEditBio(e.target.value)} className="h-11" />
                                                </div>
                                            </div>
                                            <Button type="submit" className="w-full h-12 bg-accent text-accent-foreground font-bold tracking-[0.2em] hover:bg-foreground hover:text-background transition-all uppercase text-xs">
                                                Save Changes
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
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

                                <div className="flex gap-3">
                                    {prof.status === 'ACTIVE' ? (
                                        <Button
                                            variant="outline"
                                            onClick={() => banUser(prof.id)}
                                            className="flex-1 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all text-[10px] uppercase font-bold tracking-widest h-11"
                                        >
                                            Deactivate
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onClick={() => unbanUser(prof.id)}
                                            className="flex-1 text-muted-foreground hover:text-secondary hover:bg-secondary/5 transition-all text-[10px] uppercase font-bold tracking-widest h-11"
                                        >
                                            Reactivate
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {professors.length === 0 && (
                        <div className="col-span-full py-24 text-center border-2 border-dashed border-border flex flex-col items-center justify-center space-y-4">
                            <GraduationCap size={48} className="text-muted-foreground/30" />
                            <p className="font-serif italic text-muted-foreground text-xl">No professors in the registry.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
});

export default AdminProfessors;
