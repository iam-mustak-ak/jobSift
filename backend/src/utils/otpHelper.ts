import { Response } from "express";
import redis from "../libs/redis";
import EmailTemplates from "../services/email-template";
import generateOtp from "./generateOtp";

export const checkOtpRestrictions = async (email: string, res: Response) => {
    if (await redis.get(`otp_lock:${email}`)) {
        throw new Error(
            "You have reached the maximum number of OTP requests. Please try after 30 minutes."
        );
    }
    if (await redis.get(`otp_spam_lock:${email}`)) {
        throw new Error("Too many OTP requests. Please try after 1 hour.");
    }

    if (await redis.get(`otp_cooldown:${email}`)) {
        throw new Error("Please wait for 1 minute before requesting a new OTP");
    }
};

export const trackOtpRequest = async (email: string) => {
    const otpRequests = parseInt(
        (await redis.get(`otp_requests:${email}`)) || "0"
    );

    if (otpRequests >= 2) {
        await redis.set(`otp_spam_lock:${email}`, "true", "EX", 3600);

        throw new Error(
            "You have reached the maximum number of OTP requests. Please try after 1 hour."
        );
    }

    await redis.set(`otp_requests:${email}`, otpRequests + 1, "EX", 3600);
};

export const verifyOtp = async (email: string, otp: string) => {
    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp) {
        throw new Error("OTP expired or not found");
    }

    const attempts = parseInt(
        (await redis.get(`otp_attempts:${email}`)) || "0"
    );
    if (storedOtp !== otp) {
        if (attempts >= 2) {
            await redis.set(`otp_lock:${email}`, "true", "EX", 1800);
            throw new Error(
                "You have reached the maximum number of OTP attempts. Please try after 30 minutes."
            );
        }
        await redis.set(`otp_attempts:${email}`, attempts + 1, "EX", 1800);
        throw new Error(`Invalid OTP. ${2 - attempts} attempts left`);
    }

    await redis.del(`otp:${email}`, `otp_attempts:${email}`);
};

export const sendOtp = async (email: string) => {
    const otp = generateOtp();

    const emailTemplate = new EmailTemplates("otp-verification");
    await emailTemplate.setOtp(otp).sendEmail(email);

    await redis.set(`otp:${email}`, otp, "EX", 300);
    await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};
