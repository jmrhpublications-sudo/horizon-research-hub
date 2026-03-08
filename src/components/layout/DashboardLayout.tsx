import { ReactNode, memo } from "react";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutProps {
    children: ReactNode;
    role: 'ADMIN' | 'PROFESSOR';
}

const DashboardLayout = memo(({ children, role }: DashboardLayoutProps) => {
    return (
        <div className="min-h-screen bg-muted text-foreground">
            <DashboardSidebar role={role} />
            <main className="lg:pl-72 min-h-screen">
                <div className="p-6 lg:p-10 max-w-[1400px] mx-auto animate-academic-reveal">
                    {children}
                </div>
            </main>
        </div>
    );
});

export default DashboardLayout;
