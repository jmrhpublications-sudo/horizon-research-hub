import { motion } from "framer-motion";
import { Search, EyeOff, CheckSquare, Calendar, HelpCircle } from "lucide-react";
import { fadeIn, staggerContainer } from "@/hooks/use-scroll-animation";

const steps = [
    { icon: Search, title: "Initial Editorial Screening", text: "Evaluating scope, basic quality, and plagiarism compliance." },
    { icon: EyeOff, title: "Double-Blind Peer Review", text: "Identity of authors and reviewers are kept anonymous to remove bias." },
    { icon: CheckSquare, title: "Decision & Revision Stages", text: "Reviews evaluated by editors; authors receive detailed feedback." },
    { icon: Calendar, title: "Expected Timelines", text: "Initial decision within 4-6 weeks of submission." },
];

const ReviewPolicy = () => {
    return (
        <section id="policy" className="py-24 bg-white relative">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="space-y-16"
                >
                    {/* Header */}
                    <motion.div variants={fadeIn} className="max-w-3xl space-y-4">
                        <p className="section-label text-gold">Transparency in Evaluation</p>
                        <h2 className="section-title text-charcoal text-4xl lg:text-5xl leading-tight">
                            Double-Blind <br />
                            <span className="italic italic underline decoration-gold/20 underline-offset-8">Peer Review Process</span>
                        </h2>
                        <p className="text-charcoal/60 text-lg leading-relaxed font-sans">
                            JMRH ensures that every manuscript is evaluated fairly, objectively, and confidentially
                            through a structured review ecosystem.
                        </p>
                    </motion.div>

                    {/* Timeline / Process Steps */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeIn}
                                className="space-y-6 group"
                            >
                                <div className="w-16 h-16 bg-cream border border-charcoal/5 flex items-center justify-center group-hover:bg-gold transition-all duration-700">
                                    <step.icon className="w-6 h-6 text-gold group-hover:text-cream transition-colors" />
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-serif text-xl text-charcoal tracking-tight group-hover:italic transition-all">{step.title}</h4>
                                    <p className="text-sm text-charcoal/50 leading-relaxed font-sans">{step.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Appeal Policy Callout */}
                    <motion.div
                        variants={fadeIn}
                        className="p-10 bg-cream/50 border-r-4 border-gold flex flex-col md:flex-row gap-8 items-center justify-between"
                    >
                        <div className="space-y-2">
                            <h4 className="font-serif text-2xl text-charcoal flex items-center gap-3">
                                <HelpCircle className="w-6 h-6 text-gold" />
                                Appeal Policy
                            </h4>
                            <p className="text-charcoal/60 font-sans text-sm">Authors Have the right to appeal editorial decisions based on sound academic grounds.</p>
                        </div>
                        <button className="whitespace-nowrap bg-charcoal text-cream px-8 py-3 text-xs uppercase tracking-widest hover:bg-gold hover:text-charcoal transition-all duration-500 font-bold">
                            Read Appeal Guidelines
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default ReviewPolicy;
