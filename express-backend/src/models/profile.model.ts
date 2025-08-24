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
}, {
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
  created_at: Date;
  updated_at: Date;
}

export default mongoose.model<ProfileDoc>("Profile", profileSchema);