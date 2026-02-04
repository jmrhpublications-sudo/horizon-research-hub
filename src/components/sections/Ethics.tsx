import { memo } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Fingerprint, Lock, ShieldCheck, FileWarning } from "lucide-react";
import { fadeIn, staggerContainer } from "@/hooks/use-scroll-animation";

const ethicalStandards = [
    { icon: Fingerprint, title: "Plagiarism Control", detail: "Strict threshold (<10%) using international plagiarism filters." },
    { icon: ShieldCheck, title: "Authorship Responsibility", detail: "Clear accountability for data and content among all listed authors." },
    { icon: Lock, title: "Reviewer Confidentiality", detail: "Protecting the anonymity and integrity of the review process." },
    { icon: ShieldAlert, title: "Editorial Independence", detail: "Decisions based solely on academic merit without commercial influence." },
    { icon: FileWarning, title: "Handling Misconduct", detail: "Transparent protocols for investigating and correcting ethical breaches." },
];

const Ethics = memo(() => {
    return (
        <section id="ethics" className="py-24 bg-charcoal text-cream overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid lg:grid-cols-2 gap-20 items-center"
                >
                    {/* Header */}
                    <motion.div variants={fadeIn} className="space-y-8">
                        <div className="space-y-4">
                            <p className="section-label text-gold">Legitimacy & Trust</p>
                            <h2 className="section-title text-cream text-4xl lg:text-5xl leading-tight">
                                Ethics & Publication <br />
                                <span className="italic">Integrity</span>
                            </h2>
                        </div>

                        <p className="text-cream/50 text-lg font-sans leading-relaxed max-w-xl">
                            JMRH strictly adheres to UGC and COPE guidelines to ensure ethical publishing practices.
                            Our commitment to research integrity is the foundation of our academic ecosystem.
                        </p>

                        <div className="p-8 border-l border-gold/40 bg-white/5 space-y-4 font-serif">
                            <p className="italic text-gold opacity-80">" Every manuscript is evaluated fairly, objectively, and confidentially to safeguard the progress of science. "</p>
                        </div>
                    </motion.div>

                    {/* Ethics Grid */}
                    <motion.div variants={fadeIn} className="bg-white/5 border border-white/10 p-10 lg:p-14 relative overflow-hidden">
                        {/* Background noise texture */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

                        <div className="relative z-10 space-y-10">
                            {ethicalStandards.map((std, idx) => (
                                <div key={idx} className="flex gap-6 group">
                                    <std.icon className="w-6 h-6 text-gold group-hover:scale-125 transition-transform duration-500" />
                                    <div className="space-y-1">
                                        <h4 className="font-serif text-lg tracking-wide text-cream group-hover:text-gold transition-colors">{std.title}</h4>
                                        <p className="text-xs text-cream/40 font-sans leading-relaxed uppercase tracking-widest">{std.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
});

export default Ethics;
