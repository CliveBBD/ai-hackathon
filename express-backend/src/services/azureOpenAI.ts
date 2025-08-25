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

      return this.safeJsonParse(content, this.fallbackMatchCalculation(applicant, project));
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
    // Return empty recommendations if no data available
    if (!applicant.skills || applicant.skills.length === 0) {
      return { recommendations: [] };
    }

    try {
      // Use fallback recommendations instead of AI for now
      return this.fallbackSkillRecommendations(applicant);
    } catch (error) {
      console.error('Skill recommendation error:', error);
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
    // If no jobs available or no applicant skills, return empty
    if (!availableJobs.length || !applicant.skills.length) {
      return { recommendations: [] };
    }

    try {
      // Use fallback calculation instead of AI for now
      return this.fallbackJobRecommendations(applicant, availableJobs);
    } catch (error) {
      console.error('Job recommendation error:', error);
      return { recommendations: [] };
    }
  }

  private fallbackSkillRecommendations(applicant: IApplicantProfile) {
    const recommendations = [
      {
        skill: 'Communication',
        priority: 'high' as const,
        reason: 'Essential for all professional roles',
        resources: [
          {
            title: 'Effective Communication Course',
            type: 'course' as const,
            provider: 'Online Learning',
            free: true
          }
        ]
      },
      {
        skill: 'Problem Solving',
        priority: 'medium' as const,
        reason: 'Highly valued by employers',
        resources: [
          {
            title: 'Critical Thinking Guide',
            type: 'book' as const,
            provider: 'Learning Resources',
            free: false
          }
        ]
      }
    ];

    return { recommendations };
  }

  private fallbackJobRecommendations(applicant: IApplicantProfile, availableJobs: IProject[]) {
    const recommendations = availableJobs.map(job => {
      const matchResult = this.fallbackMatchCalculation(applicant, job);
      return {
        project_id: (job._id as any).toString(),
        match_score: matchResult.score,
        reasons: matchResult.insights.match_reasons
      };
    })
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 5);

    return { recommendations };
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

  private cleanJsonResponse(content: string): string {
    // Remove markdown code blocks
    let cleaned = content.replace(/```json\s*|```\s*$/g, '').trim();
    
    // Remove any text before the first { or [
    const jsonStart = Math.min(
      cleaned.indexOf('{') === -1 ? Infinity : cleaned.indexOf('{'),
      cleaned.indexOf('[') === -1 ? Infinity : cleaned.indexOf('[')
    );
    
    if (jsonStart !== Infinity && jsonStart > 0) {
      cleaned = cleaned.substring(jsonStart);
    }
    
    // Remove any text after the last } or ]
    const lastBrace = cleaned.lastIndexOf('}');
    const lastBracket = cleaned.lastIndexOf(']');
    const jsonEnd = Math.max(lastBrace, lastBracket);
    
    if (jsonEnd !== -1 && jsonEnd < cleaned.length - 1) {
      cleaned = cleaned.substring(0, jsonEnd + 1);
    }
    
    return cleaned;
  }

  private safeJsonParse(content: string, fallback: any): any {
    try {
      const cleaned = this.cleanJsonResponse(content);
      
      // Check if JSON appears complete
      if (!this.isValidJsonStructure(cleaned)) {
        console.warn('Incomplete JSON detected, using fallback');
        return fallback;
      }
      
      return JSON.parse(cleaned);
    } catch (error) {
      console.error('JSON parse error:', error);
      console.error('Content:', content.substring(0, 500) + '...');
      return fallback;
    }
  }

  private isValidJsonStructure(content: string): boolean {
    const trimmed = content.trim();
    
    // Check if it starts and ends properly
    if (trimmed.startsWith('{') && !trimmed.endsWith('}')) return false;
    if (trimmed.startsWith('[') && !trimmed.endsWith(']')) return false;
    
    // Count braces and brackets
    let braceCount = 0;
    let bracketCount = 0;
    
    for (const char of trimmed) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (char === '[') bracketCount++;
      if (char === ']') bracketCount--;
    }
    
    return braceCount === 0 && bracketCount === 0;
  }
}

export default new AzureOpenAIService();