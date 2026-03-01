import { useState, memo, FormEvent } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface SecureLoginPageProps {
    role: 'ADMIN' | 'PROFESSOR';
}

const SecureLoginPage = memo(({ role }: SecureLoginPageProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { currentUser, signIn } = useJMRH();
    const navigate = useNavigate();
    const { toast } = useToast();

    if (currentUser?.role === role) {
        return <Navigate to={role === 'ADMIN' ? '/secure/admin/dashboard' : '/secure/professor/dashboard'} replace />;
    }

    const handleAuth = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast({ 
                title: "Missing Information", 
                description: "Please enter both email and password.", 
                variant: "destructive" 
            });
            return;
        }

        setIsLoading(true);

        try {
            await signIn(email, password);
            
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
                className="w-full max-w-sm space-y-6"
            >
                <div className="text-center space-y-3">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-14 h-14 bg-oxford flex items-center justify-center mx-auto"
                    >
                        <ShieldCheck className="text-gold w-7 h-7" />
                    </motion.div>
                    <div className="space-y-1">
                        <h1 className="font-serif text-2xl font-bold text-oxford">
                            {role} Login
                        </h1>
                        <p className="text-xs uppercase tracking-widest text-oxford/50">Secure Dashboard Access</p>
                    </div>
                </div>

                <motion.form 
                    onSubmit={handleAuth}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                >
                    <div className="space-y-3">
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
                                    className="h-11 pl-10 border-black/10 focus:border-gold"
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
                                    className="h-11 pl-10 pr-10 border-black/10 focus:border-gold"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-oxford/30 hover:text-oxford transition-colors"
                                >
                                    {showPassword ? <Lock size={18} className="rotate-180" /> : <Lock size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-11 bg-oxford text-white hover:bg-gold transition-colors font-bold tracking-wider uppercase text-xs"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Signing in...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Sign In <ArrowRight size={16} />
                            </span>
                        )}
                    </Button>
                </motion.form>

                <div className="text-center pt-3 border-t border-black/5">
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