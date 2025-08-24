import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user_id: mongoose.Types.ObjectId;
  type: 'application_status' | 'interview_scheduled' | 'new_match' | 'skill_recommendation' | 'profile_update';
  title: string;
  message: string;
  data?: any; // Additional data for the notification
  read: boolean;
  created_at: Date;
}

const NotificationSchema = new Schema<INotification>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['application_status', 'interview_scheduled', 'new_match', 'skill_recommendation', 'profile_update'], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: Schema.Types.Mixed,
  read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<INotification>('Notification', NotificationSchema);