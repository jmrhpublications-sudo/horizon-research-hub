import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Shield, Lock, Eye, Database, Cookie } from "lucide-react";

const PrivacyPage = memo(() => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead 
        title="Privacy Policy | Journal of Multidisciplinary Research Horizon"
        description="Privacy policy for JMRH Publications - how we collect, use, and protect your information."
        canonical="/privacy"
      />
      <Header />
      
      <section className="pt-32 pb-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Privacy Policy</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Privacy Policy
          </h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12 space-y-8">
            
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-gold" />
                Information We Collect
              </h2>
              <ul className="list-disc list-inside text-oxford/70 space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Submission details</li>
                <li>Payment information</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4">How We Use Information</h2>
              <ul className="list-disc list-inside text-oxford/70 space-y-2">
                <li>Processing submissions</li>
                <li>Communication</li>
                <li>Improving services</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gold" />
                Data Protection
              </h2>
              <p className="text-oxford/70">
                We implement strict security measures to protect user data.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4">Third-Party Sharing</h2>
              <p className="text-oxford/70">
                Data is not sold or shared except when legally required.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <Cookie className="w-5 h-5 text-gold" />
                Cookies
              </h2>
              <p className="text-oxford/70">
                Website may use cookies to enhance user experience.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-gold" />
                User Rights
              </h2>
              <p className="text-oxford/70">
                Users can request data access, correction, or deletion.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default PrivacyPage;
