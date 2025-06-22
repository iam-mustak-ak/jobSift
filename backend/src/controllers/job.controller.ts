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
        const jobs = await Job.find();

        res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: jobs,
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

        res.status(200).json({
            success: true,
            message: "Job fetched successfully",
            data: job,
        });
    } catch (err) {
        next(err);
    }
};
