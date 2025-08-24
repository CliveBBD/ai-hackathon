import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../hooks/useAuth";
import apiService from "../../services/api";
import { User, Linkedin, GraduationCap, Award, Plus, X } from "lucide-react";

export default function ApplicantProfileView() {
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
      const data = await apiService.getProfile(user?._id || '');
      const profileData = data.profile;
      
      setProfile({
        full_name: profileData?.full_name || user?.name || '',
        email: profileData?.email || user?.email || '',
        location: profileData?.location || 'Not specified',
        bio: profileData?.bio || '',
        linkedin_url: profileData?.linkedin_url || '',
        github_url: profileData?.github_url || '',
        portfolio_url: profileData?.portfolio_url || '',
        skills: profileData?.skills || [],
        experience_level: profileData?.experience_level || 'entry',
        preferred_salary: profileData?.preferred_salary || { min: 0, max: 0 },
        certifications: profileData?.certifications || [],
        remote_preference: profileData?.remote_preference || 'flexible',
        availability: profileData?.availability || 'negotiable'
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setProfile({ ...profile, [field]: value });
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills?.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...(profile.skills || []), newSkill.trim()] });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills?.filter((s: any) => s !== skill) || [] });
  };

  const addCertification = () => {
    if (newCertification.trim() && !profile.certifications?.includes(newCertification.trim())) {
      setProfile({ ...profile, certifications: [...(profile.certifications || []), newCertification.trim()] });
      setNewCertification("");
    }
  };

  const removeCertification = (cert: string) => {
    setProfile({ ...profile, certifications: profile.certifications?.filter((c: any) => c !== cert) || [] });
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      await apiService.createApplicantProfile(profile);
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
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Button onClick={handleSave} disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
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
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="experience_level">Experience Level</Label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={profile.experience_level}
                onChange={(e) => handleInputChange('experience_level', e.target.value)}
              >
                <option value="Entry-level">Entry-level (0-2 years)</option>
                <option value="Mid-level">Mid-level (2-5 years)</option>
                <option value="Senior">Senior (5-8 years)</option>
                <option value="Lead">Lead (8+ years)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Linkedin className="w-5 h-5" />
              Online Presence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
              <Input
                id="linkedin_url"
                value={profile.linkedin_url}
                onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="github_url">GitHub Profile</Label>
              <Input
                id="github_url"
                value={profile.github_url}
                onChange={(e) => handleInputChange('github_url', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="portfolio_url">Portfolio Website</Label>
              <Input
                id="portfolio_url"
                value={profile.portfolio_url}
                onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
              />
            </div>
            <div>
              <Label>Preferred Salary Range (ZAR)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={profile.preferred_salary?.min || 0}
                  onChange={(e) => handleInputChange('preferred_salary', {
                    ...(profile.preferred_salary || {}),
                    min: parseInt(e.target.value) || 0
                  })}
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={profile.preferred_salary?.max || 0}
                  onChange={(e) => handleInputChange('preferred_salary', {
                    ...(profile.preferred_salary || {}),
                    max: parseInt(e.target.value) || 0
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Professional Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself, your experience, and what you're passionate about..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button onClick={addSkill} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill: any) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a certification"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCertification()}
              />
              <Button onClick={addCertification} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.certifications?.map((cert: any) => (
                <Badge key={cert} variant="outline" className="flex items-center gap-1">
                  {cert}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeCertification(cert)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}