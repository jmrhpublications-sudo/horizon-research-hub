import { memo } from "react";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, Mail, ShieldCheck } from "lucide-react";
import { fadeIn } from "@/hooks/use-scroll-animation";

const editors = [
  {
    name: "Dr. Karthick B",
    role: "Editor-in-Chief",
    badge: "Editor-in-Chief",
    institution: "JMRH Publications",
    location: "Gudalur, The Nilgiris – 643212, Tamil Nadu, India",
    email: "editor.jmrh@gmail.com",
    specialization: "Multidisciplinary Research & Academic Governance",
    bio: "Distinguished academic with extensive focus on multidisciplinary research & academic governance. Dedicated to maintaining rigorous peer-review standards and promoting interdisciplinary scholarship.",
    affiliation: "JMRH Publications",
  },
  {
    name: "Dr. K. Thamarai Selvi K",
    role: "Editorial Advisory Board",
    badge: "Assistant Professor",
    institution: "Government Arts College",
    location: "Gudalur, The Nilgiris – 643212, Tamil Nadu, India",
    email: "thamarai@jems.org",
    specialization: "Entrepreneurship, Financial Inclusion, Digital Literacy",
    bio: "Focused on entrepreneurship and digital literacy, contributing to the academic quality and ethical oversight of JMRH publications.",
    affiliation: "Government Arts College",
  },
];

const EditorialBoardSection = memo(() => {
  return (
    <section id="editorial" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <p className="section-label text-gold mb-4">Academic Governance</p>
          <h2 className="section-title text-charcoal">
            Editorial <span className="italic italic underline decoration-gold/20 underline-offset-8">Leadership</span>
          </h2>
          <p className="mt-6 text-charcoal/60 font-sans leading-relaxed">
            Experienced academicians overseeing the journal's academic quality,
            ethical standards, and peer-review integrity.
          </p>
        </motion.div>

        {/* Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {editors.map((editor, index) => (
            <motion.div
              key={editor.name}
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="bg-cream border border-charcoal/5 p-8 lg:p-10 group hover:bg-charcoal hover:text-cream transition-all duration-700 shadow-xl"
            >
              <div className="space-y-8">
                {/* Header Info */}
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 bg-white flex items-center justify-center border border-charcoal/5 group-hover:bg-gold transition-all duration-700">
                    <GraduationCap className="w-8 h-8 text-gold group-hover:text-charcoal" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-1">{editor.role}</p>
                    <p className="font-serif italic text-sm opacity-60 group-hover:opacity-100">{editor.badge}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-3xl text-charcoal group-hover:text-gold transition-colors">{editor.name}</h3>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gold mt-1 shrink-0" />
                    <p className="text-sm font-sans opacity-60 group-hover:opacity-80">{editor.location}</p>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-charcoal/5 group-hover:border-white/10 transition-colors">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Research focus</label>
                    <p className="text-sm font-serif italic">{editor.specialization}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Biography</label>
                    <p className="text-sm font-sans leading-relaxed opacity-60 group-hover:opacity-80">{editor.bio}</p>
                  </div>

                  <div className="flex items-center gap-2 text-gold group-hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${editor.email}`} className="text-xs uppercase tracking-widest font-bold underline decoration-gold/20 underline-offset-4">{editor.email}</a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ethical Governance Footer */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-20 p-8 border border-charcoal/5 bg-cream/30 flex flex-col items-center text-center space-y-4"
        >
          <ShieldCheck className="w-8 h-8 text-gold" />
          <h4 className="font-serif text-xl text-charcoal uppercase tracking-widest">Ethical Governance</h4>
          <p className="max-w-3xl text-sm font-sans text-charcoal/50 leading-relaxed italic">
            Board members oversee manuscript evaluation, peer-review integrity, and policy enforcement
            in full compliance with COPE guidelines and international publishing ethics.
          </p>
        </motion.div>
      </div>
    </section>
  );
});

export default EditorialBoardSection;
