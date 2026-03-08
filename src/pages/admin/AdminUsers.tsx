import { memo, useState, useMemo, FormEvent } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, User } from "@/context/JMRHContext";
import {
    Search, Mail, User as UserIcon, Ban, CheckCircle, UserPlus, Trash2, Edit,
    GraduationCap, ChevronDown, ChevronUp, ArrowUpDown, Eye, X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

type SortField = "name" | "email" | "role" | "status" | "createdAt";
type SortDir = "asc" | "desc";

const AdminUsers = memo(() => {
    const { users, papers, updateUser, banUser, unbanUser, createUser, deleteUser, updateUserRole } = useJMRH();
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "PROFESSOR" | "ADMIN">("ALL");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BANNED">("ALL");
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const { toast } = useToast();

    // Create user state
    const [openCreate, setOpenCreate] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRole, setNewRole] = useState<"USER" | "PROFESSOR">("USER");
    const [newPhone, setNewPhone] = useState("");
    const [newDept, setNewDept] = useState("");
    const [newUniversity, setNewUniversity] = useState("");
    const [newDegree, setNewDegree] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [newCity, setNewCity] = useState("");
    const [newPincode, setNewPincode] = useState("");
    const [newDob, setNewDob] = useState("");
    const [newBio, setNewBio] = useState("");
    const [newSpecialization, setNewSpecialization] = useState("");
    const [newCollege, setNewCollege] = useState("");

    // Edit user state
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState<Partial<User>>({});

    // View user state
    const [viewingUser, setViewingUser] = useState<User | null>(null);

    const filteredUsers = useMemo(() => {
        let result = users.filter(u => {
            const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.affiliation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.department || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
            const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        });

        result.sort((a, b) => {
            const aVal = (a[sortField] || '').toString().toLowerCase();
            const bVal = (b[sortField] || '').toString().toLowerCase();
            return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });

        return result;
    }, [users, searchTerm, roleFilter, statusFilter, sortField, sortDir]);

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDir("asc");
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ArrowUpDown size={12} className="text-muted-foreground/40" />;
        return sortDir === "asc" ? <ChevronUp size={12} className="text-accent" /> : <ChevronDown size={12} className="text-accent" />;
    };

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        if (!newName || !newEmail || !newPassword) {
            toast({ title: "Error", description: "Name, email, and password are required.", variant: "destructive" });
            return;
        }
        try {
            await createUser(newName, newEmail, newPassword, newRole, {
                phone: newPhone, department: newDept, affiliation: newUniversity, degree: newDegree,
                address: newAddress, city: newCity, pincode: newPincode, dob: newDob,
                bio: newBio, specialization: newSpecialization, college: newCollege,
            });
            setOpenCreate(false);
            resetCreateForm();
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const resetCreateForm = () => {
        setNewName(""); setNewEmail(""); setNewPassword(""); setNewRole("USER");
        setNewPhone(""); setNewDept(""); setNewUniversity(""); setNewDegree("");
        setNewAddress(""); setNewCity(""); setNewPincode(""); setNewDob("");
        setNewBio(""); setNewSpecialization(""); setNewCollege("");
    };

    const startEdit = (user: User) => {
        setEditingUser(user);
        setEditForm({
            name: user.name, phone: user.phone, department: user.department,
            affiliation: user.affiliation, degree: user.degree, address: user.address,
            city: user.city, pincode: user.pincode, dob: user.dob, bio: user.bio,
            specialization: user.specialization, college: user.college, age: user.age,
        });
    };

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        try {
            await updateUser(editingUser.id, editForm);
            toast({ title: "Updated", description: "User profile updated successfully." });
            setEditingUser(null);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const handleDelete = async (userId: string) => {
        try { await deleteUser(userId); } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const roleCounts = useMemo(() => ({
        ALL: users.length,
        USER: users.filter(u => u.role === 'USER').length,
        PROFESSOR: users.filter(u => u.role === 'PROFESSOR').length,
        ADMIN: users.filter(u => u.role === 'ADMIN').length,
    }), [users]);

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
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">Institutional Registry</p>
                        <h1 className="text-4xl font-serif font-bold text-foreground leading-tight">User Management</h1>
                        <p className="text-sm text-muted-foreground">{users.length} total accounts • {users.filter(u => u.status === 'ACTIVE').length} active</p>
                    </div>

                    <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                        <DialogTrigger asChild>
                            <Button className="h-12 bg-accent text-accent-foreground px-6 font-bold tracking-widest hover:bg-foreground hover:text-background transition-all text-xs uppercase gap-2 shadow-md">
                                <UserPlus size={18} /> Create Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="font-serif text-2xl text-accent">Create New Account</DialogTitle>
                                <p className="text-sm text-muted-foreground">Fill in the details to create a new user or professor account with authentication.</p>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-6 pt-4">
                                {/* Account Info */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent border-b border-border pb-2">Account Credentials</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Full Name *</label>
                                            <Input required placeholder="Full name" value={newName} onChange={(e) => setNewName(e.target.value)} className="h-11" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Email *</label>
                                            <Input required type="email" placeholder="email@example.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="h-11" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Password *</label>
                                            <Input required type="password" placeholder="Min 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-11" />
                                        </div>
                                    </div>
                                    <div className="space-y-1 max-w-xs">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Role</label>
                                        <select value={newRole} onChange={(e) => setNewRole(e.target.value as any)} className="flex h-11 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                                            <option value="USER">Scholar (User)</option>
                                            <option value="PROFESSOR">Professor / Reviewer</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Personal Info */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent border-b border-border pb-2">Personal Information</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Phone</label>
                                            <Input placeholder="+91 ..." value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="h-11" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Date of Birth</label>
                                            <Input type="date" value={newDob} onChange={(e) => setNewDob(e.target.value)} className="h-11" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">City</label>
                                            <Input placeholder="City" value={newCity} onChange={(e) => setNewCity(e.target.value)} className="h-11" />
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Address</label>
                                            <Input placeholder="Full address" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} className="h-11" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Pincode</label>
                                            <Input placeholder="Pincode" value={newPincode} onChange={(e) => setNewPincode(e.target.value)} className="h-11" />
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Info */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent border-b border-border pb-2">Academic Details</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">University</label>
                                            <Input placeholder="University" value={newUniversity} onChange={(e) => setNewUniversity(e.target.value)} className="h-11" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">College</label>
                                            <Input placeholder="College" value={newCollege} onChange={(e) => setNewCollege(e.target.value)} className="h-11" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Department</label>
                                            <Input placeholder="Department" value={newDept} onChange={(e) => setNewDept(e.target.value)} className="h-11" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Degree</label>
                                            <Input placeholder="PhD, MSc..." value={newDegree} onChange={(e) => setNewDegree(e.target.value)} className="h-11" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Specialization</label>
                                            <Input placeholder="e.g. AI Ethics" value={newSpecialization} onChange={(e) => setNewSpecialization(e.target.value)} className="h-11" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Bio</label>
                                        <Textarea placeholder="Short professional bio..." value={newBio} onChange={(e) => setNewBio(e.target.value)} rows={3} />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-12 bg-accent text-accent-foreground font-bold tracking-[0.2em] hover:bg-foreground hover:text-background transition-all uppercase text-xs">
                                    Create Account
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </motion.div>

                {/* Search + Filters */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row gap-4"
                >
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, university, department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-12"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="h-12 px-4 border border-input bg-background text-sm"
                        >
                            <option value="ALL">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="BANNED">Banned</option>
                        </select>
                    </div>
                </motion.div>

                {/* Role Filter Tabs */}
                <div className="flex gap-2 flex-wrap">
                    {(["ALL", "USER", "PROFESSOR", "ADMIN"] as const).map(role => (
                        <motion.button
                            key={role}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setRoleFilter(role)}
                            className={`px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest border transition-all duration-300 ${
                                roleFilter === role
                                    ? "bg-accent text-accent-foreground border-accent shadow-sm"
                                    : "bg-card text-muted-foreground border-border hover:border-accent/30 hover:text-foreground"
                            }`}
                        >
                            {role === "ALL" ? "All" : role + "s"} ({roleCounts[role]})
                        </motion.button>
                    ))}
                </div>

                {/* Results count */}
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    Showing {filteredUsers.length} of {users.length} accounts
                </p>

                {/* Users Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card border border-border overflow-hidden shadow-sm"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/80">
                                <tr>
                                    {[
                                        { key: "name" as SortField, label: "Name" },
                                        { key: "email" as SortField, label: "Email" },
                                        { key: "role" as SortField, label: "Role" },
                                        { key: "status" as SortField, label: "Status" },
                                    ].map(col => (
                                        <th
                                            key={col.key}
                                            onClick={() => toggleSort(col.key)}
                                            className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none"
                                        >
                                            <span className="flex items-center gap-1.5">
                                                {col.label} <SortIcon field={col.key} />
                                            </span>
                                        </th>
                                    ))}
                                    <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Details</th>
                                    <th className="text-left p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                <AnimatePresence>
                                    {filteredUsers.map((user, idx) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ delay: idx * 0.02 }}
                                            className="hover:bg-muted/50 transition-colors group"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-accent/10 flex items-center justify-center text-accent text-sm font-serif italic border border-accent/20 group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground text-sm">{user.name}</p>
                                                        {user.affiliation && <p className="text-[10px] text-muted-foreground">{user.affiliation}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${
                                                    user.role === 'ADMIN' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                                                    user.role === 'PROFESSOR' ? 'bg-secondary/10 text-secondary border border-secondary/20' :
                                                    'bg-muted text-muted-foreground border border-border'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${
                                                    user.status === 'ACTIVE'
                                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                                        : 'bg-destructive/10 text-destructive border border-destructive/20'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-destructive'}`} />
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-[10px] text-muted-foreground space-y-0.5">
                                                    {user.department && <p>{user.department}</p>}
                                                    {user.degree && <p>{user.degree}</p>}
                                                    <p>{papers.filter(p => p.authorId === user.id || p.assignedProfessorId === user.id).length} papers</p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <Button size="sm" variant="ghost" onClick={() => setViewingUser(user)} title="View"><Eye size={14} /></Button>
                                                    <Button size="sm" variant="ghost" onClick={() => startEdit(user)} title="Edit"><Edit size={14} /></Button>
                                                    {user.role === 'USER' && (
                                                        <Button size="sm" variant="ghost" className="text-secondary" onClick={() => updateUserRole(user.id, 'PROFESSOR')} title="Promote">
                                                            <GraduationCap size={14} />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm" variant="ghost"
                                                        onClick={() => user.status === 'ACTIVE' ? banUser(user.id) : unbanUser(user.id)}
                                                        className={user.status === 'ACTIVE' ? 'text-orange-500' : 'text-green-600'}
                                                        title={user.status === 'ACTIVE' ? 'Ban' : 'Unban'}
                                                    >
                                                        {user.status === 'ACTIVE' ? <Ban size={14} /> : <CheckCircle size={14} />}
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant="ghost" className="text-destructive" title="Delete"><Trash2 size={14} /></Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete {user.name}?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This permanently deletes the account, profile, and auth credentials. Cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-16 text-center">
                                            <UserIcon size={48} className="text-muted-foreground/20 mx-auto mb-4" />
                                            <p className="font-serif italic text-muted-foreground text-lg">No users found.</p>
                                            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* View User Dialog */}
                <Dialog open={!!viewingUser} onOpenChange={(open) => !open && setViewingUser(null)}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        {viewingUser && (
                            <>
                                <DialogHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-accent/10 flex items-center justify-center text-accent text-2xl font-serif italic border border-accent/20">
                                            {viewingUser.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <DialogTitle className="font-serif text-2xl text-foreground">{viewingUser.name}</DialogTitle>
                                            <p className="text-sm text-muted-foreground">{viewingUser.email}</p>
                                            <div className="flex gap-2 mt-1">
                                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${
                                                    viewingUser.role === 'ADMIN' ? 'bg-destructive/10 text-destructive' :
                                                    viewingUser.role === 'PROFESSOR' ? 'bg-secondary/10 text-secondary' :
                                                    'bg-muted text-muted-foreground'
                                                }`}>{viewingUser.role}</span>
                                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${
                                                    viewingUser.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-destructive/10 text-destructive'
                                                }`}>{viewingUser.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-6 py-6">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent border-b border-border pb-2">Personal Info</h4>
                                        <InfoRow label="Phone" value={viewingUser.phone} />
                                        <InfoRow label="Date of Birth" value={viewingUser.dob} />
                                        <InfoRow label="Address" value={viewingUser.address} />
                                        <InfoRow label="City" value={viewingUser.city} />
                                        <InfoRow label="Pincode" value={viewingUser.pincode} />
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent border-b border-border pb-2">Academic Info</h4>
                                        <InfoRow label="University" value={viewingUser.affiliation} />
                                        <InfoRow label="College" value={viewingUser.college} />
                                        <InfoRow label="Department" value={viewingUser.department} />
                                        <InfoRow label="Degree" value={viewingUser.degree} />
                                        <InfoRow label="Specialization" value={viewingUser.specialization} />
                                    </div>
                                </div>
                                {viewingUser.bio && (
                                    <div className="py-4 border-t border-border">
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-2">Bio</h4>
                                        <p className="text-sm text-muted-foreground italic">{viewingUser.bio}</p>
                                    </div>
                                )}
                                {/* Papers */}
                                <div className="py-4 border-t border-border">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-3">Papers ({papers.filter(p => p.authorId === viewingUser.id || p.assignedProfessorId === viewingUser.id).length})</h4>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {papers.filter(p => p.authorId === viewingUser.id || p.assignedProfessorId === viewingUser.id).map(p => (
                                            <div key={p.id} className="p-3 bg-muted border border-border flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{p.title}</p>
                                                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{p.discipline} • {p.submissionDate}</p>
                                                </div>
                                                <span className={`text-[8px] px-2 py-0.5 border font-black uppercase tracking-widest ${p.status === 'PUBLISHED' ? 'text-secondary border-secondary/30' : 'text-accent border-accent/30'}`}>
                                                    {p.status}
                                                </span>
                                            </div>
                                        ))}
                                        {papers.filter(p => p.authorId === viewingUser.id || p.assignedProfessorId === viewingUser.id).length === 0 && (
                                            <p className="text-[10px] text-muted-foreground italic">No papers found.</p>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter className="gap-2">
                                    <Button variant="outline" onClick={() => { setViewingUser(null); startEdit(viewingUser); }}>
                                        <Edit size={14} className="mr-2" /> Edit Profile
                                    </Button>
                                    {viewingUser.role === 'USER' && (
                                        <Button variant="outline" className="text-secondary border-secondary/30" onClick={() => { updateUserRole(viewingUser.id, 'PROFESSOR'); setViewingUser(null); }}>
                                            <GraduationCap size={14} className="mr-2" /> Promote to Professor
                                        </Button>
                                    )}
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Edit User Dialog */}
                <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-2xl text-accent">Edit: {editingUser?.name}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-6 pt-4">
                            <div className="space-y-3">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent border-b border-border pb-2">Personal Information</h4>
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
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Date of Birth</label>
                                        <Input type="date" value={editForm.dob || ""} onChange={(e) => setEditForm(f => ({...f, dob: e.target.value}))} className="h-11" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Age</label>
                                        <Input value={editForm.age || ""} onChange={(e) => setEditForm(f => ({...f, age: e.target.value}))} className="h-11" />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Address</label>
                                        <Input value={editForm.address || ""} onChange={(e) => setEditForm(f => ({...f, address: e.target.value}))} className="h-11" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">City</label>
                                        <Input value={editForm.city || ""} onChange={(e) => setEditForm(f => ({...f, city: e.target.value}))} className="h-11" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Pincode</label>
                                        <Input value={editForm.pincode || ""} onChange={(e) => setEditForm(f => ({...f, pincode: e.target.value}))} className="h-11" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent border-b border-border pb-2">Academic Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">University</label>
                                        <Input value={editForm.affiliation || ""} onChange={(e) => setEditForm(f => ({...f, affiliation: e.target.value}))} className="h-11" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">College</label>
                                        <Input value={editForm.college || ""} onChange={(e) => setEditForm(f => ({...f, college: e.target.value}))} className="h-11" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Department</label>
                                        <Input value={editForm.department || ""} onChange={(e) => setEditForm(f => ({...f, department: e.target.value}))} className="h-11" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Degree</label>
                                        <Input value={editForm.degree || ""} onChange={(e) => setEditForm(f => ({...f, degree: e.target.value}))} className="h-11" />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Specialization</label>
                                        <Input value={editForm.specialization || ""} onChange={(e) => setEditForm(f => ({...f, specialization: e.target.value}))} className="h-11" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Bio</label>
                                    <Textarea value={editForm.bio || ""} onChange={(e) => setEditForm(f => ({...f, bio: e.target.value}))} rows={3} />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-foreground hover:text-background">Save Changes</Button>
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

export default AdminUsers;
