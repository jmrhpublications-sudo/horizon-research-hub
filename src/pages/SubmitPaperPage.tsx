import React, { useState, memo, FormEvent, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import {
    BookOpen,
    Send,
    FileText,
    ShieldCheck,
    ArrowLeft,
    Upload,
    Camera,
    X,
    AlertCircle,
    Database
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
    const { submitPaper, currentUser, papers } = useJMRH();
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();

    const [title, setTitle] = useState("");
    const [abstract, setAbstract] = useState("");
    const [discipline, setDiscipline] = useState("");
    const [authorName, setAuthorName] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!currentUser) {
            setError("Authorization Protocol Failure: Please login to submit manuscripts.");
        } else {
            setAuthorName(currentUser.name);
            setError(null);
        }
    }, [currentUser]);

    useEffect(() => {
        if (id) {
            const exists = papers.find(p => p.id === id);
            if (!exists) {
                setError(`Transmission Error: Manuscript ID (${id}) not found. Healing protocol active...`);
                setTimeout(() => {
                    navigate('/submit-paper');
                    setError(null);
                }, 3000);
            }
        }
    }, [id, papers]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAttachments(prev => [...prev, reader.result as string]);
                    setError(null);
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
            setTimeout(() => {
                if (videoRef.current) videoRef.current.srcObject = mediaStream;
            }, 100);
        } catch (err) {
            toast({ title: "Hardware Error", description: "Camera access failed.", variant: "destructive" });
        }
    };

    const stopCamera = () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        setStream(null);
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
                ctx.drawImage(video, 0, 0);
                setAttachments(prev => [...prev, canvas.toDataURL('image/jpeg')]);
                setError(null);
            }
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        if (attachments.length === 0) {
            setError("Validation Failure: Attachments required.");
            return;
        }
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 1500));
        submitPaper(title, abstract, discipline, authorName, attachments);
        toast({ title: "Manuscript Transmitted" });
        navigate('/account');
    };

    const disciplines = ["Commerce", "Science", "Technology", "Management", "Others"];

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans">
            <Header />
            <main className="flex-1 p-6 lg:p-12 pt-32 pb-24 relative z-10">
                <div className="container mx-auto max-w-7xl">
                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-12 p-6 bg-red-50 border-l-4 border-red-500 shadow-xl flex items-center gap-6">
                                <AlertCircle className="text-red-500" />
                                <div className="flex-1">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-red-900">System Healing</h4>
                                    <p className="text-red-700 italic">{error}</p>
                                </div>
                                {!currentUser && <Button asChild variant="outline" className="bg-white"><Link to="/auth">Login</Link></Button>}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Info */}
                        <div className="lg:col-span-4 space-y-12 h-fit lg:sticky lg:top-32">
                            <div className="space-y-6">
                                <Link to="/account" className="text-[10px] uppercase tracking-[0.4em] font-black text-teal flex items-center gap-3">
                                    <ArrowLeft size={14} /> Portal
                                </Link>
                                <div className="border-l-4 border-gold pl-8">
                                    <h1 className="text-5xl lg:text-7xl font-serif font-black italic text-oxford">Submit</h1>
                                    <p className="text-xs uppercase tracking-widest text-teal font-black">Manuscript Logic</p>
                                </div>
                            </div>
                            <div className="p-8 bg-white border border-black/5 shadow-2xl">
                                <ShieldCheck className="text-gold mb-6" size={40} />
                                <h3 className="font-serif italic text-xl font-bold">Standard Integrity</h3>
                                <p className="text-sm text-oxford/60">Peer review evaluation protocol.</p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-8">
                            <form onSubmit={handleSubmit} className="space-y-16">
                                <div className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-teal">Researcher</label>
                                            <Input required value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="border-0 border-b-2 rounded-none px-0 h-12 font-serif text-2xl italic focus:border-gold shadow-none" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-teal">Field</label>
                                            <Select required onValueChange={setDiscipline}>
                                                <SelectTrigger className="border-0 border-b-2 rounded-none px-0 h-12 font-serif text-2xl italic focus:border-gold shadow-none">
                                                    <SelectValue placeholder="Discipline" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {disciplines.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-teal">Full Title</label>
                                        <Input required value={title} onChange={(e) => setTitle(e.target.value)} className="border-0 border-b-2 rounded-none px-0 h-12 font-serif text-3xl font-black focus:border-gold shadow-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-teal">Executive Abstract</label>
                                        <Textarea required value={abstract} onChange={(e) => setAbstract(e.target.value)} className="border rounded-none h-64 p-6 font-serif italic text-lg bg-black/[0.02] focus:bg-white focus:border-gold" />
                                    </div>
                                </div>

                                <div className="p-12 border-2 border-dashed border-black/5 bg-white space-y-8">
                                    <div className="text-center">
                                        <Upload className="mx-auto text-gold mb-4" />
                                        <h4 className="font-serif italic text-2xl">Asset Registry</h4>
                                    </div>
                                    <div className="flex gap-4 justify-center relative">
                                        <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <Button type="button" variant="outline" className="h-16 px-8 rounded-none font-serif italic border-black/10">Files</Button>
                                        <Button type="button" variant="ghost" onClick={startCamera} className="h-16 px-8 rounded-none font-serif italic">Camera</Button>
                                    </div>

                                    {isCameraOpen && (
                                        <div className="relative aspect-video bg-black overflow-hidden mx-auto max-w-lg">
                                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                            <button type="button" onClick={capturePhoto} className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-2xl" />
                                            <button type="button" onClick={stopCamera} className="absolute top-4 right-4 text-white"><X /></button>
                                        </div>
                                    )}

                                    {attachments.length > 0 && (
                                        <div className="grid grid-cols-4 gap-4">
                                            {attachments.map((att, i) => (
                                                <div key={i} className="relative aspect-square border overflow-hidden">
                                                    {att.startsWith('data:image') ? <img src={att} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><FileText /></div>}
                                                    <button type="button" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white p-1"><X size={10} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <Button type="submit" disabled={isSubmitting} className="w-full h-20 bg-oxford text-white hover:bg-gold transition-all rounded-none font-black tracking-[0.5em] uppercase">
                                    {isSubmitting ? "Transmitting..." : "Finalize Protocol"}
                                </Button>
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
