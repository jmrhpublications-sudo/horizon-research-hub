import { memo } from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import { pageSEO } from "@/lib/seo-data";

const JournalOpenAccess = memo(() => {
  return (
    <PageShell {...pageSEO.journalOpenAccess} canonical="/journal/open-access">
      <section className="py-8 sm:py-16 bg-gradient-to-b from-oxford/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/journal/about" className="hover:text-gold transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-gold">Open Access</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-oxford mb-4 sm:mb-6">
            Open Access Policy
          </h1>
        </div>
      </section>

      <section className="py-8 sm:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-black/5 p-5 sm:p-8 md:p-12">
            <p className="text-oxford/70 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
              JMRH follows a <strong>full open-access publishing model</strong>. All published articles are freely accessible online without subscription or access fees.
            </p>

            <div className="bg-gold/5 p-4 sm:p-6 border border-gold/10 mb-6 sm:mb-8">
              <h3 className="font-serif text-base sm:text-lg font-bold text-oxford mb-3 sm:mb-4">Creative Commons License</h3>
              <p className="text-oxford/70 text-sm sm:text-base">
                Articles are published under a <strong>Creative Commons Attribution-NonCommercial (CC BY-NC) License</strong>
              </p>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">Allowed Activities</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {["Read", "Download", "Copy", "Distribute", "Share"].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 border border-green-100">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">✓</span>
                  <span className="text-oxford/80 font-medium text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>

            <p className="mt-6 sm:mt-8 text-oxford/60 leading-relaxed text-sm sm:text-base">
              All activities are permitted for <strong>non-commercial purposes</strong> with proper citation to the original author(s) and journal.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
});

export default JournalOpenAccess;
