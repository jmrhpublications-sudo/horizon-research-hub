import { memo } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock, ShieldCheck, Phone } from "lucide-react";

const Contact = memo(() => {
    return (
        <section id="contact" className="py-20 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto space-y-12"
                >
                    {/* Header */}
                    <div className="text-center">
                        <p className="section-label">Contact Us</p>
                        <h2 className="section-title text-4xl">
                            Get in <span className="italic academic-underline py-1">Touch</span>
                        </h2>
                    </div>

                    {/* Editor-in-Chief */}
                    <div className="bg-oxford p-8 lg:p-10 rounded-[30px] relative shadow-xl">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

                        <div className="relative z-10 space-y-6">
                            <div className="text-center border-b border-white/10 pb-4">
                                <p className="text-[10px] uppercase tracking-[0.5em] text-gold font-bold mb-1">Editor-in-Chief</p>
                                <h3 className="font-serif text-3xl text-white italic font-bold">Dr. Karthick B</h3>
                                <p className="text-white/60 text-sm">Assistant Professor, Department of Computer Applications</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 pt-2">
                                <div className="flex gap-3">
                                    <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-white/40 text-xs uppercase mb-1">Address</p>
                                        <p className="text-white/80 text-sm">
                                            Government Arts and Science College, Gudalur<br />
                                            The Nilgiris - 643212, Tamil Nadu, India
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-white/40 text-xs uppercase mb-1">Email</p>
                                        <a href="mailto:karthik@jmrh.in" className="text-gold hover:text-white text-sm block">karthik@jmrh.in</a>
                                        <a href="mailto:editorial@jmrh.in" className="text-white/60 hover:text-gold text-sm">editorial@jmrh.in</a>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-white/40 text-xs uppercase mb-1">Phone</p>
                                        <p className="text-white/80 text-sm">+91 98765 43210</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-white/40 text-xs uppercase mb-1">Office Hours</p>
                                        <p className="text-white/80 text-sm">Mon - Fri: 09:00 - 17:00 IST</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <p className="text-white/40 text-xs uppercase mb-2">For Specific Inquiries</p>
                                <div className="flex flex-wrap gap-4">
                                    <a href="mailto:submissions@jmrh.in" className="bg-white/5 px-3 py-2 rounded text-gold hover:text-white text-sm">submissions@jmrh.in</a>
                                    <a href="mailto:info@jmrh.in" className="bg-white/5 px-3 py-2 rounded text-gold hover:text-white text-sm">info@jmrh.in</a>
                                    <a href="mailto:review@jmrh.in" className="bg-white/5 px-3 py-2 rounded text-gold hover:text-white text-sm">review@jmrh.in</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Publisher Address */}
                    <div className="bg-gold/10 p-8 lg:p-10 rounded-[30px] border border-gold/20">
                        <div className="space-y-6">
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-[0.5em] text-gold font-bold mb-1">Publisher Address</p>
                                <h3 className="font-serif text-2xl text-oxford font-bold">JMRH Publications</h3>
                            </div>

                            <div className="flex justify-center">
                                <div className="flex gap-6 text-oxford/70">
                                    <div className="flex gap-3">
                                        <MapPin className="w-5 h-5 text-gold shrink-0" />
                                        <div>
                                            <p className="text-sm">Calicut Road, Gudalur</p>
                                            <p className="text-sm">The Nilgiris - 643212</p>
                                            <p className="text-sm">Tamil Nadu, India</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Phone className="w-5 h-5 text-gold shrink-0" />
                                        <div>
                                            <p className="text-sm">+91 94896 18899</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Note */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <ShieldCheck className="w-6 h-6 text-teal opacity-40" />
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-subtle font-ui italic">
                            Secure Institutional Communications Protocol Verified
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
});

export default Contact;