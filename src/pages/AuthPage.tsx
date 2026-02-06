import { useState, memo, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import {
    BookOpen,
    User as UserIcon,
    Lock,
    Mail,
    ArrowRight,
    Building,
    Phone,
    MapPin,
    GraduationCap,
    Calendar,
    Hash,
    Building2,
    ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

const UNIVERSITIES = [
    "Anna University",
    "University of Madras",
    "Bharathiar University",
    "Madurai Kamaraj University",
    "SRM Institute of Science and Technology",
    "VIT University",
    "Amrita Vishwa Vidyapeetham",
    "Delhi University",
    "Mumbai University",
    "Indian Institute of Technology (IIT)",
    "National Institute of Technology (NIT)",
    "Other International Institution"
];

const DEPARTMENTS = [
    "Computer Science & Engineering",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Commerce & Management",
    "Physics",
    "Chemistry",
    "Mathematics",
    "English Literature",
    "Social Sciences",
    "Economics"
];

const AuthPage = memo(() => {
    const [isLogin, setIsLogin] = useState(true);

    // Login State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Registration State
    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPass, setRegPass] = useState("");
    const [repeatPass, setRepeatPass] = useState("");

    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [age, setAge] = useState("");
    const [dob, setDob] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");
    const [degree, setDegree] = useState("");
    const [university, setUniversity] = useState("");
    const [college, setCollege] = useState("");
    const [department, setDepartment] = useState("");
    const [studyType, setStudyType] = useState("");

    const { users, setCurrentUser, registerUser } = useJMRH();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const handleAuth = (e: FormEvent) => {
        e.preventDefault();

        if (isLogin) {
            const user = users.find(u => u.email === email && u.role === 'USER');
            if (user) {
                if (user.status === 'BANNED') {
                    toast({ title: "Access Denied", description: "This account has been banned.", variant: "destructive" });
                    return;
                }
                setCurrentUser(user);
                toast({ title: "Welcome back", description: `Signed in as ${user.name}` });
                navigate(location.state?.from?.pathname || '/');
            } else {
                toast({ title: "Auth Failed", description: "Invalid credentials or unauthorized role.", variant: "destructive" });
            }
        } else {
            if (regPass !== repeatPass) {
                toast({ title: "Validation Error", description: "Passwords do not match.", variant: "destructive" });
                return;
            }

            const existing = users.find(u => u.email === regEmail);
            if (existing) {
                toast({ title: "Registration failed", description: "Email already exists.", variant: "destructive" });
                return;
            }
            const newUser = registerUser(regName, regEmail, {
                address,
                phoneNumber,
                age,
                dob,
                city,
                pincode,
                degree,
                university,
                college,
                department,
                studyType
            });
            setCurrentUser(newUser);
            toast({ title: "Account created", description: "Welcome to JMRH Portal" });
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans">
            <Header />
            <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-24 relative overflow-hidden">
                {/* Background Accents */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal/5 blur-[120px] -mr-64 -mt-64 rounded-full" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 blur-[100px] -ml-48 -mb-48 rounded-full" />

                <div className={`w-full ${isLogin ? 'max-w-md' : 'max-w-5xl'} space-y-12 relative z-10 animate-academic-reveal`}>
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-oxford flex items-center justify-center perspective-1000 mx-auto shadow-2xl group cursor-pointer">
                            <motion.div
                                className="preserve-3d transition-transform duration-1000 group-hover:rotate-y-180"
                            >
                                <BookOpen className="text-gold" size={32} />
                            </motion.div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="font-serif text-5xl font-black text-oxford tracking-tighter">
                                {isLogin ? "Nexus Access" : "Join the Horizon"}
                            </h1>
                            <p className="text-xs uppercase tracking-[0.5em] text-teal font-black">
                                {isLogin ? "Institutional Authentication" : "Scholar Registration Protocol"}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-12 bg-white p-10 md:p-16 border border-black/5 shadow-[0_50px_100px_rgba(0,0,0,0.05)] relative overflow-hidden">
                        {/* Elegant Corner Accent */}
                        <div className="absolute top-0 right-0 w-2 h-24 bg-gold" />
                        <div className="absolute top-0 right-0 w-24 h-2 bg-gold" />

                        {isLogin ? (
                            // LOGIN FORM
                            <div className="space-y-8">
                                <div className="space-y-3 group">
                                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 flex items-center gap-2 group-focus-within:text-gold transition-colors">
                                        <Mail size={12} className="text-teal" /> Email Address
                                    </label>
                                    <Input
                                        required
                                        type="email"
                                        placeholder="scholar@university.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-14 border-0 border-b-2 border-black/5 focus:border-gold rounded-none bg-transparent px-0 font-serif text-xl italic transition-all placeholder:text-black/10 shadow-none"
                                    />
                                </div>
                                <div className="space-y-3 group">
                                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 flex items-center gap-2 group-focus-within:text-gold transition-colors">
                                        <Lock size={12} className="text-teal" /> Security Key
                                    </label>
                                    <Input
                                        required
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-14 border-0 border-b-2 border-black/5 focus:border-gold rounded-none bg-transparent px-0 font-serif text-xl transition-all placeholder:text-black/10 shadow-none"
                                    />
                                </div>
                            </div>
                        ) : (
                            // REGISTRATION FORM
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                {/* Section 1: Personal Profile */}
                                <div className="space-y-10">
                                    <div className="border-l-4 border-gold pl-6">
                                        <h3 className="font-serif italic text-2xl font-bold text-oxford">Personal Identity</h3>
                                        <p className="text-[10px] uppercase tracking-widest text-teal font-black mt-1">Foundational Details</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-3 group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 flex items-center gap-2 group-focus-within:text-gold transition-colors">
                                                <UserIcon size={12} className="text-teal" /> Full Legal Name
                                            </label>
                                            <Input required value={regName} onChange={(e) => setRegName(e.target.value)} className="h-12 border-0 border-b border-black/10 rounded-none px-0 font-serif italic text-lg shadow-none focus:border-gold transition-all" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3 group">
                                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 flex items-center gap-2 group-focus-within:text-gold transition-colors">
                                                    <Calendar size={12} className="text-teal" /> DOB
                                                </label>
                                                <Input required type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="h-12 border-0 border-b border-black/10 rounded-none px-0 font-serif text-lg shadow-none focus:border-gold transition-all" />
                                            </div>
                                            <div className="space-y-3 group">
                                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 flex items-center gap-2 group-focus-within:text-gold transition-colors">
                                                    <Hash size={12} className="text-teal" /> Age
                                                </label>
                                                <Input required type="number" value={age} onChange={(e) => setAge(e.target.value)} className="h-12 border-0 border-b border-black/10 rounded-none px-0 font-serif text-lg shadow-none focus:border-gold transition-all" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3 group">
                                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 flex items-center gap-2 group-focus-within:text-gold transition-colors">
                                                    <Building size={12} className="text-teal" /> City
                                                </label>
                                                <Input required value={city} onChange={(e) => setCity(e.target.value)} className="h-12 border-0 border-b border-black/10 rounded-none px-0 font-serif text-lg shadow-none focus:border-gold transition-all" />
                                            </div>
                                            <div className="space-y-3 group">
                                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 flex items-center gap-2 group-focus-within:text-gold transition-colors">
                                                    <Hash size={12} className="text-teal" /> Pincode
                                                </label>
                                                <Input required value={pincode} onChange={(e) => setPincode(e.target.value)} className="h-12 border-0 border-b border-black/10 rounded-none px-0 font-serif text-lg shadow-none focus:border-gold transition-all" />
                                            </div>
                                        </div>

                                        <div className="space-y-3 group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 flex items-center gap-2 group-focus-within:text-gold transition-colors">
                                                <Phone size={12} className="text-teal" /> Phone
                                            </label>
                                            <Input required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="h-12 border-0 border-b border-black/10 rounded-none px-0 font-serif text-lg shadow-none focus:border-gold transition-all" />
                                        </div>

                                        <div className="space-y-3 group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 flex items-center gap-2 group-focus-within:text-gold transition-colors">
                                                <Mail size={12} className="text-teal" /> Email
                                            </label>
                                            <Input required type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="h-12 border-0 border-b border-black/10 rounded-none px-0 font-serif italic text-lg shadow-none focus:border-gold transition-all" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3 group">
                                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 flex items-center gap-2 group-focus-within:text-gold transition-colors">
                                                    <Lock size={12} className="text-teal" /> Password
                                                </label>
                                                <Input required type="password" value={regPass} onChange={(e) => setRegPass(e.target.value)} className="h-12 border-0 border-b border-black/10 rounded-none px-0 font-serif text-lg shadow-none focus:border-gold transition-all" />
                                            </div>
                                            <div className="space-y-3 group">
                                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 flex items-center gap-2 group-focus-within:text-gold transition-colors">
                                                    <ShieldCheck size={12} className="text-teal" /> Repeat
                                                </label>
                                                <Input required type="password" value={repeatPass} onChange={(e) => setRepeatPass(e.target.value)} className="h-12 border-0 border-b border-black/10 rounded-none px-0 font-serif text-lg shadow-none focus:border-gold transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Academic Profile */}
                                <div className="space-y-10">
                                    <div className="border-l-4 border-teal pl-6">
                                        <h3 className="font-serif italic text-2xl font-bold text-oxford">Academic Credential</h3>
                                        <p className="text-[10px] uppercase tracking-widest text-gold font-black mt-1">Institutional Status</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-3 group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 flex items-center gap-2 group-focus-within:text-gold transition-colors">
                                                <GraduationCap size={12} className="text-teal" /> Current Degree
                                            </label>
                                            <Select onValueChange={setDegree} required>
                                                <SelectTrigger className="h-12 border-0 border-b border-black/10 rounded-none px-0 font-serif italic text-lg shadow-none focus:ring-0 focus:border-gold transition-all">
                                                    <SelectValue placeholder="Select Degree" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-none border-black/5">
                                                    <SelectItem value="Bachelors">Bachelor's Degree</SelectItem>
                                                    <SelectItem value="Masters">Master's Degree</SelectItem>
                                                    <SelectItem value="PhD">PhD / Doctorate</SelectItem>
                                                    <SelectItem value="PostDoc">Post-Doctoral</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-3 group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 flex items-center gap-2 group-focus-within:text-gold transition-colors">
                                                <Building2 size={12} className="text-teal" /> University / Institution
                                            </label>
                                            <Select onValueChange={setUniversity} required>
                                                <SelectTrigger className="h-12 border-0 border-b border-black/10 rounded-none px-0 font-serif italic text-lg shadow-none focus:ring-0 focus:border-gold transition-all">
                                                    <SelectValue placeholder="Select Institution" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-none border-black/5">
                                                    {UNIVERSITIES.map(u => (
                                                        <SelectItem key={u} value={u}>{u}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-3 group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 flex items-center gap-2 group-focus-within:text-gold transition-colors">
                                                <Building size={12} className="text-teal" /> College / School
                                            </label>
                                            <Input required value={college} onChange={(e) => setCollege(e.target.value)} className="h-12 border-0 border-b border-black/10 rounded-none px-0 font-serif text-lg shadow-none focus:border-gold transition-all" />
                                        </div>

                                        <div className="space-y-3 group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 flex items-center gap-2 group-focus-within:text-gold transition-colors">
                                                <BookOpen size={12} className="text-teal" /> Department
                                            </label>
                                            <Select onValueChange={setDepartment} required>
                                                <SelectTrigger className="h-12 border-0 border-b border-black/10 rounded-none px-0 font-serif italic text-lg shadow-none focus:ring-0 focus:border-gold transition-all">
                                                    <SelectValue placeholder="Select Department" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-none border-black/5">
                                                    {DEPARTMENTS.map(d => (
                                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-3 group">
                                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 flex items-center gap-2 group-focus-within:text-gold transition-colors">
                                                <BookOpen size={12} className="text-teal" /> Study Mode
                                            </label>
                                            <Select onValueChange={setStudyType} required>
                                                <SelectTrigger className="h-12 border-0 border-b border-black/10 rounded-none px-0 font-serif italic text-lg shadow-none focus:ring-0 focus:border-gold transition-all">
                                                    <SelectValue placeholder="Select Mode" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-none border-black/5">
                                                    <SelectItem value="FullTime">Full Time</SelectItem>
                                                    <SelectItem value="PartTime">Part Time</SelectItem>
                                                    <SelectItem value="Distance">Distance Learning</SelectItem>
                                                    <SelectItem value="Research">Research Scholar</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button type="submit" className="w-full h-20 rounded-none bg-oxford text-white hover:bg-gold hover:text-white transition-all duration-700 font-bold tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 text-sm uppercase relative group overflow-hidden">
                            <span className="relative z-10 flex items-center gap-3">
                                {isLogin ? "Finalize Authentication" : "Complete Registration"} <ArrowRight size={18} />
                            </span>
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </Button>
                    </form>

                    <div className="text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[11px] uppercase tracking-[0.4em] font-black text-oxford/30 hover:text-gold transition-all border-b border-black/5 pb-2 hover:border-gold"
                        >
                            {isLogin ? "New Scholar? Request Registration protocol" : "Member? Secure Login Entry"}
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
});

export default AuthPage;
