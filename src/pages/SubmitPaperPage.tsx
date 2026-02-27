import React, { useState, memo, FormEvent, useRef, useEffect, useMemo, useCallback } from "react";
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
    FileType,
    Save,
    Loader2,
    AlertCircle,
    Check,
    FileIcon,
    Image,
    Trash2,
    Download,
    Eye,
    Clock,
    Calendar,
    Briefcase,
    Globe,
    Link as LinkIcon,
    PenLine,
    AlertTriangle,
    ChevronRight,
    ChevronDown,
    Expand,
    ChevronUp
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";

interface UploadProgress {
    fileName: string;
    progress: number;
    status: 'uploading' | 'complete' | 'error';
    url?: string;
    error?: string;
}

interface SavedDraft {
    id: string;
    data: any;
    savedAt: string;
}

const SubmitPaperPage = memo(() => {
    const { currentUser, submitPaper } = useJMRH();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [submissionType, setSubmissionType] = useState<"journal" | "book" | "">("");
    const [authorName, setAuthorName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [affiliation, setAffiliation] = useState("");
    const [designation, setDesignation] = useState("");
    const [orcid, setOrcid] = useState("");
    const [title, setTitle] = useState("");
    const [abstract, setAbstract] = useState("");
    const [abstractSections, setAbstractSections] = useState({
        objectives: "",
        methods: "",
        results: "",
        conclusions: ""
    });
    const [discipline, setDiscipline] = useState("");
    const [keywords, setKeywords] = useState("");
    const [coAuthors, setCoAuthors] = useState("");
    const [manuscriptType, setManuscriptType] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [additionalNotes, setAdditionalNotes] = useState("");
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
    const [attachmentPreviews, setAttachmentPreviews] = useState<(string | null)[]>([]);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [formStep, setFormStep] = useState(1);
    
    const [agreements, setAgreements] = useState({
        original: false,
        noConflict: false,
        copyright: false,
        ethics: false,
        dataAvailability: false
    });
    
    const [showAbstractBuilder, setShowAbstractBuilder] = useState(false);
    const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([]);
    const [showDraftDialog, setShowDraftDialog] = useState(false);
    const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [submissionId, setSubmissionId] = useState("");
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

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

    const fileSizeLimit = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/tiff',
        'application/zip',
        'application/x-zip-compressed'
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.tiff', '.tif', '.zip'];

    useEffect(() => {
        if (currentUser) {
            setAuthorName(currentUser.name || "");
            setEmail(currentUser.email || "");
            setAffiliation(currentUser.affiliation || "");
        }
    }, [currentUser]);

    useEffect(() => {
        autoSaveTimerRef.current = setTimeout(() => {
            if (title || abstract) {
                handleAutoSave();
            }
        }, 30000);
        
        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [title, abstract, authorName, email, submissionType]);

    const validateOrcid = (orcid: string): boolean => {
        if (!orcid) return true;
        const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
        return orcidRegex.test(orcid);
    };

    const validateForm = useCallback((step: number): Record<string, string> => {
        const errors: Record<string, string> = {};
        
        if (step === 1) {
            if (!authorName.trim()) errors.authorName = "Author name is required";
            if (!email.trim()) errors.email = "Email is required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email format";
            if (orcid && !validateOrcid(orcid)) errors.orcid = "Invalid ORCID format (XXXX-XXXX-XXXX-XXXX)";
            if (!affiliation.trim()) errors.affiliation = "Affiliation is required";
        }
        
        if (step === 2) {
            if (!title.trim()) errors.title = "Title is required";
            if (title.length < 10) errors.title = "Title must be at least 10 characters";
            if (!discipline) errors.discipline = "Discipline is required";
            if (!manuscriptType) errors.manuscriptType = "Manuscript type is required";
            if (!abstract.trim()) errors.abstract = "Abstract is required";
            if (abstract.length < 150) errors.abstract = "Abstract must be at least 150 characters";
        }
        
        if (step === 3) {
            if (attachmentFiles.length === 0) errors.files = "At least one file is required";
            if (!agreements.original) errors.original = "You must confirm originality";
            if (!agreements.noConflict) errors.noConflict = "You must confirm no conflict of interest";
            if (!agreements.copyright) errors.copyright = "You must agree to copyright terms";
            if (!agreements.ethics) errors.ethics = "You must confirm ethics compliance";
        }
        
        return errors;
    }, [authorName, email, orcid, affiliation, title, discipline, manuscriptType, abstract, attachmentFiles, agreements]);

    useEffect(() => {
        const errors = validateForm(formStep);
        setValidationErrors(errors);
    }, [formStep, validateForm]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const validFiles: File[] = [];
            
            files.forEach(file => {
                if (file.size > fileSizeLimit) {
                    toast({
                        title: "File Too Large",
                        description: `${file.name} exceeds 50MB limit`,
                        variant: "destructive"
                    });
                    return;
                }
                
                const ext = '.' + file.name.split('.').pop()?.toLowerCase();
                if (!allowedExtensions.includes(ext)) {
                    toast({
                        title: "Invalid File Type",
                        description: `${file.name} has an unsupported format`,
                        variant: "destructive"
                    });
                    return;
                }
                
                validFiles.push(file);
                if (file.type.startsWith('image/')) {
                    const url = URL.createObjectURL(file);
                    setAttachmentPreviews(prev => [...prev, url]);
                } else {
                    setAttachmentPreviews(prev => [...prev, null]);
                }
            });
            
            setAttachmentFiles(prev => [...prev, ...validFiles]);
        }
    };

    const removeFile = (index: number) => {
        const url = attachmentPreviews[index];
        if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
        }
        setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
        setAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFileToStorage = async (file: File, submissionId: string): Promise<string | null> => {
        const fileName = `${submissionId}/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from('manuscripts')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });
        
        if (error) {
            console.error('Upload error:', error);
            return null;
        }
        
        const { data: { publicUrl } } = supabase.storage
            .from('manuscripts')
            .getPublicUrl(fileName);
        
        return publicUrl;
    };

    const handleAutoSave = async () => {
        try {
            const draftData = {
                submissionType,
                authorName,
                email,
                phone,
                affiliation,
                designation,
                orcid,
                title,
                abstract,
                abstractSections,
                discipline,
                keywords,
                coAuthors,
                manuscriptType,
                coverLetter,
                additionalNotes,
                savedAt: new Date().toISOString()
            };
            
            localStorage.setItem('jmrh_draft', JSON.stringify(draftData));
            setLastSaved(new Date());
        } catch (err) {
            console.error('Auto-save error:', err);
        }
    };

    const loadSavedDraft = () => {
        try {
            const saved = localStorage.getItem('jmrh_draft');
            if (saved) {
                const draft = JSON.parse(saved);
                setSubmissionType(draft.submissionType || "");
                setAuthorName(draft.authorName || "");
                setEmail(draft.email || "");
                setPhone(draft.phone || "");
                setAffiliation(draft.affiliation || "");
                setDesignation(draft.designation || "");
                setOrcid(draft.orcid || "");
                setTitle(draft.title || "");
                setAbstract(draft.abstract || "");
                setAbstractSections(draft.abstractSections || { objectives: "", methods: "", results: "", conclusions: "" });
                setDiscipline(draft.discipline || "");
                setKeywords(draft.keywords || "");
                setCoAuthors(draft.coAuthors || "");
                setManuscriptType(draft.manuscriptType || "");
                setCoverLetter(draft.coverLetter || "");
                setAdditionalNotes(draft.additionalNotes || "");
                setLastSaved(new Date(draft.savedAt));
                toast({ title: "Draft Loaded", description: "Your previously saved draft has been restored." });
            }
        } catch (err) {
            console.error('Load draft error:', err);
        }
    };

    const clearDraft = () => {
        localStorage.removeItem('jmrh_draft');
        setLastSaved(null);
        toast({ title: "Draft Cleared", description: "Your saved draft has been removed." });
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
            toast({ title: "Camera Error", description: "Could not access camera. Please ensure camera permissions are granted.", variant: "destructive" });
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

    const generateSubmissionId = () => {
        const prefix = submissionType === "journal" ? "JMRH-J" : "JMRH-B";
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    };

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
        body += `Designation: ${designation}\n`;
        if (orcid) body += `ORCID: ${orcid}\n`;
        body += `\n`;
        
        body += `=== MANUSCRIPT DETAILS ===\n`;
        body += `Title: ${title}\n`;
        body += `Discipline: ${discipline}\n`;
        body += `Manuscript Type: ${manuscriptType}\n`;
        body += `Keywords: ${keywords}\n`;
        body += `Co-Authors: ${coAuthors || "None"}\n\n`;
        
        body += `=== ABSTRACT ===\n`;
        body += `${abstract}\n\n`;
        
        if (coverLetter) {
            body += `=== COVER LETTER ===\n`;
            body += `${coverLetter}\n\n`;
        }
        
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
        
        const errors = validateForm(3);
        if (Object.keys(errors).length > 0) {
            toast({ title: "Validation Error", description: "Please fix all required fields before submitting.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);

        try {
            const newSubmissionId = generateSubmissionId();
            setSubmissionId(newSubmissionId);
            
            setUploadProgress(attachmentFiles.map(f => ({
                fileName: f.name,
                progress: 0,
                status: 'uploading' as const
            })));

            const uploadedUrls: string[] = [];
            
            for (let i = 0; i < attachmentFiles.length; i++) {
                const file = attachmentFiles[i];
                try {
                    const url = await uploadFileToStorage(file, newSubmissionId);
                    if (url) {
                        uploadedUrls.push(url);
                        setUploadProgress(prev => prev.map((p, idx) => 
                            idx === i ? { ...p, progress: 100, status: 'complete', url } : p
                        ));
                    } else {
                        setUploadProgress(prev => prev.map((p, idx) => 
                            idx === i ? { ...p, status: 'error', error: 'Upload failed' } : p
                        ));
                    }
                } catch (err) {
                    setUploadProgress(prev => prev.map((p, idx) => 
                        idx === i ? { ...p, status: 'error', error: 'Upload failed' } : p
                    ));
                }
            }

            const paperType = submissionType === "journal" ? "JOURNAL" : "BOOK";
            
            await submitPaper(
                title,
                abstract,
                discipline,
                paperType,
                authorName,
                email,
                manuscriptType,
                keywords,
                coAuthors,
                uploadedUrls
            );

            const subject = generateEmailSubject();
            const body = generateEmailBody();
            const mailtoLink = `mailto:submit.jmrh@gmail.com?subject=${subject}&body=${body}`;
            const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=submit.jmrh@gmail.com&su=${encodeURIComponent(subject)}&body=${body}`;
            
            window.location.href = mailtoLink;
            window.open(gmailLink, '_blank');
            
            localStorage.removeItem('jmrh_draft');
            
            setShowReceipt(true);
            
            toast({ 
                title: "Submission Successful!", 
                description: `Your manuscript has been submitted. Submission ID: ${newSubmissionId}. Please also send the email with your attachment.` 
            });
            
            setTimeout(() => {
                setSubmissionType("");
                setAuthorName(currentUser?.name || "");
                setEmail(currentUser?.email || "");
                setPhone("");
                setAffiliation(currentUser?.affiliation || "");
                setDesignation("");
                setOrcid("");
                setTitle("");
                setAbstract("");
                setAbstractSections({ objectives: "", methods: "", results: "", conclusions: "" });
                setDiscipline("");
                setKeywords("");
                setCoAuthors("");
                setManuscriptType("");
                setCoverLetter("");
                setAdditionalNotes("");
                setAttachmentFiles([]);
                setAttachmentPreviews([]);
                setUploadProgress([]);
                setFormStep(1);
                setAgreements({
                    original: false,
                    noConflict: false,
                    copyright: false,
                    ethics: false,
                    dataAvailability: false
                });
            }, 3000);
            
        } catch (error: any) {
            toast({ title: "Error", description: error?.message || "Failed to process submission.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceedToStep2 = useMemo(() => {
        return submissionType && authorName && email && affiliation && 
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }, [submissionType, authorName, email, affiliation]);

    const canProceedToStep3 = useMemo(() => {
        return title && discipline && manuscriptType && abstract && abstract.length >= 150;
    }, [title, discipline, manuscriptType, abstract]);

    const buildAbstractFromSections = () => {
        const sections = [];
        if (abstractSections.objectives) sections.push(`Objectives: ${abstractSections.objectives}`);
        if (abstractSections.methods) sections.push(`Methods: ${abstractSections.methods}`);
        if (abstractSections.results) sections.push(`Results: ${abstractSections.results}`);
        if (abstractSections.conclusions) sections.push(`Conclusions: ${abstractSections.conclusions}`);
        setAbstract(sections.join(' '));
        setShowAbstractBuilder(false);
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <Image className="w-8 h-8 text-purple-500" />;
        if (file.name.endsWith('.pdf')) return <FileText className="w-8 h-8 text-red-500" />;
        if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) return <FileText className="w-8 h-8 text-blue-500" />;
        return <FileIcon className="w-8 h-8 text-gray-500" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

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
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-oxford/40 hover:text-gold transition-colors">
                                <ArrowLeft size={14} /> Back to Home
                            </Link>
                            {lastSaved && (
                                <div className="flex items-center gap-2 text-xs text-oxford/50">
                                    <Save size={14} />
                                    <span>Draft saved {lastSaved.toLocaleTimeString()}</span>
                                    <button onClick={clearDraft} className="text-red-500 hover:underline ml-2">Clear</button>
                                </div>
                            )}
                        </div>
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
                    <div className="mb-8 flex items-center justify-center gap-2 sm:gap-4">
                        <div className={`flex items-center gap-2 ${formStep >= 1 ? "text-gold" : "text-oxford/30"}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${formStep >= 1 ? "bg-gold text-white" : "bg-oxford/10"}`}>1</span>
                            <span className="text-xs uppercase tracking-wider font-bold hidden sm:inline">Details</span>
                        </div>
                        <div className="w-8 sm:w-12 h-0.5 bg-oxford/10">
                            <div className={`h-full bg-gold transition-all ${formStep >= 2 ? "w-full" : "w-0"}`} />
                        </div>
                        <div className={`flex items-center gap-2 ${formStep >= 2 ? "text-gold" : "text-oxford/30"}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${formStep >= 2 ? "bg-gold text-white" : "bg-oxford/10"}`}>2</span>
                            <span className="text-xs uppercase tracking-wider font-bold hidden sm:inline">Manuscript</span>
                        </div>
                        <div className="w-8 sm:w-12 h-0.5 bg-oxford/10">
                            <div className={`h-full bg-gold transition-all ${formStep >= 3 ? "w-full" : "w-0"}`} />
                        </div>
                        <div className={`flex items-center gap-2 ${formStep >= 3 ? "text-gold" : "text-oxford/30"}`}>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${formStep >= 3 ? "bg-gold text-white" : "bg-oxford/10"}`}>3</span>
                            <span className="text-xs uppercase tracking-wider font-bold hidden sm:inline">Submit</span>
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
                                                className={`h-12 pl-10 border-black/10 focus:border-gold ${validationErrors.authorName ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        {validationErrors.authorName && (
                                            <p className="text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle size={12} /> {validationErrors.authorName}
                                            </p>
                                        )}
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
                                                className={`h-12 pl-10 border-black/10 focus:border-gold ${validationErrors.email ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        {validationErrors.email && (
                                            <p className="text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle size={12} /> {validationErrors.email}
                                            </p>
                                        )}
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
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">ORCID iD</label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                            <Input
                                                value={orcid}
                                                onChange={(e) => setOrcid(e.target.value)}
                                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                                className={`h-12 pl-10 border-black/10 focus:border-gold ${validationErrors.orcid ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        {validationErrors.orcid && (
                                            <p className="text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle size={12} /> {validationErrors.orcid}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Designation</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                            <Input
                                                value={designation}
                                                onChange={(e) => setDesignation(e.target.value)}
                                                placeholder="e.g., Professor, Researcher, Student"
                                                className="h-12 pl-10 border-black/10 focus:border-gold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Website</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                            <Input
                                                type="url"
                                                placeholder="https://your-website.com"
                                                className="h-12 pl-10 border-black/10 focus:border-gold"
                                            />
                                        </div>
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
                                                className={`h-12 pl-10 border-black/10 focus:border-gold ${validationErrors.affiliation ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        {validationErrors.affiliation && (
                                            <p className="text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle size={12} /> {validationErrors.affiliation}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={loadSavedDraft}
                                        className="h-12 border-black/20 text-oxford hover:bg-oxford/5 font-bold tracking-wider uppercase text-xs gap-2"
                                    >
                                        <Save size={16} /> Load Draft
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => canProceedToStep2 && setFormStep(2)}
                                        disabled={!canProceedToStep2}
                                        className="flex-1 h-12 bg-oxford text-white hover:bg-gold transition-colors font-bold tracking-wider uppercase text-xs disabled:opacity-50"
                                    >
                                        Continue to Manuscript Details <ChevronRight size={16} className="ml-1" />
                                    </Button>
                                </div>
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
                                        className={`h-12 border-black/10 focus:border-gold text-lg ${validationErrors.title ? 'border-red-500' : ''}`}
                                    />
                                    {validationErrors.title && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle size={12} /> {validationErrors.title}
                                        </p>
                                    )}
                                    <p className="text-xs text-oxford/40">{title.length} characters</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Discipline *</label>
                                        <Select required onValueChange={setDiscipline} value={discipline}>
                                            <SelectTrigger className={`h-12 border-black/10 focus:border-gold ${validationErrors.discipline ? 'border-red-500' : ''}`}>
                                                <SelectValue placeholder="Select discipline" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {disciplines.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        {validationErrors.discipline && (
                                            <p className="text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle size={12} /> {validationErrors.discipline}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Manuscript Type *</label>
                                        <Select required onValueChange={setManuscriptType} value={manuscriptType}>
                                            <SelectTrigger className={`h-12 border-black/10 focus:border-gold ${validationErrors.manuscriptType ? 'border-red-500' : ''}`}>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {manuscriptTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        {validationErrors.manuscriptType && (
                                            <p className="text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle size={12} /> {validationErrors.manuscriptType}
                                            </p>
                                        )}
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
                                    <p className="text-xs text-oxford/40">Suggested: at least 4-6 keywords</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Co-Authors (if any)</label>
                                    <Input
                                        value={coAuthors}
                                        onChange={(e) => setCoAuthors(e.target.value)}
                                        placeholder="Names and affiliations of co-authors"
                                        className="h-12 border-black/10 focus:border-gold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Abstract *</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowAbstractBuilder(!showAbstractBuilder)}
                                            className="text-xs text-gold hover:underline flex items-center gap-1"
                                        >
                                            {showAbstractBuilder ? <ChevronUp size={14} /> : <Expand size={14} />}
                                            {showAbstractBuilder ? 'Hide Builder' : 'Use Structured Builder'}
                                        </button>
                                    </div>
                                    
                                    {showAbstractBuilder && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="space-y-4 p-4 bg-oxford/5 rounded-lg border border-black/5"
                                        >
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-oxford/60">Objectives</label>
                                                <Textarea
                                                    value={abstractSections.objectives}
                                                    onChange={(e) => setAbstractSections(prev => ({ ...prev, objectives: e.target.value }))}
                                                    placeholder="What is the main aim of your research?"
                                                    className="min-h-[80px] border-black/10 focus:border-gold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-oxford/60">Methods</label>
                                                <Textarea
                                                    value={abstractSections.methods}
                                                    onChange={(e) => setAbstractSections(prev => ({ ...prev, methods: e.target.value }))}
                                                    placeholder="What methodology was used?"
                                                    className="min-h-[80px] border-black/10 focus:border-gold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-oxford/60">Results</label>
                                                <Textarea
                                                    value={abstractSections.results}
                                                    onChange={(e) => setAbstractSections(prev => ({ ...prev, results: e.target.value }))}
                                                    placeholder="What were the main findings?"
                                                    className="min-h-[80px] border-black/10 focus:border-gold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-oxford/60">Conclusions</label>
                                                <Textarea
                                                    value={abstractSections.conclusions}
                                                    onChange={(e) => setAbstractSections(prev => ({ ...prev, conclusions: e.target.value }))}
                                                    placeholder="What are the main conclusions?"
                                                    className="min-h-[80px] border-black/10 focus:border-gold"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={buildAbstractFromSections}
                                                className="w-full bg-gold text-white hover:bg-oxford"
                                            >
                                                Generate Abstract
                                            </Button>
                                        </motion.div>
                                    )}
                                    
                                    <Textarea
                                        required
                                        value={abstract}
                                        onChange={(e) => setAbstract(e.target.value)}
                                        placeholder="Provide a concise summary of your research (150-250 words)"
                                        className={`min-h-[150px] border-black/10 focus:border-gold resize-y ${validationErrors.abstract ? 'border-red-500' : ''}`}
                                    />
                                    {validationErrors.abstract && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle size={12} /> {validationErrors.abstract}
                                        </p>
                                    )}
                                    <p className="text-xs text-oxford/40">{abstract.length} / 250 characters (recommended)</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Cover Letter</label>
                                    <Textarea
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        placeholder="Briefly describe the significance of your research and why it is suitable for publication"
                                        className="min-h-[120px] border-black/10 focus:border-gold resize-y"
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
                                        disabled={!canProceedToStep3}
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
                                        <p className="text-xs text-oxford/50 mt-1">PDF, DOC, DOCX, JPEG, PNG, TIFF, ZIP (Max 50MB each)</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff,.tif,.zip"
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
                                        <div className="space-y-3">
                                            <p className="text-xs font-bold text-oxford/60 uppercase tracking-wider">Attached Files ({attachmentFiles.length})</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {attachmentFiles.map((file, i) => (
                                                    <div key={i} className="relative border border-black/10 bg-white p-3 flex items-center gap-3 group">
                                                        {attachmentPreviews[i] ? (
                                                            <img src={attachmentPreviews[i] || ""} alt={`Attachment ${i + 1}`} className="w-12 h-12 object-cover rounded" />
                                                        ) : (
                                                            <div className="w-12 h-12 flex items-center justify-center bg-oxford/5 rounded">
                                                                {getFileIcon(file)}
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-oxford truncate">{file.name}</p>
                                                            <p className="text-xs text-oxford/50">{formatFileSize(file.size)}</p>
                                                            {uploadProgress[i] && (
                                                                <div className="mt-1">
                                                                    <div className="h-1 bg-oxford/10 rounded-full overflow-hidden">
                                                                        <div 
                                                                            className={`h-full transition-all ${uploadProgress[i].status === 'complete' ? 'bg-green-500' : uploadProgress[i].status === 'error' ? 'bg-red-500' : 'bg-gold'}`}
                                                                            style={{ width: `${uploadProgress[i].progress}%` }}
                                                                        />
                                                                    </div>
                                                                    <p className="text-xs text-oxford/50 mt-1">
                                                                        {uploadProgress[i].status === 'complete' ? 'Uploaded' : uploadProgress[i].status === 'error' ? uploadProgress[i].error : 'Uploading...'}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(i)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {validationErrors.files && (
                                        <p className="text-xs text-red-500 flex items-center gap-1 justify-center">
                                            <AlertCircle size={12} /> {validationErrors.files}
                                        </p>
                                    )}
                                </div>

                                {/* Agreements */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-oxford">Author Declarations *</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <Checkbox 
                                                checked={agreements.original}
                                                onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, original: !!checked }))}
                                                className="mt-1"
                                            />
                                            <span className="text-sm text-oxford/80">This is original work that has not been published elsewhere and is not under consideration for publication.</span>
                                        </label>
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <Checkbox 
                                                checked={agreements.noConflict}
                                                onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, noConflict: !!checked }))}
                                                className="mt-1"
                                            />
                                            <span className="text-sm text-oxford/80">I declare no conflict of interest with respect to this submission.</span>
                                        </label>
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <Checkbox 
                                                checked={agreements.copyright}
                                                onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, copyright: !!checked }))}
                                                className="mt-1"
                                            />
                                            <span className="text-sm text-oxford/80">If accepted, I agree to transfer copyright to JMRH Publications.</span>
                                        </label>
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <Checkbox 
                                                checked={agreements.ethics}
                                                onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, ethics: !!checked }))}
                                                className="mt-1"
                                            />
                                            <span className="text-sm text-oxford/80">This research complies with ethical standards and relevant institutional guidelines.</span>
                                        </label>
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <Checkbox 
                                                checked={agreements.dataAvailability}
                                                onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, dataAvailability: !!checked }))}
                                                className="mt-1"
                                            />
                                            <span className="text-sm text-oxford/80">I agree to make data and materials available upon request.</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="bg-oxford/5 p-6 border border-black/5">
                                    <h3 className="font-bold text-oxford mb-4">Submission Summary</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="text-oxford/50">Type:</span>
                                        <span className="text-oxford font-medium">{submissionType === "journal" ? "Journal Paper" : "Book Chapter"}</span>
                                        <span className="text-oxford/50">Title:</span>
                                        <span className="text-oxford font-medium">{title.substring(0, 40)}{title.length > 40 ? '...' : ''}</span>
                                        <span className="text-oxford/50">Author:</span>
                                        <span className="text-oxford font-medium">{authorName}</span>
                                        <span className="text-oxford/50">Discipline:</span>
                                        <span className="text-oxford font-medium">{discipline}</span>
                                        <span className="text-oxford/50">Manuscript Type:</span>
                                        <span className="text-oxford font-medium">{manuscriptType}</span>
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
                                                Processing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Send size={16} />
                                                Submit Manuscript
                                            </span>
                                        )}
                                    </Button>
                                </div>

                                <div className="bg-gold/10 border border-gold/30 p-4">
                                    <p className="text-sm font-bold text-oxford mb-2">📧 Email Submission Instructions:</p>
                                    <ol className="text-xs text-oxford/70 space-y-1 list-decimal list-inside">
                                        <li>Click "Submit Manuscript" button below</li>
                                        <li>Your email app will open with subject & body pre-filled</li>
                                        <li><strong>Attach your manuscript file(s)</strong> to the email</li>
                                        <li>Send the email to complete submission</li>
                                    </ol>
                                    <p className="text-xs text-oxford/50 mt-2">
                                        Submission ID will be generated after sending email.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </div>
            </main>

            {/* Receipt Dialog */}
            <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle className="text-green-500" />
                            Submission Successful!
                        </DialogTitle>
                        <DialogDescription>
                            Your manuscript has been submitted successfully.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="bg-oxford/5 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-oxford/60">Submission ID:</span>
                                <span className="text-sm font-mono font-bold text-oxford">{submissionId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-oxford/60">Title:</span>
                                <span className="text-sm text-oxford truncate max-w-[200px]">{title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-oxford/60">Date:</span>
                                <span className="text-sm text-oxford">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                        <p className="text-xs text-oxford/60">
                            Please check your email for confirmation. Your manuscript is now under review.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowReceipt(false)} className="w-full bg-gold text-white hover:bg-oxford">
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
});

export default SubmitPaperPage;
