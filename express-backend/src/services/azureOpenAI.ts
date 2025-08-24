import { AzureOpenAI } from "openai";
import { IApplicantProfile } from '../models/Profile';
import { IProject } from '../models/Project';
import client from "./llmClient";

class AzureOpenAIService {
  private client: AzureOpenAI;

  constructor() {
    this.client = client;
  }

  async calculateMatchScore(applicant: IApplicantProfile, project: IProject): Promise<{
    score: number;
    insights: {
      strengths: string[];
      gaps: string[];
      recommendations: string[];
      match_reasons: string[];
    };
  }> {
    const prompt = `
    Analyze the match between this candidate and job posting. Return a JSON response with score (0-100) and insights.

    CANDIDATE:
    - Skills: ${applicant.skills.map(s => `${s.name} (${s.level}%)`).join(', ')}
    - Experience Level: ${applicant.experience_level}
    - Work Experience: ${applicant.work_experience.map(w => `${w.position} at ${w.company}`).join(', ')}
    - Education: ${applicant.education.map(e => `${e.degree} from ${e.institution}`).join(', ')}
    - Certifications: ${applicant.certifications.join(', ')}
    - Location: ${applicant.location}
    - Remote Preference: ${applicant.remote_preference}

    JOB POSTING:
    - Title: ${project.title}
    - Required Skills: ${project.required_skills.join(', ')}
    - Preferred Skills: ${project.preferred_skills.join(', ')}
    - Experience Level: ${project.experience_level}
    - Location: ${project.location}
    - Remote Option: ${project.remote_option}
    - Required Certifications: ${project.required_certifications.join(', ')}

    Return JSON format:
    {
      "score": number,
      "insights": {
        "strengths": ["strength1", "strength2"],
        "gaps": ["gap1", "gap2"],
        "recommendations": ["rec1", "rec2"],
        "match_reasons": ["reason1", "reason2"]
      }
    }
    `;

    try {
      const response = await this.client.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      return JSON.parse(content);
    } catch (error) {
      console.error('AI matching error:', error);
      // Fallback calculation
      return this.fallbackMatchCalculation(applicant, project);
    }
  }

  async generateSkillRecommendations(applicant: IApplicantProfile, marketTrends: string[]): Promise<{
    recommendations: Array<{
      skill: string;
      priority: 'high' | 'medium' | 'low';
      reason: string;
      resources: Array<{
        title: string;
        type: 'course' | 'certification' | 'book' | 'tutorial';
        provider?: string;
        url?: string;
        free: boolean;
      }>;
    }>;
  }> {
    const prompt = `
    Based on this candidate's profile and current market trends, recommend skills to improve employability.

    CANDIDATE SKILLS: ${applicant.skills.map(s => `${s.name} (${s.level}%)`).join(', ')}
    EXPERIENCE LEVEL: ${applicant.experience_level}
    MARKET TRENDS: ${marketTrends.join(', ')}

    Return JSON with skill recommendations including learning resources:
    {
      "recommendations": [
        {
          "skill": "skill_name",
          "priority": "high|medium|low",
          "reason": "why this skill is important",
          "resources": [
            {
              "title": "resource title",
              "type": "course|certification|book|tutorial",
              "provider": "provider name",
              "url": "optional url",
              "free": true|false
            }
          ]
        }
      ]
    }
    `;

    try {
      const response = await this.client.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      return JSON.parse(content);
    } catch (error) {
      console.error('AI skill recommendation error:', error);
      return { recommendations: [] };
    }
  }

  async generateJobRecommendations(applicant: IApplicantProfile, availableJobs: IProject[]): Promise<{
    recommendations: Array<{
      project_id: string;
      match_score: number;
      reasons: string[];
    }>;
  }> {
    const prompt = `
    Recommend the best job matches for this candidate from available positions.

    CANDIDATE:
    - Skills: ${applicant.skills.map(s => `${s.name} (${s.level}%)`).join(', ')}
    - Experience: ${applicant.experience_level}
    - Location: ${applicant.location}
    - Remote Preference: ${applicant.remote_preference}

    AVAILABLE JOBS:
    ${availableJobs.map(job => `
    ID: ${job._id}
    Title: ${job.title}
    Skills: ${job.required_skills.join(', ')}
    Experience: ${job.experience_level}
    Location: ${job.location}
    Remote: ${job.remote_option}
    `).join('\n')}

    Return JSON with top 5 recommendations:
    {
      "recommendations": [
        {
          "project_id": "job_id",
          "match_score": number,
          "reasons": ["reason1", "reason2"]
        }
      ]
    }
    `;

    try {
      const response = await this.client.chat.completions.create({
        model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      return JSON.parse(content);
    } catch (error) {
      console.error('AI job recommendation error:', error);
      return { recommendations: [] };
    }
  }

  private fallbackMatchCalculation(applicant: IApplicantProfile, project: IProject) {
    let score = 0;
    const insights = {
      strengths: [] as string[],
      gaps: [] as string[],
      recommendations: [] as string[],
      match_reasons: [] as string[]
    };

    // Skills match (40% weight)
    const applicantSkills = applicant.skills.map(s => s.name.toLowerCase());
    const requiredSkills = project.required_skills.map(s => s.toLowerCase());
    const skillMatches = requiredSkills.filter(skill =>
      applicantSkills.some(appSkill => appSkill.includes(skill) || skill.includes(appSkill))
    );
    const skillScore = (skillMatches.length / requiredSkills.length) * 40;
    score += skillScore;

    if (skillMatches.length > 0) {
      insights.strengths.push(`Strong match in ${skillMatches.length} required skills`);
      insights.match_reasons.push(`Has ${skillMatches.join(', ')} skills`);
    }

    // Experience level match (30% weight)
    const expLevels = ['entry', 'mid', 'senior', 'lead'];
    const applicantLevel = expLevels.indexOf(applicant.experience_level);
    const projectLevel = expLevels.indexOf(project.experience_level);
    const expScore = Math.max(0, 30 - Math.abs(applicantLevel - projectLevel) * 10);
    score += expScore;

    // Location/Remote match (20% weight)
    let locationScore = 0;
    if (project.remote_option === 'remote' || applicant.remote_preference === 'remote') {
      locationScore = 20;
    } else if (applicant.location.toLowerCase().includes(project.location.toLowerCase())) {
      locationScore = 20;
    } else {
      locationScore = 10;
    }
    score += locationScore;

    // Certifications (10% weight)
    const certScore = project.required_certifications.length > 0 ?
      (applicant.certifications.filter(cert =>
        project.required_certifications.some(req =>
          cert.toLowerCase().includes(req.toLowerCase())
        )
      ).length / project.required_certifications.length) * 10 : 10;
    score += certScore;

    return { score: Math.round(score), insights };
  }
}

export default new AzureOpenAIService();