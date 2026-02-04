import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer } from "@/hooks/use-scroll-animation";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-cream pt-20 overflow-hidden">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3F%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <div className="container mx-auto px-6 lg:px-12 py-20 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-10 max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeIn} className="flex justify-center">
            <div className="inline-flex items-center gap-3 border-b border-gold/40 pb-2">
              <span className="w-1.5 h-1.5 bg-gold rotate-45" />
              <span className="section-label text-gold tracking-[0.3em]">Institutional Hub</span>
              <span className="w-1.5 h-1.5 bg-gold rotate-45" />
            </div>
          </motion.div>

          {/* Main Title with Mask Reveal */}
          <div className="space-y-4">
            <motion.h1
              variants={fadeIn}
              className="font-serif text-6xl md:text-7xl lg:text-[7rem] xl:text-[8rem] font-normal text-charcoal tracking-tighter leading-[0.95] md:leading-[0.9]"
            >
              Journal of
              <br />
              <span className="italic text-charcoal-light relative">
                Multidisciplinary
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-[1px] bg-gold/30"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                />
              </span>
              <br />
              Research Horizon
            </motion.h1>
          </div>

          {/* Tagline / Purpose */}
          <motion.div variants={fadeIn} className="space-y-6">
            <p className="font-serif italic text-xl md:text-2xl text-gold/80 max-w-3xl mx-auto leading-relaxed">
              Advancing Research. Mentoring Scholars. Upholding Academic Integrity.
            </p>
            <p className="font-sans text-charcoal/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed tracking-wide">
              Established to strengthen the quality, integrity, and impact of multidisciplinary research
              by guiding researchers toward publication-ready scholarship.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
          >
            <Button variant="hero" size="xl" className="rounded-none px-12 group relative overflow-hidden bg-charcoal text-cream border border-charcoal hover:text-charcoal shadow-2xl transition-all duration-500">
              <span className="relative z-10">Submit Your Manuscript</span>
              <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </Button>

            <Button variant="ghost" size="xl" className="group text-charcoal font-serif italic text-lg hover:bg-transparent">
              Explore Research Support
              <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Button>
          </motion.div>

          {/* Highlight Blocks (Monthly | Open Access | Double-Blind) */}
          <motion.div
            variants={fadeIn}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-charcoal/5"
          >
            <div className="space-y-1 text-center border-r border-charcoal/5 last:border-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Frequency</p>
              <p className="font-serif italic text-charcoal">Monthly Issue</p>
            </div>
            <div className="space-y-1 text-center border-r border-charcoal/5 last:border-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Standard</p>
              <p className="font-serif italic text-charcoal">Double-Blind Peer Review</p>
            </div>
            <div className="space-y-1 text-center border-r border-charcoal/5 last:border-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Access</p>
              <p className="font-serif italic text-charcoal">Open Access Portal</p>
            </div>
            <div className="space-y-1 text-center border-r border-charcoal/5 last:border-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Compliance</p>
              <p className="font-serif italic text-charcoal">UGC & COPE Ethics</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
