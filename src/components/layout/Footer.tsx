import { memo } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Globe, Instagram, Mail, ArrowRight } from "lucide-react";

const Footer = memo(() => {
  return (
    <footer className="bg-white border-t border-black/5 pt-16 overflow-hidden relative font-ui">
      <div className="container max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="JMRH Logo" className="w-16 h-16 object-contain" width="64" height="64" />
              <span className="font-serif text-2xl font-black text-oxford tracking-tighter">JMRH<span className="text-gold">.</span></span>
            </Link>

            <p className="font-sans text-sm text-oxford/60 leading-relaxed">
              Journal of Multidisciplinary Research Horizon - A peer-reviewed, open-access scholarly journal.
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

          {/* Journal */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-oxford">Journal</h4>
            <ul className="space-y-3">
              <li><Link to="/journal/about" className="text-xs text-oxford/50 hover:text-gold transition-colors">About Journal</Link></li>
              <li><Link to="/journal/aims-scope" className="text-xs text-oxford/50 hover:text-gold transition-colors">Aims & Scope</Link></li>
              <li><Link to="/journal/editorial-board" className="text-xs text-oxford/50 hover:text-gold transition-colors">Editorial Board</Link></li>
              <li><Link to="/journal/reviewer-board" className="text-xs text-oxford/50 hover:text-gold transition-colors">Reviewer Board</Link></li>
              <li><Link to="/journal/archives" className="text-xs text-oxford/50 hover:text-gold transition-colors">Archives</Link></li>
              <li><Link to="/call-for-papers" className="text-xs text-oxford/50 hover:text-gold transition-colors">Call for Papers</Link></li>
              <li><Link to="/reviews" className="text-xs text-oxford/50 hover:text-gold transition-colors">Reviews</Link></li>
            </ul>
          </div>

          {/* For Authors */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-oxford">For Authors</h4>
            <ul className="space-y-3">
              <li><Link to="/journal/guidelines" className="text-xs text-oxford/50 hover:text-gold transition-colors">Author Guidelines</Link></li>
              <li><Link to="/journal/ethics" className="text-xs text-oxford/50 hover:text-gold transition-colors">Publication Ethics</Link></li>
              <li><Link to="/journal/peer-review" className="text-xs text-oxford/50 hover:text-gold transition-colors">Peer Review Process</Link></li>
              <li><Link to="/journal/apc" className="text-xs text-oxford/50 hover:text-gold transition-colors">APC</Link></li>
              <li><Link to="/journal/submit" className="text-xs text-oxford/50 hover:text-gold transition-colors">Submit Manuscript</Link></li>
              <li><Link to="/open-access" className="text-xs text-oxford/50 hover:text-gold transition-colors">Open Access Policy</Link></li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-oxford">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-xs text-oxford/50 hover:text-gold transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-xs text-oxford/50 hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/security" className="text-xs text-oxford/50 hover:text-gold transition-colors">Security Policy</Link></li>
              <li><Link to="/plagiarism-policy" className="text-xs text-oxford/50 hover:text-gold transition-colors">Plagiarism Policy</Link></li>
              <li><Link to="/refund" className="text-xs text-oxford/50 hover:text-gold transition-colors">Refund Policy</Link></li>
              <li><Link to="/copyright" className="text-xs text-oxford/50 hover:text-gold transition-colors">Copyright Policy</Link></li>
              <li><Link to="/disclaimer" className="text-xs text-oxford/50 hover:text-gold transition-colors">Disclaimer</Link></li>
            </ul>

            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-oxford mt-6">Contact</h4>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-xs text-oxford/50 hover:text-gold transition-colors">Contact Us</Link></li>
              <li>
                <a href="mailto:jmrhpublications@gmail.com" className="text-xs text-gold hover:text-oxford transition-colors">
                  jmrhpublications@gmail.com
                </a>
              </li>
              <li>
                <a href="mailto:callforpapers@jmrh.in" className="text-xs text-gold hover:text-oxford transition-colors">
                  callforpapers@jmrh.in
                </a>
              </li>
            </ul>
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
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
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
