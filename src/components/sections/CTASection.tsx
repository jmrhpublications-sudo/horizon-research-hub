import { memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Send, Mail } from "lucide-react";

const CTASection = memo(() => {
  return (
    <section className="py-24 md:py-32 bg-[#050B14] relative overflow-hidden font-ui">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {/* Deep Gradient Mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.08)_0%,transparent_60%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal/10 blur-[120px] rounded-full opacity-30" />

        {/* Refractive Grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(to right, #D4AF37 1px, transparent 1px), linear-gradient(to bottom, #D4AF37 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }} />

        {/* Floating Scholarly Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 45, 0]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute rounded-none border border-gold/20"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
              width: `${20 + i * 10}px`,
              height: `${20 + i * 10}px`,
              borderWidth: '0.5px'
            }}
          />
        ))}
      </div>

      <div className="container max-w-[1800px] mx-auto px-6 lg:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Active Protocol Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-4 mb-12 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.5em] text-gold/80 font-bold">Manuscript Intake Protocol Active</span>
          </motion.div>

          <div className="space-y-10">
            <h2 className="font-serif text-5xl md:text-8xl lg:text-5xl font-black text-white tracking-tighter leading-[1.05]">
              Advance the <span className="italic text-gold block md:inline relative">
                Manuscript
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-[1px] bg-gold/30"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: 1 }}
                />
              </span> <br />
              of Human Progress
            </h2>

            <p className="font-serif italic text-white/50 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
              "Joining an international council of researchers dedicated to
              the rigorous pursuit of truth through peer-reviewed excellence."
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-10 pt-10">
              <Button asChild className="h-20 px-12 bg-white text-oxford rounded-none font-black tracking-[0.3em] uppercase text-xs hover:bg-gold hover:text-white transition-all duration-700 shadow-2xl group border-none relative overflow-hidden">
                <Link to="/submit-paper" className="relative z-10 flex items-center gap-4">
                  Submit Manuscript <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
                <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Button>

              <Link to="/contact" className="group flex flex-col items-center gap-2">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] font-black text-white/40 group-hover:text-gold transition-colors">
                  Editorial Desk <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="w-12 h-[1px] bg-white/10 group-hover:w-20 group-hover:bg-gold transition-all duration-700" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Micro-Copy */}
      <div className="absolute bottom-10 left-10 flex items-center gap-6 opacity-20 hidden lg:flex">
        <p className="text-[8px] uppercase tracking-[1em] text-white/40 vertical-text py-4 border-l border-white/20 whitespace-nowrap">
          Council Archive 2026
        </p>
      </div>
    </section>
  );
});

export default CTASection;
