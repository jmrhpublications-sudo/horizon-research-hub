import { Link, Navigate, useLocation } from 'react-router-dom';
import { useJMRH, UserRole } from '@/context/JMRHContext';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { currentUser, isLoading } = useJMRH();
    const location = useLocation();

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto" />
                    <p className="text-oxford/60 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    // Not logged in - redirect to login
    if (!currentUser) {
        // Determine login path based on requested route
        let loginPath = '/auth';
        if (location.pathname.startsWith('/secure/admin')) {
            loginPath = '/secure/admin/login';
        } else if (location.pathname.startsWith('/secure/professor')) {
            loginPath = '/secure/professor/login';
        }

        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    // Check if user is banned
    if (currentUser.status === 'BANNED') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
                <div className="max-w-md space-y-6">
                    <h1 className="text-4xl font-serif font-bold text-oxford">Account Banned</h1>
                    <p className="text-oxford/60 italic">
                        Your account has been deactivated by the administrator.
                        Please contact the editorial desk for further inquiries.
                    </p>
                    <Link
                        className="inline-flex items-center justify-center rounded-md bg-oxford px-4 py-2 text-sm font-semibold text-white transition hover:bg-oxford/90"
                        to="/auth"
                    >
                        Return to login
                    </Link>
                </div>
            </div>
        );
    }

    // Check role permissions
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        // User doesn't have required role - redirect to their appropriate dashboard
        if (currentUser.role === 'ADMIN') {
            return <Navigate to="/secure/admin/dashboard" replace />;
        } else if (currentUser.role === 'PROFESSOR') {
            return <Navigate to="/secure/professor/dashboard" replace />;
        } else {
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
