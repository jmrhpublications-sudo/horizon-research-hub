import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Shield, Lock, Eye, AlertTriangle, Server } from "lucide-react";

const SecurityPage = memo(() => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead 
        title="Security Policy | Journal of Multidisciplinary Research Horizon"
        description="Security policy for JMRH Publications - how we protect your data."
        canonical="/security"
      />
      <Header />
      
      <section className="pt-32 pb-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-oxford/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold">Security Policy</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-black text-oxford mb-6">
            Security Policy
          </h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="bg-white border border-black/5 p-8 md:p-12 space-y-8">
            
            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gold" />
                Data Encryption
              </h2>
              <p className="text-oxford/70">
                All sensitive data is encrypted using industry-standard encryption protocols.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold" />
                Secure Transactions
              </h2>
              <p className="text-oxford/70">
                Payment gateways follow industry standards to ensure secure transactions.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-gold" />
                Access Control
              </h2>
              <p className="text-oxford/70">
                Only authorized personnel can access sensitive data. Role-based access controls are implemented.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-gold" />
                Incident Response
              </h2>
              <p className="text-oxford/70">
                Immediate action is taken in case of security breaches. We have a documented incident response plan.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-oxford mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-gold" />
                Continuous Monitoring
              </h2>
              <p className="text-oxford/70">
                Systems are regularly updated and monitored for potential security threats.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default SecurityPage;
