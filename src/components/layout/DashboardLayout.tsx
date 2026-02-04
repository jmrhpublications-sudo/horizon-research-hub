import { ReactNode, memo } from "react";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutProps {
    children: ReactNode;
    role: 'ADMIN' | 'PROFESSOR';
}

const DashboardLayout = memo(({ children, role }: DashboardLayoutProps) => {
    return (
        <div className="min-h-screen bg-[#020617] text-white flex">
            <DashboardSidebar role={role} />
            <main className="flex-1 p-8 lg:p-12 overflow-x-hidden">
                <div className="max-w-[1400px] mx-auto animate-academic-reveal">
                    {children}
                </div>
            </main>
        </div>
    );
});

export default DashboardLayout;
