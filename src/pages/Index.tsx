import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import AimsAndScopeSection from "@/components/sections/AimsAndScopeSection";
import EditorialBoardSection from "@/components/sections/EditorialBoardSection";
import JournalParticularsSection from "@/components/sections/JournalParticularsSection";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <AimsAndScopeSection />
        <EditorialBoardSection />
        <JournalParticularsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
