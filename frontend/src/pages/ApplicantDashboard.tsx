import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useToast } from "../hooks/use-toast";
import DashboardLayout from "../components/DashboardLayout";
import NotificationsView from "../components/dashboard/NotificationsView";
import EditProfileView from "../components/dashboard/EditProfileView";
import ApplicantProfileView from "../components/dashboard/ApplicantProfileView";
import apiService from "../services/api";
import { 
  User, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Star,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Award,
  Target,
  Zap,
  Filter
} from "lucide-react";

export default function ApplicantDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [skillProgress, setSkillProgress] = useState<any[]>([]);
  const [coachingRecommendations, setCoachingRecommendations] = useState<any[]>([]);
  const [stats, setStats] = useState({ applications: 0, interviews: 0, profileScore: 0, skillsProgress: 0 });
  const [activeView, setActiveView] = useState("overview");
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get current user
      const currentUser = await apiService.getCurrentUser();
      setUser(currentUser);

      // Get user profile
      const profileData = await apiService.getProfile(currentUser._id);
      setProfile(profileData.profile);

      // Get applications
      const applicationsData = await apiService.getApplicantApplications(currentUser._id);
      setApplications(applicationsData);

      // Get job recommendations
      const recommendationsData = await apiService.getJobRecommendations(currentUser._id);
      setRecommendations(recommendationsData.recommendations || []);

      // Get coaching recommendations
      const coachingData = await apiService.getCoachingRecommendations(currentUser._id);
      setCoachingRecommendations(coachingData.recommendations || []);

      // Set skill progress from profile
      if (profileData.profile?.skills) {
        setSkillProgress(profileData.profile.skills);
      }

      // Calculate stats
      const interviewCount = applicationsData.filter((a: any) => 
        a.status === 'interviewed' || a.status === 'shortlisted'
      ).length;
      
      const avgSkillLevel = profileData.profile?.skills?.length > 0 
        ? Math.round(profileData.profile.skills.reduce((sum: number, s: any) => sum + s.level, 0) / profileData.profile.skills.length)
        : 0;

      setStats({
        applications: applicationsData.length,
        interviews: interviewCount,
        profileScore: profileData.profile?.profile_score || 0,
        skillsProgress: avgSkillLevel
      });
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    }
  };

  const applyToJob = async (projectId: string) => {
    try {
      await apiService.applyToProject(projectId);
      toast({
        title: "Success",
        description: "Application submitted successfully"
      });
      // Refresh applications
      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive"
      });
    }
  };

  const updateSkillLevel = async (skillName: string, newLevel: number) => {
    try {
      if (!user) return;
      
      await apiService.updateSkillLevel(user._id, skillName, newLevel);
      
      // Update local state
      const updatedSkills = profile?.skills?.map((skill: any) =>
        skill.name === skillName ? { ...skill, level: newLevel } : skill
      ) || [];
      
      setProfile({ ...profile, skills: updatedSkills });
      setSkillProgress(updatedSkills);
      
      const newAverage = updatedSkills.length > 0 
        ? Math.round(updatedSkills.reduce((sum: number, s: any) => sum + s.level, 0) / updatedSkills.length)
        : 0;
      setStats({ ...stats, skillsProgress: newAverage });
      
      toast({
        title: "Success",
        description: `${skillName} skill updated to ${newLevel}%`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update skill",
        variant: "destructive"
      });
    }
  };

  const formatSalary = (salary: any) => {
    if (!salary) return "Not specified";
    return `R${(salary.min / 1000)}k - R${(salary.max / 1000)}k`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interviewed': return 'default';
      case 'scheduled': return 'secondary';
      case 'pending': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'interviewed': return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'scheduled': return <Calendar className="w-3 h-3 mr-1" />;
      case 'pending': return <Clock className="w-3 h-3 mr-1" />;
      case 'rejected': return <AlertCircle className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'notifications':
        return <NotificationsView />;
      case 'edit-profile':
        return <EditProfileView />;
      case 'applicant-profile':
        return <ApplicantProfileView />;
      case 'applications':
        return renderApplicationsView();
      case 'recommendations':
        return renderRecommendationsView();
      case 'skills':
        return renderSkillsView();
      case 'coaching':
        return renderCoachingView();
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applications}</div>
            <p className="text-xs text-muted-foreground">+3 this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interviews}</div>
            <p className="text-xs text-muted-foreground">2 scheduled</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Score</CardTitle>
            <Star className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profileScore}%</div>
            <p className="text-xs text-muted-foreground">+5% this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.skillsProgress}%</div>
            <p className="text-xs text-muted-foreground">Average completion</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Track the status of your job applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {applications.slice(0, 3).map((app) => (
              <div key={app._id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{app.project.title}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{app.match_score}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {app.project.company} • {new Date(app.created_at).toLocaleDateString()}
                  </p>
                  <Badge variant={getStatusColor(app.status)}>
                    {getStatusIcon(app.status)}
                    {app.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>AI Job Recommendations</CardTitle>
            <CardDescription>Jobs matched to your profile and skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.slice(0, 2).map((job) => (
              <div key={job._id} className="p-4 border border-border/50 rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{job.project.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.project.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{job.project.location}</span>
                      <span className="text-sm font-medium text-secondary">{formatSalary(job.project.salary_range)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{job.matchScore}%</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {job.project.required_skills?.map((skill: string) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <Button size="sm" className="w-full" onClick={() => applyToJob(job._id)}>
                  Apply Now
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderApplicationsView = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Applications</CardTitle>
              <CardDescription>Track all your job applications</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="p-4 border border-border/50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{app.project.title}</h3>
                      <Badge variant={getStatusColor(app.status)}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{app.match_score}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>Company: {app.project.company}</div>
                      <div>Location: {app.project.location}</div>
                      <div>Salary: {formatSalary(app.project.salary_range)}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Applied: {new Date(app.created_at).toLocaleDateString()}
                      {app.interview_scheduled && (
                        <span className="ml-4">
                          Interview: {new Date(app.interview_scheduled).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRecommendationsView = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>AI Job Recommendations</CardTitle>
          <CardDescription>Personalized job matches based on your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {recommendations.map((job) => (
              <div key={job._id} className="p-6 border border-border/50 rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">{job.project.title}</h3>
                    <p className="text-muted-foreground">{job.project.company}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.project.location}
                      </div>
                      <div className="font-medium text-secondary">
                        {formatSalary(job.project.salary_range)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-lg font-medium">{job.matchScore}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Match Score</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Required Skills</h4>
                    <div className="flex gap-1 flex-wrap">
                      {job.project.required_skills?.map((skill: string) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-green-600">Your Strengths</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {job.insights?.strengths?.map((strength: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            {strength}
                          </li>
                        )) || <li className="text-muted-foreground">No strengths data available</li>}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-orange-600">Areas to Improve</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {job.insights?.gaps?.map((gap: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <Target className="w-3 h-3 text-orange-600" />
                            {gap}
                          </li>
                        )) || <li className="text-muted-foreground">No gaps data available</li>}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => applyToJob(job._id)}>
                    Apply Now
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSkillsView = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>Skills Portfolio</CardTitle>
          <CardDescription>Track and improve your technical skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {skillProgress.map((skill) => (
              <div key={skill.name} className="space-y-3 p-4 border border-border/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{skill.name}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSkill(skill)}>
                    <User className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Current Level</span>
                    <span>{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Target: {skill.target}%</span>
                    <span>{skill.target - skill.level}% to go</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCoachingView = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            AI Skill Coaching
          </CardTitle>
          <CardDescription>Personalized recommendations to improve your employability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {coachingRecommendations.map((rec, index) => (
            <div key={index} className="p-4 border border-border/50 rounded-lg space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={rec.priority === 'high' ? 'destructive' : 'default'}>
                      {rec.priority} priority
                    </Badge>
                    <h3 className="font-medium">{rec.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      {rec.estimatedImpact}
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <Clock className="w-3 h-3" />
                      {rec.timeEstimate}
                    </div>
                  </div>
                </div>
                <Zap className="w-5 h-5 text-accent" />
              </div>
              
              {rec.resources && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Recommended Resources</h4>
                  <div className="space-y-2">
                    {rec.resources.map((resource: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{resource.title}</span>
                          {resource.free && <Badge variant="outline" className="text-xs">Free</Badge>}
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <Button size="sm">Start Learning</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout userRole="applicant" activeView={activeView} onViewChange={setActiveView}>
      {renderView()}

      {selectedSkill && (
        <Dialog open={!!selectedSkill} onOpenChange={() => setSelectedSkill(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update {selectedSkill.name} Skill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label>Current Level: {selectedSkill.level}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedSkill.level}
                  onChange={(e) => setSelectedSkill({...selectedSkill, level: parseInt(e.target.value)})}
                  className="w-full mt-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedSkill(null)}>Cancel</Button>
                <Button onClick={() => {
                  updateSkillLevel(selectedSkill.name, selectedSkill.level);
                  setSelectedSkill(null);
                }}>
                  Update Skill
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}