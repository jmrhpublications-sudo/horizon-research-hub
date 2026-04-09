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
              The journal strictly follows ethical publishing practices in accordance with UGC regulations and international publication standards. All authors must adhere to our publication ethics guidelines.
            </p>

            <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Publication Ethics Requirements</h2>
            
            <div className="space-y-4 mb-12">
              {[
                "Plagiarism must not exceed 10%",
                "Follow UGC and COPE guidelines",
                "No duplicate submission",
                "Ethical violations will result in rejection or retraction"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-oxford/5 border border-black/5">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span className="text-oxford/80">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-red-50 p-6 border border-red-100">
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
