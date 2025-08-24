import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X, Plus } from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface ProjectFormProps {
  onSubmit: (projectData: any) => void;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export default function ProjectForm({ onSubmit, onCancel, initialData, isEditing = false }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    company: initialData?.company || '',
    location: initialData?.location || '',
    salary_range: {
      min: initialData?.salary_range?.min || 0,
      max: initialData?.salary_range?.max || 0,
      currency: initialData?.salary_range?.currency || 'ZAR'
    },
    required_skills: initialData?.required_skills || [],
    experience_level: initialData?.experience_level || 'mid',
    certifications: initialData?.certifications || [],
    priority: initialData?.priority || 'medium',
    status: initialData?.status || 'draft'
  });

  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.company) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.required_skills.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one required skill",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.required_skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        required_skills: [...formData.required_skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      required_skills: formData.required_skills.filter(skill => skill !== skillToRemove)
    });
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCertification.trim()]
      });
      setNewCertification('');
    }
  };

  const removeCertification = (certToRemove: string) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter(cert => cert !== certToRemove)
    });
  };

  const commonSkills = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
    'Angular', 'Vue.js', 'Express.js', 'Django', 'Spring Boot', 'Laravel',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'AWS', 'Azure', 'Docker', 'Kubernetes',
    'Git', 'REST APIs', 'GraphQL', 'HTML', 'CSS', 'Sass', 'Tailwind CSS'
  ];

  const commonCertifications = [
    'AWS Certified Solutions Architect', 'AWS Certified Developer',
    'Microsoft Azure Fundamentals', 'Google Cloud Professional',
    'Certified Kubernetes Administrator', 'Docker Certified Associate',
    'Oracle Certified Professional', 'MongoDB Certified Developer',
    'Scrum Master Certification', 'PMP Certification'
  ];

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Job Posting' : 'Create New Job Posting'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Senior React Developer"
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                placeholder="Company name"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g. Cape Town, Remote, Hybrid"
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Select 
                value={formData.experience_level} 
                onValueChange={(value) => setFormData({...formData, experience_level: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                  <SelectItem value="senior">Senior Level (5-8 years)</SelectItem>
                  <SelectItem value="lead">Lead Level (8+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <Label>Salary Range</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <Label htmlFor="salary-min" className="text-sm">Minimum</Label>
                <Input
                  id="salary-min"
                  type="number"
                  value={formData.salary_range.min}
                  onChange={(e) => setFormData({
                    ...formData,
                    salary_range: { ...formData.salary_range, min: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="300000"
                />
              </div>
              <div>
                <Label htmlFor="salary-max" className="text-sm">Maximum</Label>
                <Input
                  id="salary-max"
                  type="number"
                  value={formData.salary_range.max}
                  onChange={(e) => setFormData({
                    ...formData,
                    salary_range: { ...formData.salary_range, max: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="500000"
                />
              </div>
              <div>
                <Label htmlFor="currency" className="text-sm">Currency</Label>
                <Select 
                  value={formData.salary_range.currency}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    salary_range: { ...formData.salary_range, currency: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ZAR">ZAR (South African Rand)</SelectItem>
                    <SelectItem value="USD">USD (US Dollar)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Required Skills */}
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
                <Button type="button" onClick={addSkill} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Common Skills Quick Add */}
              <div>
                <Label className="text-sm text-muted-foreground">Quick add common skills:</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {commonSkills.slice(0, 12).map(skill => (
                    <Button
                      key={skill}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => {
                        if (!formData.required_skills.includes(skill)) {
                          setFormData({
                            ...formData,
                            required_skills: [...formData.required_skills, skill]
                          });
                        }
                      }}
                      disabled={formData.required_skills.includes(skill)}
                    >
                      + {skill}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Selected Skills */}
              {formData.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.required_skills.map(skill => (
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

          {/* Certifications */}
          <div>
            <Label>Preferred Certifications</Label>
            <div className="space-y-3 mt-2">
              <div className="flex gap-2">
                <Input
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="Add a preferred certification"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                />
                <Button type="button" onClick={addCertification} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Common Certifications Quick Add */}
              <div>
                <Label className="text-sm text-muted-foreground">Quick add common certifications:</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {commonCertifications.slice(0, 6).map(cert => (
                    <Button
                      key={cert}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => {
                        if (!formData.certifications.includes(cert)) {
                          setFormData({
                            ...formData,
                            certifications: [...formData.certifications, cert]
                          });
                        }
                      }}
                      disabled={formData.certifications.includes(cert)}
                    >
                      + {cert}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Selected Certifications */}
              {formData.certifications.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.certifications.map(cert => (
                    <Badge key={cert} variant="outline" className="flex items-center gap-1">
                      {cert}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeCertification(cert)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData({...formData, priority: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Job Posting' : 'Create Job Posting'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}