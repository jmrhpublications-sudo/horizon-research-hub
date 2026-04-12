import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Mail } from "lucide-react";

const JournalEditorialBoard = memo(() => {
  const editorialTeam = [
    {
      role: "Editor-in-Chief",
      name: "Dr. Karthick B",
      position: "Assistant Professor",
      department: "Department of Computer Applications",
      institution: "Government Arts and Science College, Gudalur",
      address: "The Nilgiris – 643212, Tamil Nadu, India",
      email: "karthik@jmrh.in",
      profile: "https://gascgudalur.in/department-of-computer-application/"
    },
    {
      role: "Managing Editor",
      name: "Dr. Sivasankaran M S",
      position: "Assistant Professor",
      department: "Department of Commerce with Computer Applications",
      institution: "Government Arts and Science College, Gudalur",
      address: "The Nilgiris – 643212, Tamil Nadu, India",
      email: "sivasankaranms@jmrh.in",
      profile: "https://gascgudalur.in/department-of-commerce-with-ca/"
    }
  ];

  const boardMembers = [
    {
      name: "Dr. Jaganathan",
      position: "Head & Assistant Professor",
      department: "Department of Commerce with Information Technology",
      institution: "Government Arts and Science College, Gudalur",
      email: "jaganathan@jmrh.in",
      profile: "https://gascgudalur.in/department-of-commerce-with-it/"
    },
    {
      name: "Dr. Porko",
      position: "Assistant Professor",
      department: "Department of Geography",
      institution: "Government Arts and Science College, Gudalur",
      email: "porko@jmrh.in",
      profile: "https://gascgudalur.in/department-of-geography/"
    },
    {
      name: "Dr. T. Sathish",
      position: "Assistant Professor",
      department: "Department of Mathematics",
      institution: "Government Arts and Science College, Gudalur",
      email: "sathisjt@jmrh.in",
      profile: "https://gascgudalur.in/department-of-mathematics/"
    },
    {
      name: "Dr. Dency Mary",
      position: "Assistant Professor",
      department: "Department of BBA (IB)",
      institution: "Nilgiri College of Arts and Science (Autonomous), Thaloor",
      address: "The Nilgiris – 643240, Tamil Nadu, India",
      email: "dencymary@nilgiricollege.ac.in",
      profile: ""
    },
    {
      name: "Dr. K Thamarai Selvi",
      position: "Research Coordinator & Assistant Professor",
      department: "Department of Commerce",
      institution: "Nilgiri College of Arts and Science (Autonomous)",
      address: "Konnachal Post, Thaloor, The Nilgiris, Tamil Nadu - 643239",
      email: "thamaraiselvi@nilgiricollege.ac.in",
      profile: ""
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Editorial Board | Journal of Multidisciplinary Research Horizon"
        description="Meet the editorial board of JMRH journal led by Dr. Karthick B, Assistant Professor."
        canonical="/journal/editorial-board"
      />
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-oxford/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link to="/journal/about" className="hover:text-gold transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-gold">Editorial Board</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Editorial Board
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            {/* Editor-in-Chief and Managing Editor */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-8 pb-4 border-b border-gold/20">Editorial Leadership</h2>
              {editorialTeam.map((member, idx) => (
                <div key={idx} className="bg-gold/5 p-6 border border-gold/10 mb-6">
                  <h3 className="font-serif text-lg font-bold text-oxford mb-1">{member.role}</h3>
                  <h4 className="font-bold text-gold text-xl mb-2">{member.name}</h4>
                  <p className="text-oxford/70 mb-1">{member.position}</p>
                  <p className="text-oxford/60 mb-1">{member.department}</p>
                  <p className="text-oxford/60 mb-1">{member.institution}</p>
                  {member.address && <p className="text-oxford/60 mb-1">{member.address}</p>}
                  <a href={`mailto:${member.email}`} className="inline-flex items-center gap-2 text-gold hover:text-oxford transition-colors mt-2">
                    <Mail size={14} />
                    {member.email}
                  </a>
                  {member.profile && (
                    <a href={member.profile} target="_blank" rel="noopener noreferrer" className="block text-gold hover:text-oxford transition-colors text-sm mt-1">
                      View Profile →
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Editorial Board Members */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Editorial Board Members</h2>
              <div className="space-y-6">
                {boardMembers.map((member, idx) => (
                  <div key={idx} className="p-6 border border-black/5 hover:border-gold/20 transition-all">
                    <h3 className="font-bold text-oxford mb-1">{member.name}</h3>
                    <p className="text-oxford/70 text-sm mb-1">{member.position}</p>
                    <p className="text-oxford/60 text-sm mb-1">{member.department}</p>
                    <p className="text-oxford/60 text-sm mb-1">{member.institution}</p>
                    {member.address && <p className="text-oxford/60 text-sm mb-2">{member.address}</p>}
                    <a href={`mailto:${member.email}`} className="inline-flex items-center gap-2 text-gold hover:text-oxford transition-colors text-sm">
                      <Mail size={12} />
                      {member.email}
                    </a>
                    {member.profile && (
                      <a href={member.profile} target="_blank" rel="noopener noreferrer" className="block text-gold hover:text-oxford transition-colors text-sm mt-1">
                        View Profile →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default JournalEditorialBoard;
