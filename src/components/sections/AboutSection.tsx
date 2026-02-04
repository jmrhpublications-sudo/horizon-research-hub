import { motion } from "framer-motion";
import { Sparkles, Users, BookCheck, ShieldCheck, GraduationCap, Lightbulb } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Research Excellence",
    description: "Strengthening research skills and academic writing standards through systematic methodologies.",
  },
  {
    icon: Users,
    title: "Scholar Mentorship",
    description: "Guiding PhD scholars, postgraduates, and early-career researchers toward publication readiness.",
  },
  {
    icon: BookCheck,
    title: "Ethical Publishing",
    description: "Promoting ethical research practices aligned with UGC and COPE guidelines.",
  },
  {
    icon: ShieldCheck,
    title: "Academic Integrity",
    description: "Ensuring research originality, transparent authorship, and responsible publication.",
  },
  {
    icon: GraduationCap,
    title: "Professional Development",
    description: "One-to-one consultation for thesis structuring, proposal development, and methodology validation.",
  },
  {
    icon: Lightbulb,
    title: "Interdisciplinary Focus",
    description: "Encouraging collaboration across Commerce, Science, Humanities, and emerging digital fields.",
  },
];

const AboutSection = () => {
  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <p className="section-label mb-4">Beyond a Journal</p>
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-6">
            About <span className="italic">JMRH</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The Journal of Multidisciplinary Research Horizon (JMRH) is an educational and research-oriented academic initiative committed to nurturing scholars at every stage of their research journey. Through structured guidance and professional consultation, we elevate academic competence and publication readiness.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border hover:border-gold/30 transition-colors group"
            >
              <div className="w-12 h-12 bg-cream-dark rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors">
                <feature.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif text-lg text-charcoal mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
