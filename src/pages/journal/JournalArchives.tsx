import { memo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { useJMRH } from "@/context/JMRHContext";
import { FileText, Calendar, User, ExternalLink, Search, Filter, Download, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
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
    const [searchTerm, setSearchTerm] = useState("");
    const [disciplineFilter, setDisciplineFilter] = useState("all");
    const [viewingJournal, setViewingJournal] = useState<any>(null);
    const [pdfViewUrl, setPdfViewUrl] = useState<string | null>(null);
    const { toast } = useToast();

    // Only show PUBLISHED journals
    const allJournals = publishedJournals
        .filter(j => j.status === 'PUBLISHED')
        .map(j => ({
            id: j.id,
            title: j.title,
            authors: j.authors,
            abstract: j.abstract,
            discipline: j.discipline,
            keywords: j.keywords,
            volume: j.volume,
            issue: j.issue,
            pages: j.pages,
            doi: j.doi,
            publicationDate: j.publicationDate,
            pdfUrl: j.pdfUrl,
            coverImage: j.coverImage,
        }));

    const disciplines = [...new Set(allJournals.map(j => j.discipline).filter(Boolean))];

    const filteredJournals = allJournals.filter(journal => {
        const matchesSearch = journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            journal.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
            journal.keywords?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDiscipline = disciplineFilter === "all" || journal.discipline === disciplineFilter;
        return matchesSearch && matchesDiscipline;
    }).sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());

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
            
            <section className="pt-32 pb-16 bg-gradient-to-b from-oxford/5 to-transparent">
                <div className="container max-w-5xl mx-auto px-6">
                    <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
                        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/journal/about" className="hover:text-gold transition-colors">Journal</Link>
                        <span>/</span>
                        <span className="text-gold">Archives</span>
                    </nav>
                    <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">Archives</h1>
                    <p className="text-oxford/60 max-w-2xl">
                        Browse all published journal articles from JMRH. Search and filter by discipline, year, or keywords.
                    </p>
                </div>
            </section>

            <section className="py-8 bg-white border-b border-black/5">
                <div className="container max-w-5xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                            <Input 
                                placeholder="Search articles by title, author, or keywords..." 
                                className="pl-10 h-12 border-black/10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
                            <SelectTrigger className="w-full md:w-64 h-12">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="All Disciplines" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Disciplines</SelectItem>
                                {disciplines.map(d => (
                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container max-w-5xl mx-auto px-6">
                    {filteredJournals.length > 0 ? (
                        <div className="space-y-6">
                            <p className="text-sm text-oxford/50">{filteredJournals.length} articles found</p>
                            <div className="grid gap-6">
                                {filteredJournals.map((journal) => {
                                    const coverUrl = getPublicUrl(journal.coverImage || '');
                                    return (
                                        <div key={journal.id} className="bg-white border border-black/5 p-6 hover:shadow-md transition-shadow">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {coverUrl ? (
                                                    <img src={coverUrl} alt={journal.title} className="w-full md:w-32 h-44 object-cover rounded" />
                                                ) : (
                                                    <div className="w-full md:w-32 h-44 bg-gold/10 rounded flex items-center justify-center">
                                                        <FileText className="w-12 h-12 text-gold" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-1 text-xs font-bold uppercase bg-gold/10 text-gold">
                                                            {journal.discipline}
                                                        </span>
                                                        {journal.volume && <span className="text-xs text-oxford/50">Vol. {journal.volume}</span>}
                                                        {journal.issue && <span className="text-xs text-oxford/50">Issue {journal.issue}</span>}
                                                    </div>
                                                    
                                                    <h3 className="font-serif text-xl font-bold text-oxford mb-2">{journal.title}</h3>
                                                    
                                                    <div className="flex items-center gap-4 text-sm text-oxford/60 mb-3">
                                                        <span className="flex items-center gap-1"><User size={14} />{journal.authors}</span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={14} />
                                                            {new Date(journal.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                                        </span>
                                                        {journal.pages && <span className="text-oxford/50">pp. {journal.pages}</span>}
                                                    </div>
                                                    
                                                    {journal.abstract && (
                                                        <p className="text-sm text-oxford/70 line-clamp-3 mb-4">{journal.abstract}</p>
                                                    )}
                                                    
                                                    <div className="flex flex-wrap gap-3">
                                                        {journal.pdfUrl && (
                                                            <>
                                                                <Button 
                                                                    variant="outline" size="sm" 
                                                                    onClick={() => handleView(journal)}
                                                                    className="gap-2 text-gold border-gold/30 hover:bg-gold/5"
                                                                >
                                                                    <Eye size={16} /> View Article
                                                                </Button>
                                                                <Button 
                                                                    variant="outline" size="sm" 
                                                                    onClick={() => handleDownload(journal)}
                                                                    className="gap-2 text-oxford border-oxford/20 hover:bg-oxford/5"
                                                                >
                                                                    <Download size={16} /> Download
                                                                </Button>
                                                            </>
                                                        )}
                                                        {journal.doi && (
                                                            <a 
                                                                href={`https://doi.org/${journal.doi}`}
                                                                target="_blank" rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 text-sm text-oxford/60 hover:text-gold transition-colors"
                                                            >
                                                                DOI: {journal.doi}
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-black/5 p-12 text-center">
                            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-10 h-10 text-gold" />
                            </div>
                            <h2 className="font-serif text-2xl font-bold text-oxford mb-4">No Articles Found</h2>
                            <p className="text-oxford/60">
                                {searchTerm || disciplineFilter !== "all" 
                                    ? "Try adjusting your search or filter criteria."
                                    : "No journal articles have been published yet."}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* PDF Viewer Dialog */}
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
