import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const JournalCurrentIssue = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Current Issue | Journal of Multidisciplinary Research Horizon"
        description="View the current issue of JMRH journal."
        canonical="/journal/current-issue"
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
            <span className="text-gold">Current Issue</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Current Issue
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📚</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4">Volume 1, Issue 1 (2026)</h2>
              <p className="text-oxford/60 mb-8">
                The current issue details will be published once the first issue is released in 2026.
              </p>
              <p className="text-oxford/50">
                Each issue will include Volume and Issue Number, Publication Month and Year, List of Articles with Author Details, and Downloadable PDF Links.
              </p>
            </div>

            <div className="mt-12 p-6 bg-gold/5 border border-gold/10">
              <h3 className="font-serif text-lg font-bold text-oxford mb-4">Submission Open</h3>
              <p className="text-oxford/70 mb-6">
                Manuscripts are accepted on a rolling basis throughout the year. Submit your research for upcoming issues.
              </p>
              <Link 
                to="/journal/submit"
                className="inline-flex items-center gap-2 bg-oxford text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-oxford transition-all"
              >
                Submit Manuscript
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default JournalCurrentIssue;
