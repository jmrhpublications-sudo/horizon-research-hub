import { BookOpen, Globe, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-cream border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gold" />
              <span className="font-serif text-xl font-semibold text-charcoal tracking-tight">
                JMRH<span className="text-warm-gray">.</span>
              </span>
            </div>
            <p className="font-serif italic text-muted-foreground text-sm leading-relaxed max-w-xs">
              Promoting excellence in multidisciplinary research through rigorous scholarly vetting.
            </p>
            <div className="flex gap-3 pt-2">
              <a 
                href="#" 
                className="w-9 h-9 border border-border rounded-sm flex items-center justify-center text-warm-gray hover:text-gold hover:border-gold transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a 
                href="mailto:jmrhpublications@gmail.com" 
                className="w-9 h-9 border border-border rounded-sm flex items-center justify-center text-warm-gray hover:text-gold hover:border-gold transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Publisher Column */}
          <div className="space-y-4">
            <p className="section-label text-gold">The Publisher</p>
            <p className="font-semibold text-charcoal">JMRH Publications</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gudalur, The Nilgiris – 643212, Tamil Nadu, India
            </p>
          </div>

          {/* Resource Hub Column */}
          <div className="space-y-4">
            <p className="section-label text-gold">Resource Hub</p>
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                Guidelines
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                Board Members
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                Digital Repository
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                Support Desk
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border">
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <div>
              <p>© 2025 Journal of Multidisciplinary Research Horizon (JMRH)</p>
              <p className="mt-1">Published by JMRH Publications – Gudalur, Tamil Nadu, India.</p>
            </div>
            <div className="text-right">
              <p className="border border-border px-3 py-1.5 rounded-sm">
                ISSN (Online): To be assigned by ISSN India
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
