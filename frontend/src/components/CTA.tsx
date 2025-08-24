import { Button } from "../components/ui/button";
import { ArrowRight, Users, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const CTA = () => {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();

  const handleAuthClick = (userType: 'recruiter' | 'applicant') => {
    if (isAuthenticated && profile) {
      // User is already logged in, redirect to their dashboard
      navigate(profile.role === 'recruiter' ? '/recruiter-dashboard' : '/applicant-dashboard');
    } else {
      // User needs to authenticate
      navigate('/auth');
    }
  };

  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your{" "}
            <span className="text-yellow-300">Recruitment Process?</span>
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join thousands of recruiters and job seekers who are already using AfroServe
            to make meaningful connections and build successful careers.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer max-w-sm"
              onClick={() => handleAuthClick('recruiter')}>
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">For Recruiters</h3>
              <p className="text-white/80 mb-4">Find top talent with AI-powered matching</p>
              <Button variant="secondary" className="w-full group">
                Start Hiring
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer max-w-sm"
              onClick={() => handleAuthClick('applicant')}>
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">For Job Seekers</h3>
              <p className="text-white/80 mb-4">Get matched with your dream opportunity</p>
              <Button variant="secondary" className="w-full group">
                Find Jobs
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          <div className="pt-8">
            <p className="text-white/70 text-sm">
              Secure authentication with Google, GitHub, and LinkedIn
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};