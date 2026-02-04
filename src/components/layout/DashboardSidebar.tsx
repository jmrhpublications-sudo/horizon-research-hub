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
    ShieldCheck
} from "lucide-react";
import { useState, memo } from "react";
import { useJMRH } from "@/context/JMRHContext";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
    role: 'ADMIN' | 'PROFESSOR';
}

const DashboardSidebar = memo(({ role }: DashboardSidebarProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, currentUser } = useJMRH();

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
        { label: "Archive", icon: ShieldCheck, href: "/secure/professor/history" },
    ];

    const links = role === 'ADMIN' ? adminLinks : professorLinks;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-[60] lg:hidden p-2 bg-oxford text-white rounded-lg shadow-lg"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <aside className={`fixed inset-y-0 left-0 z-50 bg-oxford text-white transition-all duration-500 ease-in-out border-r border-white/5
        ${isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"}`}>

                <div className="flex flex-col h-full p-6">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12 overflow-hidden">
                        <div className="w-10 h-10 bg-white/5 border border-gold/40 flex items-center justify-center rotate-45 shrink-0">
                            <BookOpen size={18} className="text-gold -rotate-45" />
                        </div>
                        {isOpen && (
                            <div className="flex flex-col">
                                <span className="font-serif text-xl font-bold tracking-tighter">JMRH<span className="text-gold">.</span></span>
                                <span className="text-[8px] uppercase tracking-[0.3em] text-white/40 font-bold">Systems Desk</span>
                            </div>
                        )}
                    </div>

                    {/* User Profile */}
                    {isOpen && (
                        <div className="mb-10 p-4 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[9px] uppercase tracking-widest text-gold font-bold mb-1">{currentUser?.role} SESSION</p>
                            <h4 className="font-serif italic text-sm font-bold truncate">{currentUser?.name}</h4>
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 group
                  ${location.pathname === link.href ? "bg-gold text-oxford" : "hover:bg-white/5 text-white/60 hover:text-white"}`}
                            >
                                <link.icon size={20} className={location.pathname === link.href ? "text-oxford" : "text-gold/50 group-hover:text-gold"} />
                                {isOpen && <span className="text-xs uppercase tracking-widest font-bold">{link.label}</span>}
                            </Link>
                        ))}
                    </nav>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 p-3 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        {isOpen && <span className="text-xs uppercase tracking-widest font-bold">Terminate Session</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Spacer */}
            <div className={`transition-all duration-500 ${isOpen ? "pl-64" : "pl-0 lg:pl-20"}`} />
        </>
    );
});

export default DashboardSidebar;
