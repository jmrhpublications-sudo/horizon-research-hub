import { memo } from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import { pageSEO } from "@/lib/seo-data";
import { CreditCard, FileCheck, Globe, ShieldCheck } from "lucide-react";

const JournalAPC = memo(() => {
  return (
    <PageShell {...pageSEO.journalAPC} canonical="/journal/apc">
      <section className="py-8 sm:py-16 bg-gradient-to-b from-oxford/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/journal/about" className="hover:text-gold transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-gold">APC</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-oxford mb-4 sm:mb-6">
            Article Processing Charges
          </h1>
        </div>
      </section>

      <section className="py-8 sm:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-black/5 p-5 sm:p-8 md:p-12">
            <div className="bg-oxford text-white p-5 sm:p-8 mb-8 sm:mb-12">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-white/60 text-xs sm:text-sm uppercase tracking-widest mb-1 sm:mb-2">Article Processing Charge</p>
                  <h2 className="font-serif text-3xl sm:text-4xl font-black text-gold">₹650 <span className="text-white/60 text-base sm:text-lg font-normal">(INR)</span></h2>
                  <p className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">Per accepted manuscript</p>
                </div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gold/20 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-gold" />
                </div>
              </div>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">APC Policy</h2>
            <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
              {["Charged only after acceptance", "Does not influence editorial decision", "Covers peer review, copyediting, formatting, online publication and archiving"].map((point, index) => (
                <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-oxford/5">
                  <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-oxford/80 text-sm sm:text-base">{point}</span>
                </div>
              ))}
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">What the APC Covers</h2>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {[
                { icon: ShieldCheck, title: "Peer Review", desc: "Rigorous double-blind peer review by subject experts" },
                { icon: FileCheck, title: "Copyediting", desc: "Professional language editing and formatting" },
                { icon: Globe, title: "Online Publication", desc: "Publication on our open-access platform" },
                { icon: Globe, title: "Archiving", desc: "Long-term digital preservation and archiving" }
              ].map((item, index) => (
                <div key={index} className="p-4 sm:p-6 border border-black/5">
                  <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-gold mb-3 sm:mb-4" />
                  <h3 className="font-bold text-oxford mb-1 sm:mb-2 text-sm sm:text-base">{item.title}</h3>
                  <p className="text-oxford/60 text-xs sm:text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-gold/5 p-4 sm:p-6 border border-gold/10">
              <h3 className="font-bold text-oxford mb-2 text-sm sm:text-base">Important Note</h3>
              <p className="text-oxford/70 text-xs sm:text-sm">
                The APC is charged only after a manuscript is accepted for publication. Payment does not guarantee acceptance - all editorial decisions are based solely on scholarly merit.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
});

export default JournalAPC;
