import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Mail, Calendar, CheckCircle } from "lucide-react";

const CallForChapters = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Call for Book Chapters | JMRH Publications"
        description="Submit your book chapter to JMRH Publications for upcoming edited volumes across multidisciplinary domains."
        canonical="/call-for-chapters"
      />
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-oxford/5 to-transparent">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Call for Chapters</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Call for Book Chapters
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12">
            <p className="text-oxford/70 leading-relaxed mb-8">
              JMRH Publications invites original and unpublished book chapter submissions for upcoming edited volumes across multidisciplinary domains. Academicians, researchers, professionals, and research scholars are encouraged to contribute high-quality scholarly chapters to our forthcoming publications.
            </p>

            {/* About the Book */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">About the Book</h2>
              <p className="text-oxford/70 leading-relaxed">
                This edited volume aims to provide a scholarly platform for high-quality research contributions addressing contemporary developments and emerging trends in multidisciplinary and interdisciplinary domains. The book seeks to bring together theoretical perspectives, empirical research findings, conceptual analyses, and case-based discussions that contribute meaningfully to academic knowledge and practice. The publication is intended for researchers, academicians, policy makers, professionals, and postgraduate scholars.
              </p>
            </div>

            {/* Themes */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Themes</h2>
              <p className="text-oxford/70 mb-4">Chapters are invited in areas including, but not limited to:</p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Commerce and Management",
                  "Economics and Finance",
                  "Education and Learning Innovations",
                  "Social Sciences and Humanities",
                  "Science and Technology",
                  "Artificial Intelligence and Digital Transformation",
                  "Environmental Sustainability",
                  "Entrepreneurship and Innovation",
                  "Public Policy and Governance",
                  "Emerging Interdisciplinary Research"
                ].map((theme, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-oxford/5">
                    <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <span className="text-oxford/80 text-sm">{theme}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Dates */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Important Dates</h2>
              <div className="space-y-3">
                {[
                  { label: "Full Chapter Submission Deadline", value: "[Insert Date]" },
                  { label: "Review Notification", value: "Within 2–3 weeks of submission" },
                  { label: "Final Submission (After Revision)", value: "[Insert Date]" },
                  { label: "Expected Publication Date", value: "[Insert Month & Year]" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gold/5 border border-gold/10">
                    <Calendar className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-oxford/50 text-sm">{item.label}</span>
                      <p className="text-oxford font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Guidelines */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Submission Guidelines</h2>
              <div className="space-y-3 mb-6">
                {[
                  "The chapter is original and unpublished",
                  "The chapter is not under consideration elsewhere",
                  "The manuscript is prepared in MS Word format (.doc/.docx)",
                  "APA 7th Edition referencing style is followed",
                  "The similarity index does not exceed 10%",
                  "A plagiarism report is submitted along with the chapter"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-oxford/5">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-oxford/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chapter Processing Charges */}
            <div className="bg-oxford text-white p-8 mb-8">
              <h2 className="font-serif text-2xl font-bold mb-4">Chapter Processing Charges</h2>
              <p className="text-white/70 mb-4">
                A Chapter Processing Charge (CPC) of <strong>[500]</strong> per accepted chapter is applicable.
              </p>
              <p className="text-white/60 text-sm">
                The CPC covers: Editorial evaluation, Academic review, Copyediting and formatting, ISBN registration, Publication and digital archiving. The processing charge is payable only after formal acceptance of the chapter. Payment of CPC does not influence editorial decisions.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gold/5 p-6 border border-gold/10">
              <h3 className="font-serif text-lg font-bold text-oxford mb-4">Contact & Submission</h3>
              <p className="text-oxford/70 mb-4">Authors may submit chapter proposals and full chapters via email:</p>
              <a href="mailto:submit.jmrh@gmail.com" className="text-xl font-bold text-gold">submit.jmrh@gmail.com</a>
              <p className="text-oxford/50 mt-4 text-sm">
                For editorial queries: <a href="mailto:editor.jmrh@gmail.com" className="text-gold">editor.jmrh@gmail.com</a>
              </p>
              <p className="text-oxford/50 mt-2 text-sm">
                Subject line format: <strong>Book Chapter Submission – [Author Name] – [Short Title]</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default CallForChapters;
