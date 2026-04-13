import { memo } from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import { pageSEO } from "@/lib/seo-data";

const JournalAbout = memo(() => {
  return (
    <PageShell {...pageSEO.journalAbout} canonical="/journal/about">
      <section className="py-8 sm:py-16 bg-gradient-to-b from-oxford/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Journal</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-oxford mb-4 sm:mb-6">
            About the Journal
          </h1>
          <p className="text-base sm:text-lg text-oxford/60 leading-relaxed">
            Journal of Multidisciplinary Research Horizon (JMRH)
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-black/5 p-5 sm:p-8 md:p-12">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6">
              Journal of Multidisciplinary Research Horizon (JMRH)
            </h2>
            
            <div className="space-y-4 sm:space-y-6 text-oxford/70 leading-relaxed text-sm sm:text-base">
              <p>
                The <strong>Journal of Multidisciplinary Research Horizon (JMRH)</strong> is an international, peer-reviewed, open-access scholarly journal published online by JMRH Publications.
              </p>
              <p>
                The journal is committed to advancing high-quality multidisciplinary and interdisciplinary research that contributes to academic excellence and societal development.
              </p>
              <p>
                All manuscripts undergo a rigorous double-blind peer review process to ensure originality, relevance, methodological soundness, and meaningful academic contribution.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-12">
              {[
                { label: "Journal Title", value: "JMRH" },
                { label: "Frequency", value: "Monthly" },
                { label: "Mode", value: "Online" },
                { label: "Starting Year", value: "2026" },
                { label: "Subject", value: "Multidisciplinary" },
                { label: "Language", value: "English" },
                { label: "Publisher", value: "JMRH Publications" },
                { label: "Address", value: "Gudalur, Nilgiris – 643212" },
                { label: "ISSN", value: "To be assigned" }
              ].map((item, index) => (
                <div key={index} className="bg-oxford/5 p-3 sm:p-6 border border-black/5">
                  <h3 className="text-[10px] sm:text-xs uppercase tracking-widest text-oxford/40 mb-1">{item.label}</h3>
                  <p className="text-oxford/70 text-sm sm:text-base font-medium">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3">
              <Link 
                to="/journal/submit"
                className="inline-flex items-center justify-center gap-2 bg-oxford text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-oxford transition-all min-h-[48px] touch-manipulation"
              >
                Submit Manuscript
              </Link>
              <Link 
                to="/journal/guidelines"
                className="inline-flex items-center justify-center gap-2 border border-oxford text-oxford px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-oxford hover:text-white transition-all min-h-[48px] touch-manipulation"
              >
                Author Guidelines
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 bg-white">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-oxford mb-6 sm:mb-8">Explore More</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Aims & Scope", href: "/journal/aims-scope" },
              { label: "Editorial Board", href: "/journal/editorial-board" },
              { label: "Peer Review", href: "/journal/peer-review" },
              { label: "Archives", href: "/journal/archives" },
            ].map((link) => (
              <Link key={link.href} to={link.href} className="bg-white p-4 sm:p-6 border border-black/5 hover:border-gold/30 transition-all group min-h-[48px] touch-manipulation flex items-center">
                <h4 className="font-bold text-oxford group-hover:text-gold transition-colors text-sm sm:text-base">{link.label}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
});

export default JournalAbout;
