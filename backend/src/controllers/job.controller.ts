import { RequestHandler } from "express";
import Job from "../models/job.model";
import customError from "../utils/customError";

export const createJobController: RequestHandler = async (req, res, next) => {
    try {
        const {
            title,
            description,
            jobType,
            employmentMode,
            location,
            salaryRange,
            experienceLevel,
            recruiter,
            company,
            skillsRequired,
            jobCategory,
            openings,
            deadline,
            isActive,
            isFeatured,
            tags,
            jobId,
        } = req.body;

        if (
            !title ||
            !description ||
            !jobType ||
            !employmentMode ||
            !skillsRequired ||
            !jobCategory
        ) {
            return next(
                customError(
                    400,
                    "Please Provide Required Field to create a job"
                )
            );
        }

        const newJob = new Job({
            jobId,
            title,
            description,
            jobType,
            employmentMode,
            location,
            salaryRange,
            experienceLevel,
            recruiter,
            company,
            skillsRequired,
            jobCategory,
            openings,
            deadline,
            isActive,
            isFeatured,
            tags,
        });

        await newJob.save();

        res.status(200).json({
            success: true,
            message: "Job Created Successfully",
            data: newJob,
        });
    } catch (err) {
        next(err);
    }
};

export const getAllJobsController: RequestHandler = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (req.query.title) {
            filter.$or = [
                { title: { $regex: req.query.title, $options: "i" } },
                { description: { $regex: req.query.title, $options: "i" } },
            ];
        }
        if (req.query.location) {
            filter.location = { $regex: req.query.location, $options: "i" };
        }
        if (req.query.jobCategory) {
            filter.jobCategory = req.query.jobCategory;
        }
        if (req.query.jobType) {
            filter.jobType = req.query.jobType;
        }
        if (req.query.experienceLevel) {
            filter.experienceLevel = req.query.experienceLevel;
        }

        const [jobs, total] = await Promise.all([
            Job.find(filter).skip(skip).limit(limit),
            Job.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: jobs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        next(err);
    }
};

export const getJobByIdController: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return next(customError(400, "Job ID is required"));
        }

        const job = await Job.findById(id);

        if (!job) {
            return next(customError(404, "Job not found"));
        }

        (job as any).views++;
        await job.save();

        res.status(200).json({
            success: true,
            message: "Job fetched successfully",
            data: job,
        });
    } catch (err) {
        next(err);
    }
};

export const getFeaturedJobs: RequestHandler = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [jobs, total] = await Promise.all([
            Job.find({ isFeatured: true }).skip(skip).limit(limit),
            Job.countDocuments({ isFeatured: true }),
        ]);

        res.status(200).json({
            success: true,
            message: "Featured Jobs Fetch Successfully",
            data: jobs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        next(err);
    }
};
