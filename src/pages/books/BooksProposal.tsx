import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Mail, CheckCircle } from "lucide-react";

const BooksProposal = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Submit Book Proposal | JMRH Publications"
        description="Submit your book proposal to JMRH Publications for academic book publishing."
        canonical="/books/proposal"
      />
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-oxford/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Submit Book Proposal</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Submit Book Proposal
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            <p className="text-oxford/70 leading-relaxed mb-8">
              Academicians and researchers interested in publishing a book with JMRH Publications are invited to submit a detailed book proposal.
            </p>

            {/* Proposal Email */}
            <div className="bg-oxford text-white p-8 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Mail className="w-8 h-8 text-gold" />
                <h2 className="font-serif text-2xl font-bold">Submit Proposal</h2>
              </div>
              <p className="text-white/70 mb-4">Proposals must be submitted via email:</p>
              <a href="mailto:submit.jmrh@gmail.com" className="text-2xl font-bold text-gold hover:text-white transition-colors">
                submit.jmrh@gmail.com
              </a>
              <p className="text-white/50 mt-4 text-sm">
                Please use the subject line format: <strong>Book Proposal – [Author/Editor Name] – [Proposed Title]</strong>
              </p>
            </div>

            {/* Proposal Requirements */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Proposal Must Include</h2>
              <div className="space-y-3">
                {[
                  "Proposed Book Title",
                  "Name(s) of Author(s) / Editor(s)",
                  "Institutional Affiliation",
                  "Brief Author Biography",
                  "Proposed Table of Contents",
                  "Abstract / Concept Note (500–800 words)",
                  "Target Audience",
                  "Estimated Completion Timeline"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-oxford/5">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-oxford/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Process */}
            <div className="bg-gold/5 p-6 border border-gold/10">
              <h3 className="font-serif text-lg font-bold text-oxford mb-4">Editorial Evaluation</h3>
              <p className="text-oxford/70">
                All proposals will undergo editorial evaluation before approval. Publication timelines vary depending on manuscript volume and review requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default BooksProposal;
