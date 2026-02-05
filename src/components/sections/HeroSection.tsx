import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = memo(() => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background pt-20 overflow-hidden">
      {/* Background - Pristine White */}\n      <div className="absolute inset-0 bg-background" />\n

      <div className="container mx-auto px-6 lg:px-12 py-20 relative z-10">
        <div className="space-y-12 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-4 border-b border-gold/40 pb-3">
              <BookOpen className="w-4 h-4 text-gold" />
              <span className="section-label">
                Publication Portal</span>
              <span className="w-1.5 h-1.5 bg-gold rotate-45" />
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-6xl font-bold text-oxford tracking-tighter leading-[0.9] select-none"
          >
            Journal of
            <br />
            <span className="italic relative academic-underline py-2">
              Multidisciplinary
            </span>
            <br />
            Research Horizon
          </motion.h1>

          {/* Tagline / Purpose */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-6"
          >
            <p className="font-serif italic text-2xl md:text-3xl text-teal max-w-3xl mx-auto leading-relaxed">
              Advancing Research. Mentoring Scholars. Upholding Academic Integrity.
            </p>
            <p className="font-sans text-text-muted text-lg max-w-2xl mx-auto leading-[1.8] tracking-wide">
              Established to strengthen the quality, integrity, and impact of multidisciplinary research
              by guiding researchers toward publication-ready scholarship.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6 font-ui"
          >
            <Button asChild className="rounded-none px-12 h-14 bg-oxford text-white hover:bg-teal transition-all duration-500 shadow-2xl">
              <Link to="/contact">Submit Your Manuscript</Link>
            </Button>

            <Link to="/about" className="group text-oxford font-bold tracking-widest text-xs uppercase flex items-center gap-2 hover:text-gold transition-colors">
              Explore Research Support
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Link>
          </motion.div>

          {/* Highlight Blocks */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-20 border-t border-border"
          >
            {[
              { label: "Frequency", value: "Monthly Issue" },
              { label: "Standard", value: "Double-Blind Review" },
              { label: "Access", value: "Open Access Portal" },
              { label: "Compliance", value: "UGC & COPE Ethics" }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2 text-center group">
                <p className="section-label group-hover:text-teal transition-colors font-ui">{stat.label}</p>
                <p className="font-serif italic text-oxford text-lg">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
});

export default HeroSection;
