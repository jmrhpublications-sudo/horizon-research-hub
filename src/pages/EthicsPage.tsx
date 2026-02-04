import { memo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Ethics from "@/components/sections/Ethics";
import ReviewPolicy from "@/components/sections/ReviewPolicy";

const EthicsPage = memo(() => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-20">
                <Ethics />
                <ReviewPolicy />
            </main>
            <Footer />
        </div>
    );
});

export default EthicsPage;
