import { useState, useEffect, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Guidelines", href: "/guidelines" },
  { label: "Editorial", href: "/editorial-board" },
  { label: "Ethics", href: "/ethics-policy" },
  { label: "Archives", href: "/archives" },
  { label: "Contact", href: "/contact" },
];

const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-md border-b border-charcoal/5 py-3" : "bg-cream/40 py-5"}`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-charcoal flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-700 shadow-lg group-hover:shadow-gold/20">
              <BookOpen className="w-5 h-5 text-gold -rotate-45 group-hover:-rotate-90 transition-transform duration-700" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold text-charcoal tracking-tighter leading-none">
                JMRH<span className="text-gold">.</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.4em] text-charcoal/40 font-bold">Research Horizon</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 relative group py-2 
                  ${location.pathname === link.href ? "text-gold" : "text-charcoal/60 hover:text-gold"}`}
              >
                {link.label}
                <span className={`absolute -bottom-0 left-0 h-[1px] bg-gold transition-all duration-300 
                  ${location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="font-serif italic text-charcoal hover:bg-transparent hover:text-gold">
              <Link to="/archives">Archives</Link>
            </Button>
            <Button variant="hero" size="sm" asChild className="rounded-none bg-charcoal text-cream px-6 hover:bg-gold hover:text-charcoal transition-all duration-500 shadow-md">
              <Link to="/contact">Submit Manuscript</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-2 text-charcoal hover:text-gold transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 xl:hidden bg-charcoal text-cream p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-16">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-gold" />
                <span className="font-serif text-2xl italic text-gold">JMRH Portal</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-3 border border-white/10 rounded-none hover:bg-white/5 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-8">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-serif text-4xl italic transition-all block
                      ${location.pathname === link.href ? "text-gold pl-4 border-l-2 border-gold" : "hover:text-gold"}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto space-y-6 pt-12 border-t border-white/5">
              <Button variant="gold" size="xl" asChild className="w-full rounded-none tracking-widest font-bold h-16 text-lg">
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>SUBMIT MANUSCRIPT</Link>
              </Button>
              <div className="flex justify-between items-center px-2">
                <p className="text-[8px] uppercase tracking-widest text-white/20">© 2025 JMRH Publications</p>
                <div className="h-[1px] flex-1 mx-4 bg-white/5" />
                <p className="text-[8px] uppercase tracking-widest text-gold animate-pulse">Scholar Access</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

export default Header;
