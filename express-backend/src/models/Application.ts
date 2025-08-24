import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  applicant_id: mongoose.Types.ObjectId;
  project_id: mongoose.Types.ObjectId;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'offered' | 'hired' | 'rejected';
  match_score: number; // AI calculated 0-100
  cover_letter?: string;
  ai_insights: {
    strengths: string[];
    gaps: string[];
    recommendations: string[];
    match_reasons: string[];
  };
  interview_scheduled?: Date;
  interview_feedback?: string;
  created_at: Date;
  updated_at: Date;
}

const ApplicationSchema = new Schema<IApplication>({
  applicant_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected'], 
    default: 'pending' 
  },
  match_score: { type: Number, required: true, min: 0, max: 100 },
  cover_letter: String,
  ai_insights: {
    strengths: [String],
    gaps: [String],
    recommendations: [String],
    match_reasons: [String]
  },
  interview_scheduled: Date,
  interview_feedback: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Compound index to prevent duplicate applications
ApplicationSchema.index({ applicant_id: 1, project_id: 1 }, { unique: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);