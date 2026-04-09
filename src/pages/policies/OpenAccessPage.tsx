import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Globe, Copyright, Share2, Eye, TrendingUp } from "lucide-react";

const OpenAccessPage = memo(() => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead 
        title="Open Access Policy | Journal of Multidisciplinary Research Horizon"
        description="Open access policy for JMRH Publications - free access to all published content."
        canonical="/open-access"
      />
      <Header />
      
      <section className="pt-32 pb-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Open Access Policy</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Open Access Policy
          </h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12 space-y-8">
            
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-gold" />
                Free Access
              </h2>
              <p className="text-oxford/70">
                All published content is freely accessible to readers worldwide.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <Copyright className="w-5 h-5 text-gold" />
                Author Rights
              </h2>
              <p className="text-oxford/70">
                Authors retain copyright but grant publishing rights to JMRH Publications.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-gold" />
                Licensing
              </h2>
              <p className="text-oxford/70">
                Content may be distributed with proper citation. Readers are encouraged to share and cite.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-gold" />
                No Paywall
              </h2>
              <p className="text-oxford/70">
                Readers can access content without subscription or payment.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold" />
                Visibility
              </h2>
              <p className="text-oxford/70">
                Open access ensures global reach and citation advantage for published authors.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default OpenAccessPage;
