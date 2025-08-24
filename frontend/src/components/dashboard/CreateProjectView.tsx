import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Plus, X } from "lucide-react";

export default function CreateProjectView() {
  const [newSkill, setNewSkill] = useState("");
  const [project, setProject] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary_range: { min: 0, max: 0, currency: "ZAR" },
    required_skills: [''],
    experience_level: "mid",
    priority: "medium",
    status: "draft"
  });

  const commonSkills = [
    "React", "TypeScript", "JavaScript", "Node.js", "Python", "Java",
    "Angular", "Vue.js", "MongoDB", "PostgreSQL", "AWS", "Docker"
  ];

  const addSkill = () => {
    if (newSkill.trim() && !project.required_skills.includes(newSkill.trim())) {
      setProject({
        ...project,
        required_skills: [...project.required_skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProject({
      ...project,
      required_skills: project.required_skills.filter(skill => skill !== skillToRemove)
    });
  };

  const addQuickSkill = (skill: string) => {
    if (!project.required_skills.includes(skill)) {
      setProject({
        ...project,
        required_skills: [...project.required_skills, skill]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create New Job Posting</h1>
        <p className="text-muted-foreground">Post a new job opportunity</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Job Title *</Label>
              <Input
                value={project.title}
                onChange={(e) => setProject({...project, title: e.target.value})}
                placeholder="e.g. Senior React Developer"
              />
            </div>
            <div>
              <Label>Company *</Label>
              <Input
                value={project.company}
                onChange={(e) => setProject({...project, company: e.target.value})}
                placeholder="Company name"
              />
            </div>
          </div>

          <div>
            <Label>Job Description *</Label>
            <Textarea
              value={project.description}
              onChange={(e) => setProject({...project, description: e.target.value})}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Location</Label>
              <Input
                value={project.location}
                onChange={(e) => setProject({...project, location: e.target.value})}
                placeholder="e.g. Cape Town, Remote"
              />
            </div>
            <div>
              <Label>Experience Level</Label>
              <Select 
                value={project.experience_level} 
                onValueChange={(value) => setProject({...project, experience_level: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="lead">Lead Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Required Skills *</Label>
            <div className="space-y-3 mt-2">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a required skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Quick add:</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {commonSkills.map(skill => (
                    <Button
                      key={skill}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => addQuickSkill(skill)}
                      disabled={project.required_skills.includes(skill)}
                    >
                      + {skill}
                    </Button>
                  ))}
                </div>
              </div>

              {project.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.required_skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Create Job Posting</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}