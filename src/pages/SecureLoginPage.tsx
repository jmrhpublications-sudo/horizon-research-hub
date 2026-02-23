import { useState, memo, FormEvent } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
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
    const { currentUser, signIn } = useJMRH();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    // If already logged in with correct role, redirect to dashboard
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
            
            // Redirect to appropriate dashboard
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
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-oxford flex items-center justify-center mx-auto">
                        <ShieldCheck className="text-gold w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="font-serif text-2xl font-bold text-oxford">
                            {role} Login
                        </h1>
                        <p className="text-xs uppercase tracking-widest text-oxford/50">Secure Dashboard Access</p>
                    </div>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
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
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    className="h-12 pl-10 border-black/10 focus:border-gold"
                                />
                            </div>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-12 bg-oxford text-white hover:bg-gold transition-colors font-bold tracking-wider uppercase text-xs"
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
                </form>

                <div className="text-center pt-4 border-t border-black/5">
                    <p className="text-oxford/50 text-sm">
                        <a href="/auth" className="text-gold font-bold hover:text-oxford">
                            Back to main login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
});

export default SecureLoginPage;
