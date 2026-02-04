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
    <section id="scope" className="py-32 bg-bg-alt relative">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 max-w-3xl mx-auto space-y-6"
        >
          <p className="section-label">Academic Clarity</p>
          <h2 className="section-title text-5xl">
            Aims and <span className="italic academic-underline py-1 px-4">Research Scope</span>
          </h2>
          <p className="text-text-muted text-lg leading-[1.8] font-sans">
            JMRH encourages original, unpublished research that integrates multiple academic
            disciplines and contributes to contemporary academic and societal challenges.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Journal Aims */}
          <div className="lg:col-span-5 space-y-12">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-oxford flex items-center justify-center rotate-45 shadow-lg">
                <Target className="w-6 h-6 text-gold -rotate-45" />
              </div>
              <h3 className="font-serif text-3xl text-oxford italic font-bold">The Strategic Aims</h3>
            </div>

            <ul className="space-y-8">
              {aims.map((aim, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-5 p-6 premium-card group"
                >
                  <CheckCircle2 className="w-6 h-6 text-teal shrink-0 mt-1 group-hover:text-gold transition-colors" />
                  <p className="font-serif italic text-oxford text-lg leading-relaxed">{aim}</p>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Publication Scope */}
          <div className="lg:col-span-7 space-y-12">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 border-2 border-gold flex items-center justify-center rounded-full">
                <BookOpen className="w-6 h-6 text-teal" />
              </div>
              <h3 className="font-serif text-3xl text-oxford italic font-bold">Call for Disciplines</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {disciplines.map((discipline, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 bg-white border border-border flex items-center justify-between group hover:border-gold hover:shadow-xl transition-all duration-500 rounded-xl"
                >
                  <span className="font-sans font-bold text-xs uppercase tracking-widest text-oxford group-hover:italic group-hover:text-teal transition-all">
                    {discipline.name}
                  </span>
                  <BookCopy className="w-4 h-4 text-gold opacity-30 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>

            <div className="p-10 bg-oxford text-white flex items-start gap-6 mt-12 relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal/10 -mr-24 -mt-24 rounded-full blur-3xl" />
              <Info className="w-8 h-8 text-gold shrink-0 mt-1" />
              <div className="space-y-4 relative z-10">
                <h4 className="font-serif italic text-2xl text-gold">Institutional Note</h4>
                <p className="text-sm font-sans leading-relaxed text-white/70 italic max-w-xl">
                  JMRH follows ISSN India compliance standards, prioritizing verifiable, high-impact interdisciplinary research
                  that undergoes rigorous scholarly vetting and quality enhancement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default AimsAndScopeSection;
