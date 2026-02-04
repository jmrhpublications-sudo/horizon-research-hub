import { motion } from "framer-motion";
import { Target, BookOpen, BookCopy, Info, CheckCircle2 } from "lucide-react";
import { fadeIn, staggerContainer } from "@/hooks/use-scroll-animation";

const aims = [
  "Mentor scholars in producing high-quality academic research.",
  "Maintain rigorous peer-review and ethical publishing standards.",
  "Encourage interdisciplinary and socially relevant research.",
  "Support emerging researchers through structured academic guidance.",
  "Ensure transparent and equitable scholarly communication.",
];

const disciplines = [
  { name: "Commerce & Management", color: "bg-blue-50" },
  { name: "Economics & Finance", color: "bg-green-50" },
  { name: "Education & Psychology", color: "bg-purple-50" }, // This is bg color for variety, text/brand will still be charcoal/gold
  { name: "Social Sciences & Humanities", color: "bg-orange-50" },
  { name: "Science & Technology", color: "bg-cyan-50" },
  { name: "Environmental & Sustainability", color: "bg-emerald-50" },
  { name: "Digital Transformation & Innovation", color: "bg-indigo-50" },
];

const AimsAndScopeSection = () => {
  return (
    <section id="scope" className="py-24 bg-cream/30 relative">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <p className="section-label text-gold mb-4">Academic clarity</p>
          <h2 className="section-title text-charcoal">
            Aims and <span className="italic italic underline decoration-gold/20 underline-offset-8">Scope</span>
          </h2>
          <p className="mt-6 text-charcoal/60 font-sans leading-relaxed">
            JMRH encourages original, unpublished research that integrates multiple academic
            disciplines and contributes to contemporary academic and societal challenges.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Journal Aims */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-charcoal flex items-center justify-center rotate-45">
                <Target className="w-5 h-5 text-gold -rotate-45" />
              </div>
              <h3 className="font-serif text-2xl text-charcoal uppercase tracking-wider">Our Aims</h3>
            </div>

            <ul className="space-y-6">
              {aims.map((aim, index) => (
                <motion.li key={index} variants={fadeIn} className="flex items-start gap-4 p-4 border-l border-gold/10 hover:border-gold hover:bg-white transition-all duration-500">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <p className="font-serif italic text-charcoal text-lg">{aim}</p>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Publication Scope */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border border-gold flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif text-2xl text-charcoal uppercase tracking-wider">Research Focus</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {disciplines.map((discipline, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="p-5 bg-white border border-charcoal/5 flex items-center justify-between group hover:shadow-xl transition-all duration-500"
                >
                  <span className="font-serif text-charcoal group-hover:italic transition-all">
                    {discipline.name}
                  </span>
                  <BookCopy className="w-4 h-4 text-gold/30 group-hover:text-gold transition-colors" />
                </motion.div>
              ))}
            </div>

            <div className="p-6 bg-charcoal text-cream flex items-start gap-4 mt-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 -mr-12 -mt-12 rounded-full blur-2xl" />
              <Info className="w-5 h-5 text-gold shrink-0 mt-1" />
              <p className="text-sm font-sans leading-relaxed text-cream/70 relative z-10">
                JMRH follows ISSN India compliance standards, prioritizing verifiable, high-impact interdisciplinary research.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AimsAndScopeSection;
