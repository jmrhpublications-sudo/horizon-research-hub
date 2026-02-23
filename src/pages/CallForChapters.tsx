import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Mail, Calendar, CheckCircle } from "lucide-react";

const CallForChapters = memo(() => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead 
        title="Call for Book Chapters | JMRH Publications"
        description="Submit your book chapter to JMRH Publications for upcoming edited volumes across multidisciplinary domains."
        canonical="/call-for-chapters"
      />
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-white">
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
      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12 space-y-8">
            <p className="text-oxford/70 leading-relaxed text-lg">
              JMRH Publications invites original and unpublished book chapter submissions for upcoming edited volumes across multidisciplinary domains.
            </p>

            {/* About */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">About the Book</h2>
              <p className="text-oxford/70 leading-relaxed">
                This edited volume aims to provide a scholarly platform for high-quality research contributions addressing contemporary developments and emerging trends.
              </p>
            </div>

            {/* Themes */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Themes</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Commerce and Management", "Economics and Finance", "Education and Learning Innovations",
                  "Social Sciences and Humanities", "Science and Technology",
                  "Artificial Intelligence and Digital Transformation", "Environmental Sustainability",
                  "Entrepreneurship and Innovation", "Public Policy and Governance", "Emerging Interdisciplinary Research"
                ].map((theme, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-oxford/5">
                    <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <span className="text-oxford/80 text-sm">{theme}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Important Dates</h2>
              <div className="space-y-3">
                {[
                  { label: "Full Chapter Submission Deadline", value: "[Insert Date]" },
                  { label: "Review Notification", value: "Within 2–3 weeks" },
                  { label: "Expected Publication Date", value: "[Insert Month & Year]" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-oxford/5 border border-black/5">
                    <Calendar className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-oxford/50 text-sm">{item.label}</span>
                      <p className="text-oxford font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guidelines */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6 pb-4 border-b border-gold/20">Submission Guidelines</h2>
              <div className="space-y-3">
                {[
                  "The chapter is original and unpublished", "MS Word format (.doc/.docx)",
                  "APA 7th Edition referencing style", "Similarity index does not exceed 10%",
                  "Plagiarism report submitted"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-oxford/5">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-oxford/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CPC */}
            <div className="bg-oxford/5 p-6 border border-black/5">
              <h2 className="font-serif text-xl font-bold text-oxford mb-4">Chapter Processing Charge</h2>
              <p className="text-oxford/70">₹500 per accepted chapter (payable after acceptance)</p>
            </div>

            {/* Contact */}
            <div className="bg-oxford text-white p-8">
              <h2 className="font-serif text-2xl font-bold mb-4">Submit Chapter</h2>
              <a href="mailto:submit.jmrh@gmail.com" className="text-xl font-bold text-gold">submit.jmrh@gmail.com</a>
              <p className="text-white/50 mt-4 text-sm">
                Subject: <strong>Book Chapter Submission – [Author Name] – [Short Title]</strong>
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
