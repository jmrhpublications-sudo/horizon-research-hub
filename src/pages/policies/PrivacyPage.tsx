import { memo } from "react";
import PolicyLayout from "@/components/layout/PolicyLayout";
import { Eye, Lock, Cookie, Database } from "lucide-react";

const PrivacyPage = memo(() => (
  <PolicyLayout title="Privacy Policy" seoTitle="Privacy Policy | JMRH Publications" seoDescription="Privacy policy for JMRH Publications - how we collect, use, and protect your information." canonical="/privacy">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-accent" /> Information We Collect</h2>
    <ul className="list-disc list-inside space-y-2 mb-6"><li>Name</li><li>Email address</li><li>Phone number</li><li>Submission details</li><li>Payment information</li></ul>
    <h2 className="text-2xl font-bold mb-4">How We Use Information</h2>
    <ul className="list-disc list-inside space-y-2 mb-6"><li>Processing submissions</li><li>Communication</li><li>Improving services</li></ul>
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-accent" /> Data Protection</h2>
    <p className="mb-6">We implement strict security measures to protect user data.</p>
    <h2 className="text-2xl font-bold mb-4">Third-Party Sharing</h2>
    <p className="mb-6">Data is not sold or shared except when legally required.</p>
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Cookie className="w-5 h-5 text-accent" /> Cookies</h2>
    <p className="mb-6">Website may use cookies to enhance user experience.</p>
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Database className="w-5 h-5 text-accent" /> User Rights</h2>
    <p className="mb-6">Users can request data access, correction, or deletion.</p>
  </PolicyLayout>
));

export default PrivacyPage;
