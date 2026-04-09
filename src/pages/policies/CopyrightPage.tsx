import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Copyright, PenTool, BookOpen } from "lucide-react";

const CopyrightPage = memo(() => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead 
        title="Copyright Policy | Journal of Multidisciplinary Research Horizon"
        description="Copyright policy for JMRH Publications."
        canonical="/copyright"
      />
      <Header />
      
      <section className="pt-32 pb-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Copyright Policy</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Copyright Policy
          </h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12 space-y-8">
            
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <Copyright className="w-5 h-5 text-gold" />
                Author Copyright
              </h2>
              <p className="text-oxford/70">
                Authors retain the copyright to their work published in JMRH.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-gold" />
                Publishing Rights
              </h2>
              <p className="text-oxford/70">
                Authors grant JMRH Publications non-exclusive rights to publish, distribute, and archive the work.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gold" />
                Reuse Permission
              </h2>
              <p className="text-oxford/70">
                Material can be reproduced with proper attribution to JMRH. Users must cite the original publication.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4">Creative Commons</h2>
              <p className="text-oxford/70">
                Published articles are distributed under Creative Commons license (CC BY-NC-ND).
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default CopyrightPage;
