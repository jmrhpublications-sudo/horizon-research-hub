import { motion } from "framer-motion";
import { Coffee, Shield, Compass, Edit3, CheckCircle2 } from "lucide-react";
import { fadeIn, staggerContainer } from "@/hooks/use-scroll-animation";

const consultationPoints = [
    { icon: Compass, text: "Clarifying Research Direction" },
    { icon: Shield, text: "Strengthening Research Design" },
    { icon: Coffee, text: "Responding to Reviewer Comments" },
    { icon: Edit3, text: "Improving Manuscript Quality" },
    { icon: CheckCircle2, text: "Ethical & Plagiarism Compliance" },
];

const Consultation = () => {
    return (
        <section id="consultation" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid lg:grid-cols-12 gap-12 items-center"
                >
                    {/* Content Block */}
                    <motion.div variants={fadeIn} className="lg:col-span-7 space-y-8">
                        <div className="space-y-4">
                            <p className="section-label text-gold">One-to-One Excellence</p>
                            <h2 className="section-title text-charcoal text-4xl lg:text-5xl leading-tight">
                                Personal Academic <br />
                                <span className="italic">Consultation</span>
                            </h2>
                        </div>

                        <p className="text-charcoal/70 text-lg font-sans leading-relaxed max-w-2xl">
                            JMRH offers confidential, individualized academic consultations to address specific
                            research challenges faced by scholars and academicians. Each consultation is
                            scholarly, non-commercial, and strictly academic in nature, aimed at long-term
                            research excellence.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {consultationPoints.map((point, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-4 bg-cream/30 border border-charcoal/5 group hover:bg-white hover:shadow-xl transition-all duration-500">
                                    <point.icon className="w-4 h-4 text-gold group-hover:scale-125 transition-transform" />
                                    <span className="font-serif text-charcoal text-sm italic">{point.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Luxury Card Block */}
                    <motion.div
                        variants={fadeIn}
                        className="lg:col-span-5 bg-charcoal p-10 lg:p-12 relative overflow-hidden shadow-2xl"
                    >
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 -mr-16 -mt-16 rounded-full blur-3xl" />

                        <div className="relative z-10 space-y-8">
                            <div className="space-y-2">
                                <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">Inquiry</p>
                                <h3 className="font-serif text-3xl text-cream italic">Request Consultation</h3>
                            </div>

                            <p className="text-cream/50 text-sm font-sans leading-relaxed">
                                Connect with our editorial office to schedule a confidential session.
                                Focus on academic growth and methodological rigor.
                            </p>

                            <div className="space-y-4 pt-4 font-serif italic text-cream/80">
                                <p className="border-b border-white/10 pb-2">Academic & Strictly Research-Oriented</p>
                                <p className="border-b border-white/10 pb-2">Confidential & Individualized Sessions</p>
                                <p className="border-b border-white/10 pb-2">Non-Commercial Institutional Guidance</p>
                            </div>

                            <button className="w-full bg-gold text-charcoal py-4 px-8 text-xs uppercase tracking-[0.2em] font-bold hover:bg-cream transition-colors duration-500">
                                Book a Session
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Consultation;
