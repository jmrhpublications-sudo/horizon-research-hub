import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import ReviewForm from "@/components/sections/ReviewForm";
import ReviewList from "@/components/sections/ReviewList";
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
                Journal of<br />
                <span className="text-gold">Multidisciplinary Research Horizon</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-oxford/70 font-light leading-relaxed mb-12 max-w-2xl">
                Peer-Reviewed | Open Access | Monthly | Online Journal
              </p>
              
              <p className="text-oxford/50 mb-4 max-w-xl">
                Published by: JMRH Publications
              </p>
              <p className="text-oxford/50 mb-12 max-w-xl">
                Gudalur, The Nilgiris – 643212, Tamil Nadu, India
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
                About the Journal
              </h2>
              <div className="space-y-6 text-oxford/70 leading-relaxed">
                <p>
                  The <strong>Journal of Multidisciplinary Research Horizon (JMRH)</strong> is a peer-reviewed, open-access scholarly journal dedicated to the publication of original research across multidisciplinary domains. The journal provides a platform for researchers, academicians, and professionals to disseminate scholarly work.
                </p>
                <p>
                  All manuscripts undergo a rigorous double-blind peer review process to ensure quality, originality, and academic integrity.
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
                  <span className="text-4xl font-bold text-gold">Monthly</span>
                  <p className="text-white/60 mt-2">Frequency</p>
                </div>
                <div className="bg-gold/10 p-8">
                  <span className="text-4xl font-bold text-oxford">2026</span>
                  <p className="text-oxford/60 mt-2">Starting Year</p>
                </div>
                <div className="bg-gold/10 p-8">
                  <span className="text-4xl font-bold text-oxford">₹650</span>
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

        {/* ==================== JOURNAL PARTICULARS ==================== */}
        <section className="py-24 bg-oxford/5">
          <div className="container max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-4">
                Journal Particulars
              </h2>
              <p className="text-oxford/60 max-w-2xl mx-auto">
                Key information about the Journal of Multidisciplinary Research Horizon
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Journal Title", value: "JMRH" },
                { label: "Frequency", value: "Monthly" },
                { label: "Publication Mode", value: "Online" },
                { label: "Starting Year", value: "2026" },
                { label: "Subject", value: "Multidisciplinary" },
                { label: "Language", value: "English" },
                { label: "Publisher", value: "JMRH Publications" },
                { label: "ISSN (Online)", value: "To be assigned" }
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 border border-black/5 hover:border-gold/20 transition-all">
                  <p className="text-[10px] uppercase tracking-widest text-oxford/40 mb-2">{item.label}</p>
                  <p className="text-oxford font-bold">{item.value}</p>
                </div>
              ))}
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

        {/* ==================== REVIEWS SECTION ==================== */}
        <section className="py-24 bg-oxford/5">
          <div className="container max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-4">
                What Our Authors Say
              </h2>
              <p className="text-oxford/60 max-w-2xl mx-auto">
                Reviews from researchers who have published with JMRH Publications
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <ReviewList maxReviews={5} />
              </div>
              <div>
                <ReviewForm />
              </div>
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
