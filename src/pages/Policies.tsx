import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const Policies = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Policies | JMRH Publications"
        description="View publication ethics, peer review policy, plagiarism policy, open access policy, and more."
        canonical="/policies"
      />
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-oxford/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Policies</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Policies
          </h1>
          <p className="text-lg text-oxford/60">
            JMRH Publications is committed to maintaining the highest standards of academic integrity, transparency, and ethical publishing practices.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12 space-y-12">
            {/* Publication Ethics */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">1. Publication Ethics</h2>
              <p className="text-oxford/70 leading-relaxed mb-4">
                JMRH Publications adheres to recognized academic publication ethics and integrity standards. All authors, editors, reviewers, and contributors are expected to maintain ethical research and publication practices.
              </p>
              <p className="text-oxford/70 font-bold mb-4">The publisher strictly prohibits:</p>
              <ul className="space-y-2 mb-4">
                {["Plagiarism", "Self-plagiarism", "Data fabrication or falsification", "Duplicate submission", "Misrepresentation of authorship", "Undisclosed conflicts of interest", "Unethical research involving human or animal subjects"].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 p-2 bg-red-50">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <span className="text-oxford/80">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-oxford/70">Any violation may result in rejection, retraction, or notification to affiliated institutions.</p>
            </div>

            {/* Peer Review Policy */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">2. Peer Review Policy</h2>
              <p className="text-oxford/70 leading-relaxed mb-4">
                All journal manuscripts and eligible book chapters undergo an academic evaluation process.
              </p>
              <div className="bg-oxford/5 p-6">
                <h3 className="font-bold text-oxford mb-4">For Journal Submissions:</h3>
                <ul className="space-y-2 text-oxford/70">
                  <li>• Double-blind peer review</li>
                  <li>• Review by at least two independent subject experts</li>
                  <li>• Editorial decision based solely on academic merit</li>
                </ul>
              </div>
              <p className="text-oxford/70 mt-4">The typical review timeline ranges between 2–4 weeks depending on submission volume and reviewer availability.</p>
            </div>

            {/* Plagiarism Policy */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">3. Plagiarism Policy</h2>
              <p className="text-oxford/70 leading-relaxed mb-4">
                JMRH Publications maintains a strict anti-plagiarism policy. All submissions are screened using standard plagiarism detection software during the initial evaluation process.
              </p>
              <p className="text-oxford/70 font-bold mb-2">The similarity index must not exceed 10%, excluding:</p>
              <ul className="space-y-1 text-oxford/60 mb-4">
                <li>• References</li>
                <li>• Bibliography</li>
                <li>• Properly cited quotations</li>
              </ul>
            </div>

            {/* Open Access Policy */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">4. Open Access Policy</h2>
              <p className="text-oxford/70 leading-relaxed mb-4">
                JMRH Publications follows an open-access model for its journal publications. All journal articles are freely accessible online without subscription or access fees.
              </p>
              <p className="text-oxford/70">Journal articles are published under a Creative Commons Attribution-NonCommercial (CC BY-NC) License.</p>
            </div>

            {/* Copyright Policy */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">5. Copyright Policy</h2>
              <p className="text-oxford/70 leading-relaxed mb-4"><strong>For Journal Articles:</strong> Authors retain copyright of their published work. By submitting to JMRH, authors grant the publisher a non-exclusive right to publish, archive, and distribute the article electronically.</p>
              <p className="text-oxford/70"><strong>For Book Publications:</strong> Copyright terms will be defined in the publishing agreement between the author/editor and JMRH Publications.</p>
            </div>

            {/* Withdrawal Policy */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">6. Withdrawal Policy</h2>
              <p className="text-oxford/70 leading-relaxed">
                Authors may request withdrawal of a manuscript before the peer review process begins. Withdrawal requests during or after peer review must be supported by a valid and justifiable reason and receive editorial approval. Once a manuscript has been formally accepted and processed for publication, withdrawal requests may not be entertained.
              </p>
            </div>

            {/* Refund Policy */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">7. Refund Policy</h2>
              <p className="text-oxford/70 leading-relaxed mb-4">
                Article Processing Charges (APC) and Chapter Processing Charges (CPC) are payable only after acceptance.
              </p>
              <p className="text-oxford/70 font-bold mb-2">Refunds will not be issued under the following circumstances:</p>
              <ul className="space-y-2 mb-4">
                {["Withdrawal after acceptance", "Author-initiated cancellation after processing has begun", "Failure to complete revisions within stipulated timelines"].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 p-2 bg-red-50">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <span className="text-oxford/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">8. Disclaimer</h2>
              <p className="text-oxford/70 leading-relaxed mb-4">
                The views and opinions expressed in published articles, book chapters, and books are those of the respective authors and do not necessarily reflect the views of the Editorial Board or JMRH Publications.
              </p>
              <p className="text-oxford/70">The publisher is not responsible for errors or omissions in published content, consequences arising from the use of published information, or claims made by authors. Authors bear full responsibility for the accuracy and authenticity of their work.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default Policies;
