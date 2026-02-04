import { memo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, ShieldCheck, Globe, Library } from "lucide-react";
import { fadeIn, staggerContainer } from "@/hooks/use-scroll-animation";

const commitments = [
  {
    icon: BookOpen,
    title: "High-Quality Publishing",
    description: "Committed to publishing original, high-quality research that contributes to global knowledge.",
  },
  {
    icon: Users,
    title: "Scholarly Support",
    description: "Providing structured guidance to researchers, PhD scholars, and academicians at every stage.",
  },
  {
    icon: ShieldCheck,
    title: "Research Integrity",
    description: "Strict adherence to UGC and COPE guidelines, ensuring the highest ethical standards.",
  },
  {
    icon: Globe,
    title: "Multidisciplinary Bridge",
    description: "Connecting research theory and academic practice with real-world application across disciplines.",
  },
];

const AboutSection = memo(() => {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left: Content */}
          <motion.div variants={fadeIn} className="space-y-8">
            <div className="space-y-4">
              <p className="section-label text-gold">Academic Initiative</p>
              <h2 className="section-title text-charcoal leading-tight">
                About the Journal & <br />
                <span className="italic underline decoration-gold/20 underline-offset-8">Academic Initiative</span>
              </h2>
            </div>

            <p className="text-charcoal/70 text-lg leading-relaxed font-sans max-w-xl">
              JMRH is an academic publishing and research development platform established to
              strengthen the quality, integrity, and impact of multidisciplinary research.
              The journal serves as a bridge between research theory, academic practice, and
              real-world application.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {commitments.map((item, idx) => (
                <div key={idx} className="space-y-3 group px-4 py-6 border-l border-gold/10 hover:border-gold transition-all duration-500 bg-cream/20">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-gold" />
                    <h3 className="font-serif text-charcoal font-medium">{item.title}</h3>
                  </div>
                  <p className="text-xs text-charcoal/50 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Visual/Image Placeholder replacement */}
          <motion.div
            variants={fadeIn}
            className="relative lg:h-[600px] w-full bg-cream border border-charcoal/5 overflow-hidden flex items-center justify-center group"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale opacity-10 group-hover:scale-105 transition-transform duration-1000" />
            <div className="relative z-10 p-12 text-center space-y-6">
              <div className="w-20 h-20 border border-gold/30 mx-auto flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-1000">
                <Library className="w-8 h-8 text-gold -rotate-45 group-hover:-rotate-90 transition-transform duration-1000" />
              </div>
              <h3 className="font-serif italic text-2xl text-charcoal">"Strengthening Research Impact"</h3>
              <div className="w-12 h-[1px] bg-gold/40 mx-auto" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold">ESTABLISHED 2025</p>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-gold/40 m-4" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-gold/40 m-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

export default AboutSection;
