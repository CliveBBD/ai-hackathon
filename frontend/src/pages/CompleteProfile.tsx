import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Brain, Users, Briefcase } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import apiService from '../services/api';

export default function CompleteProfile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roleParam = searchParams.get('role') as 'recruiter' | 'applicant' | null;
  const [selectedRole, setSelectedRole] = useState<'recruiter' | 'applicant' | null>(roleParam);
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await apiService.getCurrentUser();
        if (user.profile_completed) {
          navigate(user.role === 'recruiter' ? '/recruiter-dashboard' : '/applicant-dashboard');
          return;
        }
        if (user.full_name) {
          setFullName(user.full_name);
        }
      } catch (error) {
        navigate('/auth');
      }
    };
    getCurrentUser();
  }, [navigate]);

  const handleRoleSelection = (role: 'recruiter' | 'applicant') => {
    setSelectedRole(role);
    setSearchParams({ role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !fullName.trim()) return;

    setLoading(true);
    try {
      // Update user role first
      await apiService.updateUserRole(selectedRole);

      // Create basic profile
      const profileData = {
        full_name: fullName.trim(),
        bio: `Welcome to AfroServe! I'm excited to connect with opportunities.`,
        location: 'South Africa',
        ...(selectedRole === 'recruiter' ? {
          company: company.trim() || 'Company',
          position: 'Recruiter',
          industry: 'Technology',
          company_size: '50-200',
          specializations: [],
          years_experience: 1
        } : {
          skills: [],
          work_experience: [],
          education: [],
          certifications: [],
          experience_level: 'entry',
          preferred_salary: { min: 300000, max: 500000, currency: 'ZAR' },
          availability: 'negotiable',
          remote_preference: 'flexible'
        })
      };

      if (selectedRole === 'recruiter') {
        await apiService.createRecruiterProfile(profileData);
      } else {
        await apiService.createApplicantProfile(profileData);
      }

      toast({
        title: "Profile Created",
        description: `Welcome to AfroServe! Your ${selectedRole} profile has been set up.`
      });

      // Small delay to ensure backend updates are complete
      setTimeout(() => {
        navigate(selectedRole === 'recruiter' ? '/recruiter-dashboard' : '/applicant-dashboard');
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AfroServe
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Path
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tell us how you'd like to use AfroServe so we can personalize your experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card
              className="p-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-200"
              onClick={() => handleRoleSelection('recruiter')}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">I'm a Recruiter</h3>
                <p className="text-gray-600 mb-6">
                  Find top talent with AI-powered matching. Post jobs, discover candidates, and streamline your hiring process.
                </p>

                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span>AI-powered candidate matching</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span>Automated interview scheduling</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span>Comprehensive candidate insights</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card
              className="p-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-green-200"
              onClick={() => handleRoleSelection('applicant')}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">I'm Job Seeking</h3>
                <p className="text-gray-600 mb-6">
                  Get matched with your dream opportunities. Receive personalized coaching and advance your career.
                </p>

                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span>Smart job matching</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span>Personalized skill coaching</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {selectedRole === 'recruiter' ? (
              <Briefcase className="w-8 h-8 text-white" />
            ) : (
              <Users className="w-8 h-8 text-white" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            {selectedRole === 'recruiter'
              ? 'Set up your recruiter profile to start finding talent'
              : 'Set up your profile to discover opportunities'
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
              disabled={loading || !fullName.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {loading ? 'Creating...' : 'Complete Setup'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}