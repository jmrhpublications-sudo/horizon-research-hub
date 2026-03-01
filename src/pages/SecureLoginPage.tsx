import { useState, memo, FormEvent, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface SecureLoginPageProps {
    role: 'ADMIN' | 'PROFESSOR';
}

const DEMO_SECURE_ACCOUNTS = {
    ADMIN: { email: "admin@jmrh.com", password: "admin123" },
    PROFESSOR: { email: "professor@jmrh.com", password: "professor123" },
};

const SecureLoginPage = memo(({ role }: SecureLoginPageProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { currentUser, signIn } = useJMRH();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    if (currentUser?.role === role) {
        return <Navigate to={role === 'ADMIN' ? '/secure/admin/dashboard' : '/secure/professor/dashboard'} replace />;
    }

    const handleQuickLogin = async () => {
        const demo = DEMO_SECURE_ACCOUNTS[role];
        setEmail(demo.email);
        setPassword(demo.password);
        await handleAuth(new Event('submit') as any, demo.email, demo.password);
    };

    const handleAuth = async (e: FormEvent, overrideEmail?: string, overridePassword?: string) => {
        e.preventDefault();
        
        const loginEmail = overrideEmail || email;
        const loginPassword = overridePassword || password;
        
        if (!loginEmail || !loginPassword) {
            toast({ 
                title: "Missing Information", 
                description: "Please enter both email and password.", 
                variant: "destructive" 
            });
            return;
        }

        setIsLoading(true);

        try {
            await signIn(loginEmail, loginPassword);
            
            toast({ 
                title: "Login Successful", 
                description: "Welcome to the dashboard." 
            });
            
            const redirectPath = role === 'ADMIN' 
                ? '/secure/admin/dashboard' 
                : '/secure/professor/dashboard';
            navigate(redirectPath, { replace: true });
            
        } catch (error: any) {
            console.error("Login error:", error);
            toast({ 
                title: "Login Failed", 
                description: error?.message || "Invalid email or password. Please try again.", 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm space-y-8"
            >
                <div className="text-center space-y-4">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-16 h-16 bg-oxford flex items-center justify-center mx-auto"
                    >
                        <ShieldCheck className="text-gold w-8 h-8" />
                    </motion.div>
                    <div className="space-y-1">
                        <h1 className="font-serif text-2xl font-bold text-oxford">
                            {role} Login
                        </h1>
                        <p className="text-xs uppercase tracking-widest text-oxford/50">Secure Dashboard Access</p>
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-3 bg-gradient-to-r from-gold/10 to-oxford/5 border border-gold/20 rounded-lg"
                >
                    <button
                        type="button"
                        onClick={handleQuickLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gold/30 rounded-md text-sm font-semibold text-oxford hover:border-gold hover:bg-gold/5 transition-all disabled:opacity-50"
                    >
                        <Zap size={14} className="text-gold" />
                        Quick Demo Login as {role}
                    </button>
                </motion.div>

                <motion.form 
                    onSubmit={handleAuth}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-5"
                >
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                <Input
                                    required
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    className="h-12 pl-10 border-black/10 focus:border-gold"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                <Input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="h-12 pl-10 pr-10 border-black/10 focus:border-gold"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-oxford/30 hover:text-oxford transition-colors"
                                >
                                    {showPassword ? <Loader2 size={18} className="rotate-180" /> : <Lock size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-12 bg-oxford text-white hover:bg-gold transition-colors font-bold tracking-wider uppercase text-xs relative overflow-hidden"
                    >
                        <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : ''}`}>
                            Sign In <ArrowRight size={16} />
                        </span>
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin text-white" />
                            </div>
                        )}
                    </Button>
                </motion.form>

                <div className="text-center pt-4 border-t border-black/5">
                    <p className="text-oxford/50 text-sm">
                        <a href="/auth" className="text-gold font-bold hover:text-oxford transition-colors">
                            Back to main login
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
});

export default SecureLoginPage;