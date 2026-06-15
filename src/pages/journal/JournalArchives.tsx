import { memo, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { useJMRH } from "@/context/JMRHContext";
import { getPublicFileUrl, downloadFileFromUrl } from "@/lib/storage-utils";
import { FileText, Download, Eye, ChevronRight, Layers, FolderOpen, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";


interface VolumeGroup {
    id: string;
    name: string;
    issues: IssueGroup[];
}

interface IssueGroup {
    id: string;
    name: string;
    publicationDate?: string;
    journals: any[];
}

const JournalArchives = memo(() => {
    const { publishedJournals } = useJMRH();
    const [viewMode, setViewMode] = useState<"volumes" | "issues" | "journals">("volumes");
    const [selectedVolume, setSelectedVolume] = useState<VolumeGroup | null>(null);
    const [selectedIssue, setSelectedIssue] = useState<IssueGroup | null>(null);
    const [viewingJournal, setViewingJournal] = useState<any>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const volumes = useMemo(() => {
        const volMap = new Map<string, VolumeGroup>();
        
        publishedJournals
            .filter(j => j.status === 'PUBLISHED')
            .forEach(j => {
                const volNum = j.volume || "1";
                const issueNum = j.issue || "1";
                
                if (!volMap.has(volNum)) {
                    volMap.set(volNum, {
                        id: volNum,
                        name: `Volume ${volNum}`,
                        issues: []
                    });
                }
                
                const volume = volMap.get(volNum)!;
                let issue = volume.issues.find(i => i.id === issueNum);
                
                if (!issue) {
                    const pubDate = j.publicationDate ? new Date(j.publicationDate) : null;
                    issue = {
                        id: issueNum,
                        name: `Issue ${issueNum}`,
                        journals: [],
                        publicationDate: pubDate ? pubDate.toLocaleString('en-US', { month: 'long', year: 'numeric' }) : undefined
                    };
                    volume.issues.push(issue);
                }
                
                issue.journals.push(j);
            });
        
        return Array.from(volMap.values()).sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }, [publishedJournals]);

    const getPublicUrl = (filePath: string) => {
        if (!filePath) return null;
        if (filePath.startsWith('http')) return filePath;
        return getPublicFileUrl('publications', filePath);
    };

    const navigateToVolume = (volume: VolumeGroup) => {
        setSelectedVolume(volume);
        setViewMode("issues");
    };

    const navigateToIssue = (issue: IssueGroup) => {
        setSelectedIssue(issue);
        setViewMode("journals");
    };

    const goBack = () => {
        if (viewMode === "journals") {
            setSelectedIssue(null);
            setViewMode("issues");
        } else if (viewMode === "issues") {
            setSelectedVolume(null);
            setViewMode("volumes");
        }
    };

    const openInNewTab = (journal: any) => {
        const url = journal.pdfUrl?.startsWith('http') 
            ? journal.pdfUrl 
            : `/journal/viewer/${journal.id}`;
        window.open(url, '_blank');
    };

    const publishedArticles = useMemo(
        () => publishedJournals.filter(j => j.status === 'PUBLISHED'),
        [publishedJournals]
    );

    const articleListJsonLd = useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "JMRH Journal Archives",
        "description": "Browse all published research papers, academic journals, and scholarly articles from Gudalur, Ooty, Nilgiris and Tamil Nadu in the Journal of Multidisciplinary Research Horizon.",
        "url": "https://jmrh.in/journal/archives",
        "isPartOf": {
            "@type": "Periodical",
            "name": "Journal of Multidisciplinary Research Horizon",
            "issn": "Pending"
        },
        "hasPart": publishedArticles.map(j => ({
            "@type": "ScholarlyArticle",
            "headline": j.title,
            "author": (j.authors || "").split(",").map(n => ({ "@type": "Person", "name": n.trim() })),
            "datePublished": j.publicationDate,
            "description": j.abstract || undefined,
            "keywords": j.keywords || undefined,
            "url": `https://jmrh.in/journal/viewer/${j.id}`,
            "isPartOf": {
                "@type": "PublicationIssue",
                "issueNumber": j.issue,
                "isPartOf": { "@type": "PublicationVolume", "volumeNumber": j.volume }
            }
        }))
    }), [publishedArticles]);

    return (
        <div className="min-h-screen bg-background font-sans">
            <SEOHead 
                title="Archives | Research Papers & Journals — JMRH Gudalur Ooty Nilgiris Tamil Nadu"
                description="Browse JMRH archives: peer-reviewed research papers, academic journal articles & PDFs from Gudalur, Ooty, Nilgiris & Tamil Nadu. Free open-access publications 2026."
                keywords="research paper publications Gudalur Ooty Tamil Nadu, academic journals PDF, Nilgiris scientific papers, Ooty university journal 2026, JMRH archives, scholarly publications"
                canonical="/journal/archives"
                ogType="website"
                jsonLd={articleListJsonLd}
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
                    
                    {viewMode !== "volumes" && (
                        <Button 
                            variant="ghost" 
                            onClick={goBack} 
                            className="mb-4 gap-2 text-oxford/60 hover:text-oxford"
                        >
                            <ArrowLeft size={16} /> Back to {viewMode === "issues" ? "Volumes" : "Issues"}
                        </Button>
                    )}
                    
                    <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
                        {viewMode === "volumes" && "ARCHIVES (ISSUES)"}
                        {viewMode === "issues" && selectedVolume?.name}
                        {viewMode === "journals" && selectedIssue?.name}
                    </h1>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container max-w-4xl mx-auto px-6">
                    {/* View: Volumes */}
                    {viewMode === "volumes" && (
                        volumes.length > 0 ? (
                            <div className="space-y-8">
                                {volumes.map((volume) => (
                                    <div key={volume.id} className="border-b border-black/10 pb-8 last:border-0">
                                        <button 
                                            onClick={() => navigateToVolume(volume)}
                                            className="w-full text-left group"
                                        >
                                            <div className="flex items-center justify-between p-6 bg-white border border-black/5 hover:border-gold/30 hover:shadow-lg transition-all rounded-lg">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center">
                                                        <Layers className="w-7 h-7 text-gold" />
                                                    </div>
                                                    <div>
                                                        <h2 className="font-serif text-2xl md:text-3xl font-black text-oxford group-hover:text-gold transition-colors">
                                                            {volume.name}
                                                        </h2>
                                                        <p className="text-oxford/60 text-sm mt-1">
                                                            {volume.issues.length} {volume.issues.length === 1 ? 'Issue' : 'Issues'} • {volume.issues.reduce((sum, i) => sum + i.journals.length, 0)} Articles
                                                        </p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-6 h-6 text-oxford/30 group-hover:text-gold transition-colors" />
                                            </div>
                                        </button>
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
                        )
                    )}

                    {/* View: Issues */}
                    {viewMode === "issues" && selectedVolume && (
                        <div className="space-y-8">
                            {selectedVolume.issues.sort((a, b) => parseInt(b.id) - parseInt(a.id)).map((issue) => (
                                <div key={issue.id} className="border-b border-black/10 pb-8 last:border-0">
                                    <button 
                                        onClick={() => navigateToIssue(issue)}
                                        className="w-full text-left group"
                                    >
                                        <div className="flex items-center justify-between p-6 bg-white border border-black/5 hover:border-gold/30 hover:shadow-lg transition-all rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-oxford/10 rounded-full flex items-center justify-center">
                                                    <FolderOpen className="w-7 h-7 text-oxford" />
                                                </div>
                                                <div>
                                                    <h2 className="font-serif text-2xl font-bold text-oxford group-hover:text-gold transition-colors">
                                                        {issue.name}
                                                    </h2>
                                                    <p className="text-oxford/60 text-sm mt-1">
                                                        {issue.publicationDate && <span className="mr-2">{issue.publicationDate}</span>}
                                                        {issue.journals.length} {issue.journals.length === 1 ? 'Article' : 'Articles'}
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-6 h-6 text-oxford/30 group-hover:text-gold transition-colors" />
                                        </div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* View: Journals */}
                    {viewMode === "journals" && selectedIssue && (
                        <div className="space-y-8">
                            {selectedIssue.journals.length > 0 ? (
                                selectedIssue.journals.map((journal, idx) => (
                                    <div key={journal.id} className="bg-white border border-black/5 p-8 hover:border-gold/20 transition-all">
                                        <div className="mb-4">
                                            <span className="text-xs font-bold text-oxford/40 uppercase tracking-widest">
                                                Article {idx + 1}
                                            </span>
                                        </div>
                                        
                                        <h3 className="font-serif text-xl md:text-2xl font-bold text-oxford mb-4">
                                            {journal.title}
                                        </h3>
                                        
                                        <p className="text-sm text-oxford/70 mb-3">
                                            <span className="font-semibold">Authors:</span> {journal.authors}
                                        </p>
                                        
                                        {journal.discipline && (
                                            <p className="text-sm text-oxford/60 mb-3">
                                                <span className="font-semibold">Discipline:</span> {journal.discipline}
                                            </p>
                                        )}
                                        
                                        {journal.abstract && (
                                            <div className="mb-4">
                                                <p className="text-sm text-oxford/70 mb-2">
                                                    <span className="font-semibold">Abstract:</span>
                                                </p>
                                                <p className="text-sm text-oxford/60 italic pl-4 border-l-2 border-gold/20">
                                                    {journal.abstract}
                                                </p>
                                            </div>
                                        )}
                                        
                                        {journal.keywords && (
                                            <p className="text-sm text-oxford/60 mb-4">
                                                <span className="font-semibold">Keywords:</span> {journal.keywords}
                                            </p>
                                        )}
                                        
                                        {journal.doi && (
                                            <p className="text-sm text-oxford/60 mb-4">
                                                <span className="font-semibold">DOI:</span> {journal.doi}
                                            </p>
                                        )}
                                        
                                        {journal.pdfUrl && (() => {
                                            const publicUrl = getPublicUrl(journal.pdfUrl);
                                            const safeName = `${(journal.title || 'article').replace(/[\\/:*?"<>|]/g, '').slice(0, 100)}.pdf`;
                                            if (!publicUrl) return null;
                                            return (
                                                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-black/5 mt-4">
                                                    <Button 
                                                        variant="outline" size="sm" 
                                                        asChild
                                                        className="gap-2 text-gold border-gold/30 hover:bg-gold/5"
                                                    >
                                                        <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                                                            <Eye size={14} /> View PDF
                                                        </a>
                                                    </Button>
                                                    <Button 
                                                        variant="outline" size="sm" 
                                                        onClick={() => downloadFileFromUrl(publicUrl, safeName)}
                                                        className="gap-2 text-oxford border-oxford/20 hover:bg-oxford/5"
                                                    >
                                                        <Download size={14} /> Download
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" size="sm" 
                                                        asChild
                                                        className="gap-2 text-oxford/60 hover:text-oxford"
                                                    >
                                                        <Link to={`/journal/viewer/${journal.id}`}>
                                                            <ExternalLink size={14} /> Open Reader
                                                        </Link>
                                                    </Button>
                                                </div>
                                            );
                                        })()}

                                    </div>
                                ))
                            ) : (
                                <div className="bg-white border border-black/5 p-12 text-center">
                                    <p className="text-oxford/60">No articles in this issue.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
});

export default JournalArchives;