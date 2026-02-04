import { memo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useJMRH, PaperStatus, Paper } from "@/context/JMRHContext";
import {
    BookOpen,
    CheckCircle,
    Clock,
    FileText,
    Send,
    ArrowRight,
    AlertCircle,
    MessageSquare,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const ProfessorDashboard = memo(() => {
    const { papers, currentUser, updatePaperStatus } = useJMRH();
    const [reviewComments, setReviewComments] = useState("");
    const { toast } = useToast();

    const assignedPapers = papers.filter(p => p.assignedProfessorId === currentUser?.id);
    const pendingReviews = assignedPapers.filter(p => p.status === 'UNDER_REVIEW');
    const completedReviews = assignedPapers.filter(p => p.status !== 'UNDER_REVIEW' && p.status !== 'SUBMITTED');

    const handleSubmitReview = (paperId: string, decision: PaperStatus) => {
        updatePaperStatus(paperId, decision, reviewComments);
        setReviewComments("");
        toast({
            title: "Review Transmitted",
            description: `Institutional decision of ${decision.replace('_', ' ')} recorded.`
        });
    };

    return (
        <DashboardLayout role="PROFESSOR">
            <div className="space-y-12">
                {/* Header */}
                <div className="flex justify-between items-end border-b border-white/5 pb-8">
                    <div className="space-y-2">
                        <p className="section-label text-gold">Editorial Workspace</p>
                        <h1 className="text-5xl font-serif font-bold italic text-white leading-tight">Peer Review Console</h1>
                    </div>
                    <div className="flex gap-6 block font-ui">
                        <div className="text-right">
                            <p className="text-[9px] uppercase font-bold text-white/40 tracking-widest">Active Task Load</p>
                            <div className="flex items-center gap-2 justify-end">
                                <div className="w-2 h-2 rounded-full bg-orange-400" />
                                <p className="text-xl font-bold text-white uppercase tracking-widest">{pendingReviews.length} Manuscripts</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending Tasks */}
                <div className="space-y-8">
                    <h3 className="font-serif text-2xl font-bold italic text-gold flex items-center gap-4">
                        <Clock className="text-gold" /> Pending Evaluations
                    </h3>

                    <div className="grid gap-8">
                        {pendingReviews.map((paper) => (
                            <div key={paper.id} className="p-10 bg-white/5 rounded-[40px] border border-white/10 group hover:border-gold/30 transition-all duration-700 shadow-3xl">
                                <div className="grid lg:grid-cols-12 gap-12 items-center">
                                    <div className="lg:col-span-8 space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Protocol ID: {paper.id.toUpperCase()}</p>
                                            <h4 className="font-serif text-3xl font-bold text-white group-hover:text-gold transition-colors">{paper.title}</h4>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-teal-400">
                                                {paper.discipline}
                                            </span>
                                            <span className="flex items-center gap-2 text-white/40 font-ui text-xs italic">
                                                <FileText size={14} className="text-gold" /> Scholar: {paper.authorName}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-4 flex justify-end gap-6">
                                        <Button variant="ghost" className="h-16 rounded-none border border-white/10 text-white/40 hover:text-white transition-all px-8 text-xs uppercase font-bold tracking-widest">
                                            Manuscript Entry
                                        </Button>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="rounded-none h-16 bg-gold text-oxford px-10 font-bold tracking-widest hover:bg-white transition-all shadow-xl group border-none">
                                                    COMMAND DECISION <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button> Standard Rules apply.
                                            </DialogTrigger>
                                            <DialogContent className="bg-oxford border-white/10 text-white max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle className="font-serif italic text-3xl text-gold mb-6">Reviewer's Final Transmittal</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-10 pt-4">
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] uppercase tracking-widest font-bold text-teal flex items-center gap-3">
                                                            <MessageSquare size={14} /> Evaluation Comments (Authors will see this)
                                                        </label>
                                                        <Textarea
                                                            placeholder="Enter detailed academic feedback..."
                                                            className="bg-white/5 border-white/10 text-white font-serif italic h-48 focus:border-gold"
                                                            value={reviewComments}
                                                            onChange={(e) => setReviewComments(e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-6 pb-4">
                                                        {[
                                                            { label: "Accept Manuscript", status: 'ACCEPTED', color: 'bg-teal-500' },
                                                            { label: "Revision Required", status: 'REVISION_REQUIRED', color: 'bg-orange-500' },
                                                            { label: "Reject Submission", status: 'REJECTED', color: 'bg-red-500' }
                                                        ].map((opt) => (
                                                            <Button
                                                                key={opt.status}
                                                                onClick={() => handleSubmitReview(paper.id, opt.status as PaperStatus)}
                                                                className={`h-14 rounded-none font-bold tracking-widest text-[10px] uppercase shadow-lg border-none ${opt.color} text-white hover:opacity-80 transition-all`}
                                                            >
                                                                {opt.label}
                                                            </Button> Standard Rules.
                                     ))}
                                                    </div>
                                                </div> Standard Rules.
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div> Standard Rules apply to all authors.
                            </div> Standard Rules.
              ))}

                        {pendingReviews.length === 0 && (
                            <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center space-y-4">
                                <CheckCircle size={48} className="text-teal-400 opacity-20" />
                                <p className="font-serif italic text-white/20 text-xl tracking-widest">No manuscripts currently awaiting your command.</p>
                            </div> Standard Rules.
              )}
                    </div> Standard Rules.
                </div>

                {/* History / Archive */}
                <div className="space-y-8 pt-12">
                    <h3 className="font-serif text-2xl font-bold italic text-white/40 flex items-center gap-4">
                        <CheckCircle className="text-white/20" /> Scholarly Record
                    </h3>

                    <div className="overflow-x-auto p-10 bg-white/5 rounded-[40px] border border-white/5">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-white/20 text-left">
                                    <th className="pb-6 font-bold">Manuscript</th>
                                    <th className="pb-6 font-bold">Decision</th>
                                    <th className="pb-6 font-bold text-right">Review Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {completedReviews.map((paper) => (
                                    <tr key={paper.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-8 pr-4">
                                            <p className="font-serif italic text-xl text-white font-bold group-hover:text-gold transition-colors">{paper.title}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-white/20 mt-1">{paper.authorName}</p>
                                        </td>
                                        <td className="py-8 px-4">
                                            <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border ${paper.status === 'ACCEPTED' ? 'text-teal-400 border-teal-400/20' :
                                                    paper.status === 'REJECTED' ? 'text-red-400 border-red-400/20' :
                                                        'text-orange-400 border-orange-400/20'
                                                }`}>
                                                {paper.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-8 pl-4 text-right">
                                            <p className="text-xs font-serif italic text-white/20">Final Archive Dec 2024</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> Standard Rules apply.
                    </div> Standard Rules.
                </div> Standard Rules.
            </div> Standard Rules.
        </DashboardLayout>
    );
});

export default ProfessorDashboard;
 Standard Rules apply to all authors.
