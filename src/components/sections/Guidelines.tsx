import { memo } from "react";
import { motion } from "framer-motion";
import { ListChecks, FileEdit, Clock, Scale, BookOpen, AlertCircle, Rocket } from "lucide-react";
import { fadeIn, staggerContainer } from "@/hooks/use-scroll-animation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Guidelines = memo(() => {
    return (
        <section id="guidelines" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="space-y-16"
                >
                    {/* Header */}
                    <motion.div variants={fadeIn} className="text-center max-w-3xl mx-auto space-y-4">
                        <p className="section-label text-gold">Academic Submission</p>
                        <h2 className="section-title text-charcoal text-4xl lg:text-5xl leading-tight">
                            Author <span className="italic">Guidelines</span>
                        </h2>
                        <p className="text-charcoal/60 text-lg leading-relaxed font-sans">
                            Clarity, professionalism, and academic rigor are expected in all submissions.
                            Please follow the guidelines strictly to ensure smooth processing.
                        </p>
                    </motion.div>

                    {/* Guidelines Tabs */}
                    <motion.div variants={fadeIn} className="max-w-5xl mx-auto">
                        <Tabs defaultValue="preparation" className="w-full">
                            <TabsList className="w-full justify-start border-b border-charcoal/5 h-auto p-0 bg-transparent gap-8 overflow-x-auto no-scrollbar">
                                <TabsTrigger value="preparation" className="font-serif italic text-lg px-0 pb-4 border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:text-charcoal transition-all bg-transparent rounded-none whitespace-nowrap">
                                    Manuscript Preparation
                                </TabsTrigger>
                                <TabsTrigger value="formatting" className="font-serif italic text-lg px-0 pb-4 border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:text-charcoal transition-all bg-transparent rounded-none whitespace-nowrap">
                                    Formatting Standards
                                </TabsTrigger>
                                <TabsTrigger value="process" className="font-serif italic text-lg px-0 pb-4 border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:text-charcoal transition-all bg-transparent rounded-none whitespace-nowrap">
                                    Submission Process
                                </TabsTrigger>
                            </TabsList>

                            <div className="py-12">
                                <TabsContent value="preparation" className="space-y-10 animate-fade-in focus-visible:outline-none">
                                    <div className="grid md:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <h4 className="font-serif text-2xl text-charcoal flex items-center gap-3">
                                                <FileEdit className="w-6 h-6 text-gold" />
                                                Originality First
                                            </h4>
                                            <p className="text-charcoal/60 font-sans leading-relaxed">
                                                JMRH encourages original, unpublished research. Every manuscript must be the
                                                result of primary or secondary inquiry that contributes new insights to
                                                contemporary academic challenges.
                                            </p>
                                        </div>
                                        <div className="space-y-6">
                                            <h4 className="font-serif text-2xl text-charcoal flex items-center gap-3">
                                                <AlertCircle className="w-6 h-6 text-gold" />
                                                Ethical Clearance
                                            </h4>
                                            <p className="text-charcoal/60 font-sans leading-relaxed">
                                                Authors must ensure that their research adheres to institutional and
                                                international ethical standards. Proper informed consent and data
                                                confidentiality are mandatory.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-8 bg-cream border-l-4 border-gold italic font-serif text-charcoal">
                                        " Language should be firm, academic, and transparent. Manuscripts not meeting basic
                                        scholarly standards will be returned for revision before peer review. "
                                    </div>
                                </TabsContent>

                                <TabsContent value="formatting" className="space-y-8 animate-fade-in focus-visible:outline-none">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            "APA / MLA Citations (consistency required)",
                                            "Line Spacing: 1.5 with 12pt Times New Roman",
                                            "Abstract: 150-250 words with Keywords",
                                            "Tables & Figures: Numbered and Captioned",
                                            "Reference List: Alphabetical order",
                                            "Heading Levels: Clearly differentiated"
                                        ].map((style, idx) => (
                                            <div key={idx} className="flex items-center gap-4 bg-cream/30 p-4 border border-charcoal/5">
                                                <div className="w-2 h-2 bg-gold rotate-45" />
                                                <span className="font-sans text-sm text-charcoal/80">{style}</span>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="process" className="space-y-8 animate-fade-in focus-visible:outline-none">
                                    <div className="flex flex-col md:flex-row gap-8 items-stretch">
                                        <div className="flex-1 bg-charcoal p-8 text-cream space-y-4 group hover:bg-gold hover:text-charcoal transition-all duration-700">
                                            <h4 className="font-serif italic text-xl text-gold group-hover:text-charcoal transition-colors">1. Submit Manuscript</h4>
                                            <p className="text-sm font-sans text-cream/60 group-hover:text-charcoal/80 transition-colors">Email your manuscript in .doc or .docx format to our official editorial email.</p>
                                            <div className="pt-4">
                                                <span className="text-xs uppercase tracking-widest text-gold group-hover:text-charcoal font-bold transition-colors">editorial@jmrh.org</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-white border border-charcoal/10 p-8 space-y-4 shadow-xl">
                                            <h4 className="font-serif italic text-xl text-charcoal">2. Peer Review</h4>
                                            <p className="text-sm font-sans text-charcoal/60">Double-blind review process takes 4-6 weeks for initial decision.</p>
                                            <Clock className="w-8 h-8 text-gold" />
                                        </div>
                                        <div className="flex-1 bg-cream p-8 space-y-4">
                                            <h4 className="font-serif italic text-xl text-charcoal">3. Publication</h4>
                                            <p className="text-sm font-sans text-charcoal/60">Final refined manuscript is published in the upcoming monthly issue.</p>
                                            <Rocket className="w-8 h-8 text-gold" />
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
});

export default Guidelines;
