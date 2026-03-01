import { useState, useEffect, memo } from "react";
import { useLocation } from "react-router-dom";
import PreloadLink from "@/components/ui/LinkPreloader";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ShieldCheck, User as UserIcon, Zap } from "lucide-react";
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
  { label: "Reviews", href: "/reviews" },
  { label: "Policies", href: "/policies" },
  { label: "About", href: "/about-us" },
  { label: "Contact", href: "/contact" }
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.2, ease: [0.0, 0.0, 0.2, 1] as const }
  },
  exit: { 
    opacity: 0, 
    y: -8, 
    scale: 0.98,
    transition: { duration: 0.15, ease: [0.4, 0.0, 1, 1] as const }
  }
};

const linkVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};

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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const isHomePage = location.pathname === "/";
  const headerBg = !isHomePage || scrolled ? "bg-white/98 backdrop-blur-md shadow-sm border-b border-black/[0.06]" : "bg-white";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}>
      <div className="container max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <PreloadLink to="/" className="flex items-center gap-2 lg:gap-3 group">
              <img src="/logo.png" alt="JMRH Logo" className="w-10 h-10 lg:w-14 lg:h-14 object-contain" width="56" height="56" />
              <div className="flex flex-col">
                <span className="font-serif text-lg lg:text-xl font-black text-oxford tracking-tighter leading-none">
                  JMRH<span className="text-gold">.</span>
                </span>
                <span className="text-[7px] lg:text-[9px] uppercase tracking-[0.35em] lg:tracking-[0.45em] text-oxford/40 font-bold font-ui mt-0.5">Publications</span>
              </div>
            </PreloadLink>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link, idx) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="relative"
              >
                {link.children ? (
                  <motion.div variants={linkVariants} initial="rest" whileHover="hover">
                    <button
                      className={`text-[10px] uppercase tracking-[0.18em] font-bold transition-all duration-300 hover:text-gold relative py-3 px-3.5 flex items-center gap-1.5 cursor-pointer
                        ${isActive(link.href) ? "text-gold" : "text-oxford/70"}`}
                      onMouseEnter={() => setOpenDropdown(link.label)}
                    >
                      {link.label}
                      <motion.span
                        animate={{ rotate: openDropdown === link.label ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <ChevronDown size={10} />
                      </motion.span>
                      <motion.span
                        className="absolute bottom-2 left-3.5 right-3.5 h-[1.5px] bg-gold"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </button>
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute top-full left-0 pt-2"
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <div className="bg-white border border-black/[0.06] shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-sm py-2 min-w-[220px]">
                            {link.children.map((child, childIdx) => (
                              <motion.div
                                key={child.label}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: childIdx * 0.03 }}
                              >
                                <PreloadLink
                                  to={child.href}
                                  className={`block text-[10px] uppercase tracking-[0.12em] font-semibold px-5 py-2.5 transition-all duration-300 hover:bg-gold/5 hover:text-gold hover:pl-6
                                    ${isActive(child.href) ? "text-gold bg-gold/5" : "text-oxford/60"}`}
                                >
                                  {child.label}
                                </PreloadLink>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div variants={linkVariants} initial="rest" whileHover="hover">
                    <PreloadLink
                      to={link.href}
                      className={`text-[10px] uppercase tracking-[0.18em] font-bold transition-all duration-300 hover:text-gold relative py-3 px-3.5 block
                        ${isActive(link.href) ? "text-gold" : "text-oxford/70"}`}
                    >
                      {link.label}
                      <motion.span
                        className="absolute -bottom-0.5 left-3.5 right-3.5 h-[1.5px] bg-gold rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isActive(link.href) ? 1 : 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </PreloadLink>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </nav>

          <motion.div 
            className="hidden lg:flex items-center gap-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {!currentUser ? (
              <motion.div 
                className="flex items-center gap-3 px-4 py-2 bg-gold/5 border border-gold/10 rounded-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <ShieldCheck size={12} className="text-gold" />
                <span className="text-[9px] uppercase tracking-[0.22em] font-black text-gold/60">Trial Access</span>
                <PreloadLink 
                  to="/auth" 
                  className="text-[9px] uppercase tracking-[0.32em] font-black text-oxford hover:text-gold transition-colors ml-1 underline underline-offset-4 decoration-gold/30 hover:decoration-gold"
                >
                  Sign In
                </PreloadLink>
              </motion.div>
            ) : (
              <PreloadLink to="/account" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-oxford/5 flex items-center justify-center border border-black/[0.06] group-hover:border-gold/40 group-hover:bg-gold/5 transition-all">
                  <UserIcon size={16} className="text-oxford group-hover:text-gold transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest font-black text-oxford">{currentUser.name.split(' ')[0]}</span>
                  <span className={`text-[8px] uppercase tracking-[0.22em] font-bold ${currentUser.role === 'ADMIN' ? 'text-red-500' : 'text-oxford/50'}`}>{currentUser.role}</span>
                </div>
              </PreloadLink>
            )}

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <PreloadLink
                to="/journal/submit"
                className="flex items-center gap-2 bg-oxford text-white px-7 py-3.5 text-[10px] uppercase tracking-[0.28em] font-black hover:bg-gold hover:text-oxford transition-all duration-500 shadow-[0_4px_20px_rgba(26,35,126,0.25)] group relative overflow-hidden"
              >
                <Zap size={12} className="group-hover:fill-gold transition-all" />
                <span className="relative z-10 flex items-center gap-2">
                  Submit
                </span>
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  style={{ opacity: 0.1 }}
                />
              </PreloadLink>
            </motion.div>
          </motion.div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-oxford border border-black/[0.06] hover:border-gold/30 hover:bg-gold/5 transition-all bg-white"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 lg:hidden bg-white"
          >
            <div className="h-full flex flex-col pt-16 pb-8 px-4 sm:px-6">
              <div className="flex justify-between items-center mb-6 sm:mb-8 border-b border-black/[0.05] pb-4">
                <span className="font-serif text-xl sm:text-2xl font-bold italic text-oxford">Menu</span>
                <motion.button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-2.5 sm:p-3 bg-oxford text-white hover:bg-gold transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    {link.children ? (
                      <div className="border-b border-black/[0.04]">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                          className="w-full font-serif text-xl sm:text-2xl italic transition-all flex items-center justify-between py-4 text-oxford min-h-[56px] touch-manipulation"
                        >
                          {link.label}
                          <motion.span
                            animate={{ rotate: openDropdown === link.label ? 90 : 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <ChevronDown size={20} className="rotate-90" />
                          </motion.span>
                        </button>
                        <AnimatePresence>
                          {openDropdown === link.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              {link.children.map((child) => (
                                <PreloadLink
                                  key={child.label}
                                  to={child.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className={`block font-sans text-base text-oxford/60 py-3 pl-5 sm:pl-6 border-l-2 transition-all min-h-[48px] touch-manipulation
                                    ${isActive(child.href) ? "border-gold text-gold" : "border-gold/20 hover:border-gold hover:text-gold"}`}
                                >
                                  {child.label}
                                </PreloadLink>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <PreloadLink
                        key={link.label}
                        to={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`font-serif text-xl sm:text-2xl italic transition-all flex items-center justify-between border-b border-black/[0.04] py-4 min-h-[56px] touch-manipulation
                          ${isActive(link.href) ? "text-gold" : "text-oxford/60 hover:text-gold"}`}
                      >
                        {link.label}
                        <ChevronDown size={20} className={`rotate-[-90deg] transition-transform duration-300 ${isActive(link.href) ? "text-gold" : "text-oxford/20"}`} />
                      </PreloadLink>
                    )}
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto space-y-4 pt-6 border-t border-black/[0.05]">
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button asChild className="w-full h-12 sm:h-14 rounded-none bg-oxford text-white text-xs font-bold tracking-[0.2em] hover:bg-gold transition-all duration-500 shadow-lg">
                    <PreloadLink to="/journal/submit" onClick={() => setIsMenuOpen(false)}>SUBMIT MANUSCRIPT</PreloadLink>
                  </Button>
                </motion.div>
                
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
