import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead 
        title="Contact Us | JMRH Publications"
        description="Contact JMRH Publications for any queries related to journal submissions, book proposals, or general inquiries."
        canonical="/contact"
      />
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-oxford/5 to-transparent">
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
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              {/* Office Address */}
              <div className="bg-white border border-black/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-oxford mb-2">Office Address</h3>
                    <p className="text-oxford/60">
                      JMRH Publications<br />
                      Gudalur, The Nilgiris – 643212<br />
                      Tamil Nadu, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Email */}
              <div className="bg-white border border-black/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-oxford mb-2">Official Email</h3>
                    <p className="text-oxford/50 text-sm mb-1">For general inquiries and administrative communication</p>
                    <a href="mailto:jmrhpublications@gmail.com" className="text-gold font-bold hover:text-oxford transition-colors">
                      jmrhpublications@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Submission Email */}
              <div className="bg-white border border-black/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-oxford mb-2">Submission Email</h3>
                    <p className="text-oxford/50 text-sm mb-1">For journal manuscripts and book chapter submissions</p>
                    <a href="mailto:submit.jmrh@gmail.com" className="text-gold font-bold hover:text-oxford transition-colors">
                      submit.jmrh@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Editorial Email */}
              <div className="bg-white border border-black/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-oxford mb-2">Editorial Email</h3>
                    <p className="text-oxford/50 text-sm mb-1">For editorial and review-related queries</p>
                    <a href="mailto:editor.jmrh@gmail.com" className="text-gold font-bold hover:text-oxford transition-colors">
                      editor.jmrh@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Reviewer Email */}
              <div className="bg-white border border-black/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-oxford mb-2">Reviewer Email</h3>
                    <p className="text-oxford/50 text-sm mb-1">For reviewer communication and reviewer applications</p>
                    <a href="mailto:review.jmrh@gmail.com" className="text-gold font-bold hover:text-oxford transition-colors">
                      review.jmrh@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white border border-black/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-oxford mb-2">Phone</h3>
                    <a href="tel:+918072242010" className="text-gold font-bold hover:text-oxford transition-colors">
                      +91 80722 42010
                    </a>
                    <p className="text-oxford/50 text-sm mt-1">Available during standard working hours, Monday–Friday</p>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-gold/5 p-6 border border-gold/10">
                <p className="text-oxford/70">
                  <strong>Response Time:</strong> All inquiries will be responded to within <strong>2–3 working days</strong>.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white border border-black/5 p-6">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-6">Contact Form</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-widest text-oxford/50 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-black/10 focus:border-gold focus:outline-none transition-colors"
                    placeholder="Your Full Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-widest text-oxford/50 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-black/10 focus:border-gold focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="affiliation" className="block text-xs uppercase tracking-widest text-oxford/50 mb-2">Affiliation (if applicable)</label>
                  <input 
                    type="text" 
                    id="affiliation"
                    name="affiliation"
                    className="w-full px-4 py-3 border border-black/10 focus:border-gold focus:outline-none transition-colors"
                    placeholder="Your Institution"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs uppercase tracking-widest text-oxford/50 mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-black/10 focus:border-gold focus:outline-none transition-colors"
                    placeholder="Subject of your inquiry"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs uppercase tracking-widest text-oxford/50 mb-2">Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-black/10 focus:border-gold focus:outline-none transition-colors resize-none"
                    placeholder="Your message..."
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-oxford text-white py-4 text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-oxford transition-all"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default Contact;
