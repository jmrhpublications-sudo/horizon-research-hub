import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section id="contact" className="py-24 bg-cream-dark">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-6">
            Ready to Contribute?
          </h2>
          <p className="font-serif italic text-muted-foreground text-lg mb-8">
            Join a growing community of scholars dedicated to rigorous, impactful research.
          </p>
          <Button variant="hero" size="xl" className="rounded-sm">
            Submit Your Manuscript
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
