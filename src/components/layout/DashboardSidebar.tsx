import { useNavigate, useLocation, Link } from "react-router-dom";
import {
    LayoutDashboard, Users, BookOpen, GraduationCap, Settings, LogOut,
    Menu, X, FileText, Inbox, Star, ChevronLeft, Home, Bell, Search,
    Library, Shield, BarChart3, Upload
} from "lucide-react";
import { useState, memo, useEffect } from "react";
import { useJMRH } from "@/context/JMRHContext";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DashboardSidebarProps {
    role: 'ADMIN' | 'PROFESSOR';
}

const DashboardSidebar = memo(({ role }: DashboardSidebarProps) => {
    const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, currentUser, papers, uploadRequests } = useJMRH();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const pendingPapers = papers.filter(p => p.status === 'SUBMITTED').length;
    const pendingRequests = uploadRequests.filter(r => r.status === 'PENDING').length;
    const assignedPapers = papers.filter(p => p.assignedProfessorId === currentUser?.id).length;
    const pendingReviews = papers.filter(p => p.assignedProfessorId === currentUser?.id && p.status === 'UNDER_REVIEW').length;

    const adminLinks = [
        { label: "Overview", icon: LayoutDashboard, href: "/secure/admin/dashboard", badge: 0 },
        { label: "Analytics", icon: BarChart3, href: "/secure/admin/analytics", badge: 0 },
        { label: "Researchers", icon: Users, href: "/secure/admin/users", badge: 0 },
        { label: "Professors", icon: GraduationCap, href: "/secure/admin/professors", badge: 0 },
        { label: "Manuscripts", icon: FileText, href: "/secure/admin/papers", badge: pendingPapers },
        { label: "Publications", icon: Library, href: "/secure/admin/publications", badge: 0 },
        { label: "Upload Requests", icon: Inbox, href: "/secure/admin/requests", badge: pendingRequests },
    ];

    const professorLinks = [
        { label: "Dashboard", icon: LayoutDashboard, href: "/secure/professor/dashboard", badge: 0 },
        { label: "Analytics", icon: BarChart3, href: "/secure/professor/analytics", badge: 0 },
        { label: "My Reviews", icon: BookOpen, href: "/secure/professor/papers", badge: pendingReviews },
    ];

    const links = role === 'ADMIN' ? adminLinks : professorLinks;
    const sidebarWidth = isCollapsed ? "w-[72px]" : "w-72";

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <>
            {/* Mobile Toggle */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-4 left-4 z-[60] lg:hidden p-2.5 bg-foreground text-background shadow-lg hover:bg-accent transition-all rounded-lg"
                >
                    <Menu size={20} />
                </button>
            )}

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && window.innerWidth < 1024 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-foreground/50 lg:hidden backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            <aside className={`fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300 ease-in-out
                ${isOpen ? `${sidebarWidth} translate-x-0` : "w-0 -translate-x-full lg:w-[72px] lg:translate-x-0"}`}>

                <div className="flex flex-col h-full overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 rounded-lg">
                                {role === 'ADMIN' ? <Shield size={18} className="text-accent" /> : <GraduationCap size={18} className="text-accent" />}
                            </div>
                            {(isOpen && !isCollapsed) && (
                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col min-w-0">
                                    <span className="font-serif text-lg font-bold tracking-tight text-foreground">JMRH</span>
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                                        {role === 'ADMIN' ? 'Admin Console' : 'Professor Portal'}
                                    </span>
                                </motion.div>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {/* Collapse toggle - desktop only */}
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="hidden lg:flex p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-all"
                            >
                                <ChevronLeft size={16} className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
                            </button>
                            {/* Close - mobile only */}
                            <button onClick={() => setIsOpen(false)} className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* User Card */}
                    {(isOpen && !isCollapsed) && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                    <span className="text-sm font-bold text-accent">{currentUser?.name?.charAt(0) || '?'}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-foreground truncate">{currentUser?.name}</p>
                                    <p className="text-[10px] text-muted-foreground truncate">{currentUser?.email}</p>
                                </div>
                                <Badge variant="outline" className="text-[8px] uppercase tracking-wider shrink-0">{currentUser?.role}</Badge>
                            </div>
                        </motion.div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                        <p className={`text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-2 ${isCollapsed ? 'text-center' : 'px-3'}`}>
                            {isCollapsed ? '—' : 'Navigation'}
                        </p>
                        {links.map((link) => {
                            const isActive = location.pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                                        ${isActive
                                            ? "bg-accent text-accent-foreground shadow-sm"
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                        }`}
                                    title={isCollapsed ? link.label : undefined}
                                >
                                    <link.icon size={18} className={`shrink-0 ${isActive ? "text-accent-foreground" : "text-muted-foreground group-hover:text-accent"}`} />
                                    {(!isCollapsed) && (
                                        <span className="text-sm font-medium whitespace-nowrap">{link.label}</span>
                                    )}
                                    {link.badge > 0 && (
                                        <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-accent-foreground/20 text-accent-foreground' : 'bg-destructive/10 text-destructive'}`}>
                                            {link.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}

                        <Separator className="my-3" />

                        {/* Quick Link back to site */}
                        <Link
                            to="/"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                            title={isCollapsed ? "Back to Website" : undefined}
                        >
                            <Home size={18} className="shrink-0" />
                            {!isCollapsed && <span className="text-sm font-medium">Back to Website</span>}
                        </Link>
                    </nav>

                    {/* Footer */}
                    <div className="p-3 border-t border-border">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all group"
                            title={isCollapsed ? "Logout" : undefined}
                        >
                            <LogOut size={18} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
});

export default DashboardSidebar;
