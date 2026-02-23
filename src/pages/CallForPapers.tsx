import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Mail, Calendar, CheckCircle } from "lucide-react";

const CallForPapers = memo(() => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead 
        title="Call for Papers | Journal of Multidisciplinary Research Horizon"
        description="Submit your research manuscript to JMRH - an international, peer-reviewed, open-access journal."
        canonical="/call-for-papers"
      />
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Call for Papers</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Call for Papers
          </h1>
          <p className="text-lg text-oxford/60">
            Journal of Multidisciplinary Research Horizon (JMRH)
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12 space-y-8">
            {/* Introduction */}
            <p className="text-oxford/70 leading-relaxed text-lg">
              The <strong>Journal of Multidisciplinary Research Horizon (JMRH)</strong> invites original and unpublished research manuscripts for its upcoming issues (2026). JMRH is an international, peer-reviewed, open-access journal dedicated to promoting high-quality multidisciplinary and interdisciplinary research.
            </p>

            {/* Upcoming Issue */}
            <div className="bg-oxford text-white p-8">
              <h2 className="font-serif text-2xl font-bold mb-6">Upcoming Issue</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-white/50 text-sm">Volume & Issue</p>
                  <p className="text-xl font-bold">Volume 1, Issue 1 (2026)</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Frequency</p>
                  <p className="font-bold">Bi-Monthly (Six Issues per Year)</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Mode</p>
                  <p className="font-bold">Online</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Language</p>
                  <p className="font-bold">English</p>
                </div>
              </div>
            </div>

            {/* Areas */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Areas of Submission</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Commerce and Management", "Economics and Finance", "Education and Psychology",
                  "Social Sciences and Humanities", "Science and Technology",
                  "Environmental Studies and Sustainability", "Digital Transformation and Information Systems",
                  "Entrepreneurship and Innovation", "Public Policy and Governance"
                ].map((area, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-oxford/5">
                    <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <span className="text-oxford/80">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Types */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Types of Manuscripts</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {["Original Research Articles", "Review Papers", "Conceptual Papers", "Case Studies"].map((type, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-oxford/5 border border-black/5">
                    <span className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">{index + 1}</span>
                    <span className="text-oxford font-medium">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guidelines */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Submission Guidelines</h2>
              <div className="space-y-3">
                {[
                  "The manuscript is original and unpublished", "The manuscript is not under consideration elsewhere",
                  "APA 7th Edition referencing style is followed", "The similarity index does not exceed 10%",
                  "A plagiarism report is submitted along with the manuscript"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-oxford/5">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-oxford/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* APC */}
            <div className="bg-oxford/5 p-6 border border-black/5">
              <h2 className="font-serif text-xl font-bold text-oxford mb-4">Article Processing Charge (APC)</h2>
              <p className="text-oxford/70 mb-2">An APC of <strong>₹750 (INR)</strong> is applicable only after acceptance.</p>
              <p className="text-oxford/50 text-sm">Payment of APC does not influence editorial decisions.</p>
            </div>

            {/* How to Submit */}
            <div className="bg-oxford text-white p-8">
              <h2 className="font-serif text-2xl font-bold mb-6">How to Submit</h2>
              <p className="text-white/70 mb-4">Manuscripts must be submitted via email:</p>
              <a href="mailto:submit.jmrh@gmail.com" className="text-2xl font-bold text-gold hover:text-white transition-colors">
                submit.jmrh@gmail.com
              </a>
              <p className="text-white/50 mt-4">
                Subject: <strong>Submission – JMRH – [Author Name] – [Short Title]</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default CallForPapers;
