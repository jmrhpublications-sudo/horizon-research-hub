import { memo } from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import { pageSEO } from "@/lib/seo-data";

const JournalEthics = memo(() => {
  return (
    <PageShell {...pageSEO.journalEthics} canonical="/journal/ethics">
      <section className="py-8 sm:py-16 bg-gradient-to-b from-oxford/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/journal/about" className="hover:text-gold transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-gold">Publication Ethics</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-oxford mb-4 sm:mb-6">
            Publication Ethics
          </h1>
        </div>
      </section>

      <section className="py-8 sm:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-black/5 p-5 sm:p-8 md:p-12">
            <p className="text-oxford/70 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
              The journal strictly follows ethical publishing practices in accordance with UGC regulations and international publication standards. All authors must adhere to our publication ethics guidelines.
            </p>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-oxford mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gold/20">Publication Ethics Requirements</h2>
            
            <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
              {[
                "Plagiarism must not exceed 10%",
                "Follow UGC and COPE guidelines",
                "No duplicate submission",
                "Ethical violations will result in rejection or retraction"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-oxford/5 border border-black/5">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span className="text-oxford/80 text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-red-50 p-4 sm:p-6 border border-red-100">
              <p className="text-oxford/70 leading-relaxed text-sm sm:text-base">
                Any breach of ethical standards may result in <strong>rejection, retraction, or further action</strong> as deemed appropriate by the Editorial Board.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
});

export default JournalEthics;
