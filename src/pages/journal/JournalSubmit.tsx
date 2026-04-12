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
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Paperclip,
  Mail,
  Phone,
  User,
  Building,
  FileType,
  AlertTriangle,
  BookOpen
} from "lucide-react";
import { motion } from "framer-motion";

const JournalSubmit = memo(() => {
  const { currentUser, submitPaper } = useJMRH();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [submissionId, setSubmissionId] = useState("");

  const [authorName, setAuthorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [designation, setDesignation] = useState("");
  
  const [journalName, setJournalName] = useState("");
  const [journalDescription, setJournalDescription] = useState("");
  
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      setDesignation(currentUser.designation || "");
      setPhone(currentUser.phone || "");
    }
  }, [currentUser]);

  const handleLoginRedirect = () => {
    navigate("/auth");
  };

  const handleCloseAlert = () => {
    setShowLoginAlert(false);
    navigate("/");
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!authorName.trim()) newErrors.authorName = "Author name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Valid email is required";
    if (!affiliation.trim()) newErrors.affiliation = "Institution is required";
    if (!designation.trim()) newErrors.designation = "Designation is required";
    if (!journalName.trim()) newErrors.journalName = "Journal name is required";
    if (!journalDescription.trim()) newErrors.journalDescription = "Description is required";
    if (!attachmentFile) newErrors.attachment = "Please upload your manuscript";
    if (!agreements.original) newErrors.agreement = "You must confirm originality";
    if (!agreements.noConflict) newErrors.agreement = "You must confirm no conflict of interest";
    if (!agreements.copyright) newErrors.agreement = "You must agree to copyright terms";
    if (!agreements.ethics) newErrors.agreement = "You must confirm ethics compliance";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canSubmit = agreements.original && agreements.noConflict && agreements.copyright && agreements.ethics && attachmentFile;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const minSize = 10 * 1024;
    const maxSize = 20 * 1024 * 1024;
    
    if (file.size < minSize) {
      toast({ title: "File Too Small", description: "File must be at least 10KB", variant: "destructive" });
      return;
    }
    if (file.size > maxSize) {
      toast({ title: "File Too Large", description: "File must not exceed 20MB", variant: "destructive" });
      return;
    }

    const validTypes = ['.doc', '.docx'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(ext)) {
      toast({ title: "Invalid File Type", description: "Only DOC or DOCX files are allowed", variant: "destructive" });
      return;
    }

    setAttachmentFile(file);
    setErrors(prev => ({ ...prev, attachment: "" }));
  };

  const removeFile = () => {
    setAttachmentFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast({ 
        title: "Validation Error", 
        description: Object.values(errors)[0] || "Please complete all required fields", 
        variant: "destructive" 
      });
      return;
    }

    if (!canSubmit) {
      toast({ 
        title: "Confirmation Required", 
        description: "Please confirm all declarations in the checklist", 
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);
    setIsUploading(true);
    setUploadProgress(30);

    try {
      const newSubmissionId = generateSubmissionId();
      setSubmissionId(newSubmissionId);
      
      const uploadedUrl = await uploadFileToStorage(attachmentFile!, newSubmissionId);
      
      setUploadProgress(70);

      await submitPaper(
        `${journalName} - ${journalDescription}`,
        `Author: ${authorName}\nInstitution: ${affiliation}\nDesignation: ${designation}`,
        journalName,
        "JOURNAL",
        authorName,
        email,
        "Research Article",
        "",
        "",
        uploadedUrl ? [uploadedUrl] : [],
        phone,
        affiliation,
        designation
      );

      setUploadProgress(100);
      
      setShowReceipt(true);
      
      toast({ 
        title: "Submission Successful!", 
        description: `Your manuscript has been submitted. Submission ID: ${newSubmissionId}.` 
      });
      
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "Failed to process submission.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
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
              Your manuscript has been submitted successfully. It is now being stored and will appear in your dashboard.
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
              <div className="p-6 sm:p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-oxford mb-2 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-gold" />
                      Submit Your Manuscript
                    </h2>
                    <p className="text-oxford/60 text-sm">Fill in your details and upload your manuscript for peer review</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oxford/30" />
                        <Input
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder="Your Full Name"
                          className="pl-10 border-oxford/10 focus:border-gold"
                        />
                      </div>
                      {errors.authorName && (
                        <p className="text-xs text-red-500">{errors.authorName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oxford/30" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="pl-10 border-oxford/10 focus:border-gold"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-oxford/30" />
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="pl-10 border-oxford/10 focus:border-gold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                        Designation <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g., Professor, Researcher"
                        className="border-oxford/10 focus:border-gold"
                      />
                      {errors.designation && (
                        <p className="text-xs text-red-500">{errors.designation}</p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                        College / Institution <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 w-4 h-4 text-oxford/30" />
                        <Input
                          value={affiliation}
                          onChange={(e) => setAffiliation(e.target.value)}
                          placeholder="Your College / University"
                          className="pl-10 border-oxford/10 focus:border-gold"
                        />
                      </div>
                      {errors.affiliation && (
                        <p className="text-xs text-red-500">{errors.affiliation}</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-black/5 pt-6">
                    <h3 className="font-serif text-xl font-bold text-oxford mb-4">Manuscript Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                          Journal Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={journalName}
                          onChange={(e) => setJournalName(e.target.value)}
                          placeholder="Name of the journal you're submitting to"
                          className="border-oxford/10 focus:border-gold"
                        />
                        {errors.journalName && (
                          <p className="text-xs text-red-500">{errors.journalName}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider font-bold text-oxford/70">
                          One Line About Journal <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={journalDescription}
                          onChange={(e) => setJournalDescription(e.target.value)}
                          placeholder="Brief description of your manuscript"
                          className="border-oxford/10 focus:border-gold"
                        />
                        {errors.journalDescription && (
                          <p className="text-xs text-red-500">{errors.journalDescription}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-black/5 pt-6">
                    <h3 className="font-serif text-xl font-bold text-oxford mb-4">Upload Manuscript</h3>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-oxford/20 rounded-lg p-8 text-center hover:border-gold/50 transition-colors">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".doc,.docx"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <Upload className="w-10 h-10 mx-auto text-oxford/30 mb-3" />
                        <p className="text-sm font-medium text-oxford mb-1">
                          Upload your manuscript
                        </p>
                        <p className="text-xs text-oxford/50 mb-4">
                          DOC or DOCX (10KB - 20MB)
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

                      {attachmentFile && (
                        <div className="flex items-center justify-between p-3 bg-oxford/5 border border-oxford/10 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileType className="w-5 h-5 text-oxford/50" />
                            <div>
                              <p className="text-sm font-medium text-oxford">{attachmentFile.name}</p>
                              <p className="text-xs text-oxford/50">{formatFileSize(attachmentFile.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="p-1 hover:bg-red-50 text-red-500 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {errors.attachment && (
                        <p className="text-xs text-red-500">{errors.attachment}</p>
                      )}
                    </div>
                  </div>

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
                        {errors.agreement && (
                          <p className="text-xs text-red-500 mt-2">{errors.agreement}</p>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-end pt-6 border-t border-black/5">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
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
                  </div>
                </div>
              </motion.div>
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
