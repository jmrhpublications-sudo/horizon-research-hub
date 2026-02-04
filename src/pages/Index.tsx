import { memo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import AimsAndScopeSection from "@/components/sections/AimsAndScopeSection";
import CTASection from "@/components/sections/CTASection";

const Index = memo(() => {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-gold selection:text-charcoal">
      <Header />
      <main className="relative">
        <HeroSection />

        {/* Core Quick Intro */}
        <AboutSection />

        {/* Scope Overview */}
        <AimsAndScopeSection />

        {/* Final Conversion */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
});

export default Index;
