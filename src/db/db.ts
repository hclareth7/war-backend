import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URL) {
    throw new Error('MONGODB_URL not defined in process.env');
}

mongoose.connect(process.env.MONGODB_URL as string);