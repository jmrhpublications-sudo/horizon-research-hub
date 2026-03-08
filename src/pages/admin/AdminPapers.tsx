import { useState, memo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, Paper, User } from "@/context/JMRHContext";
import {
    BookOpen,
    CheckCircle,
    Clock,
    User as UserIcon,
    Search,
    Filter,
    GraduationCap,
    ArrowRight
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

const AdminPapers = memo(() => {
    const { papers, users, assignPaper, updatePaperStatus } = useJMRH();
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const professors = users.filter(u => u.role === 'PROFESSOR');

    const filteredPapers = papers.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssign = (paperId: string, professorId: string) => {
        const prof = professors.find(p => p.id === professorId);
        assignPaper(paperId, professorId, prof?.name || 'Unknown');
        toast({ title: "Manuscript Assigned", description: `Review protocol initiated with ${prof?.name}` });
    };

    const handlePublish = (paperId: string) => {
        updatePaperStatus(paperId, 'PUBLISHED', 'Published via Admin Console');
        toast({ title: "Manuscript Published", description: "This paper is now live in the Archives." });
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
                    <div className="space-y-2">
                        <p className="section-label">Editorial Vetting Desk</p>
                        <h1 className="text-4xl font-serif font-bold text-foreground leading-tight">Master Repository</h1>
                    </div>

                    <div className="flex w-full md:w-auto gap-3">
                        <div className="relative flex-1 md:w-80">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Identify Manuscript / Scholar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-12"
                            />
                        </div>
                        <Button variant="outline" className="h-12 w-12 p-0">
                            <Filter size={18} />
                        </Button>
                    </div>
                </div>

                {/* Papers List */}
                <div className="space-y-4">
                    {filteredPapers.map((paper) => (
                        <div key={paper.id} className="p-6 bg-card border border-border group hover:border-accent/30 transition-all duration-500 hover:shadow-md">
                            <div className="grid lg:grid-cols-12 gap-6 items-center">
                                {/* ID */}
                                <div className="lg:col-span-1 border-r border-border pr-4 space-y-1 hidden lg:block">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Index</p>
                                    <p className="font-serif italic text-lg text-accent">{paper.id.split('-')[1]?.toUpperCase()}</p>
                                </div>

                                {/* Title & Author */}
                                <div className="lg:col-span-5 space-y-2">
                                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight">{paper.title}</h3>
                                    <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">{paper.discipline}</p>
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                        <UserIcon size={14} className="text-accent" />
                                        Submitted by {paper.authorName}
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="lg:col-span-3 space-y-2">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Protocol Phase</p>
                                    <div className="flex items-center gap-2">
                                        {paper.status === 'SUBMITTED' ? <Clock size={16} className="text-orange-500" /> : <CheckCircle size={16} className="text-secondary" />}
                                        <span className={`text-xs font-bold tracking-widest uppercase ${paper.status === 'SUBMITTED' ? 'text-orange-500' : 'text-secondary'}`}>
                                            {paper.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    {paper.attachments && paper.attachments.length > 0 && (
                                        <div className="flex items-center gap-2 text-accent/60 text-[10px] uppercase tracking-widest font-bold">
                                            <BookOpen size={12} />
                                            {paper.attachments.length} Attachment{paper.attachments.length > 1 ? 's' : ''}
                                        </div>
                                    )}
                                    {paper.assignedProfessorId && (
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                            <GraduationCap size={14} className="text-secondary" />
                                            Vetted by {users.find(u => u.id === paper.assignedProfessorId)?.name}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="lg:col-span-3 flex flex-col items-end gap-2">
                                    {!paper.assignedProfessorId ? (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="w-full h-11 bg-accent text-accent-foreground font-bold tracking-widest hover:bg-foreground hover:text-background transition-all text-xs uppercase gap-2">
                                                    Initiate Vetting <ArrowRight size={14} />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle className="font-serif text-2xl text-accent">Assign Lead Reviewer</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-3 pt-4">
                                                    {professors.map((prof) => (
                                                        <button
                                                            key={prof.id}
                                                            onClick={() => handleAssign(paper.id, prof.id)}
                                                            className="w-full p-4 bg-muted border border-border hover:border-accent hover:bg-accent/5 transition-all text-left flex items-center justify-between group/prof"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-accent/10 flex items-center justify-center group-hover/prof:bg-accent transition-colors">
                                                                    <GraduationCap size={20} className="text-secondary group-hover/prof:text-accent-foreground" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-serif font-bold group-hover/prof:text-accent transition-colors">{prof.name}</p>
                                                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">{prof.email}</p>
                                                                </div>
                                                            </div>
                                                            <ArrowRight size={16} className="text-muted-foreground group-hover/prof:text-accent transition-colors" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <div className="w-full space-y-2">
                                            <div className="flex items-center justify-between px-3 py-2 bg-muted border border-border">
                                                <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-black">Lead Reviewer</span>
                                                <span className="text-[9px] uppercase tracking-widest text-accent font-bold">{users.find(u => u.id === paper.assignedProfessorId)?.name?.split(' ')[0]}</span>
                                            </div>
                                            <Button
                                                onClick={() => updatePaperStatus(paper.id, 'ACCEPTED', 'Manual Admin Override')}
                                                variant="outline"
                                                className="w-full h-10 text-secondary border-secondary/20 hover:bg-secondary hover:text-secondary-foreground text-[9px] uppercase font-bold tracking-widest transition-all"
                                            >
                                                Fast-Track Acceptance
                                            </Button>
                                        </div>
                                    )}

                                    {paper.status === 'ACCEPTED' && (
                                        <Button
                                            onClick={() => handlePublish(paper.id)}
                                            className="w-full h-11 bg-foreground text-background hover:bg-accent hover:text-accent-foreground font-black tracking-[0.15em] text-[10px] uppercase transition-all"
                                        >
                                            Commit to Archives
                                        </Button>
                                    )}
                                    {paper.status === 'PUBLISHED' && (
                                        <Button
                                            onClick={() => updatePaperStatus(paper.id, 'ARCHIVED', 'Archived by Admin')}
                                            variant="outline"
                                            className="w-full h-11 text-muted-foreground font-bold tracking-widest text-[10px] uppercase"
                                        >
                                            Move to Legacy
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredPapers.length === 0 && (
                        <div className="py-24 text-center border-2 border-dashed border-border flex flex-col items-center justify-center space-y-4">
                            <BookOpen size={48} className="text-muted-foreground/30" />
                            <p className="font-serif italic text-muted-foreground text-xl">No manuscripts archived in this directory.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
});

export default AdminPapers;
