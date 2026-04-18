import { memo } from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import { pageSEO } from "@/lib/seo-data";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = memo(() => {
  return (
    <PageShell {...pageSEO.contact} canonical="/contact">
      <section className="py-8 sm:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-4 sm:mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Contact</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-oxford mb-4 sm:mb-6">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-oxford/60">
            We welcome inquiries from authors, reviewers, editors, and academic institutions.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Publisher Address - Left */}
            <div className="bg-white border border-black/5 p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-oxford/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-oxford" />
                </div>
                <div>
                  <h3 className="font-bold text-oxford mb-2 text-sm sm:text-base">Publisher Address</h3>
                  <p className="text-oxford/60 text-xs sm:text-sm leading-relaxed">
                    JMRH Publications<br />
                    Calicut Road, Gudalur<br />
                    The Nilgiris – 643212<br />
                    Tamil Nadu, India
                  </p>
                  <p className="text-oxford/50 text-xs sm:text-sm mt-2">Email: jmrhpublications@gmail.com</p>
                  <p className="text-oxford/50 text-xs sm:text-sm">Phone: +91 8072242010</p>
                </div>
              </div>
            </div>

            {/* Editor-in-Chief - Right */}
            <div className="bg-white border border-black/5 p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-oxford/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-oxford" />
                </div>
                <div>
                  <h3 className="font-bold text-oxford mb-2 text-sm sm:text-base">Editor-in-Chief</h3>
                  <p className="text-oxford/60 text-xs sm:text-sm leading-relaxed">
                    Dr. Karthick B<br />
                    Asst. Professor, Dept. of Computer Applications<br />
                    Govt. Arts and Science College, Gudalur<br />
                    The Nilgiris – 643212, Tamil Nadu
                  </p>
                  <p className="text-oxford/50 text-xs sm:text-sm mt-2">Phone: +91 9345691912</p>
                </div>
              </div>
            </div>

            {/* Official Email */}
            <div className="bg-white border border-black/5 p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-oxford/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-oxford" />
                </div>
                <div>
                  <h3 className="font-bold text-oxford mb-2 text-sm sm:text-base">Official Email</h3>
                  <p className="text-oxford/50 text-xs sm:text-sm mb-1">For general inquiries</p>
                  <a href="mailto:jmrhpublications@gmail.com" className="text-gold font-bold hover:text-oxford transition-colors text-xs sm:text-sm break-all min-h-[44px] inline-flex items-center touch-manipulation">
                    jmrhpublications@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Submission Email */}
            <div className="bg-white border border-black/5 p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-oxford/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-oxford" />
                </div>
                <div>
                  <h3 className="font-bold text-oxford mb-2 text-sm sm:text-base">Submission Email</h3>
                  <p className="text-oxford/50 text-xs sm:text-sm mb-1">For manuscripts</p>
                  <a href="mailto:callforpapers@jmrh.in" className="text-gold font-bold hover:text-oxford transition-colors text-xs sm:text-sm break-all min-h-[44px] inline-flex items-center touch-manipulation">
                    callforpapers@jmrh.in
                  </a>
                </div>
              </div>
            </div>

            {/* Reviewer Email */}
            <div className="bg-white border border-black/5 p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-oxford/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-oxford" />
                </div>
                <div>
                  <h3 className="font-bold text-oxford mb-2 text-sm sm:text-base">Reviewer Email</h3>
                  <p className="text-oxford/50 text-xs sm:text-sm mb-1">For reviewer queries</p>
                  <a href="mailto:review@jmrh.in" className="text-gold font-bold hover:text-oxford transition-colors text-xs sm:text-sm min-h-[44px] inline-flex items-center touch-manipulation">
                    review@jmrh.in
                  </a>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-oxford/5 p-4 sm:p-6 border border-black/5 flex items-center">
              <p className="text-oxford/70 text-sm sm:text-base">
                <strong>Response Time:</strong> All inquiries will be responded to within <strong>2–3 working days</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
});

export default Contact;