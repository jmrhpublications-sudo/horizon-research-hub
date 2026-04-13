import { memo } from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import { pageSEO } from "@/lib/seo-data";
import { FileText, Mail } from "lucide-react";

const JournalGuidelines = memo(() => {
  return (
    <PageShell {...pageSEO.journalGuidelines} canonical="/journal/guidelines">
      <section className="py-8 sm:py-16 bg-gradient-to-b from-oxford/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/journal/about" className="hover:text-gold transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-gold">Author Guidelines</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-oxford mb-4 sm:mb-6">
            Author Guidelines
          </h1>
        </div>
      </section>

      <section className="py-8 sm:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-black/5 p-5 sm:p-8 md:p-12 space-y-8 sm:space-y-12">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">Submission Requirements</h2>
              <p className="text-oxford/70 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">Authors must ensure that manuscripts:</p>
              <ul className="space-y-2 sm:space-y-3">
                {["Are original and unpublished", "Are not under consideration elsewhere", "Comply with ethical research standards"].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-oxford/5 text-sm sm:text-base">
                    <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <span className="text-oxford/80">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gold/5 border border-gold/10">
                <div className="flex items-center gap-3 flex-wrap">
                  <Mail className="text-gold w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-oxford/70 text-sm">Submission Email: </span>
                  <a href="mailto:callforpapers@jmrh.in" className="text-gold font-bold text-sm">callforpapers@jmrh.in</a>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">Manuscript Preparation</h2>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { label: "File Format", value: "MS Word (.doc/.docx)" },
                  { label: "Font", value: "Times New Roman" },
                  { label: "Font Size", value: "12 pt (body), 14 pt (headings)" },
                  { label: "Line Spacing", value: "Double" },
                  { label: "Margins", value: "1 inch (A4 size)" },
                  { label: "Reference Style", value: "APA 7th Edition" }
                ].map((item, index) => (
                  <div key={index} className="p-3 sm:p-4 border border-black/5">
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-oxford/40">{item.label}</span>
                    <p className="text-oxford font-medium mt-1 text-sm sm:text-base">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">Manuscript Structure</h2>
              <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                {[
                  "Title Page", "Abstract (150–250 words)", "3–5 Keywords", "Introduction",
                  "Review of Literature", "Research Methodology", "Results and Discussion",
                  "Conclusion and Recommendations", "References"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2.5 sm:p-3 bg-oxford/5">
                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center font-bold flex-shrink-0">{index + 1}</span>
                    <span className="text-oxford/80 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-oxford text-white p-5 sm:p-8">
              <h2 className="font-serif text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Article Processing Charge (APC)</h2>
              <p className="text-white/70 mb-3 sm:mb-4 text-sm sm:text-base">
                An APC of <strong>₹650 (INR)</strong> is applicable only after acceptance.
              </p>
              <p className="text-white/60 text-xs sm:text-sm">
                The APC covers: Peer review, Copyediting, Formatting, Online publication and archiving. Payment of APC does not influence editorial decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
});

export default JournalGuidelines;
