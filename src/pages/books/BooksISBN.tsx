import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const BooksISBN = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="ISBN Information | JMRH Publications"
        description="Learn about ISBN registration for books published by JMRH Publications."
        canonical="/books/isbn"
      />
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-oxford/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">ISBN Information</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            ISBN Information
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            <p className="text-oxford/70 leading-relaxed mb-8">
              All approved books are published with a valid International Standard Book Number (ISBN).
            </p>

            {/* What ISBN Provides */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">What ISBN Ensures</h2>
              <div className="space-y-4">
                {[
                  "Formal identification of the publication",
                  "Academic and library catalog recognition",
                  "Standard bibliographic indexing"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gold/5 border border-gold/10">
                    <span className="w-6 h-6 rounded-full bg-gold text-white flex items-center justify-center text-sm font-bold flex-shrink-0">✓</span>
                    <span className="text-oxford/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ISBN Details */}
            <div className="bg-oxford/5 p-6">
              <h3 className="font-serif text-lg font-bold text-oxford mb-4">ISBN Display</h3>
              <p className="text-oxford/70">
                ISBN details will be clearly mentioned in each published book.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default BooksISBN;
