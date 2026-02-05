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
                                Your submission will undergo a Double-Blind Peer Review protocol.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-12 space-y-12">

                            {/* Author Name */}
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-teal">Primary Author Name</label>
                                <Input
                                    required
                                    placeholder="Enter full legal name"
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                    className="w-full bg-white border-border h-16 rounded-none font-serif font-bold text-lg px-6 focus:border-gold shadow-sm"
                                />
                            </div>

                            {/* Discipline Selection */}
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-teal">Academic Discipline</label>
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
                                <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-teal">Academic Abstract</label>
                                <Textarea
                                    required
                                    placeholder="Provide a concise summary of your research..."
                                    value={abstract}
                                    onChange={(e) => setAbstract(e.target.value)}
                                    className="w-full bg-white border-border h-64 rounded-none font-serif italic text-xl p-8 focus:border-gold shadow-sm resize-none"
                                />
                            </div>

                            {/* Attachments & Camera */}
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-teal">Attachments & Evidence</label>

                                <div className="p-8 border-2 border-dashed border-border rounded-3xl bg-white/50 space-y-6">
                                    <div className="flex flex-wrap gap-4">
                                        {/* File Input Trigger */}
                                        <div className="relative">
                                            <input
                                                type="file"
                                                multiple
                                                accept=".pdf,.doc,.docx,image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <Button type="button" variant="outline" className="h-12 px-6 gap-2 font-serif italic">
                                                <Upload size={18} /> Upload Files
                                            </Button>
                                        </div>

                                        {/* Camera Trigger */}
                                        <Button type="button" variant="outline" onClick={startCamera} className="h-12 px-6 gap-2 font-serif italic">
                                            <Camera size={18} /> Take Photo
                                        </Button>
                                    </div>

                                    {/* Camera Viewfinder */}
                                    {isCameraOpen && (
                                        <div className="relative bg-black rounded-xl overflow-hidden aspect-video shadow-2xl">
                                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                                                <Button onClick={capturePhoto} className="bg-white text-black hover:bg-gray-200 rounded-full h-12 w-12 p-0 flex items-center justify-center">
                                                    <div className="w-8 h-8 rounded-full border-2 border-black" />
                                                </Button>
                                                <Button onClick={stopCamera} variant="destructive" className="rounded-full h-12 w-12 p-0">
                                                    <X size={20} />
                                                </Button>
                                            </div>
                                            <canvas ref={canvasRef} className="hidden" />
                                        </div>
                                    )}

                                    {/* Attachment List */}
                                    {attachments.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                            {attachments.map((att, i) => (
                                                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-border bg-white">
                                                    {att.startsWith('data:image') ? (
                                                        <img src={att} alt={`Attachment ${i}`} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                                            <FileText size={32} className="text-oxford mb-2" />
                                                            <span className="text-xs text-center break-all text-muted-foreground">Document {i + 1}</span>
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttachment(i)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
