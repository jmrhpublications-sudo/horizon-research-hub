import { memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Send, Mail } from "lucide-react";

const CTASection = memo(() => {
  return (
    <section className="py-48 bg-oxford relative overflow-hidden font-ui">
      {/* Background Visuals */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[#0A192F]/80 mix-blend-multiply" />
        {/* Animated Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(to right, #D4AF37 1px, transparent 1px), linear-gradient(to bottom, #D4AF37 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-6xl mx-auto space-y-16"
        >
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-block"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-[1px] bg-gold/40" />
                <span className="text-[11px] uppercase tracking-[0.8em] text-gold font-black">Scholarly Invitation</span>
                <div className="w-12 h-[1px] bg-gold/40" />
              </div>
            </motion.div>

            <h2 className="font-serif text-6xl md:text-9xl text-white leading-[0.9] font-black tracking-tighter perspective-1000">
              Advance the <span className="italic text-gold block md:inline hover:rotate-x-12 transition-transform duration-700">Manuscript</span> <br />
              of Human Progress
            </h2>
          </div>

          <p className="font-serif italic text-white/40 text-2xl md:text-4xl leading-relaxed max-w-4xl mx-auto font-black px-4">
            Join an international council of researchers dedicated to
            the rigorous pursuit of truth through peer-reviewed excellence.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-12">
            <Button asChild className="group relative overflow-hidden rounded-none bg-gold text-oxford h-24 px-20 shadow-[0_30px_60px_rgba(212,175,55,0.1)] hover:bg-white hover:text-oxford transition-all duration-700">
              <Link to="/submit-paper" className="relative z-10 flex items-center justify-center gap-4 text-sm font-black tracking-[0.4em] uppercase">
                <span className="relative z-10 flex items-center gap-4">
                  Submit Research <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                </span>
                <span aria-hidden className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </Link>
            </Button>

            <Link to="/contact" className="group flex flex-col items-center gap-4 text-[10px] uppercase tracking-[0.5em] font-black text-white/30 hover:text-gold transition-all py-4">
              <span className="group-hover:translate-x-2 transition-transform flex items-center gap-3">
                Editorial Desk <Mail size={14} />
              </span>
              <div className="w-0 h-[2px] bg-gold group-hover:w-full transition-all duration-700" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Branding */}
      <div className="absolute bottom-12 right-12 opacity-[0.05] pointer-events-none">
        <span className="font-serif text-[20vw] font-black text-white italic leading-none">JMRH</span>
      </div>
    </section>
  );
});

export default CTASection;
