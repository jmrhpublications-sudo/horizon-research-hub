import { motion } from "framer-motion";
import { Target, Eye, ShieldCheck, Zap } from "lucide-react";
import { fadeIn, staggerContainer } from "@/hooks/use-scroll-animation";

const VisionMission = () => {
    return (
        <section id="vision" className="py-24 bg-charcoal text-cream relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 border border-cream/20 rounded-full -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 border border-cream/20 rounded-full -ml-32 -mb-32" />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid lg:grid-cols-2 gap-20"
                >
                    {/* Vision */}
                    <motion.div variants={fadeIn} className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 border border-gold/40 flex items-center justify-center">
                                <Eye className="w-6 h-6 text-gold" />
                            </div>
                            <h2 className="section-label text-gold tracking-[0.3em]">Our Academic Vision</h2>
                        </div>

                        <h3 className="section-title text-cream text-4xl lg:text-5xl leading-tight">
                            To become a trusted multidisciplinary <br />
                            <span className="italic">academic platform</span> that advances knowledge worldwide.
                        </h3>

                        <p className="text-cream/60 font-sans leading-relaxed text-lg max-w-xl">
                            We envision a global scholarly community where research is not just published,
                            but utilized to solve contemporary societal challenges through ethical and
                            methodologically sound development.
                        </p>
                    </motion.div>

                    {/* Mission List */}
                    <motion.div variants={fadeIn} className="space-y-12 bg-white/5 p-8 lg:p-12 border border-white/10">
                        <h4 className="font-serif italic text-2xl text-gold pb-6 border-b border-white/10">The Mission Path</h4>

                        <div className="space-y-8">
                            <div className="flex gap-6 italic group">
                                <span className="text-gold font-serif text-2xl">01</span>
                                <div>
                                    <h5 className="font-serif text-xl text-cream mb-2 group-hover:text-gold transition-colors">Scholar Mentorship</h5>
                                    <p className="text-sm text-cream/40 font-sans leading-relaxed">
                                        To mentor scholars in producing high-quality academic research that meets international standards.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 italic group">
                                <span className="text-gold font-serif text-2xl">02</span>
                                <div>
                                    <h5 className="font-serif text-xl text-cream mb-2 group-hover:text-gold transition-colors">Rigorous Standards</h5>
                                    <p className="text-sm text-cream/40 font-sans leading-relaxed">
                                        To maintain rigorous peer-review and ethical publishing standards as per COPE guidelines.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 italic group">
                                <span className="text-gold font-serif text-2xl">03</span>
                                <div>
                                    <h5 className="font-serif text-xl text-cream mb-2 group-hover:text-gold transition-colors">Interdisciplinary Impact</h5>
                                    <p className="text-sm text-cream/40 font-sans leading-relaxed">
                                        To encourage interdisciplinary research that addresses socially relevant and global challenges.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 italic group">
                                <span className="text-gold font-serif text-2xl">04</span>
                                <div>
                                    <h5 className="font-serif text-xl text-cream mb-2 group-hover:text-gold transition-colors">Academic Guidance</h5>
                                    <p className="text-sm text-cream/40 font-sans leading-relaxed">
                                        To support emerging researchers through structured and transparent academic guidance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default VisionMission;
