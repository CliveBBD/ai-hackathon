import mongoose, { Document } from "mongoose";

const profileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  role: { type: String, enum: ['recruiter', 'applicant'], required: true },
  full_name: String,
  company: String,
  job_title: String,
  bio: String,
  avatar_url: String,
  linkedin_url: String,
  github_url: String,
  // Applicant specific fields
  education: [{
    institution: String,
    degree: String,
    field: String,
    year: Number
  }],
  work_experience: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  skills: [{
    name: String,
    level: { type: Number, min: 0, max: 100 },
    verified: { type: Boolean, default: false }
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    url: String
  }],
  location: String,
  availability: { type: String, enum: ['immediate', '2weeks', '1month', 'negotiable'] },
  salary_expectation: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  profile_score: { type: Number, default: 0, min: 0, max: 100 }
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export interface ProfileDoc extends Document {
  user_id: string;
  role: 'recruiter' | 'applicant';
  full_name?: string;
  company?: string;
  job_title?: string;
  bio?: string;
  avatar_url?: string;
  linkedin_url?: string;
  github_url?: string;
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    year: number;
  }>;
  work_experience?: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  skills?: Array<{
    name: string;
    level: number;
    verified: boolean;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: Date;
    url: string;
  }>;
  location?: string;
  availability?: 'immediate' | '2weeks' | '1month' | 'negotiable';
  salary_expectation?: {
    min: number;
    max: number;
    currency: string;
  };
  profile_score: number;
  created_at: Date;
  updated_at: Date;
}

export default mongoose.model<ProfileDoc>("Profile", profileSchema);