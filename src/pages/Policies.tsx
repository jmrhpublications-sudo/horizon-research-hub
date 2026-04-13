import { memo } from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import { pageSEO } from "@/lib/seo-data";

const Policies = memo(() => {
  return (
    <PageShell {...pageSEO.policies} canonical="/policies">
      <section className="py-8 sm:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-4 sm:mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Policies</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-oxford mb-4 sm:mb-6">
            Policies
          </h1>
          <p className="text-base sm:text-lg text-oxford/60">
            JMRH Publications is committed to maintaining the highest standards of academic integrity, transparency, and ethical publishing practices.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-black/5 p-5 sm:p-8 md:p-12 space-y-8 sm:space-y-12">
            {/* Quick Links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-8">
              {[
                { label: "Terms", href: "/terms" },
                { label: "Privacy", href: "/privacy" },
                { label: "Copyright", href: "/copyright" },
                { label: "Refund", href: "/refund" },
              ].map((link) => (
                <Link key={link.href} to={link.href} className="p-3 sm:p-4 bg-oxford/5 border border-black/5 hover:border-gold/30 transition-all text-center min-h-[48px] flex items-center justify-center touch-manipulation">
                  <span className="text-oxford font-bold text-xs sm:text-sm">{link.label}</span>
                </Link>
              ))}
            </div>

            {[
              {
                title: "1. Publication Ethics",
                content: "JMRH Publications adheres to recognized academic publication ethics and integrity standards.",
                prohibits: ["Plagiarism", "Self-plagiarism", "Data fabrication or falsification", "Duplicate submission", "Misrepresentation of authorship"]
              },
              {
                title: "2. Peer Review Policy",
                content: "All journal manuscripts undergo double-blind peer review by at least two independent subject experts. Typical review timeline: 2–4 weeks."
              },
              {
                title: "3. Plagiarism Policy",
                content: "All submissions are screened using plagiarism detection software. Similarity index must not exceed 10%, excluding references and properly cited quotations."
              },
              {
                title: "4. Open Access Policy",
                content: "JMRH follows an open-access model. All journal articles are freely accessible online under a Creative Commons Attribution-NonCommercial (CC BY-NC) License."
              },
              {
                title: "5. Copyright Policy",
                content: "Authors retain copyright of their published work. By submitting to JMRH, authors grant the publisher a non-exclusive right to publish, archive, and distribute."
              }
            ].map((section, idx) => (
              <div key={idx}>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">{section.title}</h2>
                <p className="text-oxford/70 leading-relaxed mb-4 text-sm sm:text-base">{section.content}</p>
                {section.prohibits && (
                  <ul className="space-y-2">
                    {section.prohibits.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 p-2 bg-destructive/5">
                        <span className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                        <span className="text-oxford/80 text-sm sm:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
});

export default Policies;
