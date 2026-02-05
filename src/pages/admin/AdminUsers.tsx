
import { memo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH } from "@/context/JMRHContext";
import {
    Search, Filter, Mail, Phone, MapPin,
    GraduationCap, Building, BookOpen, User as UserIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

const AdminUsers = memo(() => {
    const { users, papers } = useJMRH();
    const [searchTerm, setSearchTerm] = useState("");

    // Filter only standard USER role
    const scholarUsers = users.filter(u => u.role === 'USER' && (
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    ));

    const getUserPapers = (userId: string) => papers.filter(p => p.authorId === userId);

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                    <div className="space-y-2">
                        <p className="section-label">Institutional Registry</p>
                        <h1 className="text-5xl font-serif font-bold italic text-white leading-tight">Registered Scholars</h1>
                    </div>

                    <div className="flex w-full md:w-auto gap-4">
                        <div className="relative flex-1 md:w-80">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 bg-white/5 border-white/10 text-white italic h-14 rounded-none h-14"
                            />
                        </div>
                        <Button variant="ghost" className="h-14 w-14 rounded-none border border-white/10 text-white/40 hover:text-white transition-all p-0">
                            <Filter size={20} />
                        </Button>
                    </div>
                </div>

                {/* Users Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {scholarUsers.map(user => (
                        <div key={user.id} className="bg-white/5 border border-white/10 p-8 rounded-[32px] hover:border-gold/30 transition-all duration-500 group relative overflow-hidden">
                            {/* Accents */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-[100px] -mr-16 -mt-16 transition-all group-hover:bg-gold/10" />

                            <div className="relative z-10 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-gold text-2xl font-serif italic">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className={`px-4 py-1 rounded-full text-[9px] uppercase font-bold tracking-widest border ${user.status === 'ACTIVE' ? 'border-teal-500/30 text-teal-400' : 'border-red-500/30 text-red-400'}`}>
                                        {user.status}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-gold transition-colors">{user.name}</h3>
                                    <div className="flex items-center gap-2 text-white/40 text-xs">
                                        <Mail size={12} /> {user.email}
                                    </div>
                                </div>

                                {/* Quick Stats / Info Preview */}
                                <div className="space-y-3 pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-sm text-white/60">
                                        <Building size={14} className="text-teal-400" />
                                        <span className="truncate">{user.university || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-white/60">
                                        <GraduationCap size={14} className="text-teal-400" />
                                        <span className="truncate">{user.degree || "N/A"}</span>
                                    </div>
                                </div>

                                {/* Full Details Dialog */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="w-full h-12 mt-4 bg-white/5 hover:bg-gold text-white hover:text-black font-bold tracking-widest text-[10px] uppercase transition-all">
                                            View Full Profile
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-h-[90vh] overflow-y-auto bg-oxford border-white/10 text-white">
                                        <DialogHeader>
                                            <DialogTitle className="font-serif italic text-3xl text-gold">{user.name}</DialogTitle>
                                        </DialogHeader>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                                            <div className="space-y-6">
                                                <h4 className="text-teal-400 uppercase tracking-widest text-xs font-bold border-b border-white/10 pb-2">Personal Identity</h4>

                                                <div className="space-y-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] uppercase text-white/40 font-bold">Full Name</label>
                                                        <p className="font-serif text-lg">{user.name}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] uppercase text-white/40 font-bold flex items-center gap-2"><Mail size={10} /> Email</label>
                                                        <p className="font-serif text-lg">{user.email}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] uppercase text-white/40 font-bold flex items-center gap-2"><Phone size={10} /> Contact</label>
                                                        <p className="font-serif text-lg">{user.phoneNumber || "N/A"}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] uppercase text-white/40 font-bold">Age</label>
                                                        <p className="font-serif text-lg">{user.age || "N/A"}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] uppercase text-white/40 font-bold flex items-center gap-2"><MapPin size={10} /> Address</label>
                                                        <p className="font-serif text-lg text-white/80">{user.address || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <h4 className="text-teal-400 uppercase tracking-widest text-xs font-bold border-b border-white/10 pb-2">Academic Credentials</h4>

                                                <div className="space-y-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] uppercase text-white/40 font-bold flex items-center gap-2"><GraduationCap size={10} /> Education Level</label>
                                                        <p className="font-serif text-lg">{user.degree || "N/A"}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] uppercase text-white/40 font-bold flex items-center gap-2"><Building size={10} /> Institution</label>
                                                        <p className="font-serif text-lg">{user.university || "N/A"}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] uppercase text-white/40 font-bold">College</label>
                                                        <p className="font-serif text-lg">{user.college || "N/A"}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] uppercase text-white/40 font-bold flex items-center gap-2"><BookOpen size={10} /> Department</label>
                                                        <p className="font-serif text-lg">{user.department || "N/A"}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] uppercase text-white/40 font-bold">Study Mode</label>
                                                        <p className="font-serif text-lg">{user.studyType || "N/A"}</p>
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t border-white/10">
                                                    <h4 className="text-gold uppercase tracking-widest text-xs font-bold mb-4">Submission Portfolio</h4>
                                                    <div className="space-y-3">
                                                        {getUserPapers(user.id).length > 0 ? (
                                                            getUserPapers(user.id).map(p => (
                                                                <div key={p.id} className="p-3 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center group/paper hover:bg-white/10 transition-colors">
                                                                    <div className="space-y-1">
                                                                        <span className="font-serif text-sm block truncate max-w-[200px] text-white group-hover/paper:text-gold transition-colors">{p.title}</span>
                                                                        <span className="text-[9px] text-white/40">{p.id}</span>
                                                                    </div>
                                                                    <span className={`text-[9px] uppercase font-bold px-2 py-1 rounded ${p.status === 'PUBLISHED' ? 'bg-teal-500/20 text-teal-400' : 'bg-white/10 text-white/40'}`}>{p.status.replace('_', ' ')}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-white/20 italic">No manuscripts filed.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    ))}

                    {scholarUsers.length === 0 && (
                        <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center space-y-4">
                            <UserIcon size={48} className="text-white/10" />
                            <p className="font-serif italic text-white/20 text-xl tracking-widest">No scholars matching your query.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
});

export default AdminUsers;
