import { memo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { useJMRH } from "@/context/JMRHContext";
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const JournalArchives = memo(() => {
    const { publishedJournals } = useJMRH();
    const [viewingJournal, setViewingJournal] = useState<any>(null);
    const [pdfViewUrl, setPdfViewUrl] = useState<string | null>(null);
    const { toast } = useToast();

    const allJournals = publishedJournals
        .filter(j => j.status === 'PUBLISHED')
        .map(j => ({
            id: j.id,
            title: j.title,
            authors: j.authors,
            affiliation: j.affiliation || "",
            abstract: j.abstract,
            keywords: j.keywords,
            volume: j.volume || 1,
            issue: j.issue || 1,
            publicationDate: j.publicationDate,
            pdfUrl: j.pdfUrl,
        }));

    // Group by volume and issue
    const issues = allJournals.reduce((acc, journal) => {
        const key = `Volume ${journal.volume}, Issue ${journal.issue}`;
        if (!acc[key]) {
            acc[key] = {
                volume: journal.volume,
                issue: journal.issue,
                date: new Date(journal.publicationDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                papers: []
            };
        }
        acc[key].papers.push(journal);
        return acc;
    }, {} as Record<string, { volume: number; issue: number; date: string; papers: typeof allJournals }>);

    const issueList = Object.entries(issues)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([key, value]) => ({ key, ...value }));

    const getPublicUrl = (filePath: string) => {
        if (!filePath) return null;
        if (filePath.startsWith('http')) return filePath;
        const { data } = supabase.storage.from('publications').getPublicUrl(filePath);
        return data?.publicUrl || null;
    };

    const handleView = (journal: any) => {
        const url = getPublicUrl(journal.pdfUrl);
        if (url) {
            setPdfViewUrl(url);
            setViewingJournal(journal);
        } else {
            toast({ title: "No PDF", description: "No document available for this article.", variant: "destructive" });
        }
    };

    const handleDownload = (journal: any) => {
        const url = getPublicUrl(journal.pdfUrl);
        if (url) {
            const a = document.createElement('a');
            a.href = url;
            a.download = `${journal.title}.pdf`;
            a.target = '_blank';
            a.click();
        } else {
            toast({ title: "No PDF", description: "No document available for download.", variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <SEOHead 
                title="Archives | Journal of Multidisciplinary Research Horizon"
                description="Browse the archives of JMRH journal - past issues and published articles."
                canonical="/journal/archives"
            />
            <Header />
            
            <section className="pt-32 pb-16 bg-white">
                <div className="container max-w-4xl mx-auto px-6">
                    <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
                        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/journal/about" className="hover:text-gold transition-colors">Journal</Link>
                        <span>/</span>
                        <span className="text-gold">Archives</span>
                    </nav>
                    <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">ARCHIVES (ISSUES)</h1>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container max-w-4xl mx-auto px-6">
                    {issueList.length > 0 ? (
                        <div className="space-y-12">
                            {issueList.map((issue, issueIdx) => (
                                <div key={issue.key} className="border-b border-black/10 pb-12 last:border-0">
                                    <h2 className="font-serif text-2xl md:text-3xl font-black text-oxford mb-2">
                                        {issue.key} – {issue.date}
                                    </h2>
                                    <div className="h-px bg-gradient-to-r from-gold/50 to-transparent mb-8" />

                                    <div className="space-y-8">
                                        {issue.papers.map((paper, paperIdx) => (
                                            <div key={paper.id} className="bg-white border border-black/5 p-6">
                                                <div className="mb-4">
                                                    <span className="text-xs font-bold text-oxford/40 uppercase tracking-widest">
                                                        Paper {paperIdx + 1}
                                                    </span>
                                                </div>
                                                
                                                <h3 className="font-serif text-xl font-bold text-oxford mb-3">
                                                    {paper.title}
                                                </h3>
                                                
                                                <p className="text-sm text-oxford/70 mb-2">
                                                    <span className="font-semibold">Authors:</span> {paper.authors}
                                                </p>
                                                
                                                {paper.affiliation && (
                                                    <p className="text-sm text-oxford/60 mb-3">
                                                        <span className="font-semibold">Affiliation:</span> {paper.affiliation}
                                                    </p>
                                                )}
                                                
                                                {paper.abstract && (
                                                    <div className="mb-3">
                                                        <p className="text-sm text-oxford/70 mb-1">
                                                            <span className="font-semibold">Abstract:</span>
                                                        </p>
                                                        <p className="text-sm text-oxford/60 italic pl-4 border-l-2 border-gold/20">
                                                            {paper.abstract}
                                                        </p>
                                                    </div>
                                                )}
                                                
                                                {paper.keywords && (
                                                    <p className="text-sm text-oxford/60 mb-4">
                                                        <span className="font-semibold">Keywords:</span> {paper.keywords}
                                                    </p>
                                                )}
                                                
                                                {paper.pdfUrl && (
                                                    <div className="flex items-center gap-3 pt-2">
                                                        <Button 
                                                            variant="outline" size="sm" 
                                                            onClick={() => handleView(paper)}
                                                            className="gap-2 text-gold border-gold/30 hover:bg-gold/5"
                                                        >
                                                            <Eye size={14} /> View PDF
                                                        </Button>
                                                        <Button 
                                                            variant="outline" size="sm" 
                                                            onClick={() => handleDownload(paper)}
                                                            className="gap-2 text-oxford border-oxford/20 hover:bg-oxford/5"
                                                        >
                                                            <Download size={14} /> Download PDF
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-black/5 p-12 text-center">
                            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-10 h-10 text-gold" />
                            </div>
                            <h2 className="font-serif text-2xl font-bold text-oxford mb-4">No Articles Published</h2>
                            <p className="text-oxford/60">
                                No journal articles have been published yet. Check back later or submit your manuscript.
                            </p>
                            <Link 
                                to="/journal/submit" 
                                className="inline-block mt-6 bg-oxford text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all"
                            >
                                Submit Manuscript
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            <Dialog open={!!viewingJournal} onOpenChange={() => { setViewingJournal(null); setPdfViewUrl(null); }}>
                <DialogContent className="max-w-4xl h-[85vh]">
                    <DialogHeader>
                        <DialogTitle className="font-serif">{viewingJournal?.title}</DialogTitle>
                    </DialogHeader>
                    {pdfViewUrl && (
                        <iframe src={pdfViewUrl} className="w-full flex-1 rounded border" style={{ minHeight: '70vh' }} />
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
});

export default JournalArchives;
