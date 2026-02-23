import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Mail } from "lucide-react";

const JournalEditorialBoard = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Editorial Board | Journal of Multidisciplinary Research Horizon"
        description="Meet the editorial board of JMRH journal led by Dr. Karthick B, Assistant Professor."
        canonical="/journal/editorial-board"
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
            <span className="text-gold">Editorial Board</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Editorial Board
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            {/* Editor-in-Chief */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-8 pb-4 border-b border-gold/20">Editor-in-Chief</h2>
              <div className="bg-gold/5 p-8 border border-gold/10">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-24 h-24 bg-oxford flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl font-serif text-gold font-bold">KB</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-bold text-oxford mb-2">Dr. Karthick B</h3>
                    <p className="text-oxford/60 mb-4">Assistant Professor, Department of Computer Science</p>
                    <p className="text-oxford/60 mb-4">Government Arts and Science College, India</p>
                    <a 
                      href="mailto:editor.jmrh@gmail.com" 
                      className="inline-flex items-center gap-2 text-gold hover:text-oxford transition-colors"
                    >
                      <Mail size={16} />
                      editor.jmrh@gmail.com
                    </a>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gold/10">
                  <p className="text-oxford/70 leading-relaxed">
                    The Editor-in-Chief is responsible for maintaining academic integrity, editorial independence, quality standards, and ethical compliance of the journal. All editorial decisions are made independently and are based solely on scholarly merit.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Board Members */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Editorial Advisory Board</h2>
              <div className="bg-oxford/5 p-6">
                <p className="text-oxford/70 leading-relaxed">
                  Additional Editorial Board members, along with institutional affiliations, will be published upon final confirmation.
                </p>
                <p className="text-oxford/50 mt-4">
                  Interested experts may contact the editor for potential board membership.
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

export default JournalEditorialBoard;
