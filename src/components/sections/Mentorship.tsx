import { motion } from "framer-motion";
import { GraduationCap, FileText, Search, Database, PenTool, CheckCircle, Presentation } from "lucide-react";
import { fadeIn, staggerContainer } from "@/hooks/use-scroll-animation";

const mentorshipAreas = [
    { icon: GraduationCap, label: "PhD Proposal & Synopsis Guidance" },
    { icon: Search, label: "Research Problem & Objective Formulation" },
    { icon: Database, label: "Methodology Selection & Justification" },
    { icon: CheckCircle, label: "Data Analysis Interpretation Support" },
    { icon: FileText, label: "Journal Article Structuring & Refinement" },
    { icon: PenTool, label: "Academic Writing Improvement" },
    { icon: Presentation, label: "Publication Readiness Mentoring" },
];

const Mentorship = () => {
    return (
        <section id="mentorship" className="py-24 bg-cream relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="space-y-16"
                >
                    {/* Header */}
                    <motion.div variants={fadeIn} className="max-w-3xl">
                        <p className="section-label text-gold mb-4">The Premium Differentiator</p>
                        <h2 className="section-title text-charcoal text-4xl lg:text-5xl leading-tight mb-6">
                            Supporting Scholars <br />
                            <span className="italic">Beyond Publication</span>
                        </h2>
                        <p className="text-charcoal/60 text-lg font-sans leading-relaxed">
                            JMRH provides structured academic mentorship designed to help scholars grow professionally,
                            methodologically, and intellectually. Our approach is guidance-oriented, ethical, and
                            focused on developing independent researchers.
                        </p>
                    </motion.div>

                    {/* Mentorship Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-charcoal/10">
                        {mentorshipAreas.map((area, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeIn}
                                className="p-10 border-r border-b border-charcoal/10 last:border-r-0 lg:[&:nth-child(3n)]:border-r-0 group hover:bg-white transition-colors duration-500"
                            >
                                <div className="space-y-6">
                                    <div className="w-10 h-10 border border-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <area.icon className="w-5 h-5 text-gold" />
                                    </div>
                                    <h3 className="font-serif text-xl text-charcoal group-hover:italic transition-all uppercase tracking-wide">
                                        {area.label}
                                    </h3>
                                    <div className="w-8 h-[1px] bg-gold/30 group-hover:w-full transition-all duration-700" />
                                </div>
                            </motion.div>
                        ))}
                        {/* Final dynamic block */}
                        <motion.div
                            variants={fadeIn}
                            className="p-10 bg-charcoal text-cream flex flex-col justify-center space-y-4"
                        >
                            <h3 className="font-serif italic text-2xl text-gold">Ready for Guidance?</h3>
                            <p className="text-sm text-cream/50 font-sans leading-relaxed">
                                Connect with our academic mentors to refine your research direction and accelerate your scholarship.
                            </p>
                            <button className="text-xs uppercase tracking-[0.2em] font-bold text-gold border-b border-gold pb-1 w-fit hover:text-white hover:border-white transition-colors">
                                Connect with a Mentor
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Mentorship;
