import { NextFunction, Response } from "express";
import redis from "../libs/redis";
import EmailTemplates from "../services/email-template";
import customError from "./customError";
import generateOtp from "./generateOtp";

export const checkOtpRestrictions = async (
    email: string,
    res: Response,
    next: NextFunction
) => {
    if (await redis.get(`otp_lock:${email}`)) {
        next(
            customError(
                429,
                "You have reached the maximum number of OTP requests. Please try after 30 minutes."
            )
        );
        return;
    }
    if (await redis.get(`otp_spam_lock:${email}`)) {
        next(
            customError(429, "Too many OTP requests. Please try after 1 hour.")
        );
        return;
    }

    if (await redis.get(`otp_cooldown:${email}`)) {
        next(
            customError(
                429,
                "Please wait for 1 minute before requesting a new OTP"
            )
        );
        return;
    }
};

export const trackOtpRequest = async (email: string, next: NextFunction) => {
    const otpRequests = parseInt(
        (await redis.get(`otp_requests:${email}`)) || "0"
    );

    if (otpRequests >= 3) {
        await redis.set(`otp_spam_lock:${email}`, "true", "EX", 3600);

        next(
            customError(
                429,
                "You have reached the maximum number of OTP requests. Please try after 1 hour."
            )
        );
        return;
    }

    await redis.set(`otp_requests:${email}`, otpRequests + 1, "EX", 3600);
};

export const verifyOtp = async (
    email: string,
    otp: string
) => {
    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp) {
        throw customError(400, "OTP expired or not found");
    }

    const attempts = Number.parseInt(
        (await redis.get(`otp_attempts:${email}`)) || "0",
        10,
    );
    if (storedOtp !== otp) {
        const attemptsUsed = attempts + 1;
        const attemptsLeft = Math.max(0, 3 - attemptsUsed);
        if (attemptsLeft === 0) {
            await redis.set(`otp_lock:${email}`, "true", "EX", 1800);
            await redis.set(`otp_attempts:${email}`, attemptsUsed, "EX", 1800);
            const error = customError(
                429,
                "You have used all verification attempts. Please try again after 30 minutes.",
            ) as Error & { attemptsLeft?: number };
            error.attemptsLeft = attemptsLeft;
            throw error;
        }
        await redis.set(`otp_attempts:${email}`, attemptsUsed, "EX", 1800);
        const error = customError(
            400,
            `Invalid OTP. ${attemptsLeft} attempts left`,
        ) as Error & { attemptsLeft?: number };
        error.attemptsLeft = attemptsLeft;
        throw error;
    }

    await redis.del(`otp:${email}`, `otp_attempts:${email}`);
};

export const sendOtp = async (email: string) => {
    const otp = generateOtp();

    const emailTemplate = new EmailTemplates("otp-verification");
    await emailTemplate.setOtp(otp).sendEmail(email);

    await redis.del(`otp_attempts:${email}`);
    await redis.set(`otp:${email}`, otp, "EX", 300);
    await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};
