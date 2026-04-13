import { memo } from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import { pageSEO } from "@/lib/seo-data";

const AboutUs = memo(() => {
  return (
    <PageShell {...pageSEO.aboutUs} canonical="/about-us">
      <section className="py-8 sm:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-4 sm:mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">About Us</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-oxford mb-4 sm:mb-6">
            About JMRH Publications
          </h1>
        </div>
      </section>

      <section className="py-8 sm:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-black/5 p-5 sm:p-8 md:p-12 space-y-8 sm:space-y-12">
            <div className="space-y-4 text-oxford/70 leading-relaxed text-sm sm:text-base">
              <p>
                JMRH Publications is an independent academic publishing platform committed to promoting high-quality scholarly communication across multidisciplinary domains. The publishing initiative supports researchers, academicians, professionals, and research scholars.
              </p>
              <p>
                JMRH Publications operates with a strong emphasis on academic integrity, transparency, and ethical publishing practices.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">Mission</h2>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  "To provide a credible platform for multidisciplinary research publication",
                  "To promote ethical and transparent scholarly communication",
                  "To support emerging researchers and academic innovation",
                  "To encourage interdisciplinary collaboration and knowledge exchange"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-oxford/5">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold text-white flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">✓</span>
                    <span className="text-oxford/80 text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">Vision</h2>
              <p className="text-oxford/70 leading-relaxed text-sm sm:text-lg">
                To become a recognized academic publishing platform that promotes research excellence, integrity, and meaningful contribution to global knowledge development.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">Legal Registration</h2>
              <div className="bg-oxford/5 p-4 sm:p-6 border border-black/5">
                <p className="text-oxford/70 font-bold text-sm sm:text-base">MSME Registered</p>
                <p className="text-oxford/60 mt-2 text-sm sm:text-base">
                  The publishing entity is registered under <strong>MSME (Micro, Small & Medium Enterprises), Government of India</strong>.
                </p>
                <p className="text-oxford/50 mt-3 sm:mt-4 text-xs sm:text-sm">
                  All publications are issued in compliance with applicable publishing and bibliographic standards, including ISBN and ISSN registration requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
});

export default AboutUs;
