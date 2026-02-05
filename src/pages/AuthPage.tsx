import { useState, memo, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import { BookOpen, User as UserIcon, Lock, Mail, ArrowRight, Building, Phone, MapPin, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

const AuthPage = memo(() => {
    const [isLogin, setIsLogin] = useState(true);

    // Login State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Registration State
    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState(""); // Separate email for clarity
    const [regPass, setRegPass] = useState("");

    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [age, setAge] = useState("");
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
            const existing = users.find(u => u.email === regEmail);
            if (existing) {
                toast({ title: "Registration failed", description: "Email already exists.", variant: "destructive" });
                return;
            }
            const newUser = registerUser(regName, regEmail, {
                address,
                phoneNumber,
                age,
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
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-24 relative overflow-hidden">
                {/* Background Accents */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal/5 blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 blur-[80px] -ml-40 -mb-40" />

                <div className={`w-full ${isLogin ? 'max-w-md' : 'max-w-4xl'} space-y-8 relative z-10 animate-academic-reveal transition-all duration-500`}>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-oxford flex items-center justify-center rotate-45 mx-auto shadow-2xl">
                            <BookOpen className="text-gold -rotate-45" size={24} />
                        </div>
                        <h1 className="font-serif text-4xl font-bold text-oxford">
                            {isLogin ? "Researcher Portal" : "Scholar Registration"}
                        </h1>
                        <p className="text-text-muted italic">
                            Access the frontiers of multidisciplinary knowledge.
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-8 bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-white/20 shadow-2xl">
                        {isLogin ? (
                            // LOGIN FORM
                            <div className="space-y-6">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-teal flex items-center gap-2">
                                        <Mail size={12} /> Institutional Email
                                    </label>
                                    <Input
                                        required
                                        type="email"
                                        placeholder="yourname@institution.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-white border-border focus:border-gold h-12 italic"
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-teal flex items-center gap-2">
                                        <Lock size={12} /> Secure Password
                                    </label>
                                    <Input
                                        required
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-white border-border focus:border-gold h-12"
                                    />
                                </div>
                            </div>
                        ) : (
                            // REGISTRATION FORM
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Personal Info */}
                                <div className="space-y-6">
                                    <h3 className="font-serif italic text-xl text-gold border-b border-gold/20 pb-2">Personal Identity</h3>

                                    <div className="space-y-2 group">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-teal flex items-center gap-2">
                                            <UserIcon size={12} /> Full Legal Name
                                        </label>
                                        <Input required value={regName} onChange={(e) => setRegName(e.target.value)} className="bg-white h-12 italic" placeholder="Dr. John Doe" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 group">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-teal flex items-center gap-2">
                                                <UserIcon size={12} /> Age
                                            </label>
                                            <Input required type="number" value={age} onChange={(e) => setAge(e.target.value)} className="bg-white h-12" placeholder="25" />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-teal flex items-center gap-2">
                                                <Phone size={12} /> Phone
                                            </label>
                                            <Input required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="bg-white h-12" placeholder="+91..." />
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-teal flex items-center gap-2">
                                            <MapPin size={12} /> Residential Address
                                        </label>
                                        <Input required value={address} onChange={(e) => setAddress(e.target.value)} className="bg-white h-12 italic" placeholder="Full permanent address" />
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-teal flex items-center gap-2">
                                            <Mail size={12} /> Email Address
                                        </label>
                                        <Input required type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="bg-white h-12 italic" placeholder="scholar@univ.edu" />
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-teal flex items-center gap-2">
                                            <Lock size={12} /> Password
                                        </label>
                                        <Input required type="password" value={regPass} onChange={(e) => setRegPass(e.target.value)} className="bg-white h-12" placeholder="••••••••" />
                                    </div>
                                </div>

                                {/* Academic Info */}
                                <div className="space-y-6">
                                    <h3 className="font-serif italic text-xl text-teal border-b border-teal/20 pb-2">Academic Profile</h3>

                                    <div className="space-y-2 group">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-teal flex items-center gap-2">
                                            <GraduationCap size={12} /> Current Degree
                                        </label>
                                        <Select onValueChange={setDegree} required>
                                            <SelectTrigger className="bg-white h-12"><SelectValue placeholder="Select Degree" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Bachelors">Bachelor's Degree</SelectItem>
                                                <SelectItem value="Masters">Master's Degree</SelectItem>
                                                <SelectItem value="PhD">PhD / Doctorate</SelectItem>
                                                <SelectItem value="PostDoc">Post-Doctoral</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-teal flex items-center gap-2">
                                            <Building size={12} /> University / Institution
                                        </label>
                                        <Input required value={university} onChange={(e) => setUniversity(e.target.value)} className="bg-white h-12 italic" placeholder="University of..." />
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-teal flex items-center gap-2">
                                            <Building size={12} /> College
                                        </label>
                                        <Input required value={college} onChange={(e) => setCollege(e.target.value)} className="bg-white h-12 italic" placeholder="Institute of Technology..." />
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-teal flex items-center gap-2">
                                            <BookOpen size={12} /> Department
                                        </label>
                                        <Input required value={department} onChange={(e) => setDepartment(e.target.value)} className="bg-white h-12 italic" placeholder="Dept. of Computer Science" />
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-teal flex items-center gap-2">
                                            <BookOpen size={12} /> Study Type
                                        </label>
                                        <Select onValueChange={setStudyType} required>
                                            <SelectTrigger className="bg-white h-12"><SelectValue placeholder="Select Mode" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="FullTime">Full Time</SelectItem>
                                                <SelectItem value="PartTime">Part Time</SelectItem>
                                                <SelectItem value="Distance">Distance Learning</SelectItem>
                                                <SelectItem value="Research">Research Scholar</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button type="submit" className="w-full h-16 rounded-none bg-oxford text-white hover:bg-gold transition-all duration-500 font-bold tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 text-lg">
                            {isLogin ? "TRANSMIT ACCESS" : "FINALIZE REGISTRATION"} <ArrowRight size={20} />
                        </Button>
                    </form>

                    <div className="text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-xs uppercase tracking-widest font-bold text-text-muted hover:text-teal transition-colors border-b-2 border-border pb-1"
                        >
                            {isLogin ? "New Scholar? Request Account Protocol" : "Existing Member? Return to Access Desk"}
                        </button>
                    </div>

                    {/* Social Proof */}
                    <div className="pt-12 border-t border-border flex justify-center items-center gap-8 block">
                        <div className="text-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                            <p className="text-[8px] uppercase font-bold tracking-widest">Global Indexing</p>
                            <p className="font-serif italic text-[10px]">ISSN India Compliant</p>
                        </div>
                        <div className="w-[1px] h-8 bg-border" />
                        <div className="text-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                            <p className="text-[8px] uppercase font-bold tracking-widest">Ethical Standards</p>
                            <p className="font-serif italic text-[10px]">COPE Member Protocols</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
});

export default AuthPage;
