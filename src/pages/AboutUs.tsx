import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const AboutUs = memo(() => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead 
        title="About Us | JMRH Publications"
        description="Learn about JMRH Publications - an independent academic publishing platform committed to promoting high-quality scholarly communication."
        canonical="/about-us"
      />
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">About Us</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            About JMRH Publications
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12 space-y-12">
            {/* Introduction */}
            <div>
              <p className="text-oxford/70 leading-relaxed text-lg">
                JMRH Publications is an independent academic publishing platform committed to promoting high-quality scholarly communication across multidisciplinary domains. The publishing initiative supports researchers, academicians, professionals, and research scholars by providing structured platforms for journal publication, edited volumes, academic books, and conference proceedings.
              </p>
              <p className="text-oxford/70 leading-relaxed mt-4">
                JMRH Publications operates with a strong emphasis on academic integrity, transparency, and ethical publishing practices. The organization aims to foster intellectual exchange and contribute meaningfully to global research dissemination.
              </p>
            </div>

            {/* Mission */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Mission</h2>
              <ul className="space-y-4">
                {[
                  "To provide a credible and structured platform for multidisciplinary research publication",
                  "To promote ethical and transparent scholarly communication",
                  "To support emerging researchers and academic innovation",
                  "To encourage interdisciplinary collaboration and knowledge exchange"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 p-4 bg-oxford/5">
                    <span className="w-6 h-6 rounded-full bg-gold text-white flex items-center justify-center text-sm font-bold flex-shrink-0">✓</span>
                    <span className="text-oxford/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vision */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Vision</h2>
              <p className="text-oxford/70 leading-relaxed text-lg">
                To become a recognized academic publishing platform that promotes research excellence, integrity, and meaningful contribution to global knowledge development.
              </p>
            </div>

            {/* Publishing Ethics */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Publishing Ethics</h2>
              <p className="text-oxford/70 leading-relaxed mb-4">
                JMRH Publications is committed to maintaining the highest standards of academic and publication ethics. The publisher expects authors, editors, reviewers, and contributors to adhere to responsible research and publication practices. All submissions are evaluated for originality, academic rigor, and ethical compliance.
              </p>
              <p className="text-oxford/70 font-bold mb-2">The organization strictly prohibits:</p>
              <ul className="space-y-2 mb-4">
                {["Plagiarism and self-plagiarism", "Data fabrication or falsification", "Duplicate submissions", "Misrepresentation of authorship", "Unethical research practices"].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 p-2 bg-red-50">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <span className="text-oxford/80">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-oxford/70">Transparency, fairness, and editorial independence are central to the publishing process.</p>
            </div>

            {/* Legal Registration */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Legal Registration</h2>
              <p className="text-oxford/70 leading-relaxed mb-4">
                JMRH Publications operates as an independent academic publishing initiative based in Tamil Nadu, India.
              </p>
              <div className="bg-oxford/5 p-6 border border-black/5">
                <p className="text-oxford/70 font-bold">MSME Registered</p>
                <p className="text-oxford/60 mt-2">
                  The publishing entity is registered under <strong>MSME (Micro, Small & Medium Enterprises), Government of India</strong>.
                </p>
                <p className="text-oxford/50 mt-4 text-sm">
                  All publications are issued in compliance with applicable publishing and bibliographic standards, including ISBN and ISSN registration requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default AboutUs;
