import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const BooksPublished = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Published Books | JMRH Publications"
        description="Browse published books from JMRH Publications with ISBN registration."
        canonical="/books/published"
      />
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-oxford/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Published Books</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Published Books
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📚</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4">Coming Soon</h2>
              <p className="text-oxford/60 mb-8">
                Published books will be displayed here once available.
              </p>
              <p className="text-oxford/50">
                Each published book will include Book Title, Editor(s)/Author(s), ISBN Number, Publication Year, Brief Description, Table of Contents, and Download/Purchase Link (if applicable).
              </p>
            </div>

            <div className="mt-12 p-6 bg-gold/5 border border-gold/10">
              <h3 className="font-serif text-lg font-bold text-oxford mb-4">Submit Your Book</h3>
              <p className="text-oxford/70 mb-6">
                Academicians and researchers interested in publishing a book with JMRH Publications are invited to submit a detailed book proposal.
              </p>
              <Link 
                to="/books/proposal"
                className="inline-flex items-center gap-2 bg-oxford text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-oxford transition-all"
              >
                Submit Book Proposal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default BooksPublished;
