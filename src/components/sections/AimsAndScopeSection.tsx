import { motion } from "framer-motion";
import { Target, BookOpen, BookCopy, Info } from "lucide-react";

const aims = [
  "Advance scholarly knowledge through rigorous and original interdisciplinary research.",
  "Encourage the integration of diverse academic perspectives to address complex real-world challenges.",
  "Provide a credible and inclusive publication platform for both emerging scholars and established researchers.",
  "Uphold the highest standards of research ethics, transparency, and academic integrity.",
  "Promote meaningful collaboration among researchers across disciplines and institutions.",
];

const disciplines = [
  "Commerce & Management",
  "Economics & Finance",
  "Education & Psychology",
  "Social Sciences & Humanities",
  "Science & Technology",
  "Environmental Studies",
  "Digital Transformation",
];

const AimsAndScopeSection = () => {
  return (
    <section id="about" className="py-24 bg-cream-dark">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-label mb-4">Journal Foundation</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal">
            Aims and <span className="italic">Scope</span>
          </h2>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Journal Aims */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-charcoal rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-cream" />
              </div>
              <h3 className="font-serif text-2xl text-charcoal">Journal Aims</h3>
            </div>
            <ul className="space-y-5">
              {aims.map((aim, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full mt-2.5 shrink-0" />
                  <p className="text-muted-foreground leading-relaxed">{aim}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Publication Scope */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-cream border border-gold rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif text-2xl text-charcoal">Publication Scope</h3>
            </div>
            <div className="space-y-3">
              {disciplines.map((discipline, index) => (
                <motion.div
                  key={discipline}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="discipline-card group cursor-pointer"
                >
                  <span className="font-serif text-charcoal group-hover:text-gold transition-colors">
                    {discipline}
                  </span>
                  <BookCopy className="w-4 h-4 text-warm-gray group-hover:text-gold transition-colors" />
                </motion.div>
              ))}
            </div>

            {/* ISSN Notice */}
            <div className="mt-6 bg-cream rounded-lg p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-gold mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                JMRH matches ISSN India expectations by focusing on high-quality, verified interdisciplinary scholarship.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AimsAndScopeSection;
