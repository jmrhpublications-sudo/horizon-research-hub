import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const JournalPlagiarism = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Plagiarism Policy | Journal of Multidisciplinary Research Horizon"
        description="JMRH maintains a strict anti-plagiarism policy with 10% similarity threshold."
        canonical="/journal/plagiarism"
      />
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-oxford/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/journal/about" className="hover:text-gold transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-gold">Plagiarism Policy</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Plagiarism Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            <p className="text-oxford/70 leading-relaxed mb-8">
              JMRH maintains a strict anti-plagiarism policy. All manuscripts are subjected to plagiarism screening during the initial evaluation process using standard plagiarism detection software.
            </p>

            <div className="bg-gold/5 p-6 border border-gold/10 mb-8">
              <h3 className="font-serif text-lg font-bold text-oxford mb-2">Similarity Index Threshold</h3>
              <p className="text-oxford/70">
                The similarity index must not exceed <strong>10%</strong>, excluding:
              </p>
              <ul className="mt-4 space-y-2 text-oxford/60">
                <li>• References</li>
                <li>• Bibliography</li>
                <li>• Properly cited quotations</li>
              </ul>
            </div>

            <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Prohibited Practices</h2>
            
            <div className="space-y-4">
              {[
                "Plagiarism",
                "Self-plagiarism",
                "Redundant publication"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-red-50 border border-red-100">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <span className="text-oxford/80">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-oxford/5 p-6">
              <p className="text-oxford/70 leading-relaxed">
                Manuscripts found violating plagiarism standards will be <strong>rejected or retracted</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default JournalPlagiarism;
