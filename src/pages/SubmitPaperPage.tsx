import React, { useState, memo, FormEvent, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import { supabase } from "@/integrations/supabase/client";
import {
    Send,
    FileText,
    Upload,
    Check,
    Loader2,
    CheckCircle,
    AlertCircle,
    FileIcon,
    Mail,
    Phone,
    GraduationCap,
    Briefcase,
    BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";

const SubmitPaperPage = memo(() => {
    const { currentUser, submitPaper, submitPaperAnonymous } = useJMRH();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

    // Form fields - auto-filled from user data
    const [authorName, setAuthorName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [affiliation, setAffiliation] = useState("");
    const [designation, setDesignation] = useState("");
    const [journalName, setJournalName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Checklist
    const [checklist, setChecklist] = useState({
        originality: false,
        copyright: false,
        plagiarism: false,
        accuracy: false
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-fill from user data
    useEffect(() => {
        if (currentUser) {
            setAuthorName(currentUser.name || "");
            setEmail(currentUser.email || "");
            setPhone(currentUser.phone || "");
            setAffiliation(currentUser.affiliation || "");
            setDesignation(currentUser.designation || "");
        }
    }, [currentUser]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const extension = file.name.split('.').pop()?.toLowerCase();
            
            if (!['doc', 'docx'].includes(extension || '')) {
                toast({
                    title: "Invalid File Type",
                    description: "Please upload a DOC or DOCX file",
                    variant: "destructive"
                });
                return;
            }

            if (file.size > 20 * 1024 * 1024) {
                toast({
                    title: "File Too Large",
                    description: "File size must be less than 20MB",
                    variant: "destructive"
                });
                return;
            }

            setSelectedFile(file);
        }
    };

    const uploadFile = async (): Promise<string | null> => {
        if (!selectedFile) return null;
        
        setIsUploading(true);
        
        try {
            const submissionId = `SUB-${Date.now()}`;
            const fileName = `submissions/${submissionId}/${Date.now()}_${selectedFile.name}`;
            
            const { data, error } = await supabase.storage
                .from('papers')
                .upload(fileName, selectedFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('Upload error:', error);
                return null;
            }

            return fileName;
        } catch (err) {
            console.error('Upload exception:', err);
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validation
        if (!authorName.trim()) {
            toast({ title: "Error", description: "Name is required", variant: "destructive" });
            return;
        }
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast({ title: "Error", description: "Valid email is required", variant: "destructive" });
            return;
        }
        if (!affiliation.trim()) {
            toast({ title: "Error", description: "College/Institution is required", variant: "destructive" });
            return;
        }
        if (!journalName.trim()) {
            toast({ title: "Error", description: "Journal name is required", variant: "destructive" });
            return;
        }
        if (!selectedFile) {
            toast({ title: "Error", description: "Please upload a document file", variant: "destructive" });
            return;
        }
        if (!checklist.originality || !checklist.copyright || !checklist.plagiarism || !checklist.accuracy) {
            toast({ title: "Error", description: "Please check all submission checklist items", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);

        try {
            // Upload file first
            const fileUrl = await uploadFile();
            
            if (!fileUrl) {
                toast({ title: "Error", description: "Failed to upload file. Please try again.", variant: "destructive" });
                setIsSubmitting(false);
                return;
            }

            // Submit to database
            if (currentUser) {
                await submitPaper(
                    journalName, // Using title field for journal name
                    `Submitted by: ${authorName}\nEmail: ${email}\nPhone: ${phone}\nCollege: ${affiliation}\nDesignation: ${designation}`,
                    "General",
                    "JOURNAL",
                    authorName,
                    email,
                    undefined,
                    undefined,
                    undefined,
                    [fileUrl],
                    phone,
                    affiliation,
                    designation
                );
            } else {
                await submitPaperAnonymous(
                    journalName,
                    `Submitted by: ${authorName}\nEmail: ${email}\nPhone: ${phone}\nCollege: ${affiliation}\nDesignation: ${designation}`,
                    "General",
                    "JOURNAL",
                    authorName,
                    email,
                    undefined,
                    undefined,
                    undefined,
                    [fileUrl],
                    phone,
                    affiliation,
                    designation
                );
            }

            setIsSuccess(true);
            toast({
                title: "Submission Successful",
                description: "Your manuscript has been submitted successfully."
            });

        } catch (error: any) {
            toast({ title: "Error", description: error?.message || "Failed to submit", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Success page
    if (isSuccess) {
        const emailSubject = encodeURIComponent(`New Manuscript Submission - ${journalName}`);
        const emailBody = encodeURIComponent(
            `Name: ${authorName}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone}\n` +
            `College/Institution: ${affiliation}\n` +
            `Designation: ${designation}\n` +
            `Journal Name: ${journalName}\n\n` +
            `Please find the manuscript attached.`
        );

        return (
            <div className="min-h-screen bg-gradient-to-br from-oxford/5 via-background to-gold/5">
                <Header />
                <div className="container max-w-2xl mx-auto px-6 py-20">
                    <div className="bg-white rounded-2xl shadow-xl border border-gold/20 p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="font-serif text-3xl font-black text-oxford mb-4">
                            Submission Successful!
                        </h1>
                        <p className="text-oxford/70 mb-8">
                            Your manuscript has been submitted successfully. Our editorial team will review it shortly.
                        </p>
                        <div className="space-y-4">
                            <a 
                                href={`mailto:submissions@jmrh.in?subject=${emailSubject}&body=${emailBody}`}
                                className="block w-full bg-oxford text-white py-3 px-6 rounded-lg font-bold uppercase tracking-widest hover:bg-gold transition-all"
                            >
                                <Mail className="inline mr-2 w-4 h-4" />
                                Send via Email
                            </a>
                            <button 
                                onClick={() => {
                                    setIsSuccess(false);
                                    setAuthorName(currentUser?.name || "");
                                    setEmail(currentUser?.email || "");
                                    setPhone(currentUser?.phone || "");
                                    setAffiliation(currentUser?.affiliation || "");
                                    setDesignation(currentUser?.designation || "");
                                    setJournalName("");
                                    setSelectedFile(null);
                                    setChecklist({
                                        originality: false,
                                        copyright: false,
                                        plagiarism: false,
                                        accuracy: false
                                    });
                                }}
                                className="block w-full border-2 border-oxford text-oxford py-3 px-6 rounded-lg font-bold uppercase tracking-widest hover:bg-oxford hover:text-white transition-all"
                            >
                                Submit Another
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-oxford/5 via-background to-gold/5">
            <SEOHead 
                title="Submit Manuscript | Journal of Multidisciplinary Research Horizon"
                description="Submit your manuscript to JMRH - a peer-reviewed multidisciplinary research journal."
            />
            <Header />
            
            <section className="pt-32 pb-8">
                <div className="container max-w-2xl mx-auto px-6">
                    <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
                        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/journal/about" className="hover:text-gold transition-colors">Journal</Link>
                        <span>/</span>
                        <span className="text-gold">Submit Manuscript</span>
                    </nav>
                    
                    <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-4">
                        Submit Your Manuscript
                    </h1>
                    <p className="text-oxford/60 mb-8">
                        Complete the form below to submit your research paper to JMRH.
                    </p>
                </div>
            </section>

            <section className="pb-20">
                <div className="container max-w-2xl mx-auto px-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-black/5 p-8">
                        {/* Personal Information */}
                        <div className="mb-8">
                            <h2 className="font-serif text-xl font-bold text-oxford mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-gold" />
                                Author Information
                            </h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-oxford mb-2">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oxford/40" />
                                        <Input 
                                            type="text"
                                            value={authorName}
                                            onChange={(e) => setAuthorName(e.target.value)}
                                            placeholder="Enter your full name"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-oxford mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oxford/40" />
                                        <Input 
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-oxford mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oxford/40" />
                                        <Input 
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter your phone number"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-oxford mb-2">
                                        College / Institution *
                                    </label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oxford/40" />
                                        <Input 
                                            type="text"
                                            value={affiliation}
                                            onChange={(e) => setAffiliation(e.target.value)}
                                            placeholder="Enter your college/institution"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-oxford mb-2">
                                        Designation
                                    </label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oxford/40" />
                                        <Input 
                                            type="text"
                                            value={designation}
                                            onChange={(e) => setDesignation(e.target.value)}
                                            placeholder="e.g., Professor, Assistant Professor, Research Scholar"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Manuscript Information */}
                        <div className="mb-8">
                            <h2 className="font-serif text-xl font-bold text-oxford mb-6 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-gold" />
                                Manuscript Details
                            </h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-oxford mb-2">
                                        Journal Name / Title *
                                    </label>
                                    <Input 
                                        type="text"
                                        value={journalName}
                                        onChange={(e) => setJournalName(e.target.value)}
                                        placeholder="Enter manuscript title or journal name"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="mb-8">
                            <h2 className="font-serif text-xl font-bold text-oxford mb-6 flex items-center gap-2">
                                <FileIcon className="w-5 h-5 text-gold" />
                                Upload Manuscript
                            </h2>
                            
                            <div 
                                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                                    selectedFile 
                                        ? 'border-green-400 bg-green-50' 
                                        : 'border-oxford/20 hover:border-gold/50'
                                }`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input 
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".doc,.docx"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                
                                {selectedFile ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <FileText className="w-8 h-8 text-green-600" />
                                        <div className="text-left">
                                            <p className="font-semibold text-oxford">{selectedFile.name}</p>
                                            <p className="text-sm text-oxford/60">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedFile(null);
                                            }}
                                            className="ml-4 text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 text-oxford/30 mx-auto mb-4" />
                                        <p className="text-oxford font-medium mb-2">
                                            Click to upload your manuscript
                                        </p>
                                        <p className="text-sm text-oxford/50">
                                            Supported formats: DOC, DOCX (Max 20MB)
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Submission Checklist */}
                        <div className="mb-8">
                            <h2 className="font-serif text-xl font-bold text-oxford mb-6 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-gold" />
                                Submission Checklist
                            </h2>
                            
                            <div className="space-y-3">
                                <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                    <input 
                                        type="checkbox"
                                        checked={checklist.originality}
                                        onChange={(e) => setChecklist(p => ({ ...p, originality: e.target.checked }))}
                                        className="mt-1 w-4 h-4 text-gold"
                                    />
                                    <div>
                                        <span className="font-semibold text-oxford">Originality Declaration *</span>
                                        <p className="text-sm text-oxford/60">
                                            I certify that this manuscript is original and has not been published elsewhere.
                                        </p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                    <input 
                                        type="checkbox"
                                        checked={checklist.copyright}
                                        onChange={(e) => setChecklist(p => ({ ...p, copyright: e.target.checked }))}
                                        className="mt-1 w-4 h-4 text-gold"
                                    />
                                    <div>
                                        <span className="font-semibold text-oxford">Copyright Agreement *</span>
                                        <p className="text-sm text-oxford/60">
                                            I agree to transfer copyright to the journal if the manuscript is accepted.
                                        </p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                    <input 
                                        type="checkbox"
                                        checked={checklist.plagiarism}
                                        onChange={(e) => setChecklist(p => ({ ...p, plagiarism: e.target.checked }))}
                                        className="mt-1 w-4 h-4 text-gold"
                                    />
                                    <div>
                                        <span className="font-semibold text-oxford">Plagiarism Statement *</span>
                                        <p className="text-sm text-oxford/60">
                                            I certify that the manuscript contains no plagiarized material.
                                        </p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                    <input 
                                        type="checkbox"
                                        checked={checklist.accuracy}
                                        onChange={(e) => setChecklist(p => ({ ...p, accuracy: e.target.checked }))}
                                        className="mt-1 w-4 h-4 text-gold"
                                    />
                                    <div>
                                        <span className="font-semibold text-oxford">Accuracy Declaration *</span>
                                        <p className="text-sm text-oxford/60">
                                            I certify that all information in the manuscript is accurate and true.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button 
                            type="submit"
                            disabled={isSubmitting || isUploading}
                            className="w-full bg-oxford text-white py-4 text-lg font-bold uppercase tracking-widest hover:bg-gold transition-all disabled:opacity-50"
                        >
                            {isSubmitting || isUploading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    {isUploading ? 'Uploading...' : 'Submitting...'}
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    Submit Manuscript
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </section>

            <Footer />
        </div>
    );
});

export default SubmitPaperPage;