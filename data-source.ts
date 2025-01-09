import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://root:OulUMKQy1ZFXv8VOYi8rnlYlfPORRWs4yByl3bHNldvGZ0i3dOeC9KdIIDWmWCyP@88.209.197.136:5411/?directConnection=true';

export const connectDatabase = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};
