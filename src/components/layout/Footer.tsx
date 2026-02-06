import { memo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, MapPin, Mail, ShieldCheck, Globe, Library, Instagram, Link as LinkIcon } from "lucide-react";

const Footer = memo(() => {
  return (
    <footer className="bg-white border-t border-black/5 pt-24 pb-12 overflow-hidden relative font-ui">
      {/* Cinematic Horizontal Branding Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-50" />

      <div className="container max-w-[1800px] mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 lg:gap-32 pb-24">

          {/* Brand & Scholar Mandate */}
          <div className="md:col-span-5 space-y-12">
            <Link to="/" className="flex items-center gap-6 group w-fit">
              <div className="relative w-14 h-14 perspective-2000 group-hover:rotate-y-180 transition-transform duration-1000 preserve-3d">
                <div className="absolute inset-0 bg-oxford flex items-center justify-center backface-hidden shadow-2xl">
                  <BookOpen size={24} className="text-gold" strokeWidth={1} />
                </div>
                <div className="absolute inset-0 bg-gold flex items-center justify-center rotate-y-180 backface-hidden shadow-2xl">
                  <Library size={24} className="text-oxford" strokeWidth={1} />
                </div>
              </div>
              <div>
                <span className="font-serif text-4xl font-black tracking-tighter text-oxford">
                  JMRH<span className="text-gold">.</span>
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-8 h-[1px] bg-teal/30" />
                  <p className="text-[9px] uppercase tracking-[0.6em] text-teal font-black">Scholar Mandate</p>
                </div>
              </div>
            </Link>

            <p className="font-serif italic text-oxford/40 text-xl leading-relaxed max-w-lg">
              " Dedicated to fostering excellence in multidisciplinary research through rigorous peer review and global scholarly collaboration. "
            </p>

            <div className="flex gap-4">
              {[Instagram, LinkIcon, Mail, ShieldCheck].map((Icon, idx) => (
                <a key={idx} href="#" className="w-12 h-12 border border-black/5 flex items-center justify-center hover:bg-oxford hover:text-gold transition-all duration-700 shadow-sm hover:-translate-y-2">
                  <Icon className="w-5 h-5" strokeWidth={1} />
                </a>
              ))}
            </div>
          </div>

          {/* Institutional Blueprint */}
          <div className="md:col-span-3 space-y-12">
            <div className="space-y-6">
              <div className="section-label">Administrative</div>
              <div className="flex gap-5 text-oxford/50">
                <MapPin className="w-6 h-6 text-gold shrink-0 mt-1" strokeWidth={1} />
                <p className="italic text-base leading-relaxed font-serif">
                  JMRH Publications <br />
                  Gudalur, The Nilgiris – 643212 <br />
                  Tamil Nadu, India
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="section-label">Digital Identity</div>
              <div className="space-y-2 border-l border-gold/20 pl-6">
                <p className="text-[10px] font-black text-oxford/30 uppercase tracking-[0.3em]">ISSN (Online)</p>
                <p className="text-oxford font-black text-xl font-serif italic tracking-tighter">Pending Assignment</p>
              </div>
            </div>
          </div>

          {/* Scholarly Matrix */}
          <div className="md:col-span-4 space-y-12">
            <div className="section-label">Scholarly Matrix</div>
            <div className="grid grid-cols-2 gap-y-6 gap-x-12">
              {[
                { label: "Guidelines", href: "/guidelines" },
                { label: "Board", href: "/editorial-board" },
                { label: "Ethics", href: "/ethics-policy" },
                { label: "Archives", href: "/archives" },
                { label: "Reviews", href: "/reviews" },
                { label: "Contact", href: "/contact" },
                { label: "Peer Review", href: "/about" },
                { label: "Submit", href: "/submit-paper" }
              ].map((link, idx) => (
                <Link key={idx} to={link.href} className="text-[10px] uppercase tracking-[0.4em] font-black text-oxford/30 hover:text-gold transition-all flex items-center gap-4 group">
                  <div className="w-1 h-1 bg-gold opacity-30 group-hover:w-3 group-hover:opacity-100 transition-all" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Legal & Compliance Protocol */}
        <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] uppercase tracking-[0.6em] text-oxford/30 font-black">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-5 h-5 text-teal/40" />
            <p>© 2026 Journal of Multidisciplinary Research Horizon</p>
          </div>
          <div className="flex items-center gap-12">
            <p className="italic text-oxford/20 hidden xl:block">Architected for Scholarly Excellence</p>
            <div className="flex items-center gap-4 py-2 px-4 bg-teal/5 border border-teal/10 rounded-full">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-teal tracking-[0.8em]">System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
