import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  recruiter_id: mongoose.Types.ObjectId;
  title: string;
  company: string;
  description: string;
  location: string;
  remote_option: 'remote' | 'hybrid' | 'onsite';
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship';
  experience_level: 'entry' | 'mid' | 'senior' | 'lead';
  required_skills: string[];
  preferred_skills: string[];
  required_certifications: string[];
  salary_range: {
    min: number;
    max: number;
    currency: string;
  };
  benefits: string[];
  requirements: string[];
  responsibilities: string[];
  status: 'draft' | 'active' | 'paused' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  applications_count: number;
  matches_count: number;
  deadline?: Date;
  created_at: Date;
  updated_at: Date;
}

const ProjectSchema = new Schema<IProject>({
  recruiter_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  remote_option: { type: String, enum: ['remote', 'hybrid', 'onsite'], required: true },
  employment_type: { type: String, enum: ['full_time', 'part_time', 'contract', 'internship'], required: true },
  experience_level: { type: String, enum: ['entry', 'mid', 'senior', 'lead'], required: true },
  required_skills: [{ type: String, required: true }],
  preferred_skills: [String],
  required_certifications: [String],
  salary_range: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'ZAR' }
  },
  benefits: [String],
  requirements: [String],
  responsibilities: [String],
  status: { type: String, enum: ['draft', 'active', 'paused', 'closed'], default: 'draft' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  applications_count: { type: Number, default: 0 },
  matches_count: { type: Number, default: 0 },
  deadline: Date,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IProject>('Project', ProjectSchema);