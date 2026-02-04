import { memo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Guidelines from "@/components/sections/Guidelines";
import CTASection from "@/components/sections/CTASection";

const GuidelinesPage = memo(() => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-20">
                <Guidelines />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
});

export default GuidelinesPage;
