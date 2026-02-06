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
    <section id="about" className="py-24 md:py-32 bg-white relative overflow-hidden font-ui">
      {/* Structural Background Accents */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-oxford/5 opacity-20 pointer-events-none" />

      <div className="container max-w-[1800px] mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-12 gap-20 xl:gap-32 items-center">

          {/* Content Matrix (Left) */}
          <div className="lg:col-span-7 space-y-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="section-label">
                <span className="w-12 h-[1px] bg-gold" />
                Institutional Foundations
              </div>
              <h2 className="section-title">
                Strengthening the Quality & <br />
                <span className="italic academic-underline">Impact of Research</span>
              </h2>
              <p className="text-oxford/40 font-serif italic text-xl md:text-2xl leading-relaxed max-w-2xl">
                "Directing the next generation of researchers toward publication-ready scholarship through expert mentoring and peer-reviewed excellence."
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              {commitments.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="space-y-6 group"
                >
                  <div className="w-14 h-14 bg-oxford/5 flex items-center justify-center group-hover:bg-gold transition-all duration-700 relative overflow-hidden">
                    <item.icon className="w-6 h-6 text-oxford group-hover:text-white relative z-10 transition-colors" strokeWidth={1} />
                    <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-serif text-2xl font-black text-oxford group-hover:tracking-tighter transition-all">{item.title}</h3>
                    <p className="font-sans text-sm text-oxford/50 leading-loose">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Institutional Monolith (Right) */}
          <div className="lg:col-span-5 relative group">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/5] bg-oxford overflow-hidden flex items-center justify-center perspective-2000"
            >
              {/* Refractive Image BG */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale opacity-10 group-hover:scale-110 group-hover:rotate-1 transition-transform duration-[3000ms]" />

              <div className="relative z-10 p-12 text-center space-y-12 border border-white/5 m-8 w-full h-[calc(100%-4rem)] flex flex-col justify-center items-center backdrop-blur-sm group-hover:border-gold/20 transition-all duration-1000">
                <motion.div
                  animate={{ rotateY: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 border border-gold/40 flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-[1500ms] preserve-3d shadow-2xl"
                >
                  <Library className="w-10 h-10 text-gold -rotate-45 group-hover:-rotate-90 transition-transform duration-[1500ms]" strokeWidth={0.5} />
                </motion.div>

                <div className="space-y-6">
                  <h3 className="font-serif italic text-2xl md:text-3xl text-white leading-relaxed font-light">" Empowering scholars to cross the frontiers of knowledge "</h3>
                  <div className="w-16 h-[1px] bg-gold mx-auto opacity-30 group-hover:w-32 transition-all duration-1000" />
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gold">Foundation Excellence</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 italic">Academic Year 2026</p>
                  </div>
                </div>
              </div>

              {/* Architectural Accents */}
              <div className="absolute top-0 right-0 w-48 h-48 border-t border-r border-gold/10 m-8 group-hover:m-4 transition-all duration-1000" />
              <div className="absolute bottom-0 left-0 w-48 h-48 border-b border-l border-gold/10 m-8 group-hover:m-4 transition-all duration-1000" />
            </motion.div>

            {/* Float Metric Badge */}
            <div className="absolute -bottom-8 -left-8 p-8 bg-white border border-black/5 shadow-3xl hidden xl:flex flex-col gap-2 z-20">
              <span className="text-[9px] font-black text-teal uppercase tracking-[0.8em]">Operational Status</span>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                <span className="text-[10px] font-bold text-oxford">Global Protocol Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
});

export default AboutSection;
