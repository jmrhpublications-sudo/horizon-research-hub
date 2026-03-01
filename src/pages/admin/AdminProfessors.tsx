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
    MoreVertical
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

    // Create State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [openCreate, setOpenCreate] = useState(false);

    // Details State
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [dept, setDept] = useState("");
    const [university, setUniversity] = useState("");
    const [degree, setDegree] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [bio, setBio] = useState("");

    // Edit State
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
            phone: phone,
            department: dept,
            affiliation: university,
            degree: degree,
        });

        // Reset Form
        setName(""); setEmail(""); setPhone(""); setAddress("");
        setDept(""); setUniversity(""); setDegree(""); setSpecialization(""); setBio("");
        setOpenCreate(false);

        toast({ title: "Professor Account Initialized", description: `Access credentials issued for ${name}` });
    };

    const startEdit = (prof: any) => {
        setEditingProf(prof.id);
        setEditName(prof.name);
        setEditEmail(prof.email);
        setEditPhone(prof.phone || "");
        setEditAddress("");
        setEditDept(prof.department || "");
        setEditUniversity(prof.affiliation || "");
        setEditDegree(prof.degree || "");
        setEditSpecialization("");
        setEditBio("");
    };

    const handleUpdate = (e: FormEvent) => {
        e.preventDefault();
        if (!editingProf) return;

        updateUser(editingProf, {
            name: editName,
            email: editEmail,
            phone: editPhone,
            department: editDept,
            affiliation: editUniversity,
            degree: editDegree,
        });

        setEditingProf(null);
        toast({ title: "Professor Profile Updated", description: "All changes have been saved to the registry." });
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/5 pb-8">
                    <div className="space-y-2">
                        <p className="section-label">Editorial Council</p>
                        <h1 className="text-5xl font-serif font-bold italic text-oxford leading-tight">Board Management</h1>
                    </div>

                    <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                        <DialogTrigger asChild>
                            <Button className="rounded-none h-14 bg-gold text-oxford px-8 font-bold tracking-widest hover:bg-oxford hover:text-white transition-all shadow-xl flex items-center gap-3">
                                <Plus size={18} /> INITIALIZE PROFESSOR ACCOUNT
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-black/10 text-oxford max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="font-serif italic text-2xl text-gold">Assign New Member</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-6 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">Full Scholarly Name</label>
                                        <Input required placeholder="Dr. Researcher Name" value={name} onChange={(e) => setName(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">Institutional Email</label>
                                        <Input required type="email" placeholder="scholar@institution.edu" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">Phone Number</label>
                                        <Input required placeholder="+1 234..." value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">Current Address</label>
                                        <Input required placeholder="City, Country" value={address} onChange={(e) => setAddress(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">University / Institution</label>
                                        <Input required placeholder="University name" value={university} onChange={(e) => setUniversity(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">Department</label>
                                        <Input required placeholder="e.g. Computer Science" value={dept} onChange={(e) => setDept(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">Academic Degree/Title</label>
                                        <Input required placeholder="PhD, MSc, etc." value={degree} onChange={(e) => setDegree(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">Specialization</label>
                                        <Input required placeholder="e.g. AI Ethics" value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">Biography</label>
                                        <Input placeholder="Short professional bio..." value={bio} onChange={(e) => setBio(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-12 rounded-none bg-gold text-oxford font-bold tracking-[0.2em] hover:bg-oxford hover:text-white transition-all">
                                    CONFIRM ACCOUNT ISSUANCE
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {professors.map((prof) => (
                        <div key={prof.id} className="p-8 bg-white border border-black/5 rounded-2xl group hover:border-gold/30 transition-all duration-700 relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-sm hover:shadow-md">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <Dialog open={editingProf === prof.id} onOpenChange={(open) => !open && setEditingProf(null)}>
                                    <DialogTrigger asChild>
                                        <button onClick={() => startEdit(prof)} className="text-oxford/20 hover:text-gold transition-colors">
                                            <CheckCircle size={20} />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-white border-black/10 text-oxford max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle className="font-serif italic text-2xl text-gold">Edit Member Profile</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleUpdate} className="space-y-6 pt-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2 space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">Name</label>
                                                    <Input required value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                                </div>
                                                <div className="col-span-2 space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">Email</label>
                                                    <Input required type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">Phone</label>
                                                    <Input required value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">Address</label>
                                                    <Input required value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">University</label>
                                                    <Input required value={editUniversity} onChange={(e) => setEditUniversity(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">Department</label>
                                                    <Input required value={editDept} onChange={(e) => setEditDept(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">Degree</label>
                                                    <Input required value={editDegree} onChange={(e) => setEditDegree(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">Specialization</label>
                                                    <Input required value={editSpecialization} onChange={(e) => setEditSpecialization(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                                </div>
                                                <div className="col-span-2 space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest font-bold text-oxford/60">Bio</label>
                                                    <Input value={editBio} onChange={(e) => setEditBio(e.target.value)} className="bg-white border-black/10 text-oxford italic h-12" />
                                                </div>
                                            </div>
                                            <Button type="submit" className="w-full h-12 rounded-none bg-gold text-oxford font-bold tracking-[0.2em] hover:bg-oxford hover:text-white transition-all">
                                                SAVE CHANGES
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="space-y-6">
                                <div className="w-16 h-16 bg-oxford/10 flex items-center justify-center rounded-2xl group-hover:bg-gold transition-all duration-700">
                                    <GraduationCap size={32} className="text-oxford group-hover:text-white" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-serif text-2xl font-bold text-oxford group-hover:text-gold transition-colors">{prof.name}</h3>
                                    <p className="text-[10px] uppercase tracking-widest text-oxford/40 font-bold">{prof.degree} • {prof.affiliation}</p>
                                    <p className="text-[10px] italic text-teal-500/80">{prof.department}</p>
                                </div>
                            </div>

                            <div className="space-y-6 pt-10 mt-auto border-t border-black/5">
                                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-bold">
                                    <span className="text-oxford/20">Status</span>
                                    <span className={prof.status === 'ACTIVE' ? "text-teal-500" : "text-red-500"}>{prof.status}</span>
                                </div>

                                <div className="flex gap-4">
                                    {prof.status === 'ACTIVE' ? (
                                        <Button
                                            variant="ghost"
                                            onClick={() => banUser(prof.id)}
                                            className="flex-1 rounded-none border border-black/10 text-oxford/40 hover:text-red-500 hover:bg-red-50 transition-all text-[10px] uppercase font-bold tracking-widest h-12"
                                        >
                                            Deactivate
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            onClick={() => unbanUser(prof.id)}
                                            className="flex-1 rounded-none border border-black/10 text-oxford/40 hover:text-teal-500 hover:bg-teal-50 transition-all text-[10px] uppercase font-bold tracking-widest h-12"
                                        >
                                            Authorize
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {professors.length === 0 && (
                        <div className="lg:col-span-3 py-32 text-center border-2 border-dashed border-black/5 rounded-2xl flex flex-col items-center justify-center space-y-4">
                            <AlertCircle size={48} className="text-oxford/10" />
                            <p className="font-serif italic text-oxford/20 text-xl tracking-widest">No board members found in the current directive.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
});

export default AdminProfessors;
