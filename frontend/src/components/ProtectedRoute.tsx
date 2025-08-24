import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'recruiter' | 'applicant';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="text-center relative z-10">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Loading...</h2>
          <p className="text-white/80">Please wait</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    return <Navigate to="/role-selection" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to the correct dashboard
    const redirectPath = user.role === 'recruiter' ? '/recruiter-dashboard' : '/applicant-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};