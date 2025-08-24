import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  google_id?: string;
  email: string;
  full_name: string;
  role: 'recruiter' | 'applicant';
  profile_completed: boolean;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>({
  google_id: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  role: { type: String, enum: ['recruiter', 'applicant'], required: true },
  profile_completed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);