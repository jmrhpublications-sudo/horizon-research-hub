import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { FileText, AlertTriangle, CheckCircle, BookOpen } from "lucide-react";

const PlagiarismPage = memo(() => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead 
        title="Plagiarism Policy | Journal of Multidisciplinary Research Horizon"
        description="Plagiarism policy for JMRH Publications - original work requirement and consequences."
        canonical="/plagiarism"
      />
      <Header />
      
      <section className="pt-32 pb-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Plagiarism Policy</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Plagiarism Policy
          </h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12 space-y-8">
            
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold" />
                Originality Requirement
              </h2>
              <p className="text-oxford/70">
                All submissions must be original work created by the authors.
              </p>
            </div>

            <div className="bg-red-50 p-6 border border-red-200">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Acceptable Limit
              </h2>
              <p className="text-oxford/70">
                Maximum plagiarism allowed: <strong>10%</strong>
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4">Detection</h2>
              <p className="text-oxford/70">
                Plagiarism will be checked using standard plagiarism detection tools.
              </p>
            </div>

            <div className="bg-red-50 p-6 border border-red-200">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4">Consequences</h2>
              <ul className="list-disc list-inside text-oxford/70 space-y-2">
                <li>Immediate rejection</li>
                <li>Blacklisting (if severe)</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gold" />
                Citation Requirement
              </h2>
              <p className="text-oxford/70">
                Proper referencing (APA 7th Edition as required) is mandatory. All sources must be properly cited.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default PlagiarismPage;
