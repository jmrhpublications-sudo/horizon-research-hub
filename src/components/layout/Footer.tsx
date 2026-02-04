import { memo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, MapPin, Mail, ShieldCheck, Globe, Library } from "lucide-react";

const Footer = memo(() => {
  return (
    <footer className="bg-oxford text-white pt-32 pb-12 overflow-hidden relative border-t border-white/5 font-ui">
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 pb-24 border-b border-white/5">
          {/* Brand & Mandate */}
          <div className="md:col-span-5 space-y-10">
            <Link to="/" className="flex items-center gap-4 group w-fit">
              <div className="w-12 h-12 bg-white/5 border border-gold/40 flex items-center justify-center rotate-45 group-hover:bg-gold transition-all duration-700 shadow-lg">
                <BookOpen className="w-6 h-6 text-gold group-hover:text-oxford -rotate-45" />
              </div>
              <div>
                <span className="font-serif text-3xl font-bold tracking-tighter text-white">
                  JMRH<span className="text-gold">.</span>
                </span>
                <p className="text-[9px] uppercase tracking-[0.5em] text-gold/60 font-bold block">Scholar Mandate</p>
              </div>
            </Link>

            <p className="font-serif italic text-white/40 text-xl leading-relaxed max-w-sm">
              " Strengthening the quality, integrity, and impact of multidisciplinary research for a global scholarly community. "
            </p>

            <div className="flex gap-5">
              {[Globe, Mail, ShieldCheck, Library].map((Icon, idx) => (
                <a key={idx} href="#" className="w-12 h-12 border border-white/10 rounded-xl flex items-center justify-center hover:bg-gold hover:border-gold hover:text-oxford transition-all duration-700 shadow-sm">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Institutional Info */}
          <div className="md:col-span-3 space-y-8">
            <h4 className="text-[11px] uppercase tracking-[0.4em] text-gold font-bold border-l-2 border-gold/40 pl-4">Administrative Office</h4>
            <div className="space-y-6 text-sm text-white/40 font-sans leading-relaxed">
              <div className="flex gap-4">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-1" />
                <p className="italic">JMRH Publications <br />Gudalur, The Nilgiris – 643212 <br />Tamil Nadu, India</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-white/60">Scholarly Identity</p>
                <p className="text-gold italic font-bold">ISSN (Online): To be assigned</p>
              </div>
            </div>
          </div>

          {/* Navigation Matrix */}
          <div className="md:col-span-4 space-y-8">
            <h4 className="text-[11px] uppercase tracking-[0.4em] text-gold font-bold border-l-2 border-gold/40 pl-4">Resource Matrix</h4>
            <div className="grid grid-cols-2 gap-y-5 gap-x-8">
              {[
                { label: "Author Guidelines", href: "/guidelines" },
                { label: "Editorial Board", href: "/editorial-board" },
                { label: "Ethics Policy", href: "/ethics-policy" },
                { label: "Research Archive", href: "/archives" },
                { label: "Contact Office", href: "/contact" },
                { label: "Peer Review", href: "/about" }
              ].map((link, idx) => (
                <Link key={idx} to={link.href} className="text-[10px] uppercase tracking-widest font-bold text-white/30 hover:text-gold hover:translate-x-1 transition-all flex items-center gap-2">
                  <div className="w-1 h-1 bg-white/10 rounded-full" />
                  {link.label}
                </Link> Standard Rules.
               ))}
            </div>
          </div>
        </div>

        {/* Legal & Compliance */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <p>© 2025 Journal of Multidisciplinary Research Horizon</p>
          </div>
          <p className="italic text-white/10">Academic & Peer-Reviewed Scholarly Platform</p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-gold transition-colors">Legal Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Digital Preservation</a>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
Standard Rules apply to all authors.
