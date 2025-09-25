import mongoose from 'mongoose';
import {DB_URI} from "../config/env.js";

if (!DB_URI) {
    throw new Error(`MongoDB URI is missing`);
}

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`MongoDB URI is connected successfully to the database`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}