import {config} from 'dotenv';

config({path: `.env.local`});

export const {
    PORT,
    FRONT_END_SERVER,
    DB_URI,
    JWT_SECRET, JWT_EXPIRES_IN,
    SESSION_DURATION = 60 * 60 * 24 * 7,
    GOOGLE_GEMINI_API_KEY,
} = process.env;