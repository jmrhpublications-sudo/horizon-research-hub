import { motion } from "framer-motion";
import { Mail, MapPin, Clock, Phone, Send } from "lucide-react";
import { fadeIn, staggerContainer } from "@/hooks/use-scroll-animation";

const Contact = () => {
    return (
        <section id="contact" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid lg:grid-cols-2 gap-20 items-stretch"
                >
                    {/* Contact Info */}
                    <motion.div variants={fadeIn} className="space-y-12">
                        <div className="space-y-4">
                            <p className="section-label text-gold">Connect with JMRH</p>
                            <h2 className="section-title text-charcoal text-4xl lg:text-5xl leading-tight">
                                Academic <br />
                                <span className="italic italic underline decoration-gold/20 underline-offset-8">Correspondence</span>
                            </h2>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-cream flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-gold" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-serif text-xl text-charcoal">Editorial Office</h4>
                                    <p className="text-charcoal/50 text-sm font-sans leading-relaxed">
                                        JMRH Publications, Gudalur,<br />
                                        Tamil Nadu, India
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-cream flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-gold" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-serif text-xl text-charcoal">Official Email</h4>
                                    <p className="text-charcoal/50 text-sm font-sans underline decoration-gold/20">editorial@jmrh.org</p>
                                    <p className="text-charcoal/50 text-sm font-sans underline decoration-gold/20">submissions@jmrh.org</p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-cream flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5 text-gold" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-serif text-xl text-charcoal">Office Hours</h4>
                                    <p className="text-charcoal/50 text-sm font-sans">Mon - Fri: 09:00 - 17:00 IST</p>
                                    <p className="text-charcoal/50 text-[10px] uppercase tracking-widest text-gold font-bold">Closed on Public Holidays</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact form-style Institutional Box */}
                    <motion.div
                        variants={fadeIn}
                        className="bg-charcoal p-10 lg:p-14 border border-charcoal/5 relative shadow-2xl space-y-8"
                    >
                        <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">Reach Out</p>
                            <h3 className="font-serif text-3xl text-cream italic">Academic Inquiry</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2 pb-4 border-b border-white/10">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-cream/40 font-bold">Full Name</label>
                                <input type="text" className="w-full bg-transparent border-none text-cream focus:ring-0 p-0 font-serif italic text-lg placeholder:text-cream/20" placeholder="Enter your full name" />
                            </div>
                            <div className="space-y-2 pb-4 border-b border-white/10">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-cream/40 font-bold">Institutional Email</label>
                                <input type="email" className="w-full bg-transparent border-none text-cream focus:ring-0 p-0 font-serif italic text-lg placeholder:text-cream/20" placeholder="yourname@institution.edu" />
                            </div>
                            <div className="space-y-2 pb-12 border-b border-white/10">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-cream/40 font-bold">Inquiry Message</label>
                                <textarea className="w-full bg-transparent border-none text-cream focus:ring-0 p-0 font-serif italic text-lg placeholder:text-cream/20 resize-none h-24" placeholder="How can our editorial board assist you?" />
                            </div>
                        </div>

                        <button className="w-full bg-gold text-charcoal py-4 px-8 text-xs uppercase tracking-[0.2em] font-bold hover:bg-cream transition-colors duration-500 flex items-center justify-center gap-3">
                            Send Correspondence <Send className="w-4 h-4" />
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
