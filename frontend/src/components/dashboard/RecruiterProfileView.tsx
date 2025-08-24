import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../hooks/useAuth";
import apiService from "../../services/api";
import { Building2, Mail, Phone, MapPin, Globe, Users, Award } from "lucide-react";

export default function RecruiterProfileView() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const data = await apiService.getProfile(user._id);
      const profileData = data.profile;
      
      setProfile({
        full_name: profileData?.full_name || user.name || '',
        email: profileData?.email || user.email || '',
        company: profileData?.company || '',
        position: profileData?.position || 'Not specified',
        location: profileData?.location || 'Not specified',
        company_size: profileData?.company_size || 'Not specified',
        industry: profileData?.industry || 'Not specified',
        bio: profileData?.bio || '',
        linkedin_url: profileData?.linkedin_url || '',
        specializations: profileData?.specializations || [],
        years_experience: profileData?.years_experience || 0
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'specializations') {
      setProfile({ ...profile, [field]: value.split(',').map(s => s.trim()) });
    } else {
      setProfile({ ...profile, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      await apiService.createRecruiterProfile(profile);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recruiter Profile</h1>
        <Button onClick={handleSave} disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={profile.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="years_experience">Years of Experience</Label>
              <Input
                id="years_experience"
                value={profile.years_experience}
                onChange={(e) => handleInputChange('years_experience', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="company_website">Company Website</Label>
              <Input
                id="company_website"
                value={profile.company_website}
                onChange={(e) => handleInputChange('company_website', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="company_size">Company Size</Label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={profile.company_size}
                onChange={(e) => handleInputChange('company_size', e.target.value)}
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500-1000">500-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={profile.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Professional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                value={profile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about your recruiting experience and expertise..."
              />
            </div>
            <div>
              <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
              <Input
                id="linkedin_url"
                value={profile.linkedin_url}
                onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="specializations">Recruitment Specializations</Label>
              <Input
                id="specializations"
                value={Array.isArray(profile.specializations) ? profile.specializations.join(', ') : ''}
                onChange={(e) => handleInputChange('specializations', e.target.value)}
                placeholder="e.g., Software Development, Data Science, DevOps"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Separate multiple specializations with commas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}