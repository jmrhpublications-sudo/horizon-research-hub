import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import {
    BookOpen, Send, Clock, CheckCircle, LogOut, Plus, ArrowRight,
    ShieldCheck, Edit3, FileText, User, Calendar, XCircle, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageShell from "@/components/layout/PageShell";
import { motion } from "framer-motion";

const statusConfig: Record<string, { icon: any; label: string; className: string }> = {
    SUBMITTED: { icon: Clock, label: "Submitted", className: "bg-orange-100 text-orange-700 border-orange-200" },
    UNDER_REVIEW: { icon: BookOpen, label: "Under Review", className: "bg-blue-100 text-blue-700 border-blue-200" },
    REVISION_REQUIRED: { icon: AlertCircle, label: "Revision Required", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    ACCEPTED: { icon: CheckCircle, label: "Accepted", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    REJECTED: { icon: XCircle, label: "Rejected", className: "bg-red-100 text-red-700 border-red-200" },
    PUBLISHED: { icon: CheckCircle, label: "Published", className: "bg-green-100 text-green-700 border-green-200" },
};

const AccountPage = memo(() => {
    const { papers, currentUser, logout } = useJMRH();
    const navigate = useNavigate();

    const myPapers = papers.filter(p => p.authorId === currentUser?.id);
    const submitted = myPapers.filter(p => p.status === 'SUBMITTED').length;
    const underReview = myPapers.filter(p => p.status === 'UNDER_REVIEW').length;
    const accepted = myPapers.filter(p => p.status === 'ACCEPTED' || p.status === 'PUBLISHED').length;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <PageShell
            title="My Dashboard | JMRH Publications"
            description="Manage your manuscript submissions, track review status, and access your JMRH researcher account."
            keywords="JMRH dashboard, manuscript submissions, researcher account"
            canonical="/account"
        >
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Researcher Dashboard</p>
                        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                            Welcome, {currentUser?.name?.split(' ')[0]}
                        </h1>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <ShieldCheck size={14} className="text-accent" />
                            {currentUser?.email}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild size="sm" className="gap-2">
                            <Link to="/submit-paper"><Plus size={14} /> New Submission</Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 text-destructive hover:text-destructive">
                            <LogOut size={14} /> Logout
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center">
                                <FileText size={16} className="text-accent" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-foreground">{myPapers.length}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Clock size={16} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-foreground">{submitted + underReview}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">In Review</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <CheckCircle size={16} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-foreground">{accepted}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Accepted</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-secondary/10 rounded-lg flex items-center justify-center">
                                <Send size={16} className="text-secondary" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-foreground">{submitted}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Pending</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid sm:grid-cols-3 gap-3">
                    <Link to="/submit-paper" className="bg-card border border-border p-4 rounded-lg flex items-center gap-4 hover:border-accent/40 hover:shadow-sm transition-all">
                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                            <Send size={18} className="text-accent" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground text-sm">Submit Manuscript</p>
                            <p className="text-xs text-muted-foreground">Start a new submission</p>
                        </div>
                    </Link>
                    <Link to="/my-documents" className="bg-card border border-border p-4 rounded-lg flex items-center gap-4 hover:border-accent/40 hover:shadow-sm transition-all">
                        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                            <FileText size={18} className="text-secondary" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground text-sm">My Documents</p>
                            <p className="text-xs text-muted-foreground">View uploaded files</p>
                        </div>
                    </Link>
                    <Link to="/request-upload" className="bg-card border border-border p-4 rounded-lg flex items-center gap-4 hover:border-accent/40 hover:shadow-sm transition-all">
                        <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                            <BookOpen size={18} className="text-gold" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground text-sm">Request Upload</p>
                            <p className="text-xs text-muted-foreground">Ask admin to publish</p>
                        </div>
                    </Link>
                </div>

                {/* Submissions */}
                <div className="space-y-4">
                    <h2 className="font-serif text-xl font-bold text-foreground">My Submissions</h2>
                    
                    {myPapers.length > 0 ? (
                        myPapers.map((paper, idx) => {
                            const config = statusConfig[paper.status] || statusConfig.SUBMITTED;
                            const StatusIcon = config.icon;
                            return (
                                <motion.div key={paper.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                    className="bg-card border border-border rounded-lg p-4 sm:p-5 hover:border-accent/20 transition-all">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge className={`text-[9px] uppercase tracking-widest ${config.className}`}>
                                                    <StatusIcon size={10} className="mr-1" /> {config.label}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground">{paper.discipline}</span>
                                            </div>
                                            <h3 className="font-serif font-bold text-foreground">{paper.title}</h3>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {paper.submissionDate}</span>
                                                {paper.attachments?.length ? (
                                                    <span className="flex items-center gap-1"><FileText size={12} /> {paper.attachments.length} file(s)</span>
                                                ) : null}
                                            </div>
                                            {paper.revisionComments && (
                                                <div className="bg-muted/50 p-3 rounded text-xs text-muted-foreground italic border-l-2 border-accent mt-2">
                                                    "{paper.revisionComments}"
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            {paper.status === 'SUBMITTED' && (
                                                <Button asChild variant="outline" size="sm" className="gap-1">
                                                    <Link to={`/submit-paper/${paper.id}`}><Edit3 size={14} /> Edit</Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="py-16 text-center border-2 border-dashed border-border rounded-lg">
                            <BookOpen size={48} className="text-muted-foreground/20 mx-auto mb-4" />
                            <h3 className="font-serif text-lg text-muted-foreground">No submissions yet</h3>
                            <p className="text-sm text-muted-foreground mt-1 mb-4">Submit your first manuscript to begin your publishing journey.</p>
                            <Button asChild size="sm">
                                <Link to="/submit-paper"><Plus size={14} className="mr-1" /> Submit Manuscript</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </PageShell>
    );
});

export default AccountPage;
