import { useState, memo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH } from "@/context/JMRHContext";
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    ShieldCheck,
    ShieldAlert,
    Mail,
    Calendar,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const AdminUsers = memo(() => {
    const { users, banUser, unbanUser } = useJMRH();
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const researchers = users.filter(u => u.role === 'USER');
    const filteredUsers = researchers.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleStatus = (userId: string, currentStatus: string) => {
        if (currentStatus === 'ACTIVE') {
            banUser(userId);
            toast({ title: "Account Deactivated", description: "The researcher's access has been terminated.", variant: "destructive" });
        } else {
            unbanUser(userId);
            toast({ title: "Account Reinstated", description: "The researcher's access has been restored.", variant: "default" });
        }
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                    <div className="space-y-2">
                        <p className="section-label">Institutional Registry</p>
                        <h1 className="text-5xl font-serif font-bold italic text-white leading-tight">Researcher Directory</h1>
                    </div>

                    <div className="flex w-full md:w-auto gap-4">
                        <div className="relative flex-1 md:w-80">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                            <Input
                                placeholder="Locate Scholar..."
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredUsers.map((user) => (
                        <div key={user.id} className="p-10 bg-white/5 rounded-[40px] border border-white/10 group hover:border-gold/30 transition-all duration-700 shadow-3xl flex flex-col justify-between min-h-[350px] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal/5 blur-3xl -mr-16 -mt-16 group-hover:bg-gold/5 transition-all duration-1000" />

                            <div className="space-y-8 relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center rounded-2xl group-hover:bg-teal transition-all duration-700">
                                        <Users size={32} className="text-white/20 group-hover:text-white" />
                                    </div>
                                    <span className={`text-[9px] uppercase font-bold tracking-[0.3em] px-3 py-1 rounded-full border ${user.status === 'ACTIVE' ? 'text-teal-400 border-teal-400/20 bg-teal-400/5' : 'text-red-400 border-red-400/20 bg-red-400/5'
                                        }`}>
                                        {user.status}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-serif text-2xl font-bold text-white group-hover:text-gold transition-colors">{user.name}</h3>
                                    <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold tracking-widest uppercase font-ui">
                                        <Mail size={12} className="text-gold" /> {user.email}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 pt-10 mt-auto border-t border-white/5 relative z-10">
                                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={12} /> Filed On {user.createdAt}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        variant="ghost"
                                        onClick={() => toggleStatus(user.id, user.status)}
                                        className={`flex-1 rounded-none border border-white/10 text-[10px] uppercase font-bold tracking-widest h-14 transition-all duration-500 hover:shadow-lg ${user.status === 'ACTIVE' ? 'text-white/40 hover:text-red-400 hover:bg-red-400/5' : 'text-white/40 hover:text-teal-400 hover:bg-teal-400/5'
                                            }`}
                                    >
                                        {user.status === 'ACTIVE' ? (
                                            <span className="flex items-center gap-2 italic"><ShieldAlert size={14} /> Terminate Access</span>
                                        ) : (
                                            <span className="flex items-center gap-2 italic"><ShieldCheck size={14} /> Reinstate Access</span>
                                        )}
                                    </Button> Standard Rules applied to all scholars.
                                </div>
                            </div> Standard Rules apply.
                        </div> Standard Rules.
          ))}

                    {filteredUsers.length === 0 && (
                        <div className="md:col-span-3 py-32 text-center border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center space-y-4">
                            <AlertCircle size={48} className="text-white/10" />
                            <p className="font-serif italic text-white/20 text-xl tracking-widest uppercase">No academic records match this inquiry.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
});

export default AdminUsers;
 Standard Rules apply to all authors.
