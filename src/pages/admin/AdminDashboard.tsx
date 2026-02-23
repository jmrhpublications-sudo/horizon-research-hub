import { memo, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, UserRole } from "@/context/JMRHContext";
import {
    Users,
    BookOpen,
    GraduationCap,
    Clock,
    CheckCircle,
    Plus,
    Trash2,
    Edit,
    Send,
    Eye,
    Download,
    Globe,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = memo(() => {
    const { users, papers, professors, assignPaper, updatePaperStatus, publishPaper, createUser } = useJMRH();
    const [activeTab, setActiveTab] = useState<"papers" | "users" | "professors">("papers");
    const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [selectedPaper, setSelectedPaper] = useState<any>(null);
    const [selectedProfessor, setSelectedProfessor] = useState("");
    
    // New user form
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const [newUserRole, setNewUserRole] = useState<UserRole>("USER");
    const [newUserAffiliation, setNewUserAffiliation] = useState("");
    
    const { toast } = useToast();

    const professorsList = users.filter(u => u.role === 'PROFESSOR');
    const regularUsers = users.filter(u => u.role === 'USER');
    
    const submittedPapers = papers.filter(p => p.status === 'SUBMITTED');
    const underReviewPapers = papers.filter(p => p.status === 'UNDER_REVIEW');
    const acceptedPapers = papers.filter(p => p.status === 'ACCEPTED');
    const publishedPapers = papers.filter(p => p.status === 'PUBLISHED');
    
    const journalPapers = papers.filter(p => p.paperType === 'JOURNAL' && p.status === 'PUBLISHED');
    const bookPapers = papers.filter(p => p.paperType === 'BOOK' && p.status === 'PUBLISHED');

    const stats = [
        { label: "Published Journal Papers", value: journalPapers.length, icon: BookOpen, color: "text-gold" },
        { label: "Published Book Chapters", value: bookPapers.length, icon: BookOpen, color: "text-teal-400" },
        { label: "Pending Review", value: submittedPapers.length, icon: Clock, color: "text-orange-400" },
        { label: "Total Users", value: users.length, icon: Users, color: "text-blue-400" },
    ];

    const handleAssignProfessor = () => {
        if (!selectedPaper || !selectedProfessor) return;
        const professor = professorsList.find(p => p.id === selectedProfessor);
        if (professor) {
            assignPaper(selectedPaper.id, professor.id, professor.name);
            setIsAssignOpen(false);
            setSelectedPaper(null);
            setSelectedProfessor("");
        }
    };

    const handlePublishPaper = (paper: any) => {
        publishPaper(paper.id);
    };

    const handleCreateUser = () => {
        if (!newUserName || !newUserEmail || !newUserPassword) {
            toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
            return;
        }
        createUser(newUserName, newUserEmail, newUserPassword, newUserRole, { affiliation: newUserAffiliation });
        setIsCreateUserOpen(false);
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserRole("USER");
        setNewUserAffiliation("");
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex justify-between items-end border-b border-white/5 pb-6">
                    <div className="space-y-2">
                        <p className="section-label">Admin Control Panel</p>
                        <h1 className="text-4xl font-serif font-bold text-oxford">Dashboard</h1>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="p-6 bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <p className="text-3xl font-bold text-oxford">{stat.value}</p>
                            <p className="text-xs text-oxford/50 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-black/10">
                    <button
                        onClick={() => setActiveTab("papers")}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === "papers" ? "border-gold text-oxford" : "border-transparent text-oxford/50"}`}
                    >
                        All Papers
                    </button>
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === "users" ? "border-gold text-oxford" : "border-transparent text-oxford/50"}`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab("professors")}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === "professors" ? "border-gold text-oxford" : "border-transparent text-oxford/50"}`}
                    >
                        Professors
                    </button>
                </div>

                {/* Papers Tab */}
                {activeTab === "papers" && (
                    <div className="space-y-6">
                        <div className="bg-white border border-black/5 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-oxford/5">
                                    <tr>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Title</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Type</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Author</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Status</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Assigned To</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    {papers.map((paper) => (
                                        <tr key={paper.id} className="hover:bg-oxford/5 transition-colors">
                                            <td className="p-4">
                                                <p className="font-medium text-oxford line-clamp-1">{paper.title}</p>
                                                <p className="text-xs text-oxford/50">{paper.discipline}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-bold uppercase ${paper.paperType === 'JOURNAL' ? 'bg-gold/10 text-gold' : 'bg-teal-500/10 text-teal-600'}`}>
                                                    {paper.paperType}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-oxford/70">{paper.authorName}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-bold uppercase ${
                                                    paper.status === 'SUBMITTED' ? 'bg-orange-100 text-orange-600' :
                                                    paper.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-600' :
                                                    paper.status === 'ACCEPTED' ? 'bg-green-100 text-green-600' :
                                                    paper.status === 'PUBLISHED' ? 'bg-gold/20 text-gold' :
                                                    'bg-red-100 text-red-600'
                                                }`}>
                                                    {paper.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-oxford/70">
                                                {paper.assignedProfessorName || "-"}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    {paper.status === 'SUBMITTED' && (
                                                        <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                                                            <DialogTrigger asChild>
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="outline"
                                                                    onClick={() => setSelectedPaper(paper)}
                                                                >
                                                                    <Send size={14} className="mr-1" /> Assign
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Assign to Professor</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="py-4">
                                                                    <Select onValueChange={setSelectedProfessor} value={selectedProfessor}>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select Professor" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {professorsList.map(p => (
                                                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <DialogFooter>
                                                                    <Button onClick={handleAssignProfessor}>Assign</Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    )}
                                                    
                                                    {paper.status === 'ACCEPTED' && (
                                                        <Button 
                                                            size="sm"
                                                            className="bg-gold hover:bg-gold/80"
                                                            onClick={() => handlePublishPaper(paper)}
                                                        >
                                                            <Globe size={14} className="mr-1" /> Publish
                                                        </Button>
                                                    )}
                                                    
                                                    {paper.status === 'PUBLISHED' && (
                                                        <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                                                            <CheckCircle size={14} /> Published
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {papers.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-oxford/50">
                                                No papers submitted yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === "users" && (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-oxford hover:bg-gold">
                                        <Plus size={16} className="mr-2" /> Create User
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create New User</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <Input 
                                            placeholder="Full Name" 
                                            value={newUserName}
                                            onChange={(e) => setNewUserName(e.target.value)}
                                        />
                                        <Input 
                                            placeholder="Email" 
                                            type="email"
                                            value={newUserEmail}
                                            onChange={(e) => setNewUserEmail(e.target.value)}
                                        />
                                        <Input 
                                            placeholder="Password" 
                                            type="password"
                                            value={newUserPassword}
                                            onChange={(e) => setNewUserPassword(e.target.value)}
                                        />
                                        <Select onValueChange={(v) => setNewUserRole(v as UserRole)} value={newUserRole}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USER">User</SelectItem>
                                                <SelectItem value="PROFESSOR">Professor</SelectItem>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input 
                                            placeholder="Affiliation" 
                                            value={newUserAffiliation}
                                            onChange={(e) => setNewUserAffiliation(e.target.value)}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleCreateUser}>Create User</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="bg-white border border-black/5 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-oxford/5">
                                    <tr>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Name</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Email</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Role</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Status</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase text-oxford/60">Papers</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-oxford/5">
                                            <td className="p-4 font-medium text-oxford">{user.name}</td>
                                            <td className="p-4 text-sm text-oxford/70">{user.email}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-bold uppercase ${
                                                    user.role === 'ADMIN' ? 'bg-red-100 text-red-600' :
                                                    user.role === 'PROFESSOR' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-bold uppercase ${
                                                    user.status === 'ACTIVE' ? 'bg-green-100 text-green-600' :
                                                    'bg-red-100 text-red-600'
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-oxford/70">
                                                {papers.filter(p => p.authorId === user.id).length}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Professors Tab */}
                {activeTab === "professors" && (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-oxford hover:bg-gold">
                                        <Plus size={16} className="mr-2" /> Add Professor
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create Professor Account</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <Input 
                                            placeholder="Full Name" 
                                            value={newUserName}
                                            onChange={(e) => setNewUserName(e.target.value)}
                                        />
                                        <Input 
                                            placeholder="Email" 
                                            type="email"
                                            value={newUserEmail}
                                            onChange={(e) => setNewUserEmail(e.target.value)}
                                        />
                                        <Input 
                                            placeholder="Password" 
                                            type="password"
                                            value={newUserPassword}
                                            onChange={(e) => setNewUserPassword(e.target.value)}
                                        />
                                        <Input 
                                            placeholder="Affiliation" 
                                            value={newUserAffiliation}
                                            onChange={(e) => setNewUserAffiliation(e.target.value)}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={() => {
                                            setNewUserRole("PROFESSOR");
                                            handleCreateUser();
                                        }}>Create Professor</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {professorsList.map((prof) => {
                                const profPapers = papers.filter(p => p.assignedProfessorId === prof.id);
                                return (
                                    <div key={prof.id} className="p-6 bg-white border border-black/5 hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-oxford/10 rounded-full flex items-center justify-center">
                                                <GraduationCap className="w-6 h-6 text-oxford" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-oxford">{prof.name}</h3>
                                                <p className="text-sm text-oxford/60">{prof.email}</p>
                                                <p className="text-xs text-oxford/50 mt-1">{prof.affiliation}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-black/5 flex justify-between text-sm">
                                            <span className="text-oxford/60">Papers Assigned:</span>
                                            <span className="font-bold text-oxford">{profPapers.length}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {professorsList.length === 0 && (
                                <div className="col-span-full p-8 text-center text-oxford/50">
                                    No professors added yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
});

export default AdminDashboard;
