import { memo } from "react";
import PolicyLayout from "@/components/layout/PolicyLayout";
import { Copyright, PenTool, BookOpen } from "lucide-react";

const CopyrightPage = memo(() => (
  <PolicyLayout title="Copyright Policy" seoTitle="Copyright Policy | JMRH Publications" seoDescription="Copyright policy for JMRH Publications - author rights and reuse permissions." canonical="/copyright">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Copyright className="w-5 h-5 text-accent" /> Author Copyright</h2>
    <p className="mb-6">Authors retain the copyright to their work published in JMRH.</p>
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><PenTool className="w-5 h-5 text-accent" /> Publishing Rights</h2>
    <p className="mb-6">Authors grant JMRH Publications non-exclusive rights to publish, distribute, and archive the work.</p>
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-accent" /> Reuse Permission</h2>
    <p className="mb-6">Material can be reproduced with proper attribution to JMRH. Users must cite the original publication.</p>
    <h2 className="text-2xl font-bold mb-4">Creative Commons</h2>
    <p className="mb-6">Published articles are distributed under Creative Commons license (CC BY-NC-ND).</p>
  </PolicyLayout>
));

export default CopyrightPage;
