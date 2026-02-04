import { motion } from "framer-motion";
import { UserCheck, ShieldCheck, Microscope, Award } from "lucide-react";
import { fadeIn, staggerContainer } from "@/hooks/use-scroll-animation";

const criteria = [
    { icon: Award, title: "Academic Expertise", text: "Specialized knowledge in specific disciplinary fields." },
    { icon: Microscope, title: "Research Experience", text: "A proven track record of scholarly publications and inquiry." },
    { icon: ShieldCheck, title: "Ethical Commitment", text: "Strict adherence to fairness, objectivity, and confidentiality." },
];

const ReviewerCommunity = () => {
    return (
        <section id="reviewers" className="py-24 bg-cream overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid lg:grid-cols-2 gap-16 items-center"
                >
                    {/* Content */}
                    <motion.div variants={fadeIn} className="space-y-8 order-2 lg:order-1">
                        <div className="space-y-4">
                            <p className="section-label text-gold">Peer Review Excellence</p>
                            <h2 className="section-title text-charcoal text-4xl lg:text-5xl leading-tight">
                                Reviewer Community & <br />
                                <span className="italic italic underline decoration-gold/20 underline-offset-8">Academic Integrity</span>
                            </h2>
                        </div>

                        <p className="text-charcoal/70 text-lg font-sans leading-relaxed">
                            JMRH follows a rigorous double-blind peer review process, supported by a diverse
                            reviewer community. Reviewers play a vital role in safeguarding research quality
                            and academic integrity.
                        </p>

                        <div className="space-y-6 pt-4">
                            {criteria.map((item, idx) => (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="shrink-0 w-10 h-10 border border-gold/20 bg-white flex items-center justify-center group-hover:bg-gold group-hover:text-cream transition-all duration-500">
                                        <item.icon className="w-5 h-5 text-gold group-hover:text-cream" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-charcoal font-bold tracking-wide">{item.title}</h3>
                                        <p className="text-sm text-charcoal/50 font-sans">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Institutional Block */}
                    <motion.div
                        variants={fadeIn}
                        className="order-1 lg:order-2 bg-charcoal p-12 lg:p-16 border border-charcoal/5 relative overflow-hidden"
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                            <UserCheck className="w-full h-full scale-150 rotate-12 text-cream" />
                        </div>

                        <div className="relative z-10 space-y-10">
                            <div className="space-y-2">
                                <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">Standard</p>
                                <h3 className="font-serif text-3xl text-cream italic">Double-Blind Review</h3>
                            </div>

                            <div className="space-y-6 text-cream/70 font-serif italic text-xl">
                                <p className="border-l-2 border-gold pl-6">" safeguarding research quality through objective evaluation "</p>
                            </div>

                            <div className="pt-8">
                                <button className="text-xs uppercase tracking-[0.3em] font-bold text-gold hover:text-white transition-colors">
                                    Join Reviewer Board →
                                </button>
                            </div>
                        </div>

                        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-gold/20 m-8" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default ReviewerCommunity;
