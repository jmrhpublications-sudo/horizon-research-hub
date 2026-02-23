import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { ArrowRight, BookOpen, Send, FileText, ShieldCheck, Globe, CheckCircle } from "lucide-react";

const Index = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-gold selection:text-charcoal">
      <SEOHead 
        title="JMRH Publications | Multidisciplinary Research & Academic Publishing"
        description="JMRH Publications - Advancing Knowledge Through Research & Scholarly Publishing. Peer-reviewed journals and academic book publishing."
        canonical="/"
      />
      <Header />
      
      <main className="relative">
        {/* ==================== HERO SECTION (LIGHT THEME) ==================== */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
          {/* Background - Light theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gold/5">
            {/* Decorative elements - Light */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-oxford/5 rounded-full blur-3xl" />
          </div>
          
          <div className="container max-w-[1400px] mx-auto px-6 relative z-10 py-20">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-oxford/5 border border-gold/20 mb-8">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-xs uppercase tracking-[0.3em] text-oxford font-bold">Now Accepting Submissions for 2026</span>
              </div>
              
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black text-oxford leading-[0.9] mb-8">
                Welcome to <br />
                <span className="text-gold">JMRH Publications</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-oxford/70 font-light leading-relaxed mb-12 max-w-2xl">
                Advancing Knowledge Through Research & Scholarly Publishing
              </p>
              
              <p className="text-oxford/50 mb-12 max-w-xl">
                JMRH Publications is committed to promoting high-quality research dissemination through peer-reviewed journals and academic book publishing.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/journal/submit"
                  className="inline-flex items-center gap-3 bg-oxford text-white px-8 py-4 text-xs uppercase tracking-widest font-black hover:bg-gold hover:text-oxford transition-all shadow-lg"
                >
                  <Send size={16} />
                  Submit to Journal
                </Link>
                <Link 
                  to="/books/proposal"
                  className="inline-flex items-center gap-3 border border-oxford text-oxford px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-oxford hover:text-white transition-all"
                >
                  <BookOpen size={16} />
                  Submit Book Proposal
                </Link>
                <Link 
                  to="/call-for-papers"
                  className="inline-flex items-center gap-3 text-oxford/60 px-8 py-4 text-xs uppercase tracking-widest font-bold hover:text-gold transition-all"
                >
                  <FileText size={16} />
                  View Current Calls
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== ABOUT SECTION ==================== */}
        <section className="py-24 bg-white">
          <div className="container max-w-[1200px] mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-8">
                  About JMRH Publications
                </h2>
                <div className="space-y-6 text-oxford/70 leading-relaxed">
                  <p>
                    JMRH Publications is an independent academic publishing initiative based in Tamil Nadu, India. We provide a structured and ethical platform for the publication of peer-reviewed journals, edited books, academic monographs, and conference proceedings.
                  </p>
                  <p>
                    Our publishing model emphasizes:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Academic integrity",
                      "Transparent editorial processes",
                      "Ethical publication practices",
                      "Open access dissemination",
                      "Compliance with ISBN and ISSN standards"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p>
                    We are dedicated to supporting researchers, academicians, scholars, and emerging authors in disseminating meaningful scholarly contributions.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-oxford text-white p-8">
                  <span className="text-4xl font-bold text-gold">10+</span>
                  <p className="text-white/60 mt-2">Subject Areas</p>
                </div>
                <div className="bg-gold/10 p-8">
                  <span className="text-4xl font-bold text-oxford">6</span>
                  <p className="text-oxford/60 mt-2">Issues Per Year</p>
                </div>
                <div className="bg-gold/10 p-8">
                  <span className="text-4xl font-bold text-oxford">₹750</span>
                  <p className="text-oxford/60 mt-2">APC (INR)</p>
                </div>
                <div className="bg-oxford text-white p-8">
                  <Globe className="w-8 h-8 text-gold mb-2" />
                  <p className="text-white/60">Open Access</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== PUBLISHING DIVISIONS ==================== */}
        <section className="py-24 bg-oxford/5">
          <div className="container max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-4">
                Our Publishing Divisions
              </h2>
              <p className="text-oxford/60 max-w-2xl mx-auto">
                Comprehensive publishing solutions for academic research
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Journal Division */}
              <Link to="/journal/about" className="bg-white p-10 border border-black/5 hover:border-gold/30 transition-all group block">
                <div className="w-16 h-16 bg-oxford flex items-center justify-center mb-6 group-hover:bg-gold transition-colors">
                  <BookOpen className="w-8 h-8 text-gold group-hover:text-oxford transition-colors" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-oxford mb-2">Journal Division</h3>
                <p className="text-gold font-bold text-sm uppercase tracking-wider mb-4">Journal of Multidisciplinary Research Horizons</p>
                <ul className="space-y-2 text-oxford/60 mb-6">
                  <li>• Peer-Reviewed</li>
                  <li>• Open Access</li>
                  <li>• Quarterly</li>
                </ul>
                <span className="inline-flex items-center gap-2 text-oxford font-bold hover:text-gold transition-colors">
                  View Journal <ArrowRight size={16} />
                </span>
              </Link>
              
              {/* Book Division */}
              <Link to="/books/about" className="bg-white p-10 border border-black/5 hover:border-gold/30 transition-all group block">
                <div className="w-16 h-16 bg-oxford flex items-center justify-center mb-6 group-hover:bg-gold transition-colors">
                  <BookOpen className="w-8 h-8 text-gold group-hover:text-oxford transition-colors" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-oxford mb-2">Book Division</h3>
                <p className="text-gold font-bold text-sm uppercase tracking-wider mb-4">Edited Books & Academic Book Chapters</p>
                <ul className="space-y-2 text-oxford/60 mb-6">
                  <li>• ISBN Registered Publications</li>
                  <li>• Edited Volumes</li>
                  <li>• Conference Proceedings</li>
                </ul>
                <span className="inline-flex items-center gap-2 text-oxford font-bold hover:text-gold transition-colors">
                  View Books <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ==================== CURRENT ANNOUNCEMENTS ==================== */}
        <section className="py-24 bg-white">
          <div className="container max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-4">
                Current Announcements
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Call for Papers – Volume 1, Issue 1",
                  description: "Submit your original research manuscripts for the inaugural issue of JMRH.",
                  icon: "📝"
                },
                {
                  title: "Call for Book Chapters",
                  description: "Contribute chapters to upcoming edited volumes across multidisciplinary domains.",
                  icon: "📚"
                },
                {
                  title: "New Book Published",
                  description: "Check our published books section for the latest academic publications.",
                  icon: "📖"
                }
              ].map((announcement, index) => (
                <div key={index} className="p-8 bg-oxford/5 border border-black/5 hover:border-gold/20 transition-all">
                  <span className="text-4xl mb-4 block">{announcement.icon}</span>
                  <h3 className="font-serif text-xl font-bold text-oxford mb-3">{announcement.title}</h3>
                  <p className="text-oxford/60 mb-4">{announcement.description}</p>
                  <Link 
                    to="/call-for-papers"
                    className="text-gold font-bold text-sm uppercase tracking-wider hover:text-oxford transition-colors"
                  >
                    Learn More →
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                to="/call-for-chapters"
                className="inline-flex items-center gap-2 border border-oxford text-oxford px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-oxford hover:text-white transition-all"
              >
                View All Announcements
              </Link>
            </div>
          </div>
        </section>

        {/* ==================== WHY PUBLISH WITH US ==================== */}
        <section className="py-24 bg-oxford">
          <div className="container max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-black text-white mb-4">
                Why Publish With Us
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Benefits of publishing with JMRH Publications
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                "Peer-Reviewed Journal",
                "Transparent Policies",
                "Ethical Publishing Standards",
                "Open Access Model",
                "ISBN & ISSN Compliance"
              ].map((benefit, index) => (
                <div key={index} className="bg-white/5 p-6 border border-white/10 text-center hover:bg-white/10 transition-all">
                  <ShieldCheck className="w-8 h-8 text-gold mx-auto mb-4" />
                  <p className="text-white font-bold text-sm">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        <section className="py-24 bg-gold">
          <div className="container max-w-[800px] mx-auto px-6 text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
              Ready to Publish Your Research?
            </h2>
            <p className="text-oxford/70 mb-8 text-lg">
              Join researchers worldwide in sharing your scholarly contributions with the academic community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/journal/submit"
                className="inline-flex items-center gap-3 bg-oxford text-white px-8 py-4 text-xs uppercase tracking-widest font-black hover:bg-white hover:text-oxford transition-all shadow-lg"
              >
                Submit to Journal
              </Link>
              <Link 
                to="/contact"
                className="inline-flex items-center gap-3 border border-oxford text-oxford px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-oxford hover:text-white transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
});

export default Index;
