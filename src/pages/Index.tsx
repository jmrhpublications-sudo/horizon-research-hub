import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import VisionMission from "@/components/sections/VisionMission";
import Mentorship from "@/components/sections/Mentorship";
import Consultation from "@/components/sections/Consultation";
import AimsAndScopeSection from "@/components/sections/AimsAndScopeSection";
import EditorialBoardSection from "@/components/sections/EditorialBoardSection";
import ReviewerCommunity from "@/components/sections/ReviewerCommunity";
import Guidelines from "@/components/sections/Guidelines";
import Ethics from "@/components/sections/Ethics";
import ReviewPolicy from "@/components/sections/ReviewPolicy";
import Archives from "@/components/sections/Archives";
import Contact from "@/components/sections/Contact";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="relative">
        <HeroSection />
        <AboutSection />
        <VisionMission />
        <Mentorship />
        <Consultation />
        <AimsAndScopeSection />
        <EditorialBoardSection />
        <ReviewerCommunity />
        <Guidelines />
        <Ethics />
        <ReviewPolicy />
        <Archives />
        <Contact />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
