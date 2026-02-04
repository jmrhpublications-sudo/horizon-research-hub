import { memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = memo(() => {
  return (
    <section className="py-40 bg-oxford relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80')] bg-fixed bg-cover bg-center grayscale shadow-inner" />

      {/* Decorative Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-oxford via-transparent to-oxford" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center max-w-5xl mx-auto space-y-12"
        >
          <div className="space-y-6">
            <p className="section-label text-gold tracking-[0.6em]">Scholarly Contribution</p>
            <h2 className="section-title text-white text-6xl md:text-8xl leading-[1.05] font-bold">
              Refining the <span className="italic academic-underline after:bg-white/30 py-1">Scientific</span> <br />
              Frontiers of Knowledge
            </h2>
          </div>

          <p className="font-serif italic text-white/60 text-xl md:text-3xl leading-relaxed max-w-3xl mx-auto font-bold opacity-80">
            Join an international council of researchers dedicated to
            upholding the absolute integrity of scholarly inquiry.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-10 font-ui">
            <Button asChild className="rounded-none bg-gold text-oxford hover:bg-white transition-all duration-[800ms] h-16 px-16 text-xs uppercase tracking-[0.4em] font-bold shadow-2xl group">
              <Link to="/contact">
                <span className="relative z-10 group-hover:tracking-[0.5em] transition-all">Submit Manuscript</span>
              </Link>
            </Button>
            <Link to="/contact" className="text-[10px] uppercase tracking-[0.4em] font-bold text-white border-b-2 border-white/10 pb-2 hover:text-gold hover:border-gold transition-all duration-500 italic">
              Editorial Correspondence →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Elite Line Accents */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5" />
    </section>
  );
});

export default CTASection;
