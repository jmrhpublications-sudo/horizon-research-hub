import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const TermsPage = memo(() => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead 
        title="Terms and Conditions | Journal of Multidisciplinary Research Horizon"
        description="Terms and conditions for JMRH Publications - understand the terms of using our services."
        canonical="/terms"
      />
      <Header />
      
      <section className="pt-32 pb-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Terms and Conditions</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Terms and Conditions
          </h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12 prose prose-sm max-w-none">
            
            <h2 className="font-serif text-2xl font-bold text-oxford mb-4">Introduction</h2>
            <p className="text-oxford/70 mb-6">
              Welcome to our website. By accessing or using our services, you agree to comply with these terms.
            </p>

            <h2 className="font-serif text-2xl font-bold text-oxford mb-4">Use of Services</h2>
            <p className="text-oxford/70 mb-6">
              Users must provide accurate information and use the platform only for lawful purposes.
            </p>

            <h2 className="font-serif text-2xl font-bold text-oxford mb-4">Intellectual Property</h2>
            <p className="text-oxford/70 mb-6">
              All content (text, logos, publications) belongs to the organization and cannot be reused without permission.
            </p>

            <h2 className="font-serif text-2xl font-bold text-oxford mb-4">User Responsibilities</h2>
            <p className="text-oxford/70 mb-6">
              Users are responsible for submitted content and must ensure originality.
            </p>

            <h2 className="font-serif text-2xl font-bold text-oxford mb-4">Limitation of Liability</h2>
            <p className="text-oxford/70 mb-6">
              We are not liable for any direct or indirect damages arising from use of the platform.
            </p>

            <h2 className="font-serif text-2xl font-bold text-oxford mb-4">Modifications</h2>
            <p className="text-oxford/70 mb-6">
              Terms may be updated at any time without prior notice.
            </p>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default TermsPage;
