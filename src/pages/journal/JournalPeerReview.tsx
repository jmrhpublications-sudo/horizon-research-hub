import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

const JournalPeerReview = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Peer Review Process | Journal of Multidisciplinary Research Horizon"
        description="Learn about JMRH's rigorous double-blind peer review process."
        canonical="/journal/peer-review"
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
            <span className="text-gold">Peer Review</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Peer Review Process
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            <p className="text-oxford/70 leading-relaxed mb-8">
              JMRH follows a structured <strong>double-blind peer review process</strong>, ensuring anonymity of both authors and reviewers.
            </p>

            {/* Review Stages */}
            <h2 className="font-serif text-2xl font-bold text-oxford mb-8 pb-4 border-b border-gold/20">Review Stages</h2>
            
            <div className="space-y-6 mb-12">
              <div className="p-6 border border-black/5 hover:border-gold/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-oxford mb-2">Initial Screening</h3>
                    <p className="text-oxford/60">Manuscripts are evaluated for scope alignment, formatting compliance, and plagiarism screening.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-black/5 hover:border-gold/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-oxford mb-2">Peer Review</h3>
                    <p className="text-oxford/60">Each manuscript is reviewed by at least two independent subject experts.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-black/5 hover:border-gold/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-oxford mb-2">Editorial Decision</h3>
                    <p className="text-oxford/60">The final decision is made based on the review reports.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decision Types */}
            <h2 className="font-serif text-2xl font-bold text-oxford mb-8 pb-4 border-b border-gold/20">Editorial Decisions</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              <div className="p-4 bg-green-50 border border-green-200 flex items-start gap-3">
                <CheckCircle className="text-green-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-green-800 font-medium">Accept</span>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 flex items-start gap-3">
                <AlertCircle className="text-blue-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-blue-800 font-medium">Minor Revision</span>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 flex items-start gap-3">
                <AlertCircle className="text-orange-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-orange-800 font-medium">Major Revision</span>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 flex items-start gap-3">
                <XCircle className="text-red-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-red-800 font-medium">Reject</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-oxford/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="text-gold w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-oxford">Review Timeline</h3>
              </div>
              <p className="text-oxford/70">
                The journal strives to complete the review process within approximately <strong>3–4 weeks</strong>, subject to reviewer availability.
              </p>
              <p className="text-oxford/50 mt-4">
                Editorial decisions are based strictly on academic merit, originality, clarity, and relevance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default JournalPeerReview;
