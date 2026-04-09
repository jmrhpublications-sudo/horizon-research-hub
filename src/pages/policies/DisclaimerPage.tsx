import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { AlertCircle } from "lucide-react";

const DisclaimerPage = memo(() => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead 
        title="Disclaimer | Journal of Multidisciplinary Research Horizon"
        description="Disclaimer for JMRH Publications."
        canonical="/disclaimer"
      />
      <Header />
      
      <section className="pt-32 pb-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Disclaimer</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Disclaimer
          </h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            
            <div className="flex items-start gap-4 p-6 bg-gold/5 border border-gold/10">
              <AlertCircle className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
              <div>
                <p className="text-oxford/70">
                  The content published is for academic and informational purposes only.
                </p>
                <p className="text-oxford/70 mt-4">
                  The organization is not responsible for authors' views or errors in their submissions.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default DisclaimerPage;
