import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill {
  name: string;
  level: number; // 0-100
  verified: boolean;
}

export interface IWorkExperience {
  company: string;
  position: string;
  duration: string;
  description: string;
  start_date?: Date;
  end_date?: Date;
}

export interface IEducation {
  institution: string;
  degree: string;
  field_of_study?: string;
  year: string;
  grade?: string;
}

export interface IApplicantProfile extends Document {
  user_id: mongoose.Types.ObjectId;
  phone?: string;
  location: string;
  bio: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  skills: ISkill[];
  work_experience: IWorkExperience[];
  education: IEducation[];
  certifications: string[];
  experience_level: 'entry' | 'mid' | 'senior' | 'lead';
  preferred_salary: {
    min: number;
    max: number;
    currency: string;
  };
  availability: 'immediate' | 'two_weeks' | 'one_month' | 'negotiable';
  remote_preference: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  profile_score: number; // AI calculated score 0-100
  created_at: Date;
  updated_at: Date;
}

export interface IRecruiterProfile extends Document {
  user_id: mongoose.Types.ObjectId;
  phone?: string;
  company: string;
  position: string;
  location: string;
  company_website?: string;
  company_size: string;
  industry: string;
  bio: string;
  linkedin_url?: string;
  specializations: string[];
  years_experience: number;
  created_at: Date;
  updated_at: Date;
}

const SkillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  level: { type: Number, required: true, min: 0, max: 100 },
  verified: { type: Boolean, default: false }
});

const WorkExperienceSchema = new Schema<IWorkExperience>({
  company: { type: String, required: true },
  position: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  start_date: Date,
  end_date: Date
});

const EducationSchema = new Schema<IEducation>({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field_of_study: String,
  year: { type: String, required: true },
  grade: String
});

const ApplicantProfileSchema = new Schema<IApplicantProfile>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phone: String,
  location: { type: String, required: true },
  bio: { type: String, default: '' },
  linkedin_url: String,
  github_url: String,
  portfolio_url: String,
  skills: [SkillSchema],
  work_experience: [WorkExperienceSchema],
  education: [EducationSchema],
  certifications: [String],
  experience_level: { type: String, enum: ['entry', 'mid', 'senior', 'lead'], required: true },
  preferred_salary: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'ZAR' }
  },
  availability: { type: String, enum: ['immediate', 'two_weeks', 'one_month', 'negotiable'], default: 'negotiable' },
  remote_preference: { type: String, enum: ['remote', 'hybrid', 'onsite', 'flexible'], default: 'flexible' },
  profile_score: { type: Number, default: 0, min: 0, max: 100 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const RecruiterProfileSchema = new Schema<IRecruiterProfile>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phone: String,
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String, required: true },
  company_website: String,
  company_size: { type: String, required: true },
  industry: { type: String, required: true },
  bio: { type: String, default: '' },
  linkedin_url: String,
  specializations: [String],
  years_experience: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export const ApplicantProfile = mongoose.model<IApplicantProfile>('ApplicantProfile', ApplicantProfileSchema);
export const RecruiterProfile = mongoose.model<IRecruiterProfile>('RecruiterProfile', RecruiterProfileSchema);