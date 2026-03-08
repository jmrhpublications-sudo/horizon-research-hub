import { useNavigate, useLocation, Link } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    Settings,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { useState, memo, useEffect } from "react";
import { useJMRH } from "@/context/JMRHContext";

interface DashboardSidebarProps {
    role: 'ADMIN' | 'PROFESSOR';
}

const DashboardSidebar = memo(({ role }: DashboardSidebarProps) => {
    const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, currentUser } = useJMRH();

    useEffect(() => {
        const handleResize = () => setIsOpen(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const adminLinks = [
        { label: "Overview", icon: LayoutDashboard, href: "/secure/admin/dashboard" },
        { label: "Researchers", icon: Users, href: "/secure/admin/users" },
        { label: "Professors", icon: GraduationCap, href: "/secure/admin/professors" },
        { label: "Manuscripts", icon: BookOpen, href: "/secure/admin/papers" },
        { label: "Settings", icon: Settings, href: "/secure/admin/settings" },
    ];

    const professorLinks = [
        { label: "Workspace", icon: LayoutDashboard, href: "/secure/professor/dashboard" },
        { label: "Assignments", icon: BookOpen, href: "/secure/professor/papers" },
    ];

    const links = role === 'ADMIN' ? adminLinks : professorLinks;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {/* Mobile Toggle */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-4 left-4 z-[60] lg:hidden p-2.5 bg-foreground text-background shadow-lg hover:bg-accent hover:text-accent-foreground transition-all"
                >
                    <Menu size={20} />
                </button>
            )}

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-foreground/40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 bg-background border-r border-border transition-all duration-300 ease-in-out shadow-xl lg:shadow-none
                ${isOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"}`}>

                <div className={`flex flex-col h-full p-6 ${!isOpen && "lg:items-center lg:px-2"}`}>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                                <BookOpen size={18} className="text-accent" />
                            </div>
                            {isOpen && (
                                <div className="flex flex-col animate-fade-in">
                                    <span className="font-serif text-xl font-bold tracking-tighter text-foreground">JMRH<span className="text-accent">.</span></span>
                                    <span className="text-[8px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Systems Desk</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* User Profile */}
                    {isOpen && (
                        <div className="mb-8 p-4 bg-muted border border-border animate-fade-in">
                            <p className="text-[9px] uppercase tracking-widest text-accent font-bold mb-1">{currentUser?.role} SESSION</p>
                            <h4 className="font-serif italic text-sm font-bold text-foreground truncate">{currentUser?.name}</h4>
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {links.map((link) => {
                            const isActive = location.pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                                    className={`flex items-center gap-4 p-3 transition-all duration-300 group
                                        ${isActive
                                            ? "bg-accent text-accent-foreground"
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <link.icon size={20} className={`shrink-0 ${isActive ? "text-accent-foreground" : "text-accent/60 group-hover:text-accent"}`} />
                                    {isOpen && <span className="text-xs uppercase tracking-widest font-bold whitespace-nowrap animate-fade-in">{link.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all group mt-auto"
                    >
                        <LogOut size={20} className="shrink-0 group-hover:translate-x-1 transition-transform" />
                        {isOpen && <span className="text-xs uppercase tracking-widest font-bold whitespace-nowrap animate-fade-in">Terminate Session</span>}
                    </button>
                </div>
            </aside>
        </>
    );
});

export default DashboardSidebar;
