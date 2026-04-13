import { memo, ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
import SEOHead from "@/components/seo/SEOHead";

interface PageShellProps {
  children: ReactNode;
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noBottomNav?: boolean;
}

const PageShell = memo(({ children, title, description, keywords, canonical, jsonLd, noBottomNav }: PageShellProps) => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead title={title} description={description} keywords={keywords} canonical={canonical} jsonLd={jsonLd} />
      <Header />
      <main className="pt-20 lg:pt-24 pb-20 lg:pb-0">
        {children}
      </main>
      <Footer />
      {!noBottomNav && <MobileBottomNav />}
    </div>
  );
});

export default PageShell;
