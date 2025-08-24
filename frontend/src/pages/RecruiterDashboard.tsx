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
import RecruiterProfileView from "../components/dashboard/RecruiterProfileView";
import CreateProjectView from "../components/dashboard/CreateProjectView";
import apiService from "../services/api";
import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Eye, 
  Star,
  Edit,
  MoreHorizontal,
  Filter,
  Search
} from "lucide-react";

export default function RecruiterDashboard() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [stats, setStats] = useState({ projects: 0, candidates: 0, interviews: 0, successRate: 0 });
  const [showCandidateDetails, setShowCandidateDetails] = useState<any>(null);
  const [activeView, setActiveView] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get current user
      const currentUser = await apiService.getCurrentUser();
      setUser(currentUser);

      // Get recruiter's projects
      const projectsData = await apiService.getRecruiterProjects(currentUser._id);
      setProjects(projectsData);

      // Get candidates from all projects
      let allCandidates: any[] = [];
      for (const project of projectsData) {
        try {
          const projectCandidates = await apiService.getProjectCandidates(project._id);
          allCandidates = [...allCandidates, ...projectCandidates];
        } catch (error) {
          console.error(`Failed to fetch candidates for project ${project._id}:`, error);
        }
      }
      setCandidates(allCandidates);

      // Calculate stats
      const totalApplications = projectsData.reduce((sum: number, p: any) => sum + (p.applications_count || 0), 0);
      const interviewCount = allCandidates.filter((c: any) => 
        c.application?.status === 'interviewed' || c.application?.status === 'shortlisted'
      ).length;
      const successRate = allCandidates.length > 0 
        ? Math.round((allCandidates.filter((c: any) => c.application?.match_score >= 80).length / allCandidates.length) * 100)
        : 0;

      setStats({
        projects: projectsData.length,
        candidates: allCandidates.length,
        interviews: interviewCount,
        successRate
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

  const scheduleInterview = async (candidateId: string, applicationId: string) => {
    try {
      // For demo purposes, schedule interview for tomorrow
      const interviewDate = new Date();
      interviewDate.setDate(interviewDate.getDate() + 1);
      
      const candidate = candidates.find(c => c._id === candidateId);
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      // Find the project for this application
      const project = projects.find(p => p._id === candidate.application.project_id);
      if (!project) {
        throw new Error('Project not found');
      }

      await apiService.scheduleInterview(project._id, applicationId, interviewDate.toISOString());
      
      // Update local state
      const updatedCandidates = candidates.map(c => 
        c._id === candidateId 
          ? { ...c, application: { ...c.application, status: 'interviewed', interview_scheduled: interviewDate } }
          : c
      );
      setCandidates(updatedCandidates);
      
      toast({
        title: "Success",
        description: "Interview scheduled successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule interview",
        variant: "destructive"
      });
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'notifications':
        return <NotificationsView />;
      case 'edit-profile':
        return <EditProfileView />;
      case 'recruiter-profile':
        return <RecruiterProfileView />;
      case 'create-project':
        return <CreateProjectView />;
      case 'projects':
        return renderProjectsView();
      case 'candidates':
        return renderCandidatesView();
      case 'analytics':
        return renderAnalyticsView();
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projects}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.candidates}</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interviews}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">AI matching accuracy</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your current job postings and their performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project._id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{project.title}</h3>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                    <Badge variant={project.priority === 'high' ? 'destructive' : project.priority === 'medium' ? 'default' : 'outline'}>
                      {project.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {project.applications_count} candidates • {project.matches_count} AI matches
                  </p>
                  <div className="flex gap-1">
                    {project.required_skills?.slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Top AI Matches</CardTitle>
            <CardDescription>Candidates with highest compatibility scores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {candidates.slice(0, 3).map((candidate) => (
              <div key={candidate._id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{candidate.profile?.full_name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{candidate.application?.match_score}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {candidate.profile?.work_experience?.[0]?.position} • {candidate.profile?.location}
                  </p>
                  <div className="flex gap-1">
                    {candidate.profile?.skills?.slice(0, 3).map((skill: any) => (
                      <Badge key={skill.name} variant="outline" className="text-xs">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                  <Progress value={candidate.application?.match_score} className="h-1" />
                </div>
                <div className="ml-4 space-y-2">
                  <Badge variant={
                    candidate.application?.status === 'interviewed' ? 'default' :
                    candidate.application?.status === 'scheduled' ? 'secondary' : 'outline'
                  }>
                    {candidate.application?.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setShowCandidateDetails(candidate)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => scheduleInterview(candidate._id, candidate.application._id)}>
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderProjectsView = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>Manage your job postings</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project._id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{project.title}</h3>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                    <Badge variant={project.priority === 'high' ? 'destructive' : project.priority === 'medium' ? 'default' : 'outline'}>
                      {project.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {project.company} • {project.location} • {project.experience_level}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{project.applications_count} applications</span>
                    <span>{project.matches_count} matches</span>
                    <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCandidatesView = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>All Candidates</CardTitle>
          <CardDescription>Review and manage candidate applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div key={candidate._id} className="p-4 border border-border/50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{candidate.profile?.full_name}</h3>
                      <Badge variant={
                        candidate.application?.status === 'interviewed' ? 'default' :
                        candidate.application?.status === 'scheduled' ? 'secondary' : 'outline'
                      }>
                        {candidate.application?.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{candidate.application?.match_score}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>Location: {candidate.profile?.location}</div>
                      <div>Experience: {candidate.profile?.work_experience?.length} positions</div>
                    </div>
                    <div className="flex gap-1">
                      {candidate.profile?.skills?.slice(0, 5).map((skill: any) => (
                        <Badge key={skill.name} variant="outline" className="text-xs">
                          {skill.name} ({skill.level}%)
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowCandidateDetails(candidate)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button size="sm" onClick={() => scheduleInterview(candidate._id, candidate.application._id)}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalyticsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Hiring Funnel</CardTitle>
            <CardDescription>Track your recruitment process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Applications</span>
                <span className="font-medium">248</span>
              </div>
              <Progress value={100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Reviewed</span>
                <span className="font-medium">186</span>
              </div>
              <Progress value={75} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Interviewed</span>
                <span className="font-medium">42</span>
              </div>
              <Progress value={17} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Hired</span>
                <span className="font-medium">8</span>
              </div>
              <Progress value={3} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Top Skills in Demand</CardTitle>
            <CardDescription>Most requested skills across your projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {['React', 'TypeScript', 'Node.js', 'Python', 'AWS'].map((skill, index) => (
              <div key={skill} className="flex justify-between items-center">
                <span className="text-sm">{skill}</span>
                <div className="flex items-center gap-2">
                  <Progress value={90 - index * 15} className="h-2 w-20" />
                  <span className="text-sm font-medium">{90 - index * 15}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <DashboardLayout userRole="recruiter" activeView={activeView} onViewChange={setActiveView}>
      {renderView()}
      
      {showCandidateDetails && (
        <Dialog open={!!showCandidateDetails} onOpenChange={() => setShowCandidateDetails(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{showCandidateDetails.profile?.full_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Location: {showCandidateDetails.profile?.location}</div>
                      <div>LinkedIn: {showCandidateDetails.profile?.linkedin_url}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Skills</h4>
                    <div className="space-y-2">
                      {showCandidateDetails.profile?.skills?.map((skill: any) => (
                        <div key={skill.name} className="flex justify-between items-center">
                          <span className="text-sm">{skill.name}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={skill.level} className="h-2 w-20" />
                            <span className="text-sm">{skill.level}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Work Experience</h4>
                    <div className="space-y-3">
                      {showCandidateDetails.profile?.work_experience?.map((exp: any, index: number) => (
                        <div key={index} className="border-l-2 border-primary/20 pl-4">
                          <h5 className="font-medium">{exp.position}</h5>
                          <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                          <p className="text-sm mt-1">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCandidateDetails(null)}>Close</Button>
                <Button onClick={() => scheduleInterview(showCandidateDetails._id, showCandidateDetails.application._id)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}