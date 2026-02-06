import { memo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, MapPin, Mail, ShieldCheck, Globe, Library, Instagram, Link as LinkIcon } from "lucide-react";

const Footer = memo(() => {
  return (
    <footer className="bg-white border-t border-black/5 pt-24 pb-12 overflow-hidden relative font-ui">
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-50" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24 pb-20">
          {/* Brand & Mandate */}
          <div className="md:col-span-5 space-y-10">
            <Link to="/" className="flex items-center gap-5 group w-fit">
              <div className="relative w-14 h-14 perspective-1000 group-hover:rotate-y-180 transition-transform duration-1000 preserve-3d">
                <div className="absolute inset-0 bg-oxford flex items-center justify-center backface-hidden shadow-2xl">
                  <BookOpen size={24} className="text-gold" />
                </div>
                <div className="absolute inset-0 bg-gold flex items-center justify-center rotate-y-180 backface-hidden shadow-2xl">
                  <Library size={24} className="text-oxford" />
                </div>
              </div>
              <div>
                <span className="font-serif text-4xl font-black tracking-tighter text-oxford">
                  JMRH<span className="text-gold">.</span>
                </span>
                <p className="text-[10px] uppercase tracking-[0.6em] text-teal font-black block mt-1">Scholar Mandate</p>
              </div>
            </Link>

            <p className="font-serif italic text-oxford/60 text-xl leading-relaxed max-w-md">
              " Dedicated to fostering excellence in multidisciplinary research through rigorous peer review and global scholarly collaboration. "
            </p>

            <div className="flex gap-4">
              {[Instagram, LinkIcon, Mail, ShieldCheck].map((Icon, idx) => (
                <a key={idx} href="#" className="w-12 h-12 border border-black/5 flex items-center justify-center hover:bg-oxford hover:text-white transition-all duration-500 shadow-sm hover:translate-y-[-4px]">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Institutional Info */}
          <div className="md:col-span-3 space-y-10">
            <div className="space-y-4">
              <h4 className="text-[11px] uppercase tracking-[0.5em] text-gold font-black border-l-2 border-gold pl-4">Administrative</h4>
              <div className="flex gap-4 text-oxford/60">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                <p className="italic text-sm leading-relaxed">
                  JMRH Publications <br />
                  Gudalur, The Nilgiris – 643212 <br />
                  Tamil Nadu, India
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] uppercase tracking-[0.5em] text-gold font-black border-l-2 border-gold pl-4">Digital Identity</h4>
              <div className="space-y-1 pl-4">
                <p className="text-[11px] font-black text-oxford/40 uppercase tracking-widest">ISSN (Online)</p>
                <p className="text-oxford font-black text-lg font-serif italic">Pending Assignment</p>
              </div>
            </div>
          </div>

          {/* Navigation Matrix */}
          <div className="md:col-span-4 space-y-10">
            <h4 className="text-[11px] uppercase tracking-[0.5em] text-gold font-black border-l-2 border-gold pl-4">Scholarly Matrix</h4>
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              {[
                { label: "Guidelines", href: "/guidelines" },
                { label: "Board", href: "/editorial-board" },
                { label: "Ethics", href: "/ethics-policy" },
                { label: "Archives", href: "/archives" },
                { label: "Contact", href: "/contact" },
                { label: "Peer Review", href: "/about" },
                { label: "Submit", href: "/submit-paper" },
                { label: "Privacy", href: "/ethics-policy" }
              ].map((link, idx) => (
                <Link key={idx} to={link.href} className="text-[10px] uppercase tracking-[0.3em] font-black text-oxford/40 hover:text-gold transition-all flex items-center gap-3">
                  <div className="w-1 h-1 bg-gold opacity-30" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Legal & Compliance */}
        <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] uppercase tracking-[0.5em] text-oxford/30 font-black">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-teal" />
            <p>© 2025 Journal of Multidisciplinary Research Horizon</p>
          </div>
          <p className="italic text-oxford/20">A Premium Peer-Reviewed Scholarly Platform</p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-teal">System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
