import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextFunction, Request, Response } from "express";
import { convert } from "html-to-text";
import { buildSimpleMatchPrompt } from "../libs/buildSimpleMatchPrompt ";
import { parseLLMJsonOutput } from "../libs/parseJsonFromMD";
import redis from "../libs/redis";
import Job from "../models/job.model";
import User from "../models/user.model";
import customError from "../utils/customError";

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
        if (!user) {
            return next(customError(404, "user not found!!"));
        }
        const jobs = await Job.find({})
            .populate("tags")
            .populate({
                path: "skillsRequired",
                select: "name",
            })
            .populate({
                path: "jobCategory",
                select: "name",
            })
            .lean();

        const aboutPlainText = convert(user.about || "", {
            wordwrap: false,
        });
        const userData = {
            about: aboutPlainText.replace(/\n/g, " "),
            experience: user.experience,
            skills: JSON.stringify(user.skills),
            bio: user.bio,
        };

        const formattedJobData = jobs.map((job) => ({
            _id: job._id.toString(),
            description: convert(String(job.description ?? "")).replace(
                /\n/g,
                ""
            ),
            jobCategory: Array.isArray(job.jobCategory)
                ? job.jobCategory.map((jobC: any) => jobC.name)
                : [],
            skillsRequired: Array.isArray(job.skillsRequired)
                ? job.skillsRequired.map((jobC: any) => jobC.name)
                : [],
            tags: JSON.stringify(job.tags),
            experienceLevel: job.experienceLevel,
            location: job.location,
        }));

        const prompt = buildSimpleMatchPrompt(userData, formattedJobData);

        const { text: aiTextResponse } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt,
        });

        const mactedJobsParsed = parseLLMJsonOutput(aiTextResponse);

        const matchedData = [];

        for (let i = 0; i < jobs.length; i++) {
            for (let j = 0; j < mactedJobsParsed.length; j++) {
                if (jobs[i]._id.toString() === mactedJobsParsed[j].id) {
                    matchedData.push({
                        ...jobs[i],
                        matchPercent: mactedJobsParsed[j].matchPercent,
                    });
                    continue;
                }
            }
        }
        await redis.set(cacheKey, JSON.stringify(matchedData), "EX", 86400);

        res.status(200).json({
            success: true,
            message: "Job matches generated successfully",
            data: matchedData,
        });
    } catch (err) {
        next(err);
    }
};
