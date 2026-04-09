import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { CreditCard, FileCheck, Globe, ShieldCheck } from "lucide-react";

const JournalAPC = memo(() => {
  const policyPoints = [
    "Charged only after acceptance",
    "Does not influence editorial decision",
    "Covers peer review, copyediting, formatting, online publication and archiving"
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Article Processing Charges (APC) | Journal of Multidisciplinary Research Horizon"
        description="Learn about JMRH's Article Processing Charges policy."
        canonical="/journal/apc"
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
            <span className="text-gold">APC</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Article Processing Charges
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            {/* APC Amount */}
            <div className="bg-oxford text-white p-8 mb-12">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-white/60 text-sm uppercase tracking-widest mb-2">Article Processing Charge</p>
                  <h2 className="font-serif text-4xl font-black text-gold">₹650 <span className="text-white/60 text-lg font-normal">(INR)</span></h2>
                  <p className="text-white/60 text-sm mt-2">Per accepted manuscript</p>
                </div>
                <div className="w-16 h-16 bg-gold/20 flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-gold" />
                </div>
              </div>
            </div>

            {/* Policy */}
            <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">APC Policy</h2>
            <div className="space-y-4 mb-12">
              {policyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-oxford/5">
                  <FileCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-oxford/80">{point}</span>
                </div>
              ))}
            </div>

            {/* What's Included */}
            <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">What the APC Covers</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 border border-black/5">
                <ShieldCheck className="w-8 h-8 text-gold mb-4" />
                <h3 className="font-bold text-oxford mb-2">Peer Review</h3>
                <p className="text-oxford/60 text-sm">
                  Rigorous double-blind peer review process by subject experts
                </p>
              </div>
              <div className="p-6 border border-black/5">
                <FileCheck className="w-8 h-8 text-gold mb-4" />
                <h3 className="font-bold text-oxford mb-2">Copyediting</h3>
                <p className="text-oxford/60 text-sm">
                  Professional language editing and formatting
                </p>
              </div>
              <div className="p-6 border border-black/5">
                <Globe className="w-8 h-8 text-gold mb-4" />
                <h3 className="font-bold text-oxford mb-2">Online Publication</h3>
                <p className="text-oxford/60 text-sm">
                  Publication on our open-access platform
                </p>
              </div>
              <div className="p-6 border border-black/5">
                <Globe className="w-8 h-8 text-gold mb-4" />
                <h3 className="font-bold text-oxford mb-2">Archiving</h3>
                <p className="text-oxford/60 text-sm">
                  Long-term digital preservation and archiving
                </p>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-gold/5 p-6 border border-gold/10">
              <h3 className="font-bold text-oxford mb-2">Important Note</h3>
              <p className="text-oxford/70 text-sm">
                The APC is charged only after a manuscript is accepted for publication. Payment does not guarantee acceptance - all editorial decisions are based solely on scholarly merit. Authors will receive payment instructions only after their manuscript has been accepted.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default JournalAPC;
