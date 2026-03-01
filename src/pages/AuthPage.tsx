import { useState, memo, FormEvent, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import {
    User as UserIcon,
    Lock,
    Mail,
    Phone,
    Building2,
    ShieldCheck,
    Eye,
    EyeOff,
    Loader2,
    ArrowRight,
    CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";

const DEPARTMENTS = [
    "Computer Science & IT", "Electronics & Communication", "Mechanical Engineering",
    "Commerce & Management", "Economics", "Biotechnology", "Social Sciences", 
    "Law", "Mathematics", "Physics", "Chemistry", "Other"
];

const DEGREES = [
    "B.Com", "BBA", "BCA", "B.Sc", "B.A", "M.Com", "MBA", "MCA", "M.Sc", "M.A", "PhD"
];

const STORAGE_REMEMBER_KEY = "jmrh_remember_email";
const STORAGE_EMAIL_KEY = "jmrh_saved_email";

const AuthPage = memo(() => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPass, setRegPass] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regAffiliation, setRegAffiliation] = useState("");
    const [regDepartment, setRegDepartment] = useState("");
    const [regDegree, setRegDegree] = useState("");
    const [regRole, setRegRole] = useState("researcher");

    const { signIn, signUp } = useJMRH();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    useEffect(() => {
        const savedEmail = localStorage.getItem(STORAGE_EMAIL_KEY);
        const remembered = localStorage.getItem(STORAGE_REMEMBER_KEY);
        
        if (savedEmail && remembered) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            toast({ 
                title: "Missing Information", 
                description: "Please enter both email and password.", 
                variant: "destructive" 
            });
            return;
        }

        setLoading(true);

        try {
            await signIn(email, password);
            
            if (rememberMe) {
                localStorage.setItem(STORAGE_EMAIL_KEY, email);
                localStorage.setItem(STORAGE_REMEMBER_KEY, "true");
            } else {
                localStorage.removeItem(STORAGE_EMAIL_KEY);
                localStorage.removeItem(STORAGE_REMEMBER_KEY);
            }
            
            toast({ title: "Welcome Back!", description: "Login successful." });
            navigate(location.state?.from?.pathname || '/');
        } catch (error: any) {
            console.error("Login error:", error);
            toast({ 
                title: "Login Failed", 
                description: error.message || "Invalid email or password.", 
                variant: "destructive" 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await handleLogin();
                return;
            } else {
                if (regPass.length < 6) {
                    toast({ title: "Validation Error", description: "Password must be at least 6 characters.", variant: "destructive" });
                    setLoading(false);
                    return;
                }
                if (!regName || !regEmail || !regAffiliation) {
                    toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
                    setLoading(false);
                    return;
                }
                
                await signUp(regName, regEmail, regPass, {
                    phone: regPhone,
                    affiliation: regAffiliation,
                    department: regDepartment,
                    degree: regDegree,
                    role: regRole
                });
                
                setVerificationSent(true);
                toast({ 
                    title: "Verification Email Sent!", 
                    description: "Please check your email and click the verification link to activate your account." 
                });
            }
        } catch (error: any) {
            console.error("Auth error:", error);
            toast({ title: "Error", description: error.message || "An unexpected error occurred.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (verificationSent) {
        return (
            <div className="min-h-screen bg-white flex flex-col font-sans">
                <SEOHead title="Verification Email Sent | JMRH Publications" description="Please verify your email to complete registration." canonical="/auth" />
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
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                        >
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </motion.div>
                        <h1 className="font-serif text-3xl font-bold text-oxford">Check Your Email</h1>
                        <p className="text-oxford/60">
                            We've sent a verification link to <strong>{regEmail}</strong>. 
                            Please click the link in the email to verify your account.
                        </p>
                        <div className="bg-oxford/5 p-4 rounded-lg">
                            <p className="text-sm text-oxford/60">
                                Didn't receive the email? Check your spam folder or 
                                <button 
                                    onClick={() => {
                                        setVerificationSent(false);
                                        setIsLogin(true);
                                    }}
                                    className="text-gold font-bold ml-1"
                                >
                                    try again
                                </button>
                            </p>
                        </div>
                        <Button onClick={() => {
                            setVerificationSent(false);
                            setIsLogin(true);
                        }} className="w-full bg-oxford hover:bg-gold">
                            Back to Login
                        </Button>
                    </motion.div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <SEOHead 
                title="Login / Register | JMRH Publications"
                description="Login or register to submit manuscripts to JMRH Publications"
                canonical="/auth"
            />
            <Header />
            
            <main className="flex-1 pt-24 pb-16 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-oxford/5 border border-gold/20 rounded-full mb-4">
                            <ShieldCheck className="text-gold" size={12} />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-oxford">Secure Access</span>
                        </div>
                        <h1 className="font-serif text-4xl font-black text-oxford">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-oxford/50 mt-2">
                            {isLogin ? "Sign in to submit your manuscripts" : "Register to start publishing with JMRH"}
                        </p>
                    </motion.div>

                    <motion.form 
                        onSubmit={handleAuth}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-black/[0.05] shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-6 sm:p-8 space-y-5"
                    >
                        {isLogin ? (
                            <div className="space-y-4">
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
                                            autoComplete="email"
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
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-11 pl-10 pr-10 border-black/10 focus:border-gold"
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-oxford/30 hover:text-oxford transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 rounded border-black/20 text-gold focus:ring-gold"
                                        />
                                        <span className="text-xs text-oxford/60">Remember me</span>
                                    </label>
                                    <Link to="/auth/forgot-password" className="text-xs text-gold hover:text-oxford font-semibold">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Full Name *</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                        <Input
                                            required
                                            placeholder="Your full name"
                                            value={regName}
                                            onChange={(e) => setRegName(e.target.value)}
                                            className="h-11 pl-10 border-black/10 focus:border-gold"
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
                                            placeholder="your@email.com"
                                            value={regEmail}
                                            onChange={(e) => setRegEmail(e.target.value)}
                                            className="h-11 pl-10 border-black/10 focus:border-gold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Password *</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                            <Input
                                                required
                                                type="password"
                                                placeholder="Min 6 chars"
                                                value={regPass}
                                                onChange={(e) => setRegPass(e.target.value)}
                                                className="h-11 pl-10 border-black/10 focus:border-gold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                            <Input
                                                placeholder="+91 XXXXX"
                                                value={regPhone}
                                                onChange={(e) => setRegPhone(e.target.value)}
                                                className="h-11 pl-10 border-black/10 focus:border-gold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Institution / Affiliation *</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3 w-5 h-5 text-oxford/30" />
                                        <Input
                                            required
                                            placeholder="University / College / Organization"
                                            value={regAffiliation}
                                            onChange={(e) => setRegAffiliation(e.target.value)}
                                            className="h-11 pl-10 border-black/10 focus:border-gold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Department</label>
                                        <Select onValueChange={setRegDepartment} value={regDepartment}>
                                            <SelectTrigger className="h-11 border-black/10 focus:border-gold">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Degree</label>
                                        <Select onValueChange={setRegDegree} value={regDegree}>
                                            <SelectTrigger className="h-11 border-black/10 focus:border-gold">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DEGREES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-oxford text-white hover:bg-gold transition-colors font-bold tracking-wider uppercase text-xs"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Please wait...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isLogin ? "Sign In" : "Create Account"}
                                    <ArrowRight size={16} />
                                </span>
                            )}
                        </Button>

                        <div className="text-center pt-3 border-t border-black/[0.05]">
                            <p className="text-oxford/50 text-sm">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-gold font-bold ml-2 hover:text-oxford transition-colors"
                                >
                                    {isLogin ? "Register" : "Sign In"}
                                </button>
                            </p>
                        </div>
                    </motion.form>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-5 p-4 bg-oxford/5 border border-black/5"
                    >
                        <p className="text-xs text-oxford/60 text-center">
                            <strong>Note:</strong> You can also submit manuscripts without registration by using our 
                            <Link to="/submit-paper" className="text-gold font-bold ml-1 hover:text-oxford">online submission form</Link>.
                        </p>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
});

export default AuthPage;