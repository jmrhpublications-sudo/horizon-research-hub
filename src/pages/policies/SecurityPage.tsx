import { memo } from "react";
import PolicyLayout from "@/components/layout/PolicyLayout";
import { Shield, Lock, Eye, AlertTriangle, Server } from "lucide-react";

const SecurityPage = memo(() => (
  <PolicyLayout title="Security Policy" seoTitle="Security Policy | JMRH Publications" seoDescription="Security policy for JMRH Publications - how we protect your data." canonical="/security">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-accent" /> Data Encryption</h2>
    <p className="mb-6">All sensitive data is encrypted using industry-standard encryption protocols.</p>
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-accent" /> Secure Transactions</h2>
    <p className="mb-6">Payment gateways follow industry standards to ensure secure transactions.</p>
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-accent" /> Access Control</h2>
    <p className="mb-6">Only authorized personnel can access sensitive data. Role-based access controls are implemented.</p>
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-accent" /> Incident Response</h2>
    <p className="mb-6">Immediate action is taken in case of security breaches. We have a documented incident response plan.</p>
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Server className="w-5 h-5 text-accent" /> Continuous Monitoring</h2>
    <p className="mb-6">Systems are regularly updated and monitored for potential security threats.</p>
  </PolicyLayout>
));

export default SecurityPage;
