import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import { getSignedFileUrl } from "@/lib/storage-utils";
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
        const loadPdf = async () => {
            if (!journal?.pdfUrl) {
                setError("No PDF file available");
                setLoading(false);
                return;
            }

            try {
                if (journal.pdfUrl.startsWith('http')) {
                    setPdfUrl(journal.pdfUrl);
                } else {
                    const url = await getSignedFileUrl('publications', journal.pdfUrl);
                    setPdfUrl(url);
                }
            } catch (err) {
                setError("Failed to load PDF");
            }
            setLoading(false);
        };

        loadPdf();
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
                description={journal.abstract || `Journal article: ${journal.title}`}
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
                                    className="text-gray-300 hover:text-white"
                                    onClick={() => {
                                        const a = document.createElement('a');
                                        a.href = pdfUrl;
                                        a.download = `${journal.title}.pdf`;
                                        a.click();
                                    }}
                                >
                                    <Download size={16} className="mr-1" /> Download
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-gray-300 hover:text-white"
                                    onClick={() => window.open(pdfUrl, '_blank')}
                                >
                                    <ExternalLink size={16} className="mr-1" /> Open Full Screen
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