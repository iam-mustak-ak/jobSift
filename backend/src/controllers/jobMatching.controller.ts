import { NextFunction, Request, Response } from "express";
import gemini from "../config/gemini";
import { buildSimpleMatchPrompt } from "../libs/buildSimpleMatchPrompt ";
import redis from "../libs/redis";
import Job from "../models/job.model";
import User from "../models/user.model";
import safeParseJson from "../utils/safeParseJson";

export const matchJobsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { _id } = req.user as { _id: string };

        const cacheKey = `matchedJobs:${_id}`;
        const cached = await redis.get(cacheKey);
        if (cached) {
            return res.status(200).json({
                success: true,
                message: "Job matches fetched from cache",
                data: JSON.parse(cached),
            });
        }

        const user = await User.findById(_id);
        const jobs = await Job.find({})
            .populate("tags")
            .populate("skillsRequired")
            .populate("jobCategory")
            .populate("company")
            .lean();

        const prompt = buildSimpleMatchPrompt(user, jobs);
        const raw = await gemini(prompt);
        console.log("DEBUG: AI raw response:", raw);

        const parsed = safeParseJson(raw);
        console.log("DEBUG: parsed response:", parsed);

        const validatedArray = Array.isArray(parsed) ? parsed : [parsed];

        let matchedJobs = jobs.map((job) => {
            const match = validatedArray.find(
                (m: any) => m._id == job._id.toString()
            );
            return {
                ...job,
                matchPercent: match?.matchPercent ?? 0,
                reason: match?.reason ?? "Not enough info",
            };
        });

        matchedJobs = matchedJobs.filter((job) => job.matchPercent > 0);
        console.log("DEBUG: final matchedJobs:", matchedJobs);

        await redis.set(cacheKey, JSON.stringify(matchedJobs), "EX", 86400);

        res.status(200).json({
            success: true,
            message: "Job matches generated successfully",
            data: matchedJobs,
        });
    } catch (err) {
        next(err);
    }
};
