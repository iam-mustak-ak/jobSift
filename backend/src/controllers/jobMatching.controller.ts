import { NextFunction, Request, Response } from "express";
import gemini from "../config/gemini";
import { buildSimpleMatchPrompt } from "../libs/buildSimpleMatchPrompt ";
import redis from "../libs/redis"; // Redis client
import Job from "../models/job.model";
import User from "../models/user.model";
import safeParseJson from "../utils/safeParseJson";

export const matchJobsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const { _id } = req.user as { _id: string };

        // 🔹 Redis cache key per user + page
        const cacheKey = `matchedJobs:${_id}:page:${page}:limit:${limit}`;
        const cached = await redis.get(cacheKey);

        if (cached) {
            return res.status(200).json({
                success: true,
                message: "Job matches fetched from cache",
                data: JSON.parse(cached),
            });
        }

        // 🔹 Fetch user and jobs
        const user = await User.findById(_id);

        const [jobs, total] = await Promise.all([
            Job.find({})
                .skip(skip)
                .limit(limit)
                .populate("tags")
                .populate("skillsRequired")
                .populate("jobCategory")
                .populate("company")
                .lean(),
            Job.countDocuments({}),
        ]);

        // 🔹 Send prompt to AI
        const prompt = buildSimpleMatchPrompt(user, jobs);
        const raw = await gemini(prompt);
        const parsed = safeParseJson(raw);

        const validatedArray = Array.isArray(parsed) ? parsed : [];
        let matchedJobs = jobs.map((job) => {
            const match = validatedArray.find(
                (m: any) => m.jobId == job._id.toString()
            );
            return {
                ...job,
                matchPercent: match?.matchPercent ?? 0,
                reason: match?.reason ?? "Not enough info",
            };
        });

        matchedJobs = matchedJobs.filter((job) => job.matchPercent > 0);

        await redis.set(cacheKey, JSON.stringify(matchedJobs), "EX", 86400);

        res.status(200).json({
            success: true,
            message: "Job matches generated successfully",
            data: matchedJobs,
            pagination: {
                total: matchedJobs.length,
                page,
                limit,
                totalPages: Math.ceil(matchedJobs.length / limit),
            },
        });
    } catch (err) {
        next(err);
    }
};
