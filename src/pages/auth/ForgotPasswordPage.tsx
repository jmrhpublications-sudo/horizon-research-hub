import { useState, memo, FormEvent } from "react";
import { Link } from "react-router-dom";
import { 
    Mail, Lock, Loader2, ArrowRight, CheckCircle, AlertCircle 
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";
import { supabase } from "@/integrations/supabase/client";

const ForgotPasswordPage = memo(() => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState("");
    const { toast } = useToast();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        if (!email) {
            toast({ title: "Error", description: "Please enter your email", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth`,
            });

            if (resetError) throw resetError;

            setEmailSent(true);
            toast({ 
                title: "Password Reset Link Sent!", 
                description: "Check your email for reset instructions." 
            });
        } catch (err: any) {
            setError(err.message || "Failed to send reset email. Please try again.");
            toast({ 
                title: "Error", 
                description: err.message || "Failed to send reset email.", 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen bg-white flex flex-col font-sans">
                <SEOHead title="Check Your Email | JMRH Publications" description="Password reset link sent" canonical="/auth/forgot-password" />
                <Header />
                <main className="flex-1 pt-24 pb-16 flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md text-center space-y-6"
                    >
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                        >
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </motion.div>
                        <h1 className="font-serif text-3xl font-bold text-oxford">Check Your Email</h1>
                        <p className="text-oxford/60">
                            We've sent a password reset link to <strong>{email}</strong>. 
                            Click the link to reset your password.
                        </p>
                        <Link 
                            to="/auth" 
                            className="inline-block bg-oxford text-white px-6 py-3 text-sm font-bold hover:bg-gold transition-colors"
                        >
                            Back to Login
                        </Link>
                    </motion.div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <SEOHead title="Forgot Password | JMRH Publications" description="Reset your password" canonical="/auth/forgot-password" />
            <Header />
            <main className="flex-1 pt-24 pb-16 flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md space-y-6"
                >
                    <div className="text-center">
                        <div className="w-16 h-16 bg-oxford/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-oxford" />
                        </div>
                        <h1 className="font-serif text-3xl font-black text-oxford">Forgot Password?</h1>
                        <p className="text-oxford/60 mt-2">
                            Enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white border border-black/5 shadow-lg p-6 space-y-4">
                        {error && (
                            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-sm text-red-700">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                <Input
                                    required
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 pl-10 border-black/10 focus:border-gold"
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-oxford hover:bg-gold transition-colors"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Send Reset Link
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>

                        <div className="text-center">
                            <Link to="/auth" className="text-sm text-oxford/60 hover:text-gold">
                                Remember your password? Sign in
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
});

export default ForgotPasswordPage;
