import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { ShieldCheck, FileCheck, Users, AlertCircle } from "lucide-react";

const JournalReviewerBoard = memo(() => {
  const responsibilities = [
    "Maintain confidentiality of manuscripts",
    "Provide unbiased and constructive evaluation",
    "Adhere to ethical review standards",
    "Declare any conflict of interest"
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Reviewer Board | Journal of Multidisciplinary Research Horizon"
        description="Learn about JMRH's reviewer board and the double-blind peer review process."
        canonical="/journal/reviewer-board"
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
            <span className="text-gold">Reviewer Board</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Reviewer Board
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            <p className="text-oxford/70 leading-relaxed mb-8">
              JMRH follows a structured double-blind peer review system supported by qualified subject experts. Our reviewer board comprises academics and researchers from various disciplines who ensure the quality and integrity of published research.
            </p>

            {/* Reviewer System Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-oxford/5 p-6">
                <div className="w-12 h-12 bg-oxford flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-serif text-lg font-bold text-oxford mb-2">Double-Blind Review</h3>
                <p className="text-oxford/60 text-sm">
                  All manuscripts undergo double-blind peer review where both reviewers and authors remain anonymous.
                </p>
              </div>
              <div className="bg-oxford/5 p-6">
                <div className="w-12 h-12 bg-oxford flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-serif text-lg font-bold text-oxford mb-2">Expert Reviewers</h3>
                <p className="text-oxford/60 text-sm">
                  Each manuscript is evaluated by minimum 2 qualified reviewers from relevant subject areas.
                </p>
              </div>
            </div>

            {/* Reviewer Responsibilities */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Reviewer Responsibilities</h2>
              <div className="space-y-4">
                {responsibilities.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border border-black/5">
                    <FileCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-oxford/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Become a Reviewer */}
            <div className="mt-12 p-6 bg-gold/5 border border-gold/10">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-gold flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-oxford mb-2">Become a Reviewer</h3>
                  <p className="text-oxford/70 text-sm mb-4">
                    Interested experts may apply to join our reviewer board. Please send your CV and area of expertise to the Editor-in-Chief.
                  </p>
                  <a href="mailto:karthik@jmrh.in" className="text-gold hover:text-oxford transition-colors text-sm font-bold">
                    Contact Editor-in-Chief →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default JournalReviewerBoard;
