import { memo } from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import { pageSEO } from "@/lib/seo-data";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

const JournalPeerReview = memo(() => {
  return (
    <PageShell {...pageSEO.journalPeerReview} canonical="/journal/peer-review">
      <section className="py-8 sm:py-16 bg-gradient-to-b from-oxford/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/journal/about" className="hover:text-gold transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-gold">Peer Review</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-oxford mb-4 sm:mb-6">
            Peer Review Process
          </h1>
        </div>
      </section>

      <section className="py-8 sm:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-black/5 p-5 sm:p-8 md:p-12">
            <p className="text-oxford/70 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
              JMRH follows a structured <strong>double-blind peer review process</strong>, ensuring anonymity of both authors and reviewers.
            </p>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-gold/20">Review Stages</h2>
            
            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              {[
                { step: 1, title: "Initial Screening (Scope + Plagiarism Check)", desc: "Manuscripts are evaluated for scope alignment, formatting compliance, and plagiarism screening." },
                { step: 2, title: "Double-Blind Peer Review (Minimum 2 Reviewers)", desc: "Each manuscript is reviewed by at least two independent subject experts. Both authors and reviewers remain anonymous." },
                { step: 3, title: "Editorial Decision", desc: "The final decision is made based on the review reports." }
              ].map((item) => (
                <div key={item.step} className="p-4 sm:p-6 border border-black/5 hover:border-gold/30 transition-colors">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold flex-shrink-0 text-sm">{item.step}</div>
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-oxford mb-1 sm:mb-2">{item.title}</h3>
                      <p className="text-oxford/60 text-sm">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-gold/20">Editorial Decisions</h2>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12">
              <div className="p-3 sm:p-4 bg-green-50 border border-green-200 flex items-center gap-2 sm:gap-3">
                <CheckCircle className="text-green-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-green-800 font-medium text-sm sm:text-base">Accept</span>
              </div>
              <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 flex items-center gap-2 sm:gap-3">
                <AlertCircle className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-blue-800 font-medium text-sm sm:text-base">Minor Revision</span>
              </div>
              <div className="p-3 sm:p-4 bg-orange-50 border border-orange-200 flex items-center gap-2 sm:gap-3">
                <AlertCircle className="text-orange-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-orange-800 font-medium text-sm sm:text-base">Major Revision</span>
              </div>
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 flex items-center gap-2 sm:gap-3">
                <XCircle className="text-red-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-red-800 font-medium text-sm sm:text-base">Reject</span>
              </div>
            </div>

            <div className="bg-oxford/5 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <Clock className="text-gold w-4 h-4 sm:w-5 sm:h-5" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-oxford">Review Timeline</h3>
              </div>
              <p className="text-oxford/70 text-sm sm:text-base">
                The journal strives to complete the review process within approximately <strong>3–4 weeks</strong>, subject to reviewer availability.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
});

export default JournalPeerReview;
