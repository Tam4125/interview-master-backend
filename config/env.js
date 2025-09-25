import {config} from 'dotenv';

config({path: `.env.local`});

export const {
    PORT,
    SERVER_URL,
    DB_URI,
    JWT_SECRET, JWT_EXPIRES_IN,
    SESSION_DURATION = 60 * 60 * 24 * 7,
    GOOGLE_GEMINI_API_KEY,
    EXPRESS_PUBLIC_VAPI_WEB_TOKEN,
} = process.env;