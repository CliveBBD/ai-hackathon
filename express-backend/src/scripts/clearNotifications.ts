import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from '../models/Notification';

dotenv.config();

const clearNotifications = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');

    const result = await Notification.deleteMany({});
    console.log(`Deleted ${result.deletedCount} notifications`);

  } catch (error) {
    console.error('Error clearing notifications:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

clearNotifications();