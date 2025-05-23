import dotenv from "dotenv";

dotenv.config();

export const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL,
    JWT_SECRET,
    REDIS_CONNECTION_URI,
    MONGO_URI,
    APP_PASSWORD,
    SMTP_SENDER,
    FRONTEND_URL,
} = process.env;
