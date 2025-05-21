import dotenv from "dotenv";
import { Request } from "express";
import jwt from "jsonwebtoken";
import Session from "../models/session.model";
import getUserAgent from "./getUserAgent";

dotenv.config();

const generateTokens = async (
    user: Record<string, any>,
    req: Request
): Promise<{
    accessToken: string;
    refreshToken: string;
}> => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error(
                "JWT_SECRET is not defined in environment variables"
            );
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "5m",
        });

        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "5d",
        });

        const sessionExpiry = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 days
        const userAgent = getUserAgent(req);

        const existingSession = await Session.findOne({ user: user._id });

        if (existingSession) {
            await Session.findByIdAndUpdate(existingSession._id, {
                token: refreshToken,
                userAgent,
                ipAddress: req.ip,
                isValid: true,
                expiresAt: sessionExpiry,
            });
        } else {
            await Session.create({
                user: user._id,
                token: refreshToken,
                userAgent,
                ipAddress: req.ip,
                isValid: true,
                expiresAt: sessionExpiry,
            });
        }

        return {
            accessToken,
            refreshToken,
        };
    } catch (error: any) {
        console.error("generateTokens error:", error.message || error);
        throw new Error("Token generation failed");
    }
};

export default generateTokens;
