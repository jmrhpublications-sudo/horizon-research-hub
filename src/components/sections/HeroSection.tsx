import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-cream pt-20">
      <div className="container mx-auto px-6 lg:px-12 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-gold/40 rounded-sm px-4 py-1.5">
            <span className="w-1.5 h-1.5 bg-gold rounded-full" />
            <span className="section-label text-gold">Est. 2025</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal text-charcoal tracking-tight leading-[1.1]">
            Scholarly
            <br />
            <span className="italic text-charcoal-light">Horizon.</span>
          </h1>

          {/* Subtitle */}
          <p className="font-serif italic text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            "To bridge the gap between theoretical inquiry and practical societal impact through rigorous, open-access scholarship."
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <Button variant="hero" size="xl" className="rounded-sm">
              Submit Manuscript
            </Button>
            <Button variant="ghost" size="xl" className="group text-charcoal">
              View Repository
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
