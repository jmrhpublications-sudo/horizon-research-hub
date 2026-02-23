import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const JournalOpenAccess = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Open Access Policy | Journal of Multidisciplinary Research Horizon"
        description="JMRH follows a full open-access publishing model under CC BY-NC license."
        canonical="/journal/open-access"
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
            <span className="text-gold">Open Access</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Open Access Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            <p className="text-oxford/70 leading-relaxed mb-8">
              JMRH follows a <strong>full open-access publishing model</strong>. All published articles are freely accessible online without subscription or access fees.
            </p>

            <div className="bg-gold/5 p-6 border border-gold/10 mb-8">
              <h3 className="font-serif text-lg font-bold text-oxford mb-4">Creative Commons License</h3>
              <p className="text-oxford/70">
                Articles are published under a <strong>Creative Commons Attribution-NonCommercial (CC BY-NC) License</strong>
              </p>
            </div>

            <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Allowed Activities</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Read",
                "Download",
                "Copy",
                "Distribute",
                "Share"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-green-50 border border-green-100">
                  <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">✓</span>
                  <span className="text-oxford/80 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <p className="mt-8 text-oxford/60 leading-relaxed">
              All activities are permitted for <strong>non-commercial purposes</strong> with proper citation to the original author(s) and journal.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default JournalOpenAccess;
