import express from 'express';
import Project from '../models/Project';
import Application from '../models/Application';
import { ApplicantProfile } from '../models/Profile';
import azureOpenAI from '../services/azureOpenAI';
import Notification from '../models/Notification';

const router = express.Router();

const requireAuth = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Get recruiter's projects
router.get('/recruiter/:recruiterId', requireAuth, async (req, res) => {
  try {
    const projects = await Project.find({ recruiter_id: req.params.recruiterId })
      .sort({ created_at: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create new project
router.post('/', requireAuth, async (req, res) => {
  try {
    const user = req.user as any;
    
    if (user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only recruiters can create projects' });
    }

    const projectData = {
      ...req.body,
      recruiter_id: user._id,
      created_at: new Date(),
      updated_at: new Date()
    };

    const project = new Project(projectData);
    await project.save();

    res.status(201).json(project);
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:projectId', requireAuth, async (req, res) => {
  try {
    const user = req.user as any;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.recruiter_id.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      { ...req.body, updated_at: new Date() },
      { new: true }
    );

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Get project candidates with AI matching
router.get('/:projectId/candidates', requireAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const applications = await Application.find({ project_id: req.params.projectId })
      .populate({
        path: 'applicant_id',
        select: 'full_name email'
      })
      .sort({ match_score: -1 });

    // Get applicant profiles
    const candidatesWithProfiles = await Promise.all(
      applications.map(async (app) => {
        const profile = await ApplicantProfile.findOne({ user_id: app.applicant_id });
        return {
          _id: app._id,
          application: app,
          profile: profile
        };
      })
    );

    res.json(candidatesWithProfiles);
  } catch (error) {
    console.error('Candidates fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// Schedule interview
router.post('/:projectId/schedule-interview', requireAuth, async (req, res) => {
  try {
    const { applicationId, interviewDate } = req.body;
    
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { 
        interview_scheduled: new Date(interviewDate),
        status: 'interviewed',
        updated_at: new Date()
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Create notification for applicant
    await new Notification({
      user_id: application.applicant_id,
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      message: `Your interview has been scheduled for ${new Date(interviewDate).toLocaleDateString()}`,
      data: { applicationId, interviewDate }
    }).save();

    res.json(application);
  } catch (error) {
    console.error('Interview scheduling error:', error);
    res.status(500).json({ error: 'Failed to schedule interview' });
  }
});

// Get all active projects (for job recommendations)
router.get('/active', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'active' })
      .select('title company location required_skills experience_level remote_option salary_range')
      .limit(50);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active projects' });
  }
});

export default router;