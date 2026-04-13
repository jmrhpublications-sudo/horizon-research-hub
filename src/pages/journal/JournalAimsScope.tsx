import { memo } from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import { pageSEO } from "@/lib/seo-data";

const JournalAimsScope = memo(() => {
  return (
    <PageShell {...pageSEO.journalAimsScope} canonical="/journal/aims-scope">
      <section className="py-8 sm:py-16 bg-gradient-to-b from-oxford/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/journal/about" className="hover:text-gold transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-gold">Aims & Scope</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-oxford mb-4 sm:mb-6">
            Aims & Scope
          </h1>
        </div>
      </section>

      <section className="py-8 sm:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-black/5 p-5 sm:p-8 md:p-12">
            <div className="mb-8 sm:mb-12">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">Aims</h2>
              <ul className="space-y-3 sm:space-y-4 text-oxford/70 leading-relaxed text-sm sm:text-base">
                {[
                  "To advance academic knowledge through interdisciplinary research",
                  "To bridge theory and practice across multiple domains",
                  "To promote innovation and research excellence"
                ].map((aim, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <span>{aim}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8 sm:mb-12">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">Scope</h2>
              <p className="text-oxford/70 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">The journal accepts research in:</p>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  "Commerce and Management",
                  "Economics and Finance",
                  "Education and Psychology",
                  "Social Sciences and Humanities",
                  "Science and Technology",
                  "Environmental Studies and Sustainability",
                  "Digital Transformation and Information Systems",
                  "Entrepreneurship and Innovation",
                  "Policy and Governance"
                ].map((scope, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-oxford/5">
                    <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <span className="text-oxford/80 text-sm sm:text-base">{scope}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">Types of Manuscripts Accepted</h2>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {["Original Research Articles", "Review Papers", "Conceptual Papers", "Case Studies"].map((type, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 sm:p-4 border border-black/5">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-oxford/80 font-medium text-sm sm:text-base">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
});

export default JournalAimsScope;
