import React, { useState, memo, FormEvent, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import { supabase } from "@/integrations/supabase/client";
import {
    Send,
    FileText,
    ShieldCheck,
    ArrowLeft,
    Upload,
    Camera,
    X,
    CheckCircle,
    BookOpen,
    Mail,
    User,
    GraduationCap,
    Phone,
    MapPin,
    FileType
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
import SEOHead from "@/components/seo/SEOHead";

const SubmitPaperPage = memo(() => {
    const { currentUser } = useJMRH();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Form state
    const [submissionType, setSubmissionType] = useState<"journal" | "book" | "">("");
    const [authorName, setAuthorName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [affiliation, setAffiliation] = useState("");
    const [designation, setDesignation] = useState("");
    const [title, setTitle] = useState("");
    const [abstract, setAbstract] = useState("");
    const [discipline, setDiscipline] = useState("");
    const [keywords, setKeywords] = useState("");
    const [coAuthors, setCoAuthors] = useState("");
    const [manuscriptType, setManuscriptType] = useState("");
    const [additionalNotes, setAdditionalNotes] = useState("");
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
    const [attachmentPreviews, setAttachmentPreviews] = useState<(string | null)[]>([]);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [formStep, setFormStep] = useState(1);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const disciplines = [
        "Commerce and Management",
        "Economics and Finance", 
        "Education and Psychology",
        "Social Sciences and Humanities",
        "Science and Technology",
        "Environmental Studies and Sustainability",
        "Digital Transformation and Information Systems",
        "Entrepreneurship and Innovation",
        "Public Policy and Governance",
        "Other"
    ];

    const manuscriptTypes = [
        "Original Research Article",
        "Review Paper",
        "Conceptual Paper",
        "Case Study",
        "Short Communication",
        "Letter to Editor"
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setAttachmentFiles(prev => [...prev, ...files]);
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    const url = URL.createObjectURL(file);
                    setAttachmentPreviews(prev => [...prev, url]);
                } else {
                    setAttachmentPreviews(prev => [...prev, null]);
                }
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
            toast({ title: "Camera Error", description: "Could not access camera.", variant: "destructive" });
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
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
                        setAttachmentFiles(prev => [...prev, file]);
                        setAttachmentPreviews(prev => [...prev, URL.createObjectURL(file)]);
                    }
                }, 'image/jpeg');
            }
        }
    };

    // Generate email subject and body
    const generateEmailSubject = () => {
        const typeLabel = submissionType === "journal" ? "JMRH Journal" : "JMRH Book";
        return `Submission – ${typeLabel} – ${authorName} – ${title.substring(0, 50)}`;
    };

    const generateEmailBody = () => {
        const typeLabel = submissionType === "journal" ? "Journal Manuscript" : "Book Chapter";
        
        let body = `Dear Editorial Team,\n\n`;
        body += `I am submitting my ${typeLabel} for consideration for publication.\n\n`;
        
        body += `=== AUTHOR DETAILS ===\n`;
        body += `Name: ${authorName}\n`;
        body += `Email: ${email}\n`;
        body += `Phone: ${phone}\n`;
        body += `Affiliation: ${affiliation}\n`;
        body += `Designation: ${designation}\n\n`;
        
        body += `=== MANUSCRIPT DETAILS ===\n`;
        body += `Title: ${title}\n`;
        body += `Discipline: ${discipline}\n`;
        body += `Manuscript Type: ${manuscriptType}\n`;
        body += `Keywords: ${keywords}\n`;
        body += `Co-Authors: ${coAuthors || "None"}\n\n`;
        
        body += `=== ABSTRACT ===\n`;
        body += `${abstract}\n\n`;
        
        if (additionalNotes) {
            body += `=== ADDITIONAL NOTES ===\n`;
            body += `${additionalNotes}\n\n`;
        }
        
        body += `Please find the attached manuscript file(s).\n\n`;
        body += `Thank you for your consideration.\n\n`;
        body += `Best regards,\n`;
        body += `${authorName}`;
        
        return encodeURIComponent(body);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!submissionType) {
            toast({ title: "Selection Required", description: "Please select Journal Paper or Book Chapter.", variant: "destructive" });
            return;
        }
        if (!authorName || !email || !affiliation || !title || !discipline || !manuscriptType) {
            toast({ title: "Fields Required", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }
        if (attachmentFiles.length === 0) {
            toast({ title: "File Required", description: "Please upload your manuscript file.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);

        try {
            // Open email client with pre-filled content
            const subject = generateEmailSubject();
            const body = generateEmailBody();
            const mailtoLink = `mailto:submit.jmrh@gmail.com?subject=${subject}&body=${body}`;
            
            // Also try to open Gmail in new tab for convenience
            const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=submit.jmrh@gmail.com&su=${encodeURIComponent(subject)}&body=${body}`;
            
            // Open default email app
            window.location.href = mailtoLink;
            
            // Also try to open Gmail in new tab
            window.open(gmailLink, '_blank');
            
            toast({ 
                title: "Email Client Opened!", 
                description: "Your default email app has opened with all details pre-filled. Please attach your manuscript file and send." 
            });
            
            // Reset form after successful submission
            setTimeout(() => {
                setSubmissionType("");
                setAuthorName("");
                setEmail("");
                setPhone("");
                setAffiliation("");
                setDesignation("");
                setTitle("");
                setAbstract("");
                setDiscipline("");
                setKeywords("");
                setCoAuthors("");
                setManuscriptType("");
                setAdditionalNotes("");
                setAttachmentFiles([]);
                setAttachmentPreviews([]);
                setFormStep(1);
            }, 2000);
            
        } catch (error: any) {
            toast({ title: "Error", description: error?.message || "Failed to process submission.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceedToStep2 = submissionType && authorName && email && affiliation;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <SEOHead 
                title="Submit Manuscript | JMRH Publications"
                description="Submit your research manuscript to JMRH Publications"
                canonical="/submit-paper"
            />
            <Header />
            <canvas ref={canvasRef} className="hidden" />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    {/* Page Header */}
                    <div className="mb-8 space-y-4">
                        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-oxford/40 hover:text-gold transition-colors">
                            <ArrowLeft size={14} /> Back to Home
                        </Link>
                        <div className="border-l-4 border-gold pl-6">
                            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-oxford">
                                Submit Manuscript
                            </h1>
                            <p className="text-sm text-oxford/60 mt-1">
                                Share your research with the academic community
                            </p>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8 flex items-center justify-center gap-4">
                        <div className={`flex items-center gap-2 ${formStep >= 1 ? "text-gold" : "text-oxford/30"}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${formStep >= 1 ? "bg-gold text-white" : "bg-oxford/10"}`}>1</span>
                            <span className="text-xs uppercase tracking-wider font-bold">Details</span>
                        </div>
                        <div className="w-12 h-0.5 bg-oxford/10">
                            <div className={`h-full bg-gold transition-all ${formStep >= 2 ? "w-full" : "w-0"}`} />
                        </div>
                        <div className={`flex items-center gap-2 ${formStep >= 2 ? "text-gold" : "text-oxford/30"}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${formStep >= 2 ? "bg-gold text-white" : "bg-oxford/10"}`}>2</span>
                            <span className="text-xs uppercase tracking-wider font-bold">Manuscript</span>
                        </div>
                        <div className="w-12 h-0.5 bg-oxford/10">
                            <div className={`h-full bg-gold transition-all ${formStep >= 3 ? "w-full" : "w-0"}`} />
                        </div>
                        <div className={`flex items-center gap-2 ${formStep >= 3 ? "text-gold" : "text-oxford/30"}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${formStep >= 3 ? "bg-gold text-white" : "bg-oxford/10"}`}>3</span>
                            <span className="text-xs uppercase tracking-wider font-bold">Submit</span>
                        </div>
                    </div>

                    {/* Submission Type Selection */}
                    <div className="mb-8 grid md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setSubmissionType("journal")}
                            className={`p-6 border-2 transition-all ${submissionType === "journal" ? "border-gold bg-gold/5" : "border-black/5 hover:border-gold/30"}`}
                        >
                            <FileText className={`w-10 h-10 mb-3 ${submissionType === "journal" ? "text-gold" : "text-oxford/40"}`} />
                            <h3 className="font-serif text-xl font-bold text-oxford">Journal Paper</h3>
                            <p className="text-xs text-oxford/50 mt-1">Submit to JMRH Journal</p>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSubmissionType("book")}
                            className={`p-6 border-2 transition-all ${submissionType === "book" ? "border-gold bg-gold/5" : "border-black/5 hover:border-gold/30"}`}
                        >
                            <BookOpen className={`w-10 h-10 mb-3 ${submissionType === "book" ? "text-gold" : "text-oxford/40"}`} />
                            <h3 className="font-serif text-xl font-bold text-oxford">Book Chapter</h3>
                            <p className="text-xs text-oxford/50 mt-1">Submit to Edited Book</p>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Step 1: Author Details */}
                        {formStep === 1 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h2 className="font-serif text-xl font-bold text-oxford pb-4 border-b border-gold/20">Author Information</h2>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Author Name *</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                            <Input
                                                required
                                                value={authorName}
                                                onChange={(e) => setAuthorName(e.target.value)}
                                                placeholder="Full Name"
                                                className="h-12 pl-10 border-black/10 focus:border-gold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Email Address *</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                            <Input
                                                required
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="your@email.com"
                                                className="h-12 pl-10 border-black/10 focus:border-gold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                            <Input
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+91 XXXXX XXXXX"
                                                className="h-12 pl-10 border-black/10 focus:border-gold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Designation</label>
                                        <Input
                                            value={designation}
                                            onChange={(e) => setDesignation(e.target.value)}
                                            placeholder="e.g., Professor, Researcher, Student"
                                            className="h-12 border-black/10 focus:border-gold"
                                        />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Affiliation / Institution *</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                            <Input
                                                required
                                                value={affiliation}
                                                onChange={(e) => setAffiliation(e.target.value)}
                                                placeholder="University / College / Organization"
                                                className="h-12 pl-10 border-black/10 focus:border-gold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    onClick={() => canProceedToStep2 && setFormStep(2)}
                                    disabled={!canProceedToStep2}
                                    className="w-full h-12 bg-oxford text-white hover:bg-gold transition-colors font-bold tracking-wider uppercase text-xs disabled:opacity-50"
                                >
                                    Continue to Manuscript Details →
                                </Button>
                            </motion.div>
                        )}

                        {/* Step 2: Manuscript Details */}
                        {formStep === 2 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h2 className="font-serif text-xl font-bold text-oxford pb-4 border-b border-gold/20">Manuscript Details</h2>
                                
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Manuscript Title *</label>
                                    <Input
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter the full title of your manuscript"
                                        className="h-12 border-black/10 focus:border-gold text-lg"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Discipline *</label>
                                        <Select required onValueChange={setDiscipline} value={discipline}>
                                            <SelectTrigger className="h-12 border-black/10 focus:border-gold">
                                                <SelectValue placeholder="Select discipline" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {disciplines.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Manuscript Type *</label>
                                        <Select required onValueChange={setManuscriptType} value={manuscriptType}>
                                            <SelectTrigger className="h-12 border-black/10 focus:border-gold">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {manuscriptTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Keywords</label>
                                    <Input
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        placeholder="Enter keywords separated by commas"
                                        className="h-12 border-black/10 focus:border-gold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Co-Authors (if any)</label>
                                    <Input
                                        value={coAuthors}
                                        onChange={(e) => setCoAuthors(e.target.value)}
                                        placeholder="Names of co-authors"
                                        className="h-12 border-black/10 focus:border-gold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Abstract *</label>
                                    <Textarea
                                        required
                                        value={abstract}
                                        onChange={(e) => setAbstract(e.target.value)}
                                        placeholder="Provide a concise summary of your research (150-250 words)"
                                        className="min-h-[150px] border-black/10 focus:border-gold resize-y"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Additional Notes</label>
                                    <Textarea
                                        value={additionalNotes}
                                        onChange={(e) => setAdditionalNotes(e.target.value)}
                                        placeholder="Any additional information for the editorial team"
                                        className="min-h-[100px] border-black/10 focus:border-gold resize-y"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        onClick={() => setFormStep(1)}
                                        variant="outline"
                                        className="flex-1 h-12 border-black/20 text-oxford hover:bg-oxford/5 font-bold tracking-wider uppercase text-xs"
                                    >
                                        ← Back
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => setFormStep(3)}
                                        disabled={!title || !discipline || !manuscriptType || !abstract}
                                        className="flex-1 h-12 bg-oxford text-white hover:bg-gold transition-colors font-bold tracking-wider uppercase text-xs disabled:opacity-50"
                                    >
                                        Continue to Upload →
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: File Upload & Submit */}
                        {formStep === 3 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h2 className="font-serif text-xl font-bold text-oxford pb-4 border-b border-gold/20">Upload Manuscript</h2>

                                {/* File Upload Section */}
                                <div className="border-2 border-dashed border-black/10 bg-oxford/5 p-8 space-y-6">
                                    <div className="text-center">
                                        <Upload className="mx-auto text-gold mb-3" size={32} />
                                        <h4 className="font-semibold text-oxford">Upload Manuscript Files</h4>
                                        <p className="text-xs text-oxford/50 mt-1">PDF, DOC, DOCX formats accepted</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="h-12 px-6 gap-2 border-black/20"
                                        >
                                            <Upload size={16} /> Choose Files
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={startCamera}
                                            className="h-12 px-6 gap-2"
                                        >
                                            <Camera size={16} /> Take Photo
                                        </Button>
                                    </div>

                                    {/* Camera Preview */}
                                    <AnimatePresence>
                                        {isCameraOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="relative aspect-video bg-oxford/5 overflow-hidden mx-auto max-w-md rounded-lg"
                                            >
                                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={capturePhoto}
                                                        className="w-14 h-14 bg-white rounded-full shadow-lg border-4 border-gold hover:scale-105 transition-transform"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={stopCamera}
                                                    className="absolute top-3 right-3 p-2 bg-oxford text-white rounded-full hover:bg-gold transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Attachments Preview */}
                                    {attachmentPreviews.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {attachmentPreviews.map((preview, i) => (
                                                <div key={i} className="relative aspect-square border border-black/10 bg-white overflow-hidden group">
                                                    {preview ? (
                                                        <img src={preview || ""} alt={`Attachment ${i + 1}`} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-full text-oxford/40">
                                                            <FileText size={24} />
                                                            <span className="text-[10px] mt-1">{attachmentFiles[i]?.name?.substring(0, 15)}</span>
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setAttachmentFiles(prev => prev.filter((_, idx) => idx !== i));
                                                            setAttachmentPreviews(prev => prev.filter((_, idx) => idx !== i));
                                                        }}
                                                        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Summary */}
                                <div className="bg-oxford/5 p-6 border border-black/5">
                                    <h3 className="font-bold text-oxford mb-4">Submission Summary</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="text-oxford/50">Type:</span>
                                        <span className="text-oxford font-medium">{submissionType === "journal" ? "Journal Paper" : "Book Chapter"}</span>
                                        <span className="text-oxford/50">Title:</span>
                                        <span className="text-oxford font-medium">{title.substring(0, 30)}...</span>
                                        <span className="text-oxford/50">Author:</span>
                                        <span className="text-oxford font-medium">{authorName}</span>
                                        <span className="text-oxford/50">Files:</span>
                                        <span className="text-oxford font-medium">{attachmentFiles.length} attached</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        onClick={() => setFormStep(2)}
                                        variant="outline"
                                        className="flex-1 h-12 border-black/20 text-oxford hover:bg-oxford/5 font-bold tracking-wider uppercase text-xs"
                                    >
                                        ← Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || attachmentFiles.length === 0}
                                        className="flex-1 h-12 bg-oxford text-white hover:bg-gold transition-colors font-bold tracking-wider uppercase text-xs disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <motion.span
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                />
                                                Opening Email...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Mail size={16} />
                                                Submit via Email
                                            </span>
                                        )}
                                    </Button>
                                </div>

                                <p className="text-xs text-oxford/50 text-center">
                                    Clicking submit will open your default email application with all details pre-filled.
                                    Please attach your manuscript file and send the email.
                                </p>
                            </motion.div>
                        )}
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
});

export default SubmitPaperPage;
