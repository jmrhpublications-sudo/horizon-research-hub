import { memo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Archives from "@/components/sections/Archives";

const ArchivesPage = memo(() => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-20">
                <Archives />
            </main>
            <Footer />
        </div>
    );
});

export default ArchivesPage;
