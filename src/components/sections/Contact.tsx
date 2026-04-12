import { memo } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock, ShieldCheck, Phone } from "lucide-react";

const Contact = memo(() => {
    return (
        <section id="contact" className="py-32 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-16">
                        <p className="section-label">Institutional Relations</p>
                        <h2 className="section-title text-5xl">
                            Editor-in-Chief
                            <span className="italic academic-underline py-1">Correspondence</span>
                        </h2>
                    </div>

                    {/* Editor-in-Chief Info */}
                    <div className="bg-oxford p-12 lg:p-16 rounded-[40px] relative shadow-2xl">
                        {/* Background noise texture */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

                        <div className="relative z-10 space-y-8">
                            {/* Name and Title */}
                            <div className="text-center border-b border-white/10 pb-8">
                                <p className="text-[10px] uppercase tracking-[0.5em] text-gold font-bold mb-2">Editor-in-Chief</p>
                                <h3 className="font-serif text-4xl text-white italic leading-tight font-bold">Dr. Karthick B</h3>
                                <p className="text-white/60 mt-2">Assistant Professor, Department of Computer Applications</p>
                            </div>

                            {/* Contact Details */}
                            <div className="grid md:grid-cols-2 gap-8 pt-4">
                                {/* Address */}
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 bg-white/10 flex items-center justify-center shrink-0 rounded-xl group-hover:bg-gold transition-all duration-500">
                                        <MapPin className="w-5 h-5 text-gold group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-serif text-lg text-white font-bold mb-2">Editorial Office</h4>
                                        <p className="text-white/70 text-sm leading-relaxed">
                                            Government Arts and Science College, Gudalur<br />
                                            The Nilgiris – 643212, Tamil Nadu, India
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 bg-white/10 flex items-center justify-center shrink-0 rounded-xl group-hover:bg-gold transition-all duration-500">
                                        <Mail className="w-5 h-5 text-gold group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-serif text-lg text-white font-bold mb-2">Email</h4>
                                        <a href="mailto:karthik@jmrh.in" className="text-gold hover:text-white transition-colors text-sm">
                                            karthik@jmrh.in
                                        </a>
                                        <br />
                                        <a href="mailto:editorial@jmrh.in" className="text-white/60 hover:text-gold transition-colors text-sm">
                                            editorial@jmrh.in
                                        </a>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 bg-white/10 flex items-center justify-center shrink-0 rounded-xl group-hover:bg-gold transition-all duration-500">
                                        <Phone className="w-5 h-5 text-gold group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-serif text-lg text-white font-bold mb-2">Phone</h4>
                                        <p className="text-white/70 text-sm">+91 98765 43210</p>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 bg-white/10 flex items-center justify-center shrink-0 rounded-xl group-hover:bg-gold transition-all duration-500">
                                        <Clock className="w-5 h-5 text-gold group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-serif text-lg text-white font-bold mb-2">Office Hours</h4>
                                        <p className="text-white/70 text-sm">Mon - Fri: 09:00 - 17:00 IST</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Emails */}
                            <div className="pt-8 border-t border-white/10 mt-8">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-4">For Specific Inquiries</p>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-white/5 p-4 rounded-lg">
                                        <p className="text-white/40 text-xs uppercase mb-1">Submissions</p>
                                        <a href="mailto:submissions@jmrh.in" className="text-gold hover:text-white text-sm">submissions@jmrh.in</a>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-lg">
                                        <p className="text-white/40 text-xs uppercase mb-1">General</p>
                                        <a href="mailto:info@jmrh.in" className="text-gold hover:text-white text-sm">info@jmrh.in</a>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-lg">
                                        <p className="text-white/40 text-xs uppercase mb-1">Review</p>
                                        <a href="mailto:review@jmrh.in" className="text-gold hover:text-white text-sm">review@jmrh.in</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Note */}
                    <div className="pt-10 flex items-center justify-center gap-4 group">
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