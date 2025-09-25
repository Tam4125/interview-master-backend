import {config} from 'dotenv';

config({path: `.env.local`});

export const {
    PORT,
    PRODUCTION_SERVER_URL_FRONTEND,
    DB_URI,
    JWT_SECRET, JWT_EXPIRES_IN,
    SESSION_DURATION = 60 * 60 * 24 * 7,
    GOOGLE_GEMINI_API_KEY,
} = process.env;