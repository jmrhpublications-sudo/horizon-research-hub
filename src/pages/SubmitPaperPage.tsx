import { useState, memo, FormEvent, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import {
    BookOpen,
    Send,
    FileText,
    ShieldCheck,
    ArrowLeft,
    Info,
    Camera,
    X,
    Upload,
    Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    const { submitPaper, currentUser } = useJMRH();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Form States
    const [title, setTitle] = useState("");
    const [abstract, setAbstract] = useState("");
    const [discipline, setDiscipline] = useState("");
    const [authorName, setAuthorName] = useState(currentUser?.name || "");

    // Attachment States
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (currentUser?.name) {
            setAuthorName(currentUser.name);
        }
    }, [currentUser]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        submitPaper(title, abstract, discipline, authorName, attachments);
        toast({
            title: "Manuscript Transmitted",
            description: "Successfully filed in the JMRH master repository."
        });
        navigate('/account');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    setAttachments(prev => [...prev, result]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            setIsCameraOpen(true);
            // Wait for modal/state to update then attach stream
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }, 100);
        } catch (err) {
            console.error("Error accessing camera:", err);
            toast({
                title: "Camera Error",
                description: "Could not access camera. Please check permissions.",
                variant: "destructive"
            });
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setAttachments(prev => [...prev, dataUrl]);
                toast({
                    title: "Image Captured",
                    description: "Photo added to attachments."
                });
            }
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
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
        <div className="min-h-screen bg-background flex flex-col relative selection:bg-gold selection:text-white">
            {/* Minimal Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{
                backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            <Header />

            <main className="flex-1 p-6 lg:p-12 pt-32 pb-24 relative z-10 w-full overflow-hidden">
                <div className="container mx-auto max-w-7xl animate-academic-reveal">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">
                        {/* Sidebar / Info Panel - Sticky */}
                        <div className="lg:col-span-4 xl:col-span-3 space-y-12 lg:sticky lg:top-32 h-fit">
                            <div className="space-y-6">
                                <Link to="/account" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-teal hover:text-gold transition-colors group">
                                    <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Nexus
                                </Link>
                                <div className="space-y-4 border-l-2 border-gold pl-6">
                                    <p className="section-label text-oxford/50">Transmission Protocol</p>
                                    <h1 className="text-4xl lg:text-5xl font-serif font-bold italic text-oxford leading-[0.9]">
                                        Submit<br />Manuscript
                                    </h1>
                                </div>
                            </div>

                            <div className="p-8 bg-white border border-border shadow-2xl relative overflow-hidden group hover:border-gold/30 transition-colors">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-teal/5 rounded-bl-full -mr-4 -mt-4" />
                                <ShieldCheck className="text-gold mb-6 relative z-10" size={32} strokeWidth={1.5} />
                                <h3 className="font-serif italic text-xl text-oxford mb-4">Double-Blind Review</h3>
                                <p className="text-xs leading-relaxed text-text-muted font-ui tracking-wide">
                                    Your submission will undergo a rigorous Double-Blind Peer Review protocol. Ensure all identifying information is removed from the manuscript file itself.
                                </p>
                            </div>

                            <div className="hidden lg:block">
                                <p className="text-[10px] uppercase tracking-widest text-text-subtle mb-4">Supported Formats</p>
                                <div className="flex gap-3 text-oxford/60">
                                    <FileText size={20} strokeWidth={1} />
                                    <ImageIcon size={20} strokeWidth={1} />
                                    <span className="font-serif italic text-sm">PDF, DOCX, JPEG</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Form Area */}
                        <div className="lg:col-span-8 xl:col-span-9">
                            <form onSubmit={handleSubmit} className="space-y-16">
                                {/* Section 1: Identity */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 text-oxford/40">
                                        <span className="text-xs font-bold tracking-widest">01</span>
                                        <div className="h-[1px] flex-1 bg-border" />
                                        <span className="text-[10px] uppercase tracking-widest">Author Identity</span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4 group">
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-teal group-focus-within:text-gold transition-colors">Primary Author</label>
                                            <Input
                                                required
                                                placeholder="Full Legal Name"
                                                value={authorName}
                                                onChange={(e) => setAuthorName(e.target.value)}
                                                className="w-full bg-transparent border-0 border-b border-border rounded-none px-0 h-14 font-serif text-2xl focus:border-gold focus:ring-0 shadow-none transition-all placeholder:text-black/10"
                                            />
                                        </div>
                                        <div className="space-y-4 group">
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-teal group-focus-within:text-gold transition-colors">Research Discipline</label>
                                            <Select required onValueChange={setDiscipline}>
                                                <SelectTrigger className="w-full h-14 bg-transparent border-0 border-b border-border rounded-none px-0 font-serif italic text-xl shadow-none focus:border-gold focus:ring-0">
                                                    <SelectValue placeholder="Select Field..." />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white/95 backdrop-blur-xl border border-border rounded-none shadow-2xl">
                                                    {disciplines.map(d => (
                                                        <SelectItem key={d} value={d} className="font-serif italic py-3 focus:bg-oxford focus:text-gold cursor-pointer">{d}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Manuscript Details */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 text-oxford/40">
                                        <span className="text-xs font-bold tracking-widest">02</span>
                                        <div className="h-[1px] flex-1 bg-border" />
                                        <span className="text-[10px] uppercase tracking-widest">Research Details</span>
                                    </div>

                                    <div className="space-y-8 group">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-teal group-focus-within:text-gold transition-colors">Title of Research</label>
                                        <Input
                                            required
                                            placeholder="Enter the full scholarly title..."
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-transparent border-0 border-b border-border rounded-none px-0 h-auto py-2 font-serif font-bold text-3xl md:text-4xl text-oxford focus:border-gold focus:ring-0 shadow-none transition-all placeholder:text-black/10 leading-tight"
                                        />
                                    </div>

                                    <div className="space-y-6 group">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-teal group-focus-within:text-gold transition-colors">Abstract / Summary</label>
                                        <Textarea
                                            required
                                            placeholder="Provide a concise summary of your methodology and findings..."
                                            value={abstract}
                                            onChange={(e) => setAbstract(e.target.value)}
                                            className="w-full bg-slate-50/50 border border-border/50 rounded-none h-64 font-serif leading-relaxed text-lg p-8 focus:border-gold focus:bg-white focus:ring-0 focus:shadow-xl transition-all resize-none placeholder:text-black/20"
                                        />
                                    </div>
                                </div>

                                {/* Section 3: Evidence */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 text-oxford/40">
                                        <span className="text-xs font-bold tracking-widest">03</span>
                                        <div className="h-[1px] flex-1 bg-border" />
                                        <span className="text-[10px] uppercase tracking-widest">Documentation</span>
                                    </div>

                                    <div className="p-8 md:p-12 border border-dashed border-border hover:border-gold/50 bg-white/30 transition-colors space-y-8 relative group">

                                        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                                            <div className="relative overflow-hidden">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept=".pdf,.doc,.docx,image/*"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                />
                                                <Button type="button" variant="outline" className="h-14 px-8 gap-3 font-serif italic text-lg bg-white hover:bg-oxford hover:text-white transition-all border-border shadow-sm group-hover:shadow-md">
                                                    <Upload size={18} strokeWidth={1.5} /> Upload Files
                                                </Button>
                                            </div>

                                            <div className="h-14 w-[1px] bg-border hidden md:block" />

                                            <Button type="button" variant="ghost" onClick={startCamera} className="h-14 px-6 gap-3 font-serif italic text-lg hover:bg-transparent hover:text-gold transition-colors">
                                                <Camera size={18} strokeWidth={1.5} /> Capture Evidence
                                            </Button>
                                        </div>

                                        {/* Camera Interface */}
                                        <AnimatePresence>
                                            {isCameraOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="relative bg-black aspect-video shadow-2xl mx-auto max-w-2xl border border-white/10">
                                                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-90" />
                                                        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-8 items-center z-10">
                                                            <Button onClick={stopCamera} variant="ghost" className="text-white hover:text-red-400 hover:bg-transparent"><X size={24} /></Button>
                                                            <Button onClick={capturePhoto} className="bg-white text-black hover:bg-gray-200 rounded-full h-16 w-16 p-0 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-transform hover:scale-105 active:scale-95">
                                                                <div className="w-12 h-12 rounded-full border border-black/20" />
                                                            </Button>
                                                            <div className="w-10" /> {/* Spacer */}
                                                        </div>
                                                        <div className="absolute top-4 left-4 text-[10px] text-white/50 tracking-widest uppercase animate-pulse">● LIVE FEED</div>
                                                        <canvas ref={canvasRef} className="hidden" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Attachments Grid */}
                                        {attachments.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-6 border-t border-border/50">
                                                {attachments.map((att, i) => (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        key={i}
                                                        className="relative group aspect-[3/4] border border-border bg-white shadow-sm hover:shadow-lg transition-all"
                                                    >
                                                        {att.startsWith('data:image') ? (
                                                            <img src={att} alt={`Attachment ${i}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-bg-alt">
                                                                <FileText size={24} className="text-oxford mb-2 opacity-50" />
                                                                <span className="text-[10px] text-center text-text-muted break-all uppercase tracking-widest">DOC {i + 1}</span>
                                                            </div>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeAttachment(i)}
                                                            className="absolute top-0 right-0 p-2 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Action */}
                                <div className="lg:pl-[33%] pt-12">
                                    <Button type="submit" className="w-full h-20 bg-oxford text-white hover:bg-gold hover:text-oxford transition-all duration-500 rounded-none text-sm font-bold tracking-[0.4em] uppercase shadow-2xl border border-transparent hover:border-oxford group relative overflow-hidden">
                                        <span className="relative z-10 flex items-center justify-center gap-4">
                                            Finalize Transmission <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    </Button>
                                    <p className="text-center mt-6 text-[10px] text-text-muted uppercase tracking-widest">
                                        By submitting, you agree to the JMRH Ethics Policy
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
});

export default SubmitPaperPage;
