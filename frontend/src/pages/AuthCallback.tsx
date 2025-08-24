import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!profile) {
        navigate('/role-selection');
      } else {
        navigate(profile.role === 'recruiter' ? '/recruiter-dashboard' : '/applicant-dashboard');
      }
    }
  }, [user, profile, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="text-center relative z-10">
        <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-white mb-2">Setting up your account...</h2>
        <p className="text-white/80">Please wait while we redirect you</p>
      </div>
    </div>
  );
}