import mongoose, { Document } from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  role: { type: String, enum: ['recruiter', 'applicant'] },
});

export interface UserDoc extends Document {
  googleId: string;
  name: string;
  email: string;
  role?: 'recruiter' | 'applicant';
}
export default mongoose.model<UserDoc>("User", userSchema);