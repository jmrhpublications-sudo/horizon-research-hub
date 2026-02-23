import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const JournalEthics = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Publication Ethics | Journal of Multidisciplinary Research Horizon"
        description="Learn about JMRH's publication ethics and standards."
        canonical="/journal/ethics"
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
            <span className="text-gold">Publication Ethics</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Publication Ethics
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            <p className="text-oxford/70 leading-relaxed mb-8">
              JMRH adheres to recognized standards of academic publication ethics and integrity. The journal expects all authors, reviewers, and editors to follow ethical research and publication practices.
            </p>

            <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Prohibited Practices</h2>
            
            <div className="space-y-4 mb-12">
              {[
                "Data fabrication or falsification",
                "Duplicate submission",
                "Unethical research practices",
                "Misrepresentation of authorship"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-red-50 border border-red-100">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <span className="text-oxford/80">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-oxford/5 p-6">
              <p className="text-oxford/70 leading-relaxed">
                Any breach of ethical standards may result in <strong>rejection, retraction, or further action</strong> as deemed appropriate by the Editorial Board.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default JournalEthics;
