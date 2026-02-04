import { BookOpen, Globe, Mail, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-charcoal text-cream pt-20 pb-10 overflow-hidden relative">
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 pb-20">
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-gold/40 flex items-center justify-center rotate-45">
                <BookOpen className="w-5 h-5 text-gold -rotate-45" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tighter">
                JMRH<span className="text-gold">.</span>
              </span>
            </div>

            <p className="font-serif italic text-cream/40 text-lg leading-relaxed max-w-sm">
              " Strengthening the quality, integrity, and impact of multidisciplinary research worldwide. "
            </p>

            <div className="flex gap-4">
              {[Globe, Mail, ShieldCheck].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all duration-500">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Institutional Info */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Institutional</h4>
            <div className="space-y-4 text-sm text-cream/50 font-sans leading-relaxed">
              <p className="text-cream">JMRH Publications</p>
              <p>Gudalur, The Nilgiris – 643212,<br />Tamil Nadu, India</p>
              <p className="text-gold italic">ISSN (Online): To be assigned</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Resouce Navigation</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Author Guidelines", href: "#guidelines" },
                { label: "Ethics Policy", href: "#ethics" },
                { label: "Peer Review", href: "#policy" },
                { label: "Board Members", href: "#editorial" },
                { label: "Research Archive", href: "#archives" },
                { label: "Contact Office", href: "#contact" }
              ].map((link, idx) => (
                <a key={idx} href={link.href} className="text-xs uppercase tracking-widest text-cream/40 hover:text-gold transition-colors block">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold">
          <p>© 2025 Journal of Multidisciplinary Research Horizon (JMRH)</p>
          <p>Academic & Peer-Reviewed Multidisciplinary Platform</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Digital Preservation</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
