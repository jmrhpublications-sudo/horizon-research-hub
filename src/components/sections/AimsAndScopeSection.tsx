import { memo } from "react";
import { motion } from "framer-motion";
import { Target, BookOpen, BookCopy, Info, CheckCircle2 } from "lucide-react";

const aims = [
  "Mentor scholars in producing high-quality academic research.",
  "Maintain rigorous peer-review and ethical publishing standards.",
  "Encourage interdisciplinary and socially relevant research.",
  "Support emerging researchers through structured academic guidance.",
  "Ensure transparent and equitable scholarly communication.",
];

const disciplines = [
  { name: "Commerce & Management" },
  { name: "Economics & Finance" },
  { name: "Education & Psychology" },
  { name: "Social Sciences & Humanities" },
  { name: "Science & Technology" },
  { name: "Environmental & Sustainability" },
  { name: "Digital Transformation & Innovation" },
];

const AimsAndScopeSection = memo(() => {
  return (
    <section id="scope" className="py-24 md:py-32 bg-bg-alt relative overflow-hidden font-ui">
      {/* Cinematic Background Architectural Lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-oxford" />
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-oxford" />
      </div>

      <div className="container max-w-[1800px] mx-auto px-6 lg:px-10 relative z-10">

        {/* Header Matrix */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24 max-w-4xl mx-auto space-y-8"
        >
          <div className="section-label justify-center">
            <span className="w-12 h-[1px] bg-gold" />
            Scholarly Directives
            <span className="w-12 h-[1px] bg-gold" />
          </div>
          <h2 className="section-title">
            Aims and <span className="italic academic-underline px-2">Research Scope</span>
          </h2>
          <p className="text-oxford/40 font-serif italic text-xl md:text-2xl leading-relaxed">
            "Directing original research that integrates multi-disciplinary rigor to
            address contemporary academic and societal challenges."
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 xl:gap-32">

          {/* Strategic Aims (Left) */}
          <div className="lg:col-span-5 space-y-16">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-oxford flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-700 shadow-2xl">
                <Target className="w-6 h-6 text-gold -rotate-45 group-hover:-rotate-90 transition-transform duration-700" strokeWidth={1} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-3xl font-black text-oxford tracking-tighter italic">Strategic Directives</h3>
                <p className="text-[10px] uppercase tracking-[0.4em] text-teal font-black">Institutional Aims</p>
              </div>
            </div>

            <div className="space-y-6">
              {aims.map((aim, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="p-8 bg-white border border-black/5 shadow-sm hover:shadow-2xl hover:border-gold/20 transition-all duration-700 flex items-start gap-8 group"
                >
                  <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center shrink-0 mt-1 transition-all group-hover:bg-gold group-hover:border-gold">
                    <CheckCircle2 className="w-4 h-4 text-teal group-hover:text-white transition-colors" strokeWidth={2} />
                  </div>
                  <p className="font-serif italic text-oxford/60 text-lg leading-relaxed group-hover:text-oxford transition-colors uppercase tracking-tight font-medium">
                    {aim}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Publication Matrix (Right) */}
          <div className="lg:col-span-7 space-y-16">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 border border-gold flex items-center justify-center rounded-full group-hover:bg-gold transition-all duration-700">
                <BookOpen className="w-6 h-6 text-teal group-hover:text-white transition-colors" strokeWidth={1} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-3xl font-black text-oxford tracking-tighter italic">Scholarly Domains</h3>
                <p className="text-[10px] uppercase tracking-[0.4em] text-teal font-black">Call for Disciplines</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {disciplines.map((discipline, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
                  className="discipline-card group"
                >
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-oxford group-hover:text-gold transition-all">
                    {discipline.name}
                  </span>
                  <div className="relative">
                    <BookCopy className="w-5 h-5 text-gold opacity-10 group-hover:opacity-100 transition-all duration-700" strokeWidth={1} />
                    <motion.div
                      className="absolute inset-0 bg-gold blur-lg opacity-0 group-hover:opacity-20"
                      initial={false}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Institutional Compliance Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16 bg-oxford p-12 relative overflow-hidden flex flex-col md:flex-row gap-10 items-center border border-white/5 shadow-3xl"
            >
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold/10 -mr-24 -mt-24 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

              <div className="w-20 h-20 bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0">
                <Info className="w-10 h-10 text-gold" strokeWidth={1} />
              </div>

              <div className="space-y-4 relative z-10 text-center md:text-left">
                <h4 className="font-serif italic text-3xl text-gold font-normal tracking-tight">Institutional Directive</h4>
                <p className="text-[11px] font-sans leading-loose text-white/50 uppercase tracking-[0.2em] font-medium max-w-2xl">
                  JMRH follows ISSN India compliance standards, prioritizing verifiable, high-impact interdisciplinary research
                  that undergoes rigorous scholarly vetting and quality enhancement.
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
});

export default AimsAndScopeSection;
