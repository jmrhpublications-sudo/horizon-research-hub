import { useState, memo, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useJMRH } from "@/context/JMRHContext";
import { BookOpen, User as UserIcon, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

const AuthPage = memo(() => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
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
            const existing = users.find(u => u.email === email);
            if (existing) {
                toast({ title: "Registration failed", description: "Email already exists.", variant: "destructive" });
                return;
            }
            const newUser = registerUser(name, email);
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

                <div className="w-full max-w-md space-y-8 relative z-10 animate-academic-reveal">
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

                    <form onSubmit={handleAuth} className="space-y-6">
                        {!isLogin && (
                            <div className="space-y-2 group">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-teal flex items-center gap-2">
                                    <UserIcon size={12} /> Full Name
                                </label>
                                <Input
                                    required
                                    placeholder="Enter your scholarly name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-white border-border focus:border-gold h-12 italic"
                                />
                            </div>
                        )}
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

                        <Button type="submit" className="w-full h-14 rounded-none bg-oxford text-white hover:bg-gold transition-all duration-500 font-bold tracking-widest shadow-xl flex items-center justify-center gap-3">
                            {isLogin ? "TRANSMIT ACCESS" : "INITIALIZE ACCOUNT"} <ArrowRight size={16} />
                        </Button>
                    </form>

                    <div className="text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-xs uppercase tracking-widest font-bold text-text-muted hover:text-teal transition-colors border-b-2 border-border pb-1"
                        >
                            {isLogin ? "Request Scholarly Account" : "Return to Access Desk"}
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
