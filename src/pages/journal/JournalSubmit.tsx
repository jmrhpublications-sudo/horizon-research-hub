import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Mail, Send, CheckCircle } from "lucide-react";

const JournalSubmit = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Submit Manuscript | Journal of Multidisciplinary Research Horizon"
        description="Submit your manuscript to JMRH. Easy submission process for researchers and academics."
        canonical="/journal/submit"
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
            <span className="text-gold">Submit</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Submit Manuscript
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            <p className="text-oxford/70 leading-relaxed mb-8">
              Submit your original and unpublished research manuscript to the Journal of Multidisciplinary Research Horizon. We welcome contributions from researchers, academicians, professionals, and scholars.
            </p>

            {/* Submission Email */}
            <div className="bg-oxford text-white p-8 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Mail className="w-8 h-8 text-gold" />
                <h2 className="font-serif text-2xl font-bold">Submission Email</h2>
              </div>
              <p className="text-white/70 mb-4">Manuscripts must be submitted via email:</p>
              <a href="mailto:submit.jmrh@gmail.com" className="text-2xl font-bold text-gold hover:text-white transition-colors">
                submit.jmrh@gmail.com
              </a>
              <p className="text-white/50 mt-4 text-sm">
                Please use the subject line format: <strong>Submission – JMRH – [Author Name] – [Short Title of Paper]</strong>
              </p>
            </div>

            {/* Submission Checklist */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Submission Checklist</h2>
              <div className="space-y-3">
                {[
                  "The manuscript is original and unpublished",
                  "The manuscript is not under consideration elsewhere",
                  "APA 7th Edition referencing style is followed",
                  "The similarity index does not exceed 10%",
                  "A plagiarism report is submitted along with the manuscript"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-oxford/5">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-oxford/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acknowledgment */}
            <div className="bg-gold/5 p-6 border border-gold/10">
              <h3 className="font-serif text-lg font-bold text-oxford mb-4">Acknowledgment</h3>
              <p className="text-oxford/70">
                An acknowledgment email will be sent within <strong>2–3 working days</strong> of submission.
              </p>
            </div>

            {/* Quick Links */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                to="/journal/guidelines"
                className="inline-flex items-center gap-2 border border-oxford text-oxford px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-oxford hover:text-white transition-all"
              >
                View Author Guidelines
              </Link>
              <Link 
                to="/call-for-papers"
                className="inline-flex items-center gap-2 bg-gold text-oxford px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-oxford hover:text-white transition-all"
              >
                View Call for Papers
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default JournalSubmit;
