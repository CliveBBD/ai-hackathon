import mongoose, { Document } from "mongoose";

const projectSchema = new mongoose.Schema({
  recruiter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  salary_range: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  required_skills: [String],
  experience_level: { type: String, enum: ['entry', 'mid', 'senior', 'lead'], required: true },
  certifications: [String],
  status: { type: String, enum: ['draft', 'active', 'paused', 'closed'], default: 'draft' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  applications_count: { type: Number, default: 0 },
  matches_count: { type: Number, default: 0 }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export interface ProjectDoc extends Document {
  recruiter_id: string;
  title: string;
  description: string;
  company: string;
  location?: string;
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  required_skills: string[];
  experience_level: 'entry' | 'mid' | 'senior' | 'lead';
  certifications: string[];
  status: 'draft' | 'active' | 'paused' | 'closed';
  priority: 'low' | 'medium' | 'high';
  applications_count: number;
  matches_count: number;
  created_at: Date;
  updated_at: Date;
}

export default mongoose.model<ProjectDoc>("Project", projectSchema);