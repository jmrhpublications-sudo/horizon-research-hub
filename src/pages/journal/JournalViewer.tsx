import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import { getPublicFileUrl, downloadFileFromUrl } from "@/lib/storage-utils";
import { ArrowLeft, Download, ExternalLink, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/seo/SEOHead";


const JournalViewer = () => {
    const { id } = useParams<{ id: string }>();
    const { publishedJournals } = useJMRH();
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const journal = publishedJournals.find(j => j.id === id);

    useEffect(() => {
        let objectUrl: string | null = null;
        let cancelled = false;

        const loadPdf = async () => {
            if (!journal?.pdfUrl) {
                setError("No PDF file available");
                setLoading(false);
                return;
            }

            try {
                const sourceUrl = journal.pdfUrl.startsWith('http')
                    ? journal.pdfUrl
                    : getPublicFileUrl('publications', journal.pdfUrl);

                // Fetch and serve as a same-origin blob URL so the PDF opens
                // under the jmrh.in domain instead of the Supabase origin.
                const res = await fetch(sourceUrl);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const blob = await res.blob();
                objectUrl = URL.createObjectURL(
                    new Blob([blob], { type: 'application/pdf' })
                );
                if (!cancelled) {
                    setPdfUrl(objectUrl);
                    setLoading(false);
                }
            } catch (err) {
                if (!cancelled) {
                    setError("Failed to load PDF");
                    setLoading(false);
                }
            }
        };

        loadPdf();

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [journal]);


    if (!journal) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Journal Not Found</h1>
                    <p className="text-gray-600 mb-4">The journal you're looking for doesn't exist.</p>
                    <Link to="/journal/archives">
                        <Button>Go to Archives</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <SEOHead 
                title={`${journal.title} | JMRH Journal`}
                description={journal.abstract || `Read the full publication "${journal.title}" by ${journal.authors} in the Journal of Multidisciplinary Research Horizon.`}
                keywords={journal.keywords || `journal article, JMRH, multidisciplinary research, ${journal.authors}, ${journal.discipline}`}
                canonical={`/journal/viewer/${journal.id}`}
                ogType="article"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "ScholarlyArticle",
                    "headline": journal.title,
                    "author": (journal.authors || "").split(",").map((name: string) => ({
                        "@type": "Person",
                        "name": name.trim()
                    })),
                    "datePublished": journal.publicationDate,
                    "description": journal.abstract || undefined,
                    "isPartOf": {
                        "@type": "Periodical",
                        "name": "Journal of Multidisciplinary Research Horizon"
                    }
                }}
            />
            
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <Link to="/journal/archives">
                            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                                <ArrowLeft size={16} className="mr-2" /> Back to Archives
                            </Button>
                        </Link>
                        <div className="h-6 w-px bg-gray-600" />
                        <div className="text-white">
                            <h1 className="text-sm font-semibold line-clamp-1 max-w-md">{journal.title}</h1>
                            <p className="text-xs text-gray-400">{journal.authors}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {pdfUrl && (
                            <>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => downloadFileFromUrl(pdfUrl, `${(journal.title || 'article').replace(/[\\/:*?"<>|]/g, '').slice(0, 100)}.pdf`)}
                                    className="text-gray-300 hover:text-white"
                                >
                                    <Download size={16} className="mr-1" /> Download
                                </Button>

                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    asChild
                                    className="text-gray-300 hover:text-white"
                                >
                                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink size={16} className="mr-1" /> Open Full Screen
                                    </a>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="h-[calc(100vh-60px)]">
                {loading && (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                        <span className="text-gray-400 ml-2">Loading document...</span>
                    </div>
                )}

                {error && (
                    <div className="h-full flex items-center justify-center flex-col">
                        <FileText className="w-16 h-16 text-gray-600 mb-4" />
                        <p className="text-gray-400 mb-4">{error}</p>
                        {pdfUrl && (
                            <Button onClick={() => window.open(pdfUrl, '_blank')}>
                                Open in Browser
                            </Button>
                        )}
                    </div>
                )}

                {!loading && !error && pdfUrl && (
                    <iframe 
                        src={pdfUrl}
                        className="w-full h-full"
                        title={journal.title}
                    />
                )}

                {!loading && !error && !pdfUrl && (
                    <div className="h-full flex items-center justify-center flex-col">
                        <FileText className="w-16 h-16 text-gray-600 mb-4" />
                        <p className="text-gray-400">No document available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalViewer;