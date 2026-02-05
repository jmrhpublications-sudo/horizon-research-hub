
import { memo, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BookOpen, Download, Search, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const ArchivesPage = memo(() => {
    const { papers } = useJMRH();
    const [searchTerm, setSearchTerm] = useState("");

    // Filter only PUBLISHED or ARCHIVED papers
    const publishedPapers = useMemo(() => {
        return papers.filter(p =>
            (p.status === 'PUBLISHED' || p.status === 'ARCHIVED') &&
            (p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.discipline.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [papers, searchTerm]);

    const handleDownload = (attachments?: string[]) => {
        if (!attachments || attachments.length === 0) return;

        // Simple download logic for base64 data strings (single file for now)
        // In a real app, you might zip them or provide a list. 
        // Here we just download the first one as a demo.
        const link = document.createElement("a");
        link.href = attachments[0];
        // Heuristic to guess extension or default to .pdf
        link.download = "jmrh_manuscript_download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <div className="relative py-24 bg-oxford overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2690&auto=format&fit=crop')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-gradient-to-r from-oxford via-oxford/90 to-transparent" />

                    <div className="container mx-auto px-6 lg:px-12 relative z-10">
                        <div className="max-w-3xl space-y-6">
                            <p className="section-label text-gold">Digital Library</p>
                            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white leading-tight">
                                Scholarly <span className="italic text-teal">Archives</span>
                            </h1>
                            <p className="text-white/60 text-xl font-sans leading-relaxed max-w-2xl">
                                Browse our curated collection of peer-reviewed research papers, case studies, and academic articles.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search & List */}
                <div className="container mx-auto px-6 lg:px-12 py-16 space-y-12">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-border">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search by title, author, or discipline..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-12 bg-bg-alt border-transparent focus:bg-white transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">
                                {publishedPapers.length} Records Found
                            </p>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="grid gap-8">
                        {publishedPapers.length > 0 ? (
                            publishedPapers.map(paper => (
                                <div key={paper.id} className="group bg-white rounded-3xl p-8 border border-border hover:border-gold/50 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity duration-500">
                                        <BookOpen size={48} className="text-gold -rotate-12" />
                                    </div>

                                    <div className="relative z-10 grid lg:grid-cols-4 gap-8">
                                        <div className="lg:col-span-3 space-y-4">
                                            <div className="flex flex-wrap gap-3">
                                                <Badge variant="outline" className="rounded-md border-teal text-teal uppercase tracking-widest text-[10px] font-bold py-1 px-3">
                                                    {paper.discipline}
                                                </Badge>
                                                <Badge variant="secondary" className="rounded-md bg-bg-alt text-muted-foreground uppercase tracking-widest text-[10px] font-bold py-1 px-3 flex items-center gap-2">
                                                    <Calendar size={12} /> {paper.submissionDate}
                                                </Badge>
                                            </div>

                                            <h3 className="text-2xl font-serif font-bold text-oxford group-hover:text-teal transition-colors">
                                                {paper.title}
                                            </h3>

                                            <p className="text-muted-foreground leading-relaxed line-clamp-3 font-sans">
                                                {paper.abstract}
                                            </p>

                                            <div className="pt-4 flex items-center gap-2 text-sm font-bold text-oxford/80">
                                                <span className="text-gold">By</span> {paper.authorName}
                                            </div>
                                        </div>

                                        <div className="lg:col-span-1 flex flex-col justify-center items-start lg:items-end gap-4 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8">
                                            <Button
                                                onClick={() => handleDownload(paper.attachments)}
                                                disabled={!paper.attachments || paper.attachments.length === 0}
                                                className="w-full h-12 bg-oxford text-white hover:bg-gold transition-all font-bold tracking-widest text-xs uppercase shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <Download size={16} /> Download
                                            </Button>
                                            <Button variant="outline" className="w-full h-12 border-oxford/10 hover:bg-oxford/5 text-oxford font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-2">
                                                Read Abstract
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-24 space-y-4">
                                <Search size={64} className="mx-auto text-border" />
                                <h3 className="text-xl font-serif italic text-muted-foreground">No archives found matching your criteria.</h3>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
});

export default ArchivesPage;
