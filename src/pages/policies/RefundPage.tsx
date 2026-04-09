import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

const RefundPage = memo(() => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead 
        title="Refund Policy | Journal of Multidisciplinary Research Horizon"
        description="Refund policy for JMRH Publications."
        canonical="/refund"
      />
      <Header />
      
      <section className="pt-32 pb-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Refund Policy</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Refund Policy
          </h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12 space-y-8">
            
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-gold" />
                Refund Eligibility
              </h2>
              <p className="text-oxford/70">
                Article Processing Charges (APC) are refundable only in exceptional circumstances.
              </p>
            </div>

            <div className="bg-red-50 p-6 border border-red-200">
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Non-Refundable Cases
              </h2>
              <ul className="list-disc list-inside text-oxford/70 space-y-2">
                <li>If the manuscript has already been published</li>
                <li>If the review process has been completed</li>
                <li>If the author withdraws after acceptance</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-gold" />
                Eligible for Refund
              </h2>
              <ul className="list-disc list-inside text-oxford/70 space-y-2">
                <li>Payment made in error</li>
                <li>Duplicate payment</li>
                <li>Technical failure导致重复扣款</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4">Refund Process</h2>
              <p className="text-oxford/70">
                To request a refund, contact us at jmrhpublications@gmail.com within 7 days of payment. Refunds are processed within 14 business days.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default RefundPage;
