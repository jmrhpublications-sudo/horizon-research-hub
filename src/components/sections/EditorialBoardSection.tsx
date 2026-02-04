import { motion } from "framer-motion";
import { GraduationCap, MapPin, Mail, BookMarked } from "lucide-react";

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
    badge: "Assistant Professor of Commerce",
    institution: "Government Arts College",
    location: "Gudalur, The Nilgiris – 643212, Tamil Nadu, India",
    email: "thamarai@jems.org",
    specialization: "Entrepreneurship, Financial Inclusion, Digital Literacy",
    bio: "Distinguished academic with extensive focus on entrepreneurship, financial inclusion, digital literacy. Dedicated to maintaining rigorous peer-review standards and promoting interdisciplinary scholarship.",
    affiliation: "Government Arts College",
  },
];

const EditorialBoardSection = () => {
  return (
    <section id="editorial" className="py-24 bg-cream">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-label mb-4">Leadership</p>
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal">
            Editorial <span className="italic">Board</span>
          </h2>
        </motion.div>

        {/* Editorial Cards */}
        <div className="space-y-8 max-w-5xl mx-auto">
          {editors.map((editor, index) => (
            <motion.div
              key={editor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-card rounded-2xl p-8 lg:p-10 border border-border"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
                {/* Left Column - Photo & Name */}
                <div className="text-center lg:text-left">
                  <div className="w-24 h-24 mx-auto lg:mx-0 mb-4 bg-cream-dark rounded-xl flex items-center justify-center border border-border">
                    <GraduationCap className="w-10 h-10 text-warm-gray" />
                  </div>
                  <h3 className="font-serif text-xl text-charcoal mb-1">{editor.name}</h3>
                  <p className="section-label text-[10px] mb-3">{editor.role}</p>
                  <span className="inline-block text-xs border border-border rounded-full px-3 py-1 text-muted-foreground">
                    {editor.badge}
                  </span>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">{editor.institution}</p>
                        <p className="text-xs text-warm-gray">{editor.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BookMarked className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                      <div>
                        <p className="info-label text-[10px] mb-1">Specialization</p>
                        <p className="text-sm text-charcoal">{editor.specialization}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gold shrink-0" />
                      <a 
                        href={`mailto:${editor.email}`} 
                        className="text-sm text-gold hover:underline"
                      >
                        {editor.email}
                      </a>
                    </div>
                  </div>

                  {/* Biography */}
                  <div className="bg-cream rounded-lg p-6">
                    <p className="section-label text-[10px] mb-3">Researcher Biography</p>
                    <p className="font-serif italic text-muted-foreground leading-relaxed">
                      {editor.bio}
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                      Institutional Affiliation: <span className="text-charcoal">{editor.affiliation}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ethics Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 bg-charcoal rounded-2xl p-8 text-center max-w-4xl mx-auto"
        >
          <p className="font-serif italic text-cream/80 text-sm leading-relaxed">
            All board members are bound by COPE ethical guidelines. No personal email IDs are utilized for ISSN listing or official editorial correspondence.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default EditorialBoardSection;
