import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Mail, MapPin } from "lucide-react";

const Contact = memo(() => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead 
        title="Contact Us | JMRH Publications"
        description="Contact JMRH Publications for any queries related to journal submissions, book proposals, or general inquiries."
        canonical="/contact"
      />
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Contact</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-oxford/60">
            We welcome inquiries from authors, reviewers, editors, and academic institutions.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
              {/* Row 1: Editor-in-Chief + Publisher Address */}
              <div className="bg-white border border-black/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-oxford/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-oxford" />
                  </div>
                  <div>
                    <h3 className="font-bold text-oxford mb-2">Editor-in-Chief</h3>
                    <p className="text-oxford/60">
                      Dr. Karthick B<br />
                      Assistant Professor, Department of Computer Applications<br />
                      Government Arts and Science College, Gudalur<br />
                      The Nilgiris – 643212, Tamil Nadu, India
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-oxford/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-oxford" />
                  </div>
                  <div>
                    <h3 className="font-bold text-oxford mb-2">Publisher Address</h3>
                    <p className="text-oxford/60">
                      JMRH Publications<br />
                      Calicut Road, Gudalur<br />
                      The Nilgiris – 643212<br />
                      Tamil Nadu, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 2: Official Email + Submission Email */}
              <div className="bg-white border border-black/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-oxford/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-oxford" />
                  </div>
                  <div>
                    <h3 className="font-bold text-oxford mb-2">Official Email</h3>
                    <p className="text-oxford/50 text-sm mb-1">For general inquiries</p>
                    <a href="mailto:jmrhpublications@gmail.com" className="text-gold font-bold hover:text-oxford transition-colors">
                      jmrhpublications@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-oxford/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-oxford" />
                  </div>
                  <div>
                    <h3 className="font-bold text-oxford mb-2">Submission Email</h3>
                    <p className="text-oxford/50 text-sm mb-1">For manuscripts</p>
                    <a href="mailto:callforpapers@jmrh.in" className="text-gold font-bold hover:text-oxford transition-colors">
                      callforpapers@jmrh.in
                    </a>
                  </div>
                </div>
              </div>

              {/* Row 3: Reviewer Email + Response Time */}
              <div className="bg-white border border-black/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-oxford/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-oxford" />
                  </div>
                  <div>
                    <h3 className="font-bold text-oxford mb-2">Reviewer Email</h3>
                    <p className="text-oxford/50 text-sm mb-1">For reviewer queries</p>
                    <a href="mailto:review@jmrh.in" className="text-gold font-bold hover:text-oxford transition-colors">
                      review@jmrh.in
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-oxford/5 p-6 border border-black/5">
                <p className="text-oxford/70">
                  <strong>Response Time:</strong> All inquiries will be responded to within <strong>2–3 working days</strong>.
                </p>
              </div>
            </div>

            <div className="bg-oxford/5 p-6 border border-black/5">
              <p className="text-oxford/70">
                <strong>Response Time:</strong> All inquiries will be responded to within <strong>2–3 working days</strong>.
              </p>
            </div>
          </div>
        </section>

      <Footer />
    </div>
  );
});

export default Contact;
