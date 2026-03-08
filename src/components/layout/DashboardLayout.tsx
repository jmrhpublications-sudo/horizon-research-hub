import { ReactNode, memo } from "react";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutProps {
    children: ReactNode;
    role: 'ADMIN' | 'PROFESSOR';
}

const DashboardLayout = memo(({ children, role }: DashboardLayoutProps) => {
    return (
        <div className="min-h-screen bg-muted/30 text-foreground">
            <DashboardSidebar role={role} />
            <main className="lg:pl-72 min-h-screen transition-all duration-300">
                <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
});

export default DashboardLayout;
