import { NextFunction } from "express";
import redis from "../libs/redis";
import customError from "./customError";

export const trackResetEmail = async (email: string, next: NextFunction) => {
    const resetRequest = parseInt(
        (await redis.get(`reset_requests:${email}`)) || "0"
    );

    if (resetRequest >= 3) {
        await redis.set(`reset_lock:${email}`, "true", "EX", 3600);

        next(
            customError(
                429,
                "You have reached the maximum number of Reset requests. Please try after 1 hour."
            )
        );
        return;
    }

    await redis.set(`reset_requests:${email}`, resetRequest + 1, "EX", 3600);
};
