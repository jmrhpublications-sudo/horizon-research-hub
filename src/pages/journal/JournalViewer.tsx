import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useJMRH } from "@/context/JMRHContext";
import { getPublicFileUrl, downloadFileFromUrl } from "@/lib/storage-utils";
import {
    ArrowLeft,
    Download,
    ExternalLink,
    FileText,
    Loader2,
    BookOpen,
    Calendar,
    Users,
    Share2,
    Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SEOHead from "@/components/seo/SEOHead";

const JournalViewer = () => {
    const { id } = useParams<{ id: string }>();
    const { publishedJournals } = useJMRH();
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);

    const journal = publishedJournals.find((j) => j.id === id);

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
                const sourceUrl = journal.pdfUrl.startsWith("http")
                    ? journal.pdfUrl
                    : getPublicFileUrl("publications", journal.pdfUrl);

                const res = await fetch(sourceUrl);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                // Stream response so we can show real progress
                const contentLength = Number(res.headers.get("content-length")) || 0;
                const reader = res.body?.getReader();
                if (reader && contentLength) {
                    const chunks: Uint8Array[] = [];
                    let received = 0;
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        if (value) {
                            chunks.push(value);
                            received += value.length;
                            if (!cancelled) {
                                setProgress(Math.min(99, Math.round((received / contentLength) * 100)));
                            }
                        }
                    }
                    const blob = new Blob(chunks, { type: "application/pdf" });
                    objectUrl = URL.createObjectURL(blob);
                } else {
                    const blob = await res.blob();
                    objectUrl = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
                }

                if (!cancelled) {
                    setProgress(100);
                    setPdfUrl(objectUrl);
                    // Small delay so users see the completed progress
                    setTimeout(() => !cancelled && setLoading(false), 250);
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

    const handleDownload = async () => {
        if (!pdfUrl) return;
        setDownloading(true);
        try {
            const filename = `${(journal?.title || "article")
                .replace(/[\\/:*?"<>|]/g, "")
                .slice(0, 100)}.pdf`;
            await downloadFileFromUrl(pdfUrl, filename);
            toast.success("Download started");
        } catch {
            toast.error("Download failed");
        } finally {
            setDownloading(false);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: journal?.title, url });
            } else {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                toast.success("Link copied");
                setTimeout(() => setCopied(false), 1800);
            }
        } catch {
            /* user cancelled */
        }
    };

    if (!journal) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md"
                >
                    <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Journal Not Found</h1>
                    <p className="text-slate-400 mb-6">The journal you're looking for doesn't exist.</p>
                    <Link to="/journal/archives">
                        <Button>Go to Archives</Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <SEOHead
                title={`${journal.title} | JMRH Journal`}
                description={journal.abstract || `Read "${journal.title}" by ${journal.authors} in JMRH.`}
                keywords={journal.keywords || `journal article, JMRH, ${journal.authors}, ${journal.discipline}`}
                canonical={`/journal/viewer/${journal.id}`}
                ogType="article"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "ScholarlyArticle",
                    headline: journal.title,
                    author: (journal.authors || "").split(",").map((name: string) => ({
                        "@type": "Person",
                        name: name.trim(),
                    })),
                    datePublished: journal.publicationDate,
                    description: journal.abstract || undefined,
                    isPartOf: {
                        "@type": "Periodical",
                        name: "Journal of Multidisciplinary Research Horizon",
                    },
                }}
            />

            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="sticky top-0 z-20 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/60"
            >
                <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <Link to="/journal/archives" className="shrink-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-300 hover:text-white hover:bg-slate-800"
                            >
                                <ArrowLeft size={16} className="sm:mr-2" />
                                <span className="hidden sm:inline">Archives</span>
                            </Button>
                        </Link>
                        <div className="h-6 w-px bg-slate-700 hidden sm:block" />
                        <div className="text-white min-w-0">
                            <h1 className="text-sm sm:text-base font-semibold line-clamp-1">
                                {journal.title}
                            </h1>
                            <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1">
                                {journal.authors}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleShare}
                            className="text-slate-300 hover:text-white hover:bg-slate-800"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {copied ? (
                                    <motion.span
                                        key="ok"
                                        initial={{ scale: 0.6, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.6, opacity: 0 }}
                                    >
                                        <Check size={16} />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="share"
                                        initial={{ scale: 0.6, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.6, opacity: 0 }}
                                    >
                                        <Share2 size={16} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            <span className="hidden sm:inline sm:ml-2">Share</span>
                        </Button>

                        {pdfUrl && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDownload}
                                    disabled={downloading}
                                    className="text-slate-300 hover:text-white hover:bg-slate-800"
                                >
                                    {downloading ? (
                                        <Loader2 size={16} className="animate-spin sm:mr-2" />
                                    ) : (
                                        <Download size={16} className="sm:mr-2" />
                                    )}
                                    <span className="hidden sm:inline">Download</span>
                                </Button>
                                <Button
                                    size="sm"
                                    asChild
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink size={16} className="sm:mr-2" />
                                        <span className="hidden sm:inline">Full Screen</span>
                                    </a>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </motion.header>

            {/* Meta bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400"
            >
                <span className="inline-flex items-center gap-1.5">
                    <BookOpen size={13} /> {journal.discipline || "Research"}
                </span>
                {journal.publicationDate && (
                    <span className="inline-flex items-center gap-1.5">
                        <Calendar size={13} />
                        {new Date(journal.publicationDate).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                )}
                <span className="inline-flex items-center gap-1.5 line-clamp-1">
                    <Users size={13} /> {journal.authors}
                </span>
            </motion.div>

            {/* PDF Viewer */}
            <div className="relative max-w-7xl mx-auto px-2 sm:px-6 pb-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-slate-800/50 shadow-2xl shadow-black/40 ring-1 ring-slate-700/60"
                    style={{ height: "calc(100vh - 180px)", minHeight: 480 }}
                >
                    <AnimatePresence>
                        {loading && (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 z-10 px-6"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    className="relative mb-6"
                                >
                                    <div className="w-16 h-16 rounded-full border-2 border-slate-700" />
                                    <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-primary" />
                                </motion.div>
                                <p className="text-slate-300 font-medium mb-2">Loading manuscript…</p>
                                <div className="w-64 max-w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-primary to-primary/60"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ ease: "easeOut" }}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-2">{progress}%</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="h-full flex items-center justify-center flex-col p-6 text-center"
                        >
                            <FileText className="w-16 h-16 text-slate-600 mb-4" />
                            <p className="text-slate-400 mb-4">{error}</p>
                            {pdfUrl && (
                                <Button onClick={() => window.open(pdfUrl, "_blank")}>
                                    Open in Browser
                                </Button>
                            )}
                        </motion.div>
                    )}

                    {!error && pdfUrl && (
                        <motion.iframe
                            initial={{ opacity: 0 }}
                            animate={{ opacity: iframeLoaded && !loading ? 1 : 0 }}
                            transition={{ duration: 0.5 }}
                            src={pdfUrl}
                            onLoad={() => setIframeLoaded(true)}
                            className="w-full h-full bg-white"
                            title={journal.title}
                        />
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default JournalViewer;
