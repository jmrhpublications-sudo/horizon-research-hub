import { memo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, ShieldCheck, Globe, Library } from "lucide-react";

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
    <section id="about" className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-20 items-center"
        >
          {/* Left: Content */}
          <div className="space-y-10">
            <div className="space-y-4">
              <p className="section-label">Institutional Core</p>
              <h2 className="section-title text-5xl leading-tight">
                Strengthening the Quality & <br />
                <span className="italic academic-underline py-1">Impact of Research</span>
              </h2>
            </div>

            <p className="text-text-muted text-lg leading-[1.8] font-sans max-w-xl">
              JMRH is an academic publishing and research development platform established to
              strengthen the quality, integrity, and impact of multidisciplinary research.
              The journal serves as a bridge between research theory, academic practice, and
              real-world application.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              {commitments.map((item, idx) => (
                <div key={idx} className="space-y-4 group p-6 premium-card border-none bg-bg-alt">
                  <div className="w-12 h-12 bg-white flex items-center justify-center rounded-lg shadow-sm group-hover:bg-gold transition-colors duration-500">
                    <item.icon className="w-6 h-6 text-teal group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-serif text-xl text-oxford leading-tight group-hover:text-teal transition-colors font-bold">{item.title}</h3>
                  <p className="text-sm text-text-subtle leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Institutional Block */}
          <div className="relative lg:h-[700px] w-full bg-oxford overflow-hidden flex items-center justify-center group rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale opacity-20 group-hover:scale-105 transition-transform duration-[2000ms]" />
            <div className="relative z-10 p-16 text-center space-y-8 border border-white/10 m-8 w-full h-[calc(100%-4rem)] flex flex-col justify-center items-center">
              <div className="w-24 h-24 border-2 border-gold/40 flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-[1500ms]">
                <Library className="w-10 h-10 text-gold -rotate-45 group-hover:-rotate-90 transition-transform duration-[1500ms]" />
              </div>
              <h3 className="font-serif italic text-3xl text-white leading-relaxed">" Empowering scholars to cross the frontiers of knowledge "</h3>
              <div className="w-20 h-[1.5px] bg-gold/50" />
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.5em] text-gold font-bold">Foundation Excellence</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-ui italic">Academic Year 2025</p>
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-gold/30 m-6" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-gold/30 m-6" />
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default AboutSection;
