import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { FileText, Mail } from "lucide-react";

const JournalGuidelines = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Author Guidelines | Journal of Multidisciplinary Research Horizon"
        description="Submit your manuscript to JMRH. Learn about submission requirements, manuscript preparation, and formatting guidelines."
        canonical="/journal/guidelines"
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
            <span className="text-gold">Author Guidelines</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Author Guidelines
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            {/* Submission Requirements */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Submission Requirements</h2>
              <p className="text-oxford/70 leading-relaxed mb-6">
                Authors must ensure that manuscripts:
              </p>
              <ul className="space-y-3">
                {[
                  "Are original and unpublished",
                  "Are not under consideration elsewhere",
                  "Comply with ethical research standards"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-oxford/5">
                    <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <span className="text-oxford/80">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-gold/5 border border-gold/10">
                <div className="flex items-center gap-3">
                  <Mail className="text-gold w-5 h-5" />
                  <span className="text-oxford/70">Submission Email: </span>
                  <a href="mailto:submit.jmrh@gmail.com" className="text-gold font-bold">submit.jmrh@gmail.com</a>
                </div>
              </div>
            </div>

            {/* Manuscript Preparation */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Manuscript Preparation</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: "File Format", value: "MS Word (.doc/.docx)" },
                  { label: "Font", value: "Times New Roman" },
                  { label: "Font Size", value: "12 pt (body), 14 pt (headings)" },
                  { label: "Line Spacing", value: "Double" },
                  { label: "Margins", value: "1 inch (A4 size)" },
                  { label: "Reference Style", value: "APA 7th Edition" }
                ].map((item, index) => (
                  <div key={index} className="p-4 border border-black/5">
                    <span className="text-xs uppercase tracking-widest text-oxford/40">{item.label}</span>
                    <p className="text-oxford font-medium mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Manuscript Structure */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Manuscript Structure</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Title Page",
                  "Abstract (150–250 words)",
                  "3–5 Keywords",
                  "Introduction",
                  "Review of Literature",
                  "Research Methodology",
                  "Results and Discussion",
                  "Conclusion and Recommendations",
                  "References"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-oxford/5">
                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center font-bold">{index + 1}</span>
                    <span className="text-oxford/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* APC */}
            <div className="bg-oxford text-white p-8">
              <h2 className="font-serif text-2xl font-bold mb-4">Article Processing Charge (APC)</h2>
              <p className="text-white/70 mb-4">
                An APC of <strong>₹750 (INR)</strong> is applicable only after acceptance.
              </p>
              <p className="text-white/60 text-sm">
                The APC covers: Editorial processing, Peer review management, Copyediting and formatting, Online publication and archiving. Payment of APC does not influence editorial decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default JournalGuidelines;
