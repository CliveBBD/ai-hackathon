import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { useToast } from "../hooks/use-toast";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newSkill, setNewSkill] = useState("");
  const [newExperience, setNewExperience] = useState({
    company: "", position: "", duration: "", description: ""
  });

  const [profile, setProfile] = useState({
    full_name: "John Doe",
    location: "Cape Town",
    bio: "Passionate full-stack developer with 3 years of experience",
    linkedin_url: "https://linkedin.com/in/johndoe",
    github_url: "https://github.com/johndoe",
    skills: [
      { name: "React", level: 85 },
      { name: "TypeScript", level: 75 },
      { name: "Node.js", level: 70 }
    ],
    work_experience: [{
      company: "TechStart",
      position: "Frontend Developer", 
      duration: "2022-2024",
      description: "Developed React applications"
    }]
  });

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

  const addExperience = () => {
    if (newExperience.company && newExperience.position) {
      setProfile({
        ...profile,
        work_experience: [...profile.work_experience, newExperience]
      });
      setNewExperience({ company: "", position: "", duration: "", description: "" });
    }
  };

  const saveProfile = () => {
    toast({ title: "Success", description: "Profile updated successfully" });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>LinkedIn URL</Label>
                  <Input
                    value={profile.linkedin_url}
                    onChange={(e) => setProfile({...profile, linkedin_url: e.target.value})}
                  />
                </div>
                <div>
                  <Label>GitHub URL</Label>
                  <Input
                    value={profile.github_url}
                    onChange={(e) => setProfile({...profile, github_url: e.target.value})}
                  />
                </div>
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

          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Company"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                />
                <Input
                  placeholder="Position"
                  value={newExperience.position}
                  onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
                />
                <Input
                  placeholder="Duration (e.g., 2022-2024)"
                  value={newExperience.duration}
                  onChange={(e) => setNewExperience({...newExperience, duration: e.target.value})}
                />
                <Button onClick={addExperience}>Add Experience</Button>
              </div>
              <Textarea
                placeholder="Description"
                value={newExperience.description}
                onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
              />
              
              <div className="space-y-3">
                {profile.work_experience.map((exp, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium">{exp.position}</h4>
                    <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                    <p className="text-sm mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button onClick={saveProfile}>Save Profile</Button>
          </div>
        </div>
      </div>
    </div>
  );
}