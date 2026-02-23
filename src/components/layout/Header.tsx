import { useState, useEffect, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BookOpen, Send, ChevronRight, ShieldCheck, User as UserIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJMRH } from "@/context/JMRHContext";

const navLinks = [
  { label: "Home", href: "/" },
  { 
    label: "Journal", 
    href: "/journal/about",
    children: [
      { label: "About", href: "/journal/about" },
      { label: "Editorial Board", href: "/journal/editorial-board" },
      { label: "Current Issue", href: "/journal/current-issue" },
      { label: "Archives", href: "/journal/archives" },
      { label: "Author Guidelines", href: "/journal/guidelines" },
      { label: "Submit", href: "/journal/submit" },
    ]
  },
  { 
    label: "Books", 
    href: "/books/about",
    children: [
      { label: "About Book Publishing", href: "/books/about" },
      { label: "Published Books", href: "/books/published" },
      { label: "Submit Book Proposal", href: "/books/proposal" },
      { label: "ISBN Info", href: "/books/isbn" },
    ]
  },
  { label: "Call for Chapters", href: "/call-for-chapters" },
  { label: "Policies", href: "/policies" },
  { label: "About", href: "/about-us" },
  { label: "Contact", href: "/contact" }
];

const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { currentUser } = useJMRH();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 
      ${scrolled || location.pathname !== "/"
        ? "bg-white/95 backdrop-blur-2xl border-b border-black/5 py-3 shadow-sm"
        : "bg-transparent py-5"}`}>
      <div className="container max-w-[1800px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative w-12 h-12 perspective-1000">
              <motion.div
                className="relative w-full h-full transition-all duration-1000 preserve-3d"
                whileHover={{ rotateY: 180 }}
              >
                {/* Front Cover */}
                <div className="absolute inset-0 bg-oxford flex items-center justify-center backface-hidden shadow-xl border-r-2 border-gold/40">
                  <BookOpen className="w-6 h-6 text-gold" />
                </div>
                {/* Back Cover / Pages */}
                <div className="absolute inset-0 bg-gold flex items-center justify-center rotate-y-180 backface-hidden shadow-xl border-l-2 border-oxford/40">
                  <div className="flex flex-col gap-1">
                    <div className="w-6 h-0.5 bg-oxford/20" />
                    <div className="w-6 h-0.5 bg-oxford/20" />
                    <div className="w-6 h-0.5 bg-oxford/20" />
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-black text-oxford tracking-tighter leading-none group-hover:text-gold transition-colors duration-500">
                JMRH<span className="text-gold group-hover:text-oxford">.</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.4em] text-teal font-black font-ui mt-0.5 opacity-80">Publications</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2" aria-label="Main navigation">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                {link.children ? (
                  <>
                    <button
                      className={`text-[10px] uppercase tracking-[0.15em] font-bold transition-all duration-300 hover:text-gold relative py-2 px-3 flex items-center gap-1
                        ${isActive(link.href) ? "text-gold" : "text-oxford/70"}`}
                      onMouseEnter={() => setOpenDropdown(link.label)}
                    >
                      {link.label}
                      <ChevronDown size={10} className={`transition-transform duration-300 ${openDropdown === link.label ? "rotate-180" : ""}`} />
                    </button>
                    {/* Dropdown Menu */}
                    <div 
                      className={`absolute top-full left-0 pt-2 transition-all duration-300 ${openDropdown === link.label ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <div className="bg-white border border-black/5 shadow-2xl rounded-sm py-2 min-w-[200px]">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            className={`block text-[10px] uppercase tracking-[0.1em] font-bold px-4 py-2.5 transition-all duration-300 hover:bg-gold/5 hover:text-gold
                              ${isActive(child.href) ? "text-gold bg-gold/5" : "text-oxford/60"}`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={link.href}
                    className={`text-[10px] uppercase tracking-[0.15em] font-bold transition-all duration-300 hover:text-gold relative py-2 px-3
                      ${isActive(link.href) ? "text-gold" : "text-oxford/70"}`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-3 right-3 h-[1.5px] bg-gold transition-all duration-300 rounded-full
                      ${isActive(link.href) ? "w-auto" : "w-0 group-hover:w-auto"}`}
                    />
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons & Profile */}
          <div className="hidden lg:flex items-center gap-6">
            {!currentUser ? (
              <div className="flex items-center gap-3 px-4 py-2 bg-gold/5 border border-gold/10 rounded-full">
                <ShieldCheck size={12} className="text-gold" />
                <span className="text-[9px] uppercase tracking-[0.2em] font-black text-gold/60">Trial Access</span>
                <Link to="/auth" className="text-[9px] uppercase tracking-[0.3em] font-black text-oxford hover:text-gold transition-colors ml-2 underline underline-offset-4">Sign In</Link>
              </div>
            ) : (
              <Link to="/account" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-oxford/5 flex items-center justify-center border border-black/5 group-hover:border-gold transition-all">
                  <UserIcon size={16} className="text-teal" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest font-black text-oxford">{currentUser.name.split(' ')[0]}</span>
                  <span className={`text-[8px] uppercase tracking-[0.2em] font-bold ${currentUser.role === 'ADMIN' ? 'text-red-500' : 'text-teal'}`}>{currentUser.role}</span>
                </div>
              </Link>
            )}

            <Link
              to="/journal/submit"
              className="flex items-center gap-2 bg-oxford text-white px-8 py-3.5 text-[10px] uppercase tracking-[0.25em] font-black hover:bg-gold hover:text-oxford transition-all duration-500 shadow-2xl group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Submit <Send size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-12 h-12 flex items-center justify-center text-oxford border border-black/5 hover:border-gold transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 lg:hidden bg-white px-6 pt-24 pb-12 flex flex-col"
          >
            <div className="container mx-auto h-full flex flex-col">
              <div className="flex justify-between items-center mb-12 border-b border-black/5 pb-6">
                <span className="font-serif text-2xl font-bold italic text-oxford">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-3 bg-oxford text-white hover:bg-gold transition-colors">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    {link.children ? (
                      <div className="border-b border-black/5">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                          className="w-full font-serif text-2xl italic transition-all flex items-center justify-between py-4 text-oxford"
                        >
                          {link.label}
                          <ChevronRight size={20} className={`transition-transform duration-300 ${openDropdown === link.label ? "rotate-90" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {openDropdown === link.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              {link.children.map((child) => (
                                <Link
                                  key={child.label}
                                  to={child.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="block font-sans text-base text-oxford/60 py-3 pl-6 border-l-2 border-gold/20 hover:border-gold hover:text-gold transition-all"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        key={link.label}
                        to={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`font-serif text-2xl italic transition-all flex items-center justify-between border-b border-black/5 py-4
                          ${isActive(link.href) ? "text-gold" : "text-oxford/60 hover:text-gold"}`}
                      >
                        {link.label}
                        <ChevronRight size={20} className={isActive(link.href) ? "text-gold" : "text-oxford/20"} />
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-auto space-y-4 pt-6 border-t border-black/5">
                <Button asChild className="w-full h-14 rounded-none bg-oxford text-white text-xs font-bold tracking-[0.2em] hover:bg-gold transition-all duration-500 shadow-lg">
                  <Link to="/journal/submit" onClick={() => setIsMenuOpen(false)}>SUBMIT MANUSCRIPT</Link>
                </Button>
                
                <div className="flex justify-between items-center px-1">
                  <p className="text-[9px] uppercase tracking-widest text-oxford/20 font-bold">© 2026 JMRH Publications</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

export default Header;
