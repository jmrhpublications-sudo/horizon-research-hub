import { memo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EditorialBoardSection from "@/components/sections/EditorialBoardSection";
import ReviewerCommunity from "@/components/sections/ReviewerCommunity";

const EditorialPage = memo(() => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-20">
                <EditorialBoardSection />
                <ReviewerCommunity />
            </main>
            <Footer />
        </div>
    );
});

export default EditorialPage;
