import { memo } from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import ReviewForm from "@/components/sections/ReviewForm";
import ReviewList from "@/components/sections/ReviewList";
import { Send, FileText, ShieldCheck, Globe, CheckCircle } from "lucide-react";
import { pageSEO, organizationSchema, websiteSchema, periodicaSchema } from "@/lib/seo-data";

const Index = memo(() => {
  return (
    <PageShell 
      title={pageSEO.home.title}
      description={pageSEO.home.description}
      keywords={pageSEO.home.keywords}
      canonical="/"
      jsonLd={[organizationSchema, websiteSchema, periodicaSchema]}
    >
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[80vh] sm:min-h-screen flex items-center overflow-hidden bg-white -mt-20 lg:-mt-24 pt-20 lg:pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gold/5">
          <div className="absolute top-20 right-10 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 sm:left-20 w-32 sm:w-64 h-32 sm:h-64 bg-oxford/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 py-12 sm:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-oxford/5 border border-gold/20 mb-6 sm:mb-8">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-oxford font-bold">Now Accepting Submissions for 2026</span>
            </div>
            
            <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-oxford leading-[0.9] mb-6 sm:mb-8">
              Journal of<br />
              <span className="text-gold">Multidisciplinary Research Horizon</span>
            </h1>
            
            <p className="text-base sm:text-xl md:text-2xl text-oxford/70 font-light leading-relaxed mb-8 sm:mb-12 max-w-2xl">
              Peer-Reviewed | Open Access | Monthly | Online Journal
            </p>
            
            <p className="text-oxford/50 mb-2 sm:mb-4 max-w-xl text-sm sm:text-base">
              Published by: JMRH Publications
            </p>
            <p className="text-oxford/50 mb-8 sm:mb-12 max-w-xl text-sm sm:text-base">
              Gudalur, The Nilgiris – 643212, Tamil Nadu, India
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link 
                to="/journal/submit"
                className="inline-flex items-center justify-center gap-3 bg-oxford text-white px-6 sm:px-8 py-3.5 sm:py-4 text-xs uppercase tracking-widest font-black hover:bg-gold hover:text-oxford transition-all shadow-lg min-h-[48px] touch-manipulation"
              >
                <Send size={16} />
                Submit to Journal
              </Link>
              <Link 
                to="/call-for-papers"
                className="inline-flex items-center justify-center gap-3 text-oxford/60 px-6 sm:px-8 py-3.5 sm:py-4 text-xs uppercase tracking-widest font-bold hover:text-gold transition-all min-h-[48px] touch-manipulation border border-oxford/10 sm:border-0"
              >
                <FileText size={16} />
                View Current Calls
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ABOUT SECTION ==================== */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div>
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-oxford mb-6 sm:mb-8">
                About the Journal
              </h2>
              <div className="space-y-4 sm:space-y-6 text-oxford/70 leading-relaxed text-sm sm:text-base">
                <p>
                  The <strong>Journal of Multidisciplinary Research Horizon (JMRH)</strong> is a peer-reviewed, open-access scholarly journal dedicated to the publication of original research across multidisciplinary domains.
                </p>
                <p>
                  All manuscripts undergo a rigorous double-blind peer review process to ensure quality, originality, and academic integrity.
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    "Academic integrity",
                    "Transparent editorial processes",
                    "Ethical publication practices",
                    "Open access dissemination",
                    "Compliance with ISBN and ISSN standards"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gold flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-oxford text-white p-5 sm:p-8">
                <span className="text-2xl sm:text-4xl font-bold text-gold">Monthly</span>
                <p className="text-white/60 mt-1 sm:mt-2 text-sm sm:text-base">Frequency</p>
              </div>
              <div className="bg-gold/10 p-5 sm:p-8">
                <span className="text-2xl sm:text-4xl font-bold text-oxford">2026</span>
                <p className="text-oxford/60 mt-1 sm:mt-2 text-sm sm:text-base">Starting Year</p>
              </div>
              <div className="bg-gold/10 p-5 sm:p-8">
                <span className="text-2xl sm:text-4xl font-bold text-oxford">₹650</span>
                <p className="text-oxford/60 mt-1 sm:mt-2 text-sm sm:text-base">APC (INR)</p>
              </div>
              <div className="bg-oxford text-white p-5 sm:p-8">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-gold mb-2" />
                <p className="text-white/60 text-sm sm:text-base">Open Access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== JOURNAL PARTICULARS ==================== */}
      <section className="py-16 sm:py-24 bg-oxford/5">
        <div className="container max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-oxford mb-3 sm:mb-4">
              Journal Particulars
            </h2>
            <p className="text-oxford/60 max-w-2xl mx-auto text-sm sm:text-base">
              Key information about the Journal of Multidisciplinary Research Horizon
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
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
              <div key={index} className="bg-white p-4 sm:p-6 border border-black/5 hover:border-gold/20 transition-all">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-oxford/40 mb-1 sm:mb-2">{item.label}</p>
                <p className="text-oxford font-bold text-sm sm:text-base">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CURRENT ANNOUNCEMENTS ==================== */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-oxford mb-3 sm:mb-4">
              Current Announcements
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                title: "Call for Papers – Volume 1, Issue 2",
                description: "Submit your original research manuscripts for the upcoming issue of JMRH.",
                icon: "📝",
                link: "/call-for-papers"
              },
              {
                title: "Volume 1, Issue 1 Published",
                description: "Check our archives to view the first published issue of JMRH.",
                icon: "📖",
                link: "/journal/archives"
              }
            ].map((announcement, index) => (
              <div key={index} className="p-6 sm:p-8 bg-oxford/5 border border-black/5 hover:border-gold/20 transition-all">
                <span className="text-3xl sm:text-4xl mb-3 sm:mb-4 block">{announcement.icon}</span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-oxford mb-2 sm:mb-3">{announcement.title}</h3>
                <p className="text-oxford/60 mb-3 sm:mb-4 text-sm sm:text-base">{announcement.description}</p>
                <Link 
                  to={announcement.link}
                  className="text-gold font-bold text-sm uppercase tracking-wider hover:text-oxford transition-colors touch-manipulation"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY PUBLISH WITH US ==================== */}
      <section className="py-16 sm:py-24 bg-oxford">
        <div className="container max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4">
              Why Publish With Us
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base">
              Benefits of publishing with JMRH Publications
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
            {[
              "Peer-Reviewed Journal",
              "Transparent Policies",
              "Ethical Standards",
              "Open Access Model",
              "ISBN & ISSN"
            ].map((benefit, index) => (
              <div key={index} className="bg-white/5 p-4 sm:p-6 border border-white/10 text-center hover:bg-white/10 transition-all">
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-gold mx-auto mb-2 sm:mb-4" />
                <p className="text-white font-bold text-xs sm:text-sm">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== REVIEWS SECTION ==================== */}
      <section className="py-16 sm:py-24 bg-oxford/5">
        <div className="container max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-oxford mb-3 sm:mb-4">
              What Our Authors Say
            </h2>
            <p className="text-oxford/60 max-w-2xl mx-auto text-sm sm:text-base">
              Reviews from researchers who have published with JMRH Publications
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
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
      <section className="py-16 sm:py-24 bg-gold">
        <div className="container max-w-[800px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-oxford mb-4 sm:mb-6">
            Ready to Publish Your Research?
          </h2>
          <p className="text-oxford/70 mb-6 sm:mb-8 text-base sm:text-lg">
            Join researchers worldwide in sharing your scholarly contributions with the academic community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link 
              to="/journal/submit"
              className="inline-flex items-center justify-center gap-3 bg-oxford text-white px-6 sm:px-8 py-3.5 sm:py-4 text-xs uppercase tracking-widest font-black hover:bg-white hover:text-oxford transition-all shadow-lg min-h-[48px] touch-manipulation"
            >
              Submit to Journal
            </Link>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center gap-3 border border-oxford text-oxford px-6 sm:px-8 py-3.5 sm:py-4 text-xs uppercase tracking-widest font-bold hover:bg-oxford hover:text-white transition-all min-h-[48px] touch-manipulation"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
});

export default Index;
