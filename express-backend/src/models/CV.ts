import mongoose from 'mongoose';

const CVSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  about: String,
  github: String,
  profile: String,
  skills: [String],
  experience: [String],
  education: [String],
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export const CV = mongoose.model('CV', CVSchema);