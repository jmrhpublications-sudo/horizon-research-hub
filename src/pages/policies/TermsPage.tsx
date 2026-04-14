import { memo } from "react";
import PolicyLayout from "@/components/layout/PolicyLayout";

const TermsPage = memo(() => (
  <PolicyLayout title="Terms and Conditions" seoTitle="Terms and Conditions | JMRH Publications" seoDescription="Terms and conditions for JMRH Publications - understand the terms of using our services." canonical="/terms">
    <h2 className="text-2xl font-bold mb-4">Introduction</h2>
    <p className="mb-6">Welcome to our website. By accessing or using our services, you agree to comply with these terms.</p>
    <h2 className="text-2xl font-bold mb-4">Use of Services</h2>
    <p className="mb-6">Users must provide accurate information and use the platform only for lawful purposes.</p>
    <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
    <p className="mb-6">All content (text, logos, publications) belongs to the organization and cannot be reused without permission.</p>
    <h2 className="text-2xl font-bold mb-4">User Responsibilities</h2>
    <p className="mb-6">Users are responsible for submitted content and must ensure originality.</p>
    <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
    <p className="mb-6">We are not liable for any direct or indirect damages arising from use of the platform.</p>
    <h2 className="text-2xl font-bold mb-4">Modifications</h2>
    <p className="mb-6">Terms may be updated at any time without prior notice.</p>
  </PolicyLayout>
));

export default TermsPage;
