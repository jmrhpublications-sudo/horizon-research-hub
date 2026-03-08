import { memo, useState, FormEvent } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, User } from "@/context/JMRHContext";
import {
    Search, Mail, User as UserIcon, Ban, CheckCircle, UserPlus, Trash2, Edit, GraduationCap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const AdminUsers = memo(() => {
    const { users, papers, updateUser, banUser, unbanUser, createUser, deleteUser, updateUserRole } = useJMRH();
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "PROFESSOR" | "ADMIN">("ALL");
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

    // Edit user state
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editName, setEditName] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editDept, setEditDept] = useState("");
    const [editUniversity, setEditUniversity] = useState("");
    const [editDegree, setEditDegree] = useState("");

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        if (!newName || !newEmail || !newPassword) {
            toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
            return;
        }
        try {
            await createUser(newName, newEmail, newPassword, newRole, {
                phone: newPhone, department: newDept, affiliation: newUniversity, degree: newDegree
            });
            setOpenCreate(false);
            setNewName(""); setNewEmail(""); setNewPassword(""); setNewRole("USER");
            setNewPhone(""); setNewDept(""); setNewUniversity(""); setNewDegree("");
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const startEdit = (user: User) => {
        setEditingUser(user);
        setEditName(user.name);
        setEditPhone(user.phone || "");
        setEditDept(user.department || "");
        setEditUniversity(user.affiliation || "");
        setEditDegree(user.degree || "");
    };

    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        try {
            await updateUser(editingUser.id, {
                name: editName, phone: editPhone, department: editDept,
                affiliation: editUniversity, degree: editDegree,
            });
            toast({ title: "Updated", description: "User profile updated." });
            setEditingUser(null);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const handleDelete = async (userId: string) => {
        try {
            await deleteUser(userId);
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    const handlePromote = async (userId: string) => {
        try {
            await updateUserRole(userId, "PROFESSOR");
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
                    <div className="space-y-2">
                        <p className="section-label">Institutional Registry</p>
                        <h1 className="text-4xl font-serif font-bold text-foreground leading-tight">User Management</h1>
                        <p className="text-sm text-muted-foreground">{users.length} total accounts</p>
                    </div>

                    <div className="flex w-full md:w-auto gap-3">
                        <div className="relative flex-1 md:w-80">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-12"
                            />
                        </div>
                        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                            <DialogTrigger asChild>
                                <Button className="h-12 bg-accent text-accent-foreground px-6 font-bold tracking-widest hover:bg-foreground hover:text-background transition-all text-xs uppercase gap-2">
                                    <UserPlus size={18} /> Create Account
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="font-serif text-2xl text-accent">Create New Account</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 space-y-1">
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
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Role</label>
                                            <select
                                                value={newRole}
                                                onChange={(e) => setNewRole(e.target.value as "USER" | "PROFESSOR")}
                                                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                            >
                                                <option value="USER">Scholar (User)</option>
                                                <option value="PROFESSOR">Professor / Reviewer</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Phone</label>
                                            <Input placeholder="+91 ..." value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="h-11" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">University</label>
                                            <Input placeholder="University name" value={newUniversity} onChange={(e) => setNewUniversity(e.target.value)} className="h-11" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Department</label>
                                            <Input placeholder="Department" value={newDept} onChange={(e) => setNewDept(e.target.value)} className="h-11" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Degree</label>
                                            <Input placeholder="PhD, MSc..." value={newDegree} onChange={(e) => setNewDegree(e.target.value)} className="h-11" />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full h-12 bg-accent text-accent-foreground font-bold tracking-[0.2em] hover:bg-foreground hover:text-background transition-all uppercase text-xs">
                                        Create Account
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Role Filter */}
                <div className="flex gap-2">
                    {(["ALL", "USER", "PROFESSOR", "ADMIN"] as const).map(role => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-4 py-2 text-[10px] uppercase font-bold tracking-widest border transition-all ${
                                roleFilter === role
                                    ? "bg-accent text-accent-foreground border-accent"
                                    : "bg-card text-muted-foreground border-border hover:border-accent/30"
                            }`}
                        >
                            {role === "ALL" ? `All (${users.length})` : `${role}s (${users.filter(u => u.role === role).length})`}
                        </button>
                    ))}
                </div>

                {/* Users Table */}
                <div className="bg-card border border-border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr>
                                <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Name</th>
                                <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Email</th>
                                <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Role</th>
                                <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Status</th>
                                <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Papers</th>
                                <th className="text-left p-4 text-xs font-bold uppercase text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-muted flex items-center justify-center text-accent text-sm font-serif italic border border-border">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{user.name}</p>
                                                {user.affiliation && <p className="text-[10px] text-muted-foreground">{user.affiliation}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${
                                            user.role === 'ADMIN' ? 'bg-destructive/10 text-destructive' :
                                            user.role === 'PROFESSOR' ? 'bg-secondary/10 text-secondary' :
                                            'bg-muted text-muted-foreground'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${
                                            user.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-destructive/10 text-destructive'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">
                                        {papers.filter(p => p.authorId === user.id || p.assignedProfessorId === user.id).length}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-1">
                                            {/* Edit */}
                                            <Button size="sm" variant="ghost" onClick={() => startEdit(user)} title="Edit">
                                                <Edit size={14} />
                                            </Button>

                                            {/* Promote to Professor (only for USER role) */}
                                            {user.role === 'USER' && (
                                                <Button size="sm" variant="ghost" className="text-secondary" onClick={() => handlePromote(user.id)} title="Promote to Professor">
                                                    <GraduationCap size={14} />
                                                </Button>
                                            )}

                                            {/* Ban/Unban */}
                                            <Button 
                                                size="sm" 
                                                variant="ghost"
                                                onClick={() => user.status === 'ACTIVE' ? banUser(user.id) : unbanUser(user.id)}
                                                className={user.status === 'ACTIVE' ? 'text-orange-500' : 'text-green-600'}
                                                title={user.status === 'ACTIVE' ? 'Ban' : 'Unban'}
                                            >
                                                {user.status === 'ACTIVE' ? <Ban size={14} /> : <CheckCircle size={14} />}
                                            </Button>

                                            {/* Delete */}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="ghost" className="text-destructive" title="Delete">
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete User: {user.name}?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently delete the user account, their profile, and authentication credentials. This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                            Delete Permanently
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <UserIcon size={48} className="text-muted-foreground/30 mx-auto mb-4" />
                                        <p className="font-serif italic text-muted-foreground text-lg">No users matching your query.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Edit User Dialog */}
                <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-2xl text-accent">Edit User: {editingUser?.name}</DialogTitle>
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

export default AdminUsers;
