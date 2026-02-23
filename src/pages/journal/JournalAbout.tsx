import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const JournalAbout = memo(() => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead 
        title="About the Journal | Journal of Multidisciplinary Research Horizon"
        description="Learn about JMRH - an international, peer-reviewed, open-access scholarly journal dedicated to advancing multidisciplinary research."
        canonical="/journal/about"
      />
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/journal/about" className="text-gold">Journal</Link>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            About the Journal
          </h1>
          <p className="text-lg text-oxford/60 leading-relaxed">
            Journal of Multidisciplinary Research Horizon (JMRH)
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            <h2 className="font-serif text-2xl font-bold text-oxford mb-6">
              Journal of Multidisciplinary Research Horizon (JMRH)
            </h2>
            
            <p className="text-oxford/70 leading-relaxed mb-6">
              The <strong>Journal of Multidisciplinary Research Horizon (JMRH)</strong> is an international, peer-reviewed, open-access scholarly journal published online by JMRH Publications.
            </p>

            <p className="text-oxford/70 leading-relaxed mb-6">
              The journal is committed to advancing high-quality multidisciplinary and interdisciplinary research that contributes to academic excellence and societal development. JMRH provides a structured and ethical platform for researchers, academicians, professionals, and research scholars to publish original and unpublished scholarly work.
            </p>

            <p className="text-oxford/70 leading-relaxed mb-8">
              All manuscripts undergo a rigorous double-blind peer review process to ensure originality, relevance, methodological soundness, and meaningful academic contribution.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-oxford/5 p-6 border border-black/5">
                <h3 className="font-serif text-lg font-bold text-oxford mb-4">Mode of Publication</h3>
                <p className="text-oxford/60">Online</p>
              </div>
              <div className="bg-oxford/5 p-6 border border-black/5">
                <h3 className="font-serif text-lg font-bold text-oxford mb-4">Frequency</h3>
                <p className="text-oxford/60">Bi-Monthly (Six Issues per Year)</p>
              </div>
              <div className="bg-oxford/5 p-6 border border-black/5">
                <h3 className="font-serif text-lg font-bold text-oxford mb-4">Language</h3>
                <p className="text-oxford/60">English</p>
              </div>
              <div className="bg-oxford/5 p-6 border border-black/5">
                <h3 className="font-serif text-lg font-bold text-oxford mb-4">Starting Year</h3>
                <p className="text-oxford/60">2026</p>
              </div>
              <div className="bg-oxford/5 p-6 border border-black/5">
                <h3 className="font-serif text-lg font-bold text-oxford mb-4">ISSN (Online)</h3>
                <p className="text-oxford/60">To be Assigned</p>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link 
                to="/journal/submit"
                className="inline-flex items-center gap-2 bg-oxford text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-oxford transition-all"
              >
                Submit Manuscript
              </Link>
              <Link 
                to="/journal/guidelines"
                className="inline-flex items-center gap-2 border border-oxford text-oxford px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-oxford hover:text-white transition-all"
              >
                Author Guidelines
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <h3 className="font-serif text-xl font-bold text-oxford mb-8">Explore More</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <Link to="/journal/aims-scope" className="bg-white p-6 border border-black/5 hover:border-gold/30 transition-all group">
              <h4 className="font-bold text-oxford group-hover:text-gold transition-colors">Aims & Scope</h4>
            </Link>
            <Link to="/journal/editorial-board" className="bg-white p-6 border border-black/5 hover:border-gold/30 transition-all group">
              <h4 className="font-bold text-oxford group-hover:text-gold transition-colors">Editorial Board</h4>
            </Link>
            <Link to="/journal/peer-review" className="bg-white p-6 border border-black/5 hover:border-gold/30 transition-all group">
              <h4 className="font-bold text-oxford group-hover:text-gold transition-colors">Peer Review Process</h4>
            </Link>
            <Link to="/journal/archives" className="bg-white p-6 border border-black/5 hover:border-gold/30 transition-all group">
              <h4 className="font-bold text-oxford group-hover:text-gold transition-colors">Archives</h4>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default JournalAbout;
