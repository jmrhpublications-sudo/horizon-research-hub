import { useState, memo, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import {
    BookOpen,
    User as UserIcon,
    Lock,
    Mail,
    ArrowRight,
    Phone,
    MapPin,
    GraduationCap,
    Building2,
    ShieldCheck,
    Eye,
    EyeOff
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";

const UNIVERSITIES = [
    "Anna University", "University of Madras", "SRM Institute", "VIT University", "IIT Madras",
    "Bangalore University", "University of Mysore", "Cochin University", "University of Kerala",
    "The Nilgiris College", "Government Arts and Science College", "Other"
];

const DEPARTMENTS = [
    "Computer Science & IT", "Electronics & Communication", "Mechanical Engineering",
    "Commerce & Management", "Economics", "Biotechnology", "Social Sciences", 
    "Law", "Mathematics", "Physics", "Chemistry", "Other"
];

const DEGREES = [
    "B.Com", "BBA", "BCA", "B.Sc", "B.A", "M.Com", "MBA", "MCA", "M.Sc", "M.A", "PhD"
];

const AuthPage = memo(() => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Login State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Registration State
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

    const handleAuth = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await signIn(email, password);
                toast({ title: "Login Successful!", description: "Welcome back to JMRH Publications." });
                navigate(location.state?.from?.pathname || '/');
            } else {
                if (regPass.length < 6) {
                    toast({ title: "Validation Error", description: "Password must be at least 6 characters.", variant: "destructive" });
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
                toast({ title: "Registration Successful!", description: "Please check your email to verify your account." });
                setIsLogin(true);
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "An unexpected error occurred.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <SEOHead 
                title="Login / Register | JMRH Publications"
                description="Login or register to submit manuscripts to JMRH Publications"
                canonical="/auth"
            />
            <Header />
            
            <main className="flex-1 pt-24 pb-16 flex items-center justify-center p-6">
                <div className="w-full max-w-lg">
                    {/* Header */}
                    <div className="text-center mb-8">
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
                    </div>

                    {/* Form */}
                    <form onSubmit={handleAuth} className="bg-white border border-black/5 shadow-xl p-8 space-y-6">
                        {isLogin ? (
                            // Login Form
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
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-12 pl-10 pr-10 border-black/10 focus:border-gold"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-oxford/30 hover:text-oxford"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Link to="/auth" className="text-xs text-gold hover:text-oxford font-bold">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            // Registration Form
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
                                            className="h-12 pl-10 border-black/10 focus:border-gold"
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
                                            className="h-12 pl-10 border-black/10 focus:border-gold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
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
                                                className="h-12 pl-10 border-black/10 focus:border-gold"
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
                                                className="h-12 pl-10 border-black/10 focus:border-gold"
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
                                            className="h-12 pl-10 border-black/10 focus:border-gold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">Department</label>
                                        <Select onValueChange={setRegDepartment} value={regDepartment}>
                                            <SelectTrigger className="h-12 border-black/10 focus:border-gold">
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
                                            <SelectTrigger className="h-12 border-black/10 focus:border-gold">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DEGREES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-oxford/60">I am a</label>
                                    <Select onValueChange={setRegRole} value={regRole}>
                                        <SelectTrigger className="h-12 border-black/10 focus:border-gold">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="researcher">Researcher</SelectItem>
                                            <SelectItem value="student">Student</SelectItem>
                                            <SelectItem value="professor">Professor</SelectItem>
                                            <SelectItem value="academician">Academician</SelectItem>
                                            <SelectItem value="professional">Professional</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-oxford text-white hover:bg-gold transition-colors font-bold tracking-wider uppercase text-xs"
                        >
                            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
                        </Button>

                        {/* Toggle */}
                        <div className="text-center pt-4 border-t border-black/5">
                            <p className="text-oxford/50 text-sm">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-gold font-bold ml-2 hover:text-oxford"
                                >
                                    {isLogin ? "Register" : "Sign In"}
                                </button>
                            </p>
                        </div>
                    </form>

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-oxford/5 border border-black/5">
                        <p className="text-xs text-oxford/60 text-center">
                            <strong>Note:</strong> You can also submit manuscripts without registration by using our 
                            <Link to="/submit-paper" className="text-gold font-bold ml-1">online submission form</Link>.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
});

export default AuthPage;
