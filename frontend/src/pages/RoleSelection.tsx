import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Users, Briefcase, Upload } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import apiService from '../services/api';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<'recruiter' | 'applicant' | null>(null);
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createProfile, user, checkAuthStatus } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role) {
      const dashboardPath = user.role === 'recruiter' ? '/recruiter-dashboard' : '/applicant-dashboard';
      navigate(dashboardPath);
    }
  }, [user, navigate]);

  const handleRoleSelection = (role: 'recruiter' | 'applicant') => {
    setSelectedRole(role);
    if (user?.name && !fullName) {
      setFullName(user.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !fullName.trim()) return;
    if (selectedRole === 'applicant' && !cvFile) {
      toast({
        title: "CV Required",
        description: "Please upload your CV to continue.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (selectedRole === 'applicant' && cvFile) {
        // First upload CV
        await apiService.uploadCV(cvFile);
        // Then create profile with additional data
        await createProfile(selectedRole, {
          full_name: fullName.trim()
        });
        // Refresh auth status to get updated user role
        await checkAuthStatus();
        toast({
          title: "Profile Created",
          description: "Your CV has been processed and profile created!"
        });
      } else {
        await createProfile(selectedRole, {
          full_name: fullName.trim(),
          company: company.trim() || undefined
        });
        toast({
          title: "Profile Created",
          description: `Welcome to AfroServe! Your ${selectedRole} profile has been set up.`
        });
      }

      navigate(selectedRole === 'recruiter' ? '/recruiter-dashboard' : '/applicant-dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/20" />
        <div className="w-full max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AfroServe
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Path
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Tell us how you'd like to use AfroServe so we can personalize your experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card
              className="p-8 bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
              onClick={() => handleRoleSelection('recruiter')}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">I'm a Recruiter</h3>
                <p className="text-white/80 mb-6">
                  Find top talent with AI-powered matching. Post jobs, discover candidates, and streamline your hiring process.
                </p>
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <span>AI-powered candidate matching</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <span>Automated interview scheduling</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <span>Comprehensive candidate insights</span>
                  </div>
                </div>
              </div>
            </Card>
            <Card
              className="p-8 bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
              onClick={() => handleRoleSelection('applicant')}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">I'm Job Seeking</h3>
                <p className="text-white/80 mb-6">
                  Get matched with your dream opportunities. Receive personalized coaching and advance your career.
                </p>
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                    <span>Smart job matching</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                    <span>Personalized skill coaching</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                    <span>Career development insights</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20" />
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-lg border-white/20 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            {selectedRole === 'recruiter' ? (
              <Briefcase className="w-8 h-8 text-white" />
            ) : (
              <Users className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground">
            {selectedRole === 'recruiter'
              ? 'Set up your recruiter profile to start finding talent'
              : 'Upload your CV and we\'ll create your profile automatically'
            }
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          {selectedRole === 'recruiter' && (
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Enter your company name"
              />
            </div>
          )}
          {selectedRole === 'applicant' && (
            <div className="space-y-2">
              <Label>Upload CV *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {cvFile ? cvFile.name : 'Click to upload your CV'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PDF, JPG, or PNG (max 10MB)</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedRole(null)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={loading || !fullName.trim() || (selectedRole === 'applicant' && !cvFile)}
              className="flex-1"
            >
              {loading ? 'Processing...' : 'Complete Setup'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}