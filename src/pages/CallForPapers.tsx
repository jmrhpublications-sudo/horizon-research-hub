import { memo } from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import { pageSEO } from "@/lib/seo-data";
import { CheckCircle, Mail } from "lucide-react";

const CallForPapers = memo(() => {
  return (
    <PageShell {...pageSEO.callForPapers} canonical="/call-for-papers">
      <section className="py-8 sm:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Call for Papers</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-oxford mb-4 sm:mb-6">
            Call for Papers
          </h1>
          <p className="text-base sm:text-lg text-oxford/60">
            Journal of Multidisciplinary Research Horizon (JMRH)
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-black/5 p-5 sm:p-8 md:p-12 space-y-6 sm:space-y-8">
            <p className="text-oxford/70 leading-relaxed text-sm sm:text-lg">
              The <strong>Journal of Multidisciplinary Research Horizon (JMRH)</strong> invites original and unpublished research manuscripts for its upcoming issues (2026). JMRH is an international, peer-reviewed, open-access journal dedicated to promoting high-quality multidisciplinary and interdisciplinary research.
            </p>

            <div className="bg-oxford text-white p-5 sm:p-8">
              <h2 className="font-serif text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Volume 1, Issue 1 – March 2026</h2>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  { label: "Frequency", value: "Monthly" },
                  { label: "Mode", value: "Online" },
                  { label: "Starting Year", value: "2026" },
                  { label: "Language", value: "English" }
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-white/50 text-xs sm:text-sm">{item.label}</p>
                    <p className="font-bold text-sm sm:text-xl">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">Areas of Submission</h2>
              <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                {[
                  "Commerce and Management", "Economics and Finance", "Education and Psychology",
                  "Social Sciences and Humanities", "Science and Technology",
                  "Environmental Studies", "Digital Transformation",
                  "Entrepreneurship and Innovation", "Public Policy and Governance"
                ].map((area, index) => (
                  <div key={index} className="flex items-start gap-3 p-2.5 sm:p-3 bg-oxford/5">
                    <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <span className="text-oxford/80 text-sm sm:text-base">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">Types of Manuscripts</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {["Original Research Articles", "Review Papers", "Conceptual Papers", "Case Studies"].map((type, index) => (
                  <div key={index} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-oxford/5 border border-black/5">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">{index + 1}</span>
                    <span className="text-oxford font-medium text-xs sm:text-base">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">Submission Guidelines</h2>
              <div className="space-y-2 sm:space-y-3">
                {[
                  "The manuscript is original and unpublished",
                  "The manuscript is not under consideration elsewhere",
                  "APA 7th Edition referencing style is followed",
                  "The similarity index does not exceed 10%",
                  "A plagiarism report is submitted along with the manuscript"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-2.5 sm:p-3 bg-oxford/5">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-oxford/80 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-oxford/5 p-4 sm:p-6 border border-black/5">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-oxford mb-3 sm:mb-4">Article Processing Charge (APC)</h2>
              <p className="text-oxford/70 mb-2 text-sm sm:text-base">An APC of <strong>₹650 (INR)</strong> is applicable only after acceptance.</p>
              <p className="text-oxford/50 text-xs sm:text-sm">Payment of APC does not influence editorial decisions.</p>
            </div>

            <div className="bg-oxford text-white p-5 sm:p-8">
              <h2 className="font-serif text-xl sm:text-2xl font-bold mb-4 sm:mb-6">How to Submit</h2>
              <p className="text-white/70 mb-3 sm:mb-4 text-sm sm:text-base">Manuscripts must be submitted via email:</p>
              <a href="mailto:callforpapers@jmrh.in" className="text-lg sm:text-2xl font-bold text-gold hover:text-white transition-colors break-all">
                callforpapers@jmrh.in
              </a>
              <p className="text-white/50 mt-3 sm:mt-4 text-xs sm:text-sm">
                Subject: <strong>Submission – JMRH – [Author Name] – [Short Title]</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
});

export default CallForPapers;
