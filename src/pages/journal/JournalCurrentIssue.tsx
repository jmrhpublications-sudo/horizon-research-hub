import { memo } from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import { pageSEO } from "@/lib/seo-data";

const JournalCurrentIssue = memo(() => {
  return (
    <PageShell {...pageSEO.journalCurrentIssue} canonical="/journal/current-issue">
      <section className="py-8 sm:py-16 bg-gradient-to-b from-oxford/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/journal/about" className="hover:text-gold transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-gold">Current Issue</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-oxford mb-4 sm:mb-6">
            Current Issue
          </h1>
        </div>
      </section>

      <section className="py-8 sm:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-black/5 p-5 sm:p-8 md:p-12">
            <div className="text-center py-8 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl">📚</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-3 sm:mb-4">Volume 1, Issue 1 (2026)</h2>
              <p className="text-oxford/60 mb-6 sm:mb-8 text-sm sm:text-base">
                The current issue details will be published once the first issue is released in 2026.
              </p>
              <p className="text-oxford/50 text-sm">
                Each issue will include Volume and Issue Number, Publication Month and Year, List of Articles with Author Details, and Downloadable PDF Links.
              </p>
            </div>

            <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gold/5 border border-gold/10">
              <h3 className="font-serif text-base sm:text-lg font-bold text-oxford mb-3 sm:mb-4">Submission Open</h3>
              <p className="text-oxford/70 mb-4 sm:mb-6 text-sm sm:text-base">
                Manuscripts are accepted on a rolling basis throughout the year. Submit your research for upcoming issues.
              </p>
              <Link 
                to="/journal/submit"
                className="inline-flex items-center justify-center gap-2 bg-oxford text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-oxford transition-all min-h-[48px] touch-manipulation"
              >
                Submit Manuscript
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
});

export default JournalCurrentIssue;
