import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextFunction, Request, Response } from "express";
import InterViewModel from "../models/interview.model";
import Job from "../models/job.model";
import User from "../models/user.model";
import customError from "../utils/customError";

export const interViewHealth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(200).json({
        success: true,
        message: "Thanks",
        data: null,
    });
};

export const generateInterview = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { role, type, level, userid, jobid, jobdescription, amount } =
        req.body;

    try {
        const [job, user] = await Promise.all([
            Job.findById({ _id: jobid }),
            User.findById({ _id: userid }),
        ]);

        if (!job) {
            return next(customError(404, "Job Not found!!"));
        }
        if (!user) {
            return next(customError(404, "User Not found!!!"));
        }

        const { text: generatedQuestions } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `prepare questions for a job interview.
        The job description is: ${jobdescription}.
        The job role is: ${role}.
        The job experience level is: ${level}.
        The focus between behavioural and technical questions should lean towards: ${type}
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special charecters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]

        Thank you! <3

            `,
        });

        const interView = new InterViewModel({
            level,
            role,
            type,
            jobid,
            userid,
            questions: JSON.parse(generatedQuestions),
        });

        await interView.save();

        return res.status(200).json({
            success: true,
            message: "Interview Generated",
            data: null,
        });
    } catch (err) {
        next(err);
    }
};
