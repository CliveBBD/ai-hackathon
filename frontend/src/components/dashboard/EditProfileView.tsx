import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Plus, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../ui/use-toast";
import apiService from "../../services/api";

export default function EditProfileView() {
  const [newSkill, setNewSkill] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const data = await apiService.getProfile(user._id);
      setProfile(data.profile || {
        full_name: user.name || '',
        location: '',
        bio: '',
        linkedin_url: '',
        skills: []
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfile({
        ...profile,
        skills: [...profile.skills, { name: newSkill.trim(), level: 50 }]
      });
      setNewSkill("");
    }
  };

  const updateSkillLevel = (index: number, level: number) => {
    const updatedSkills = [...profile.skills];
    updatedSkills[index].level = level;
    setProfile({ ...profile, skills: updatedSkills });
  };

  const removeSkill = (index: number) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((_, i) => i !== index)
    });
  };

  const saveProfile = async () => {
    if (!user || !profile) return;
    
    setLoading(true);
    try {
      if (user.role === 'applicant') {
        await apiService.createApplicantProfile(profile);
      } else {
        await apiService.createRecruiterProfile(profile);
      }
      
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
      <div>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <p className="text-muted-foreground">Update your profile information and skills</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={profile.full_name}
                  onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                rows={3}
              />
            </div>
            <div>
              <Label>LinkedIn URL</Label>
              <Input
                value={profile.linkedin_url}
                onChange={(e) => setProfile({...profile, linkedin_url: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add new skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button onClick={addSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {profile.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeSkill(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={skill.level} className="flex-1" />
                      <span className="text-sm w-12">{skill.level}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={(e) => updateSkillLevel(index, parseInt(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={saveProfile} disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
}