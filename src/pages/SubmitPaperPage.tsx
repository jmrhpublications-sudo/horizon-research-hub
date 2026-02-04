import { useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import {
    BookOpen,
    Send,
    FileText,
    ShieldCheck,
    ArrowLeft,
    Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

const SubmitPaperPage = memo(() => {
    const [title, setTitle] = useState("");
    const [abstract, setAbstract] = useState("");
    const [discipline, setDiscipline] = useState("");
    const { submitPaper } = useJMRH();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitPaper(title, abstract, discipline);
        toast({
            title: "Manuscript Transmitted",
            description: "Successfully filed in the JMRH master repository."
        });
        navigate('/account');
    };

    const disciplines = [
        "Commerce & Management",
        "Economics & Finance",
        "Education & Psychology",
        "Social Sciences & Humanities",
        "Science & Technology",
        "Environmental & Sustainability",
        "Digital Transformation & Innovation"
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 p-6 pt-32 pb-24 relative overflow-hidden">
                <div className="container mx-auto max-w-4xl space-y-16 animate-academic-reveal">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-border pb-12">
                        <div className="space-y-6">
                            <Link to="/account" className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-teal hover:text-gold transition-colors block group">
                                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Account
                            </Link>
                            <div className="space-y-4">
                                <p className="section-label">Submission Protocol</p>
                                <h1 className="text-5xl font-serif font-bold italic text-oxford leading-tight">File New Manuscript</h1>
                            </div>
                        </div>

                        <div className="p-6 bg-oxford/5 border border-border rounded-2xl flex items-center gap-4 max-w-sm">
                            <ShieldCheck className="text-gold shrink-0" size={24} />
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted leading-relaxed">
                                Your submission will undergo a Double-Blind Peer Review protocol in full compliance with COPE.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-12 space-y-12">
                            {/* Discipline Selection */}
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-teal">Primary Academic Discipline</label>
                                <Select required onValueChange={setDiscipline}>
                                    <SelectTrigger className="w-full h-14 bg-white border-border rounded-none font-serif italic text-lg shadow-sm focus:ring-oxford">
                                        <SelectValue placeholder="Select Discipline..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-border">
                                        {disciplines.map(d => (
                                            <SelectItem key={d} value={d} className="font-serif italic text-lg hover:bg-bg-alt focus:bg-bg-alt">{d}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Title */}
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-teal">Manuscript Title</label>
                                <Input
                                    required
                                    placeholder="Enter full scholarly title of the research paper"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-white border-border h-16 rounded-none font-serif font-bold text-2xl px-6 focus:border-gold shadow-sm"
                                />
                            </div>

                            {/* Abstract */}
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-teal">Academic Abstract (250 Words Max)</label>
                                <Textarea
                                    required
                                    placeholder="Provide a concise summary of your research, methodology, and findings..."
                                    value={abstract}
                                    onChange={(e) => setAbstract(e.target.value)}
                                    className="w-full bg-white border-border h-64 rounded-none font-serif italic text-xl p-8 focus:border-gold shadow-sm resize-none"
                                />
                            </div>

                            {/* File Note */}
                            <div className="p-10 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center space-y-6 bg-white/50 group hover:border-gold transition-all duration-700">
                                <div className="w-16 h-16 bg-bg-alt flex items-center justify-center rounded-2xl group-hover:bg-gold transition-colors">
                                    <FileText size={32} className="text-teal group-hover:text-white" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="font-serif italic text-xl font-bold text-oxford">Manuscript File Protocol</h3>
                                    <p className="text-sm text-text-muted font-sans italic">Please forward your .docx / .pdf file to <span className="text-teal font-bold font-ui uppercase">submissions@jmrh.org</span> after completing this form.</p>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-gold">
                                    <Info size={14} /> File Identifier will be auto-generated
                                </div>
                            </div>

                            {/* Submit button */}
                            <div className="pt-8 border-t border-border flex justify-end">
                                <Button type="submit" className="h-20 bg-oxford text-white hover:bg-gold transition-all duration-[800ms] rounded-none px-20 font-bold tracking-[0.3em] text-xs shadow-2xl group border-none">
                                    FINALIZE TRANSMISSION <Send size={20} className="ml-4 group-hover:translate-x-2 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
});

export default SubmitPaperPage;
