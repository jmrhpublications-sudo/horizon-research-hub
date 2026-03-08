import { memo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH } from "@/context/JMRHContext";
import {
    Search, Mail, GraduationCap, User as UserIcon,
    Ban, CheckCircle, UserPlus
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
import { useToast } from "@/hooks/use-toast";

const AdminUsers = memo(() => {
    const { users, papers, updateUser, banUser, unbanUser } = useJMRH();
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const scholarUsers = users.filter(u => u.role === 'USER' && (
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    ));

    const handlePromote = async (userId: string) => {
        await updateUser(userId, { role: 'PROFESSOR' });
        toast({ title: "Scholar Promoted", description: "The user is now a Professor/Reviewer." });
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
                    <div className="space-y-2">
                        <p className="section-label">Institutional Registry</p>
                        <h1 className="text-4xl font-serif font-bold text-foreground leading-tight">Registered Scholars</h1>
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
                    </div>
                </div>

                {/* Users Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {scholarUsers.map(user => (
                        <div key={user.id} className="bg-card border border-border p-6 hover:border-accent/30 transition-all duration-500 group relative overflow-hidden hover:shadow-md">
                            {/* Accent Corner */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-[80px] -mr-12 -mt-12 transition-all group-hover:bg-accent/10" />

                            <div className="relative z-10 space-y-5">
                                <div className="flex items-start justify-between">
                                    <div className="w-14 h-14 bg-muted flex items-center justify-center text-accent text-xl font-serif italic border border-border">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className={`px-3 py-1 text-[9px] uppercase font-bold tracking-widest border ${user.status === 'ACTIVE' ? 'border-secondary/30 text-secondary' : 'border-destructive/30 text-destructive'}`}>
                                        {user.status}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-lg font-serif font-bold text-foreground group-hover:text-accent transition-colors">{user.name}</h3>
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs overflow-hidden text-ellipsis">
                                        <Mail size={12} /> {user.email}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="h-10 text-[9px] uppercase font-bold tracking-widest">
                                                Registry Details
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle className="font-serif text-3xl text-accent">{user.name}</DialogTitle>
                                            </DialogHeader>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                                <div className="space-y-4">
                                                    <h4 className="text-secondary uppercase tracking-widest text-xs font-bold border-b border-border pb-2">Personal Identity</h4>
                                                    <div className="space-y-3">
                                                        <div className="space-y-1"><label className="text-[10px] uppercase text-muted-foreground font-bold">Email</label><p className="font-serif text-base">{user.email}</p></div>
                                                        <div className="space-y-1"><label className="text-[10px] uppercase text-muted-foreground font-bold">Contact</label><p className="font-serif text-base">{user.phone || "N/A"}</p></div>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h4 className="text-secondary uppercase tracking-widest text-xs font-bold border-b border-border pb-2">Institutional Status</h4>
                                                    <div className="space-y-3">
                                                        <div className="space-y-1"><label className="text-[10px] uppercase text-muted-foreground font-bold">University</label><p className="font-serif text-base">{user.affiliation || "N/A"}</p></div>
                                                        <div className="space-y-1"><label className="text-[10px] uppercase text-muted-foreground font-bold">Department</label><p className="font-serif text-base">{user.department || "N/A"}</p></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Submission Portfolio */}
                                            <div className="py-4 border-t border-border">
                                                <h4 className="text-secondary uppercase tracking-widest text-xs font-bold mb-3">Submission Portfolio</h4>
                                                <div className="space-y-2">
                                                    {papers.filter(p => p.authorId === user.id).length > 0 ? (
                                                        papers.filter(p => p.authorId === user.id).map(p => (
                                                            <div key={p.id} className="p-3 bg-muted border border-border flex justify-between items-center group/paper hover:bg-accent/5 transition-all">
                                                                <div>
                                                                    <p className="text-sm font-serif font-bold group-hover/paper:text-accent transition-colors">{p.title}</p>
                                                                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">{p.discipline} | Filed: {p.submissionDate}</p>
                                                                </div>
                                                                <span className={`text-[8px] px-2 py-0.5 border border-border font-black uppercase tracking-widest ${p.status === 'PUBLISHED' ? 'text-secondary' : 'text-accent'}`}>
                                                                    {p.status}
                                                                </span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold italic">No manuscripts filed to date.</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-border">
                                                <h4 className="text-accent uppercase tracking-widest text-xs font-bold mb-3">Actions</h4>
                                                <div className="flex flex-wrap gap-3">
                                                    <Button onClick={() => handlePromote(user.id)} variant="outline" className="h-11 px-5 text-[10px] font-black tracking-widest uppercase gap-2 border-secondary/30 text-secondary hover:bg-secondary hover:text-secondary-foreground">
                                                        <UserPlus size={14} /> Promote to Professor
                                                    </Button>
                                                    {user.status === 'ACTIVE' ? (
                                                        <Button onClick={() => banUser(user.id)} variant="outline" className="h-11 px-5 text-[10px] font-black tracking-widest uppercase gap-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                                                            <Ban size={14} /> Ban Scholar
                                                        </Button>
                                                    ) : (
                                                        <Button onClick={() => unbanUser(user.id)} variant="outline" className="h-11 px-5 text-[10px] font-black tracking-widest uppercase gap-2 border-green-500/30 text-green-600 hover:bg-green-500 hover:text-white">
                                                            <CheckCircle size={14} /> Restore access
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    {user.status === 'ACTIVE' ? (
                                        <Button onClick={() => banUser(user.id)} variant="outline" className="h-10 text-destructive/60 hover:bg-destructive hover:text-destructive-foreground border-destructive/10 text-[9px] uppercase font-bold tracking-widest">
                                            Terminate
                                        </Button>
                                    ) : (
                                        <Button onClick={() => unbanUser(user.id)} variant="outline" className="h-10 text-green-600/60 hover:bg-green-500 hover:text-white border-green-500/10 text-[9px] uppercase font-bold tracking-widest">
                                            Restore
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {scholarUsers.length === 0 && (
                        <div className="col-span-full py-24 text-center border-2 border-dashed border-border flex flex-col items-center justify-center space-y-4">
                            <UserIcon size={48} className="text-muted-foreground/30" />
                            <p className="font-serif italic text-muted-foreground text-xl">No scholars matching your query.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
});

export default AdminUsers;
