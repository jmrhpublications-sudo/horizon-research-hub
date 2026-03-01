import { useState, memo, useEffect, useRef, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { useToast } from "@/hooks/use-toast";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Send,
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Paperclip,
  Mail,
  Phone,
  MapPin,
  User,
  Building,
  BookOpen,
  FileType,
  Check,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

const disciplines = [
  "Commerce and Management",
  "Economics and Finance",
  "Education and Psychology",
  "Social Sciences and Humanities",
  "Science and Technology",
  "Environmental Studies and Sustainability",
  "Law and Legal Studies",
  "Medical and Health Sciences",
  "Engineering and Technology",
  "Arts and Literature",
  "Multidisciplinary"
];

const manuscriptTypes = [
  "Research Article",
  "Review Article",
  "Short Communication",
  "Case Study",
  "Letter to Editor",
  "Book Review",
  "Conference Proceeding"
];

const JournalSubmit = memo(() => {
  const { currentUser, submitPaper } = useJMRH();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [formStep, setFormStep] = useState(1);

  const [authorName, setAuthorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [designation, setDesignation] = useState("");
  const [orcid, setOrcid] = useState("");
  
  const [title, setTitle] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [manuscriptType, setManuscriptType] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  const [coAuthors, setCoAuthors] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [agreements, setAgreements] = useState({
    original: false,
    noConflict: false,
    copyright: false,
    ethics: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUser) {
      setShowLoginAlert(true);
    } else {
      setAuthorName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setAffiliation(currentUser.affiliation || "");
    }
  }, [currentUser]);

  const handleLoginRedirect = () => {
    navigate("/auth");
  };

  const handleCloseAlert = () => {
    setShowLoginAlert(false);
    navigate("/");
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    if (step === 1) {
      if (!authorName.trim()) errors.authorName = "Author name is required";
      if (!email.trim()) errors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Valid email is required";
      if (!affiliation.trim()) errors.affiliation = "Affiliation is required";
    }
    
    if (step === 2) {
      if (!title.trim()) errors.title = "Title is required";
      if (!discipline) errors.discipline = "Discipline is required";
      if (!manuscriptType) errors.manuscriptType = "Manuscript type is required";
      if (!abstract.trim()) errors.abstract = "Abstract is required";
      else if (abstract.length < 150) errors.abstract = "Abstract must be at least 150 characters";
    }
    
    if (step === 3) {
      if (!agreements.original) errors.agreement = "You must confirm originality";
      if (!agreements.noConflict) errors.agreement = "You must confirm no conflict of interest";
      if (!agreements.copyright) errors.agreement = "You must agree to copyright terms";
      if (!agreements.ethics) errors.agreement = "You must confirm ethics compliance";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const canProceedToStep2 = authorName && email && affiliation && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canProceedToStep3 = title && discipline && manuscriptType && abstract && abstract.length >= 150;
  const canSubmit = agreements.original && agreements.noConflict && agreements.copyright && agreements.ethics;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({ title: "File Too Large", description: `${file.name} exceeds 50MB limit`, variant: "destructive" });
        return false;
      }
      return true;
    });
    setAttachmentFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateSubmissionId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `JMRH-J-${timestamp}-${random}`;
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
    
    return fileName;
  };

  const generateEmailSubject = () => {
    return `Submission – JMRH Journal – ${authorName} – ${title.substring(0, 50)}`;
  };

  const generateEmailBody = () => {
    let body = `Dear Editorial Team,\n\n`;
    body += `I am submitting my manuscript for consideration for publication in the Journal of Multidisciplinary Research Horizon (JMRH).\n\n`;
    
    body += `=== SUBMISSION DETAILS ===\n`;
    body += `Submission ID: ${submissionId}\n`;
    body += `Date: ${new Date().toLocaleDateString()}\n\n`;
    
    body += `=== AUTHOR DETAILS ===\n`;
    body += `Name: ${authorName}\n`;
    body += `Email: ${email}\n`;
    body += `Phone: ${phone || "Not provided"}\n`;
    body += `Affiliation: ${affiliation}\n`;
    body += `Designation: ${designation || "Not provided"}\n`;
    if (orcid) body += `ORCID: ${orcid}\n`;
    body += `\n`;
    
    body += `=== MANUSCRIPT DETAILS ===\n`;
    body += `Title: ${title}\n`;
    body += `Discipline: ${discipline}\n`;
    body += `Manuscript Type: ${manuscriptType}\n`;
    body += `Keywords: ${keywords || "Not provided"}\n`;
    body += `Co-Authors: ${coAuthors || "None"}\n\n`;
    
    body += `=== ABSTRACT ===\n`;
    body += `${abstract}\n\n`;
    
    if (coverLetter) {
      body += `=== COVER LETTER ===\n`;
      body += `${coverLetter}\n\n`;
    }
    
    body += `=== ATTACHMENTS ===\n`;
    attachmentFiles.forEach((file, index) => {
      body += `${index + 1}. ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)\n`;
    });
    body += `\n`;
    
    body += `=== CHECKLIST ===\n`;
    body += `✓ Original manuscript: Yes\n`;
    body += `✓ Not under consideration elsewhere: Yes\n`;
    body += `✓ No conflict of interest: Yes\n`;
    body += `✓ Copyright agreement: Yes\n`;
    body += `✓ Ethics compliance: Yes\n\n`;
    
    body += `Please acknowledge receipt of this submission.\n\n`;
    body += `Thank you for your consideration.\n\n`;
    body += `Best regards,\n`;
    body += `${authorName}`;
    
    return encodeURIComponent(body);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      toast({ 
        title: "Validation Error", 
        description: Object.values(validationErrors)[0] || "Please complete all required fields", 
        variant: "destructive" 
      });
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
              idx === i ? { ...p, progress: 100, status: 'complete' } : p
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

      await submitPaper(
        title,
        abstract,
        discipline,
        "JOURNAL",
        authorName,
        email,
        manuscriptType,
        keywords,
        coAuthors,
        uploadedUrls
      );

      const subject = generateEmailSubject();
      const body = generateEmailBody();
      const adminEmail = "jmrhpublication@gmail.com";
      
      const mailtoLink = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
      const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${adminEmail}&su=${encodeURIComponent(subject)}&body=${body}`;
      
      window.location.href = mailtoLink;
      window.open(gmailLink, '_blank');
      
      setShowReceipt(true);
      
      toast({ 
        title: "Submission Successful!", 
        description: `Your manuscript has been submitted. Submission ID: ${newSubmissionId}. Please also check your email to attach files.` 
      });
      
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "Failed to process submission.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Submit Manuscript | Journal of Multidisciplinary Research Horizon"
        description="Submit your manuscript to JMRH. Easy submission process for researchers and academics."
        canonical="/journal/submit"
      />
      <Header />

      <Dialog open={showLoginAlert} onOpenChange={(open) => {
        if (!open) handleCloseAlert();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Login Required
            </DialogTitle>
            <DialogDescription>
              You need to be logged in to submit your manuscript.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Button onClick={handleLoginRedirect} className="w-full bg-oxford hover:bg-oxford/90">
              <User className="w-4 h-4 mr-2" />
              Login / Register
            </Button>
            <Button variant="outline" onClick={handleCloseAlert} className="w-full">
              Return to Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Submission Received
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Submission ID:</strong> {submissionId}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Your manuscript has been submitted successfully. Please check your email client to attach the manuscript files and send to the admin.
            </p>
            <p className="text-xs text-gray-500">
              You will receive an acknowledgment email within 2-3 working days.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setShowReceipt(false);
              navigate('/');
            }} className="w-full">
              Return to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <section className="pt-32 pb-16 bg-gradient-to-b from-oxford/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/journal/about" className="hover:text-gold transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-gold">Submit</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-oxford mb-4">
            Submit Manuscript
          </h1>
          <p className="text-oxford/70 text-sm sm:text-base max-w-2xl">
            Submit your original research to the Journal of Multidisciplinary Research Horizon. 
            All submissions undergo rigorous peer review.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-black/5 shadow-xl rounded-sm overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="border-b border-black/5">
                <div className="flex items-center justify-between px-6 py-4 bg-oxford/5">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {[
                      { num: 1, label: "Author" },
                      { num: 2, label: "Manuscript" },
                      { num: 3, label: "Review" }
                    ].map((step) => (
                      <div key={step.num} className="flex items-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (step.num === 1 || (step.num === 2 && validateStep(1)) || (step.num === 3 && validateStep(2))) {
                              setFormStep(step.num);
                            }
                          }}
                          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            formStep === step.num 
                              ? "bg-oxford text-white" 
                              : formStep > step.num 
                                ? "bg-green-500 text-white"
                                : "bg-white text-oxford/40 border border-oxford/10"
                          }`}
                        >
                          {formStep > step.num ? <Check className="w-3 h-3" /> : step.num}
                          <span className="hidden sm:inline">{step.label}</span>
                        </button>
                        {step.num < 3 && (
                          <ChevronRight className="w-4 h-4 text-oxford/20 mx-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 md:p-12">
                <AnimatePresence mode="wait">
                  {formStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-oxford mb-6 flex items-center gap-2">
                          <User className="w-5 h-5 text-gold" />
                          Author Information
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                            Author Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oxford/30" />
                            <Input
                              value={authorName}
                              onChange={(e) => setAuthorName(e.target.value)}
                              placeholder="Full Name"
                              className="pl-10 border-oxford/10 focus:border-gold"
                            />
                          </div>
                          {validationErrors.authorName && (
                            <p className="text-xs text-red-500">{validationErrors.authorName}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oxford/30" />
                            <Input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="author@example.com"
                              className="pl-10 border-oxford/10 focus:border-gold"
                            />
                          </div>
                          {validationErrors.email && (
                            <p className="text-xs text-red-500">{validationErrors.email}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oxford/30" />
                            <Input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+1 (555) 000-0000"
                              className="pl-10 border-oxford/10 focus:border-gold"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                            Designation
                          </label>
                          <Input
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder="e.g., Professor, Researcher"
                            className="border-oxford/10 focus:border-gold"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                            Affiliation / Institution <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Building className="absolute left-3 top-3 w-4 h-4 text-oxford/30" />
                            <Input
                              value={affiliation}
                              onChange={(e) => setAffiliation(e.target.value)}
                              placeholder="University / Organization"
                              className="pl-10 border-oxford/10 focus:border-gold"
                            />
                          </div>
                          {validationErrors.affiliation && (
                            <p className="text-xs text-red-500">{validationErrors.affiliation}</p>
                          )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                            ORCID (Optional)
                          </label>
                          <Input
                            value={orcid}
                            onChange={(e) => setOrcid(e.target.value)}
                            placeholder="https://orcid.org/0000-0000-0000-0000"
                            className="border-oxford/10 focus:border-gold"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {formStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-oxford mb-6 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-gold" />
                          Manuscript Details
                        </h2>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                          Manuscript Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter the title of your manuscript"
                          className="border-oxford/10 focus:border-gold text-lg"
                        />
                        {validationErrors.title && (
                          <p className="text-xs text-red-500">{validationErrors.title}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                            Discipline <span className="text-red-500">*</span>
                          </label>
                          <Select value={discipline} onValueChange={setDiscipline}>
                            <SelectTrigger className="border-oxford/10 focus:border-gold">
                              <SelectValue placeholder="Select discipline" />
                            </SelectTrigger>
                            <SelectContent>
                              {disciplines.map((d) => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {validationErrors.discipline && (
                            <p className="text-xs text-red-500">{validationErrors.discipline}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                            Manuscript Type <span className="text-red-500">*</span>
                          </label>
                          <Select value={manuscriptType} onValueChange={setManuscriptType}>
                            <SelectTrigger className="border-oxford/10 focus:border-gold">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {manuscriptTypes.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {validationErrors.manuscriptType && (
                            <p className="text-xs text-red-500">{validationErrors.manuscriptType}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                          Keywords
                        </label>
                        <Input
                          value={keywords}
                          onChange={(e) => setKeywords(e.target.value)}
                          placeholder="keyword1, keyword2, keyword3"
                          className="border-oxford/10 focus:border-gold"
                        />
                        <p className="text-xs text-oxford/40">Separate keywords with commas</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                          Co-Authors
                        </label>
                        <Input
                          value={coAuthors}
                          onChange={(e) => setCoAuthors(e.target.value)}
                          placeholder="Co-author names (if any)"
                          className="border-oxford/10 focus:border-gold"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                          Abstract <span className="text-red-500">*</span> (Min 150 characters)
                        </label>
                        <Textarea
                          value={abstract}
                          onChange={(e) => setAbstract(e.target.value)}
                          placeholder="Provide a summary of your research..."
                          className="border-oxford/10 focus:border-gold min-h-[150px]"
                        />
                        <div className="flex justify-between text-xs">
                          <span className={abstract.length < 150 ? "text-red-500" : "text-green-500"}>
                            {abstract.length} / 150 characters minimum
                          </span>
                        </div>
                        {validationErrors.abstract && (
                          <p className="text-xs text-red-500">{validationErrors.abstract}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                          Cover Letter
                        </label>
                        <Textarea
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          placeholder="Explain the significance of your research..."
                          className="border-oxford/10 focus:border-gold min-h-[100px]"
                        />
                      </div>
                    </motion.div>
                  )}

                  {formStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-oxford mb-6 flex items-center gap-2">
                          <Upload className="w-5 h-5 text-gold" />
                          File Upload & Review
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-oxford/20 rounded-lg p-8 text-center hover:border-gold/50 transition-colors">
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <Upload className="w-10 h-10 mx-auto text-oxford/30 mb-3" />
                          <p className="text-sm font-medium text-oxford mb-1">
                            Drop your manuscript files here
                          </p>
                          <p className="text-xs text-oxford/50 mb-4">
                            PDF, DOC, DOCX (Max 50MB each)
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="border-oxford/20 hover:bg-oxford hover:text-white"
                          >
                            <Paperclip className="w-4 h-4 mr-2" />
                            Browse Files
                          </Button>
                        </div>

                        {attachmentFiles.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                              Attached Files ({attachmentFiles.length})
                            </p>
                            {attachmentFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-oxford/5 border border-oxford/10 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <FileType className="w-5 h-5 text-oxford/50" />
                                  <div>
                                    <p className="text-sm font-medium text-oxford">{file.name}</p>
                                    <p className="text-xs text-oxford/50">{formatFileSize(file.size)}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="p-1 hover:bg-red-50 text-red-500 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {uploadProgress.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                            Upload Progress
                          </p>
                          {uploadProgress.map((up, index) => (
                            <div key={index} className="flex items-center gap-3 p-2">
                              {up.status === 'complete' && <CheckCircle className="w-4 h-4 text-green-500" />}
                              {up.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin text-gold" />}
                              {up.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                              <span className="text-sm text-oxford flex-1">{up.fileName}</span>
                              {up.status === 'uploading' && <span className="text-xs text-oxford/50">{up.progress}%</span>}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                        <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4" />
                          Submission Checklist
                        </h3>
                        <div className="space-y-2">
                          {[
                            { key: 'original', label: 'This manuscript is original and has not been published elsewhere' },
                            { key: 'noConflict', label: 'I declare no conflict of interest' },
                            { key: 'copyright', label: 'I agree to the copyright terms and conditions' },
                            { key: 'ethics', label: 'My research follows ethical guidelines' }
                          ].map((item) => (
                            <label key={item.key} className="flex items-start gap-3 cursor-pointer">
                              <Checkbox
                                checked={agreements[item.key as keyof typeof agreements]}
                                onCheckedChange={(checked) => 
                                  setAgreements(prev => ({ ...prev, [item.key]: checked }))
                                }
                                className="mt-0.5 border-oxford/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                              />
                              <span className="text-sm text-oxford/80">{item.label}</span>
                            </label>
                          ))}
                        </div>
                        {validationErrors.agreement && (
                          <p className="text-xs text-red-500 mt-2">{validationErrors.agreement}</p>
                        )}
                      </div>

                      <div className="bg-oxford text-white p-6 rounded-lg">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gold" />
                          Submission Email
                        </h3>
                        <p className="text-sm text-white/70 mb-2">
                          After submission, an email will be opened with all details to:
                        </p>
                        <p className="text-lg font-bold text-gold">jmrhpublication@gmail.com</p>
                        <p className="text-xs text-white/50 mt-2">
                          Please attach your manuscript files in the email.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-black/5">
                  <div>
                    {formStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormStep(formStep - 1)}
                        className="border-oxford/20"
                      >
                        Previous
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {formStep < 3 ? (
                      <Button
                        type="button"
                        onClick={() => {
                          if (validateStep(formStep)) {
                            setFormStep(formStep + 1);
                          }
                        }}
                        className="bg-oxford hover:bg-oxford/90"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting || !canSubmit}
                        className="bg-gold hover:bg-gold/90 text-oxford"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Manuscript
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link 
              to="/journal/guidelines"
              className="inline-flex items-center gap-2 border border-oxford text-oxford px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-oxford hover:text-white transition-all"
            >
              View Author Guidelines
            </Link>
            <Link 
              to="/call-for-papers"
              className="inline-flex items-center gap-2 bg-gold text-oxford px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-oxford hover:text-white transition-all"
            >
              View Call for Papers
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default JournalSubmit;
