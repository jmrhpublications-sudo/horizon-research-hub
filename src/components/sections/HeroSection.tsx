import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Sparkles, ShieldCheck, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = memo(() => {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center bg-white pt-24 overflow-hidden font-ui">
      {/* Premium Cinematic Background Layer */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {/* Deep Field Gradient */}
        <div className="absolute top-0 right-0 w-[70%] h-full bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.06)_0%,transparent_50%)]" />
        <div className="absolute -bottom-48 -left-48 w-[800px] h-[800px] bg-teal/[0.03] blur-[150px] rounded-full" />

        {/* Moving Scholarly Protocol Lines */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(to right, #102540 1px, transparent 1px), linear-gradient(to bottom, #102540 1px, transparent 1px)`,
          backgroundSize: '120px 120px'
        }} />

        {/* Cinematic Vertical Text */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-24 opacity-10 hidden xl:flex">
          <p className="text-[9px] uppercase tracking-[1.5em] text-oxford vertical-text whitespace-nowrap">JMRH Scholarly Protocol 2026</p>
          <p className="text-[9px] uppercase tracking-[1.5em] text-oxford vertical-text whitespace-nowrap">Manuscript Intake Open</p>
        </div>
      </div>

      <div className="container max-w-[1800px] mx-auto px-6 lg:px-10 py-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">

          {/* Text Content */}
          <div className="lg:col-span-7 space-y-14">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="inline-flex items-center gap-6"
            >
              <div className="w-16 h-[1.5px] bg-gold" />
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-[10px] uppercase tracking-[0.5em] font-black text-oxford/40">
                  Scholarly Excellence Repository 2026
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-oxford tracking-tighter leading-[0.9]">
                Journal of <br />
                <span className="italic text-gold relative inline-block group">
                  Multidisciplinary
                  <motion.span
                    className="absolute -bottom-2 left-0 w-full h-[2px] bg-gold/20"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                </span> <br />
                <span className="text-teal/80">Research Hub.</span>
              </h1>
              <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-oxford/40 max-w-xl leading-relaxed">
                "Where academic rigor meets global vision—advancing knowledge through peer-reviewed excellence."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="flex flex-col sm:flex-row items-center gap-12 pt-8"
            >
              <Button asChild className="group h-16 sm:h-20 px-8 sm:px-14 rounded-none bg-oxford text-white hover:bg-gold hover:text-white transition-all duration-700 shadow-xl relative overflow-hidden">
                <Link to="/submit-paper" className="relative z-10 flex items-center justify-center gap-3 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase">
                  <span>Submit Manuscript</span>
                  <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span aria-hidden className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Link>
              </Button>

              <Link to="/archives" className="group flex flex-col items-start gap-1">
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-oxford/40 group-hover:text-teal transition-colors">Digital Archives</span>
                <div className="w-12 h-[1px] bg-black/10 group-hover:w-20 group-hover:bg-teal transition-all duration-700" />
              </Link>
            </motion.div>
          </div>

          {/* 3D Cinematic Asset */}
          <div className="lg:col-span-5 hidden lg:block relative perspective-3000">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -45 }}
              animate={{ opacity: 1, scale: 1, rotateY: -20 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/5] bg-white border border-black/5 shadow-[60px_60px_120px_rgba(0,0,0,0.08)] p-16 flex flex-col justify-between preserve-3d group hover:rotate-y-0 transition-transform duration-1000"
            >
              {/* Journal Interface Design */}
              <div className="space-y-10 group-hover:translate-z-20 transition-transform duration-1000">
                <div className="w-20 h-1.5 bg-gold" />
                <div className="space-y-4">
                  <h2 className="font-serif text-5xl font-black text-oxford leading-none tracking-tight">JMRH</h2>
                  <p className="text-[10px] font-black text-teal uppercase tracking-[0.5em]">Volume 04 / Issue 01</p>
                </div>
                <div className="space-y-4 opacity-10">
                  <div className="w-full h-1.5 bg-oxford" />
                  <div className="w-4/5 h-1.5 bg-oxford" />
                  <div className="w-full h-1.5 bg-oxford" />
                </div>
              </div>

              <div className="flex justify-between items-end group-hover:translate-z-30 transition-transform duration-1000">
                <div className="space-y-2">
                  <p className="text-[9px] font-black tracking-widest text-oxford/20 uppercase">Premium Repository</p>
                  <p className="text-[9px] font-black tracking-widest text-teal uppercase">Verified Indexing</p>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Globe className="text-gold/30" size={64} strokeWidth={0.5} />
                </motion.div>
              </div>

              {/* Stack Accumulation Effect */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 -z-10 border border-black/5 bg-white shadow-xl opacity-60" />
              <div className="absolute inset-0 translate-x-8 translate-y-8 -z-20 border border-black/5 bg-white shadow-xl opacity-30" />
            </motion.div>

            {/* Float Badges */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-12 p-8 bg-white border border-black/5 shadow-4xl backdrop-blur-xl z-20 flex items-center gap-5"
            >
              <div className="w-12 h-12 bg-teal flex items-center justify-center">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.3em] text-oxford uppercase">Double-Blind</p>
                <p className="text-[9px] text-oxford/40 font-bold uppercase tracking-widest mt-0.5">Peer Review</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Cinematic Metric Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-32 mt-32 border-t border-black/5 relative">
          <div className="absolute -top-[1px] left-0 w-24 h-[1px] bg-gold" />
          {[
            { icon: ShieldCheck, label: "Integrity", desc: "COPE Protocol Compliant" },
            { icon: Zap, label: "Momentum", desc: "Digital Intake 2026 Active" },
            { icon: Globe, label: "Impact", desc: "Global Research Velocity" },
            { icon: BookOpen, label: "Scholarly", desc: "Multidisciplinary Vision" }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-6 group"
            >
              <div className="w-14 h-14 bg-oxford/5 flex items-center justify-center group-hover:bg-gold transition-all duration-700 relative overflow-hidden">
                <feature.icon className="w-6 h-6 text-oxford group-hover:text-white relative z-10 transition-colors" strokeWidth={1} />
                <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-teal">{feature.label}</p>
                  <div className="w-4 h-[1px] bg-gold/30" />
                </div>
                <p className="font-serif italic text-oxford/40 text-sm mt-2">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
