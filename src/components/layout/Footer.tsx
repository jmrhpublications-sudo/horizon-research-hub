import { memo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ShieldCheck, Globe, Instagram, Mail, ArrowRight } from "lucide-react";

const Footer = memo(() => {
  return (
    <footer className="bg-white border-t border-black/5 pt-16 overflow-hidden relative font-ui">
      <div className="container max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">

          {/* Brand */}
          <div className="md:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="JMRH Logo" className="w-12 h-12 object-contain" />
              <span className="font-serif text-2xl font-black text-oxford tracking-tighter">JMRH<span className="text-gold">.</span></span>
            </Link>

            <p className="font-sans text-sm text-oxford/60 leading-relaxed max-w-sm">
              JMRH Publications is committed to promoting high-quality research dissemination through peer-reviewed journals and academic book publishing.
            </p>

            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 flex items-center justify-center text-oxford/40 hover:text-gold hover:bg-gold/5 transition-all">
                <Globe className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center text-oxford/40 hover:text-gold hover:bg-gold/5 transition-all">
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a href="mailto:jmrhpublications@gmail.com" className="w-10 h-10 flex items-center justify-center text-oxford/40 hover:text-gold hover:bg-gold/5 transition-all">
                <Mail className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Journal Links */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-oxford">Journal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/journal/about" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  About
                </Link>
              </li>
              <li>
                <Link to="/journal/editorial-board" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Editorial Board
                </Link>
              </li>
              <li>
                <Link to="/journal/current-issue" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Current Issue
                </Link>
              </li>
              <li>
                <Link to="/journal/archives" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Archives
                </Link>
              </li>
              <li>
                <Link to="/journal/guidelines" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Author Guidelines
                </Link>
              </li>
              <li>
                <Link to="/journal/aims-scope" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Aims & Scope
                </Link>
              </li>
              <li>
                <Link to="/journal/peer-review" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Peer Review Process
                </Link>
              </li>
              <li>
                <Link to="/journal/ethics" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Ethics
                </Link>
              </li>
              <li>
                <Link to="/journal/plagiarism" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Plagiarism Policy
                </Link>
              </li>
              <li>
                <Link to="/journal/open-access" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Open Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Books Links */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-oxford">Books</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/books/about" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Publishing
                </Link>
              </li>
              <li>
                <Link to="/books/published" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Published Books
                </Link>
              </li>
              <li>
                <Link to="/books/proposal" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Submit Proposal
                </Link>
              </li>
              <li>
                <Link to="/books/isbn" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  ISBN Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-oxford">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/call-for-chapters" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Call for Chapters
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/policies" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Policies
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/call-for-papers" className="text-xs text-oxford/50 hover:text-gold transition-colors flex items-center gap-2 group">
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Call for Papers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-oxford">Contact</h4>
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-bold text-oxford/30 uppercase tracking-widest mb-1">Address</p>
                <p className="text-xs text-oxford/50 leading-relaxed">
                  JMRH Publications<br />
                  Gudalur, The Nilgiris – 643212<br />
                  Tamil Nadu, India
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-oxford/30 uppercase tracking-widest mb-1">Email</p>
                <a href="mailto:jmrhpublications@gmail.com" className="text-xs text-gold hover:text-oxford transition-colors">
                  jmrhpublications@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-oxford py-5">
        <div className="container max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gold/10 flex items-center justify-center rotate-45">
              <span className="text-gold text-[8px] font-black -rotate-45">J</span>
            </div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-bold">© 2026 JMRH Publications</p>
          </div>
          <div className="flex items-center gap-6 text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">
            <Link to="/policies" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <span className="w-[1px] h-3 bg-white/10" />
            <span className="flex items-center gap-2">
              <ShieldCheck size={10} />
              <span>All Rights Reserved</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
