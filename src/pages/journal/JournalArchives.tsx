import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const JournalArchives = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Archives | Journal of Multidisciplinary Research Horizon"
        description="Browse the archives of JMRH journal - past issues and published articles."
        canonical="/journal/archives"
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
            <span className="text-gold">Archives</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Archives
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📁</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4">Past Issues Archive</h2>
              <p className="text-oxford/60 mb-8">
                All published issues will be permanently archived on the journal website.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="font-serif text-xl font-bold text-oxford mb-6">Archive Organization</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "By Volume",
                  "By Issue",
                  "By Month",
                  "By Year"
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-oxford/5 border border-black/5">
                    <span className="text-oxford/70 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 p-6 bg-gold/5 border border-gold/10">
              <h3 className="font-serif text-lg font-bold text-oxford mb-4">Article Availability</h3>
              <p className="text-oxford/70 mb-4">
                Each article will be available as an individual PDF with complete bibliographic details.
              </p>
              <p className="text-oxford/50">
                All published content will remain permanently accessible online.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default JournalArchives;
