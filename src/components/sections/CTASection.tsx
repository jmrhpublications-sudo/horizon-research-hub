import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeIn } from "@/hooks/use-scroll-animation";

const CTASection = () => {
  return (
    <section className="py-32 bg-charcoal relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80')] bg-fixed bg-cover" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto space-y-10"
        >
          <div className="space-y-4">
            <p className="section-label text-gold tracking-[0.4em]">Final Call for Papers</p>
            <h2 className="section-title text-cream text-5xl md:text-7xl leading-tight">
              Advancing the <span className="italic uppercase tracking-tighter">Scholarly</span> Horizon
            </h2>
          </div>

          <p className="font-serif italic text-cream/60 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto">
            Join an elite global network of researchers and PhD scholars dedicated to
            upholding the highest standards of academic integrity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6">
            <Button variant="hero" size="xl" className="rounded-none bg-gold text-charcoal hover:bg-cream transition-all duration-500 px-12 group relative overflow-hidden">
              <span className="relative z-10">Submit Your Manuscript</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Button>
            <a href="#contact" className="text-xs uppercase tracking-[0.3em] font-bold text-cream border-b border-cream/20 pb-1 hover:text-gold hover:border-gold transition-all duration-300">
              Editorial Inquiry →
            </a>
          </div>
        </motion.div>
      </div>

      {/* Top and Bottom Line Accents */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10" />
    </section>
  );
};

export default CTASection;
