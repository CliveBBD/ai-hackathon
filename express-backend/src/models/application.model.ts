import mongoose, { Document } from "mongoose";

const applicationSchema = new mongoose.Schema({
  applicant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'interviewed', 'scheduled', 'rejected', 'hired'], 
    default: 'pending' 
  },
  match_score: { type: Number, min: 0, max: 100 },
  ai_insights: {
    strengths: [String],
    gaps: [String],
    recommendations: [String]
  },
  interview_scheduled: Date,
  notes: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

applicationSchema.index({ applicant_id: 1, project_id: 1 }, { unique: true });

export interface ApplicationDoc extends Document {
  applicant_id: string;
  project_id: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'scheduled' | 'rejected' | 'hired';
  match_score?: number;
  ai_insights?: {
    strengths: string[];
    gaps: string[];
    recommendations: string[];
  };
  interview_scheduled?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export default mongoose.model<ApplicationDoc>("Application", applicationSchema);