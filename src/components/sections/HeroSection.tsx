import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Sparkles, ShieldCheck, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = memo(() => {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center bg-white pt-20 overflow-hidden font-ui">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-gold/5 via-transparent to-transparent opacity-40 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Moving Particles (CSS only for perf) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle, #1f385aff 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="container mx-auto px-6 lg:px-12 py-20 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Text Content */}
          <div className="lg:col-span-7 space-y-12 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="inline-flex items-center gap-4 bg-oxford/5 px-6 py-2 border-l-4 border-gold group cursor-default"
            >
              <Sparkles className="w-4 h-4 text-gold animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-oxford/60 group-hover:text-gold transition-colors">
                Scholarly Excellence Repository 2026
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="font-serif text-5xl md:text-7xl lg:text-5xl font-black text-oxford tracking-tighter leading-[0.85]">
                Horizon <br />
                <span className="italic text-gold perspective-1000 inline-block hover:rotate-x-12 transition-transform duration-700">Research</span> <br />
                <span className="text-teal underline decoration-black/5 underline-offset-8">Hub.</span>
              </h1>
              <p className="font-serif italic text-xl md:text-2xl text-oxford/40 max-w-2xl leading-relaxed">
                "Where multidisciplinary rigor meets global scholarly vision."
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-sans text-oxford/60 text-lg max-w-xl leading-loose tracking-wide border-l border-black/5 pl-8"
            >
              Directing the next generation of researchers toward publication-ready scholarship through expert mentoring and peer-reviewed excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-10 pt-8"
            >
              <Button asChild className="group h-16 px-10 rounded-none bg-oxford text-white hover:bg-gold hover:text-white transition-all duration-700 shadow-[0_15px_30px_rgba(10,37,64,0.1)] relative overflow-hidden">
                <Link to="/submit-paper" className="relative z-10 flex items-center justify-center gap-4 text-xs font-black tracking-[0.2em] uppercase">
                  <span className="relative z-10 flex items-center gap-3">
                    Transmit Manuscript <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                  <span aria-hidden className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Link>
              </Button>

              <Link to="/archives" className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-black text-oxford/40 hover:text-teal transition-all">
                <div className="w-12 h-[1px] bg-black/5 group-hover:w-16 transition-all group-hover:bg-teal" />
                Explore Archives
              </Link>
            </motion.div>
          </div>

          {/* Graphical/3D Element (Abstract Journal Stack) */}
          <div className="lg:col-span-5 hidden lg:block relative perspective-2000">
            <motion.div
              initial={{ opacity: 0, rotateY: -30, scale: 0.9 }}
              animate={{ opacity: 1, rotateY: -15, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="relative w-full aspect-[4/5] bg-white border border-black/5 shadow-[50px_50px_100px_rgba(0,0,0,0.05)] p-12 flex flex-col justify-between preserve-3d"
            >
              {/* Visual Journal Cover Design */}
              <div className="space-y-8">
                <div className="w-16 h-1 bg-gold" />
                <h2 className="font-serif text-4xl font-bold text-oxford leading-none">JMRH<br />Volume 04<br />Issue 01</h2>
                <div className="space-y-4">
                  <div className="w-full h-1 bg-black/5" />
                  <div className="w-2/3 h-1 bg-black/5" />
                  <div className="w-full h-1 bg-black/5" />
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-black tracking-widest text-teal uppercase">Scholarly Matrix</p>
                  <p className="text-[10px] font-black tracking-widest text-oxford/20 uppercase">ISSN Pending</p>
                </div>
                <BookOpen className="text-gold" size={48} strokeWidth={1} />
              </div>

              {/* Layered Effect for "Book" feel */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 -z-10 border border-black/5 bg-white shadow-xl" />
              <div className="absolute inset-0 translate-x-8 translate-y-8 -z-20 border border-black/5 bg-white shadow-xl" />
            </motion.div>

            {/* Floating Info Badges */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 p-6 bg-white border border-black/5 shadow-2xl flex items-center gap-4 z-20"
            >
              <ShieldCheck className="text-teal" size={24} />
              <p className="text-[10px] font-black tracking-widest text-oxford uppercase">Double-Blind<br />Peer Review</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-10 p-6 bg-oxford border border-black/5 shadow-2xl flex items-center gap-4 z-20"
            >
              <Globe className="text-gold" size={24} />
              <p className="text-[10px] font-black tracking-widest text-white uppercase">Global Impact<br />Indexing 2025</p>
            </motion.div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-32 mt-32 border-t border-black/5">
          {[
            { icon: ShieldCheck, label: "Integrity", desc: "COPE Compliant Protocols" },
            { icon: Zap, label: "Efficiency", desc: "45-Day Decision Cycle" },
            { icon: Globe, label: "Visibility", desc: "Open Access Dissemination" },
            { icon: BookOpen, label: "Support", desc: "Manuscript Pre-flight Mentoring" }
          ].map((feature, idx) => (
            <div key={idx} className="space-y-4 group">
              <div className="w-12 h-12 bg-oxford/5 flex items-center justify-center group-hover:bg-gold transition-colors duration-500">
                <feature.icon className="w-5 h-5 text-oxford group-hover:text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal">{feature.label}</p>
                <p className="font-serif italic text-oxford/60 text-sm mt-1">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
