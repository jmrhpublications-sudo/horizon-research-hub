import { memo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { useJMRH } from "@/context/JMRHContext";
import { 
    Upload, FileText, BookOpen, Mail, User, Link as LinkIcon, 
    Send, CheckCircle, AlertCircle, Clock
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const RequestUploadPage = memo(() => {
    const { currentUser, uploadRequests, createUploadRequest } = useJMRH();
    const { toast } = useToast();
    
    const [requestType, setRequestType] = useState<"JOURNAL" | "BOOK">("JOURNAL");
    const [title, setTitle] = useState("");
    const [authors, setAuthors] = useState("");
    const [description, setDescription] = useState("");
    const [isbn, setIsbn] = useState("");
    const [publisher, setPublisher] = useState("");
    const [link, setLink] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const userRequests = currentUser ? uploadRequests.filter(r => r.userId === currentUser.id) : [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!currentUser) {
            toast({ title: "Login Required", description: "Please login to submit a request.", variant: "destructive" });
            return;
        }

        if (!title || !authors) {
            toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);

        try {
            await createUploadRequest({
                requestType,
                title,
                authors,
                description,
                isbn: requestType === "BOOK" ? isbn : undefined,
                publisher: requestType === "BOOK" ? publisher : undefined,
                link
            });
            
            setShowSuccessDialog(true);
            setTitle("");
            setAuthors("");
            setDescription("");
            setIsbn("");
            setPublisher("");
            setLink("");
        } catch (error: any) {
            toast({ title: "Error", description: error?.message || "Failed to submit request", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <SEOHead 
                title="Request Upload | JMRH Publications"
                description="Request JMRH to upload a specific journal article or book."
                canonical="/request-upload"
            />
            <Header />
            
            {/* Page Header */}
            <section className="pt-32 pb-16 bg-gradient-to-b from-oxford/5 to-transparent">
                <div className="container max-w-4xl mx-auto px-6">
                    <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
                        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-gold">Request Upload</span>
                    </nav>
                    <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
                        Request Upload
                    </h1>
                    <p className="text-oxford/60 max-w-2xl">
                        Can't find a specific journal article or book? Submit a request and our team will work to make it available on our platform.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="container max-w-4xl mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Request Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white border border-black/5 p-8">
                                <h2 className="font-serif text-xl font-bold text-oxford mb-6">Submit a Request</h2>
                                
                                {!currentUser ? (
                                    <div className="text-center py-8">
                                        <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                                        <h3 className="font-bold text-oxford mb-2">Login Required</h3>
                                        <p className="text-oxford/60 mb-4">Please login to submit an upload request.</p>
                                        <Link to="/login">
                                            <Button className="bg-oxford hover:bg-gold">Login</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Request Type */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setRequestType("JOURNAL")}
                                                className={`p-4 border-2 transition-all ${requestType === "JOURNAL" ? "border-gold bg-gold/5" : "border-black/10 hover:border-gold/30"}`}
                                            >
                                                <FileText className={`w-8 h-8 mx-auto mb-2 ${requestType === "JOURNAL" ? "text-gold" : "text-oxford/40"}`} />
                                                <p className="font-bold text-oxford text-sm">Journal Article</p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setRequestType("BOOK")}
                                                className={`p-4 border-2 transition-all ${requestType === "BOOK" ? "border-gold bg-gold/5" : "border-black/10 hover:border-gold/30"}`}
                                            >
                                                <BookOpen className={`w-8 h-8 mx-auto mb-2 ${requestType === "BOOK" ? "text-gold" : "text-oxford/40"}`} />
                                                <p className="font-bold text-oxford text-sm">Book</p>
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">
                                                {requestType === "JOURNAL" ? "Article" : "Book"} Title *
                                            </label>
                                            <Input
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder={`Enter the ${requestType === "JOURNAL" ? "article" : "book"} title`}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Author(s) *</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                                <Input
                                                    value={authors}
                                                    onChange={(e) => setAuthors(e.target.value)}
                                                    placeholder="Author names"
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {requestType === "BOOK" && (
                                            <>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">ISBN</label>
                                                        <div className="relative">
                                                            <LinkIcon className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                                            <Input
                                                                value={isbn}
                                                                onChange={(e) => setIsbn(e.target.value)}
                                                                placeholder="ISBN number"
                                                                className="pl-10"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Publisher</label>
                                                        <Input
                                                            value={publisher}
                                                            onChange={(e) => setPublisher(e.target.value)}
                                                            placeholder="Publisher name"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Description / Notes</label>
                                            <Textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Any additional information that might help us locate the content"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Link (if available)</label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                                <Input
                                                    value={link}
                                                    onChange={(e) => setLink(e.target.value)}
                                                    placeholder="https://..."
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-12 bg-oxford hover:bg-gold transition-colors font-bold tracking-wider uppercase text-xs"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <Clock size={16} className="animate-spin" />
                                                    Submitting...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Send size={16} />
                                                    Submit Request
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* How it works */}
                            <div className="bg-white border border-black/5 p-6">
                                <h3 className="font-serif text-lg font-bold text-oxford mb-4">How It Works</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-gold font-bold text-sm">1</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-oxford text-sm">Submit Request</p>
                                            <p className="text-xs text-oxford/50">Fill in the details about the content you want</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-gold font-bold text-sm">2</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-oxford text-sm">We Review</p>
                                            <p className="text-xs text-oxford/50">Our team reviews your request</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-gold font-bold text-sm">3</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-oxford text-sm">Content Available</p>
                                            <p className="text-xs text-oxford/50">You'll be notified when it's available</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User's Requests */}
                            {currentUser && userRequests.length > 0 && (
                                <div className="bg-white border border-black/5 p-6">
                                    <h3 className="font-serif text-lg font-bold text-oxford mb-4">Your Requests</h3>
                                    <div className="space-y-3">
                                        {userRequests.map(request => (
                                            <div key={request.id} className="p-3 bg-oxford/5 border border-black/5">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 text-xs font-bold uppercase ${
                                                        request.requestType === 'JOURNAL' ? 'bg-gold/10 text-gold' : 'bg-teal-500/10 text-teal-600'
                                                    }`}>
                                                        {request.requestType}
                                                    </span>
                                                    <span className={`px-2 py-0.5 text-xs font-bold uppercase ${
                                                        request.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                                        request.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                                        'bg-red-100 text-red-600'
                                                    }`}>
                                                        {request.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-oxford line-clamp-1">{request.title}</p>
                                                <p className="text-xs text-oxford/50 mt-1">
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contact */}
                            <div className="bg-oxford text-white p-6">
                                <h3 className="font-serif text-lg font-bold mb-2">Need Help?</h3>
                                <p className="text-white/70 text-sm mb-4">
                                    Contact us directly if you have any questions about content availability.
                                </p>
                                <a 
                                    href="mailto:jmrhpublications@gmail.com"
                                    className="inline-flex items-center gap-2 text-sm text-gold hover:underline"
                                >
                                    <Mail size={16} />
                                    jmrhpublications@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Success Dialog */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle className="text-green-500" />
                            Request Submitted!
                        </DialogTitle>
                        <DialogDescription>
                            Your request has been submitted successfully. We'll review it and notify you when the content is available.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setShowSuccessDialog(false)} className="w-full bg-gold hover:bg-oxford">
                            OK
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
});

export default RequestUploadPage;
