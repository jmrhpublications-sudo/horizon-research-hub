import { memo } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Calendar, ExternalLink } from "lucide-react";
import { fadeIn, staggerContainer } from "@/hooks/use-scroll-animation";

const issues = [
    { volume: "Volume 1", issue: "Issue 1", date: "Jan 2025", articles: 8 },
    { volume: "Volume 1", issue: "Issue 2", date: "Feb 2025", articles: 12 },
    { volume: "Volume 1", issue: "Issue 3", date: "Mar 2025", articles: 10 },
];

const Archives = memo(() => {
    return (
        <section id="archives" className="py-24 bg-cream overflow-hidden">
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
                        <p className="section-label text-gold">ISSN: To be assigned</p>
                        <h2 className="section-title text-charcoal text-4xl lg:text-5xl leading-tight">
                            Published Issues & <br />
                            <span className="italic">Research Archive</span>
                        </h2>
                        <p className="text-charcoal/60 text-lg leading-relaxed font-sans">
                            JMRH ensures permanent open access to all published research. Explore our
                            chronological archive of multidisciplinary studies.
                        </p>
                    </motion.div>

                    {/* Archive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {issues.map((issue, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeIn}
                                className="bg-white border border-charcoal/5 p-8 space-y-6 group hover:shadow-2xl transition-all duration-700"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">{issue.date}</p>
                                        <h3 className="font-serif text-2xl text-charcoal">{issue.volume}, {issue.issue}</h3>
                                    </div>
                                    <div className="w-12 h-12 bg-cream flex items-center justify-center group-hover:bg-gold transition-colors">
                                        <FileText className="w-5 h-5 text-gold group-hover:text-cream" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 py-4 border-y border-charcoal/5">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-charcoal/30" />
                                        <span className="text-xs text-charcoal/60 uppercase tracking-widest">{issue.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Download className="w-4 h-4 text-charcoal/30" />
                                        <span className="text-xs text-charcoal/60 uppercase tracking-widest">{issue.articles} Articles</span>
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center justify-between">
                                    <button className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-charcoal hover:text-gold transition-colors">
                                        View Issue <ExternalLink className="w-3 h-3" />
                                    </button>
                                    <button className="text-xs uppercase tracking-[0.2em] font-bold text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                                        Download Full PDF
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        {/* Future Placeholder */}
                        <motion.div
                            variants={fadeIn}
                            className="border-2 border-dashed border-charcoal/10 p-8 flex flex-col items-center justify-center space-y-4 text-center opacity-40 hover:opacity-80 transition-opacity"
                        >
                            <h4 className="font-serif italic text-xl text-charcoal">Upcoming Issue</h4>
                            <p className="text-xs uppercase tracking-[0.2em]">April 2025</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
});

export default Archives;
