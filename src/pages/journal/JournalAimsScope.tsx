import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const JournalAimsScope = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Aims & Scope | Journal of Multidisciplinary Research Horizon"
        description="Discover the aims and scope of JMRH journal - covering commerce, economics, education, social sciences, technology, and more."
        canonical="/journal/aims-scope"
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
            <span className="text-gold">Aims & Scope</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Aims & Scope
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            {/* Aims */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Aims</h2>
              <p className="text-oxford/70 leading-relaxed mb-6">
                JMRH aims to promote the advancement of academic knowledge and practical understanding by publishing research that bridges theory, application, and policy across disciplines.
              </p>
              <p className="text-oxford/70 leading-relaxed">
                The journal encourages interdisciplinary collaboration and innovative scholarship addressing emerging global challenges.
              </p>
            </div>

            {/* Scope */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Scope</h2>
              <p className="text-oxford/70 leading-relaxed mb-6">
                The journal welcomes original research contributions including, but not limited to:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Commerce and Management",
                  "Economics and Finance",
                  "Education and Psychology",
                  "Social Sciences and Humanities",
                  "Science and Technology",
                  "Environmental Studies and Sustainability",
                  "Digital Transformation and Information Systems",
                  "Entrepreneurship and Innovation",
                  "Public Policy and Governance"
                ].map((scope, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-oxford/5">
                    <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <span className="text-oxford/80">{scope}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Types of Manuscripts */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Types of Manuscripts Accepted</h2>
              <div className="space-y-4">
                {[
                  "Original Research Articles",
                  "Review Papers",
                  "Conceptual Papers",
                  "Case Studies"
                ].map((type, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 border border-black/5">
                    <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-oxford/80 font-medium">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default JournalAimsScope;
