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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 
      ${scrolled ? "bg-white/95 backdrop-blur-md border-b border-border py-3 shadow-sm" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-oxford flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-1000 shadow-xl">
              <BookOpen className="w-5 h-5 text-gold -rotate-45 group-hover:-rotate-90 transition-transform duration-1000" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold text-oxford tracking-tighter leading-none">
                JMRH<span className="text-gold">.</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.4em] text-teal font-bold font-ui">Research Horizon</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`nav-link relative py-1
                  ${location.pathname === link.href ? "text-teal" : "text-text-muted hover:text-teal"}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-gold transition-all duration-500 
                  ${location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-6 font-ui">
            <Link to="/archives" className="text-[10px] uppercase tracking-[0.2em] font-bold text-oxford hover:text-gold transition-colors">
              Archives
            </Link>
            <Button asChild className="rounded-none bg-oxford text-white px-8 hover:bg-teal transition-all duration-500 shadow-md">
              <Link to="/contact">Submit Manuscript</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-2 text-oxford"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "10%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "10%" }}
            className="fixed inset-0 z-50 xl:hidden bg-oxford text-white p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="font-serif text-2xl italic text-gold">JMRH Portal</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-3 border border-white/10">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <nav className="flex flex-col gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-serif text-4xl italic transition-all
                    ${location.pathname === link.href ? "text-gold translate-x-4" : "hover:text-gold"}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto space-y-6">
              <Button asChild className="w-full h-16 rounded-none bg-gold text-oxford text-lg font-bold tracking-widest hover:bg-white transition-colors">
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>SUBMIT MANUSCRIPT</Link>
              </Button>
              <p className="text-[10px] uppercase tracking-widest text-center text-white/40 font-ui">© 2025 JMRH Publications</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

export default Header;
