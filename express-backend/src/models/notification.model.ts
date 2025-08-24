import mongoose, { Document } from "mongoose";

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['application_status', 'interview_scheduled', 'skill_coaching', 'new_match', 'project_update'], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  data: mongoose.Schema.Types.Mixed
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export interface NotificationDoc extends Document {
  user_id: string;
  type: 'application_status' | 'interview_scheduled' | 'skill_coaching' | 'new_match' | 'project_update';
  title: string;
  message: string;
  read: boolean;
  data?: any;
  created_at: Date;
  updated_at: Date;
}

export default mongoose.model<NotificationDoc>("Notification", notificationSchema);