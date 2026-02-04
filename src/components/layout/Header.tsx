import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Vision", href: "#vision" },
  { label: "Mentorship", href: "#mentorship" },
  { label: "Scope", href: "#scope" },
  { label: "Editorial", href: "#editorial" },
  { label: "Ethics", href: "#ethics" },
  { label: "Guidelines", href: "#guidelines" },
  { label: "Archives", href: "#archives" },
  { label: "Contact", href: "#contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-md border-b border-charcoal/5 py-4" : "bg-cream/40 py-6"}`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-charcoal flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-700">
              <BookOpen className="w-5 h-5 text-gold -rotate-45 group-hover:-rotate-90 transition-transform duration-700" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold text-charcoal tracking-tighter leading-none">
                JMRH<span className="text-gold">.</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.4em] text-charcoal/40 font-bold">Research Horizon</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/60 hover:text-gold transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="font-serif italic text-charcoal hover:bg-transparent hover:text-gold">
              Archives
            </Button>
            <Button variant="hero" size="sm" className="rounded-none bg-charcoal text-cream px-6 hover:bg-gold hover:text-charcoal transition-all duration-500">
              Submit Manuscript
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-2 text-charcoal"
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
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 lg:hidden bg-charcoal text-cream p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif text-2xl italic text-gold">JMRH Portal</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 border border-white/10">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="font-serif text-3xl italic hover:text-gold transition-colors text-left"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto space-y-4">
              <Button variant="gold" size="xl" className="w-full rounded-none">
                Submit Manuscript
              </Button>
              <p className="text-[10px] uppercase tracking-widest text-center text-white/20">© 2025 JMRH Publications</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
