import { NextFunction, Request, Response } from "express";
import Job from "../models/job.model";
import Notification from "../models/notification.model";
import User from "../models/user.model";
import customError from "../utils/customError";

export const createJobController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authUser = req.user as { _id?: { toString: () => string } };

    console.log(authUser);

    try {
        const {
            title,
            description,
            jobType,
            employmentMode,
            location,
            salaryRange,
            experienceLevel,
            company,
            skillsRequired,
            jobCategory,
            openings,
            deadline,
            isActive,
            isFeatured,
            isDraft,
            tags,
            jobId,
            isPublished,
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
            recruiter: authUser?._id?.toString(),
            company,
            skillsRequired,
            jobCategory,
            openings,
            deadline,
            isActive,
            isFeatured,
            isPublished,
            tags,
            isDraft,
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

export const getAllJobsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const filter: any = { isPublished: true };

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
            Job.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
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

export const getJobByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
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

export const getFeaturedJobs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
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

export const getRecruiterJobsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { recruiterId } = req.params;

        if (!recruiterId) {
            return next(customError(400, "Recruiter ID is required"));
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const filter: any = { recruiter: recruiterId };

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
            Job.find(filter)
                .populate("recruiter", "name email")
                .skip(skip)
                .limit(limit),
            Job.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            message: "Recruiter jobs fetched successfully",
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

export const updateJobController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const authUser = req.user as { _id?: string };

        if (!id) {
            return next(customError(400, "Job ID is required"));
        }

        const existingJob = await Job.findById(id);

        if (!existingJob) {
            return next(customError(404, "Job not found"));
        }

        // Optional: Only allow the recruiter who created it to update
        if (
            authUser &&
            existingJob.recruiter?.toString() !== authUser._id?.toString()
        ) {
            return next(
                customError(403, "You are not authorized to update this job")
            );
        }

        const updatableFields = [
            "title",
            "description",
            "jobType",
            "employmentMode",
            "location",
            "salaryRange",
            "experienceLevel",
            "company",
            "skillsRequired",
            "jobCategory",
            "openings",
            "deadline",
            "isActive",
            "isFeatured",
            "isDraft",
            "tags",
        ];

        // Build update object from req.body
        const updates: any = {};
        for (const field of updatableFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        // Apply updates
        Object.assign(existingJob, updates);
        await existingJob.save();

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: existingJob,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteJobController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const authUser = req.user as { _id?: string };

        if (!id) return next(customError(400, "Job ID is required"));

        const job = await Job.findById(id);
        if (!job) return next(customError(404, "Job not found"));

        if (
            authUser &&
            job.recruiter?.toString() !== authUser._id?.toString()
        ) {
            return next(customError(403, "Not authorized to delete this job"));
        }

        await job.deleteOne();

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Toggle bookmark (add/remove)
 * Uses MongoDB atomic updates instead of push
 */
export const toggleBookmarkController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authUser = req.user as { _id: string };
        const { jobId } = req.params;

        if (!authUser || !authUser._id) {
            return next(customError(401, "Unauthorized"));
        }

        if (!jobId) {
            return next(customError(400, "Job ID is required"));
        }

        const user = await User.findById(authUser._id);
        const job = await Job.findById(jobId);

        if (!user || !job) {
            return next(customError(404, "User or Job not found"));
        }

        const alreadyBookmarked = (user.savedJobs ?? []).some(
            (item) => item.jobId.toString() === jobId
        );

        if (alreadyBookmarked) {
            await Promise.all([
                User.updateOne(
                    { _id: authUser._id },
                    { $pull: { savedJobs: { jobId } } }
                ),
                Job.updateOne(
                    { _id: jobId },
                    { $pull: { bookmarkedBy: authUser._id } }
                ),
            ]);

            return res.status(200).json({
                success: true,
                message: "Job removed from bookmarks",
                data: { jobId, isBookmarked: false },
            });
        } else {
            await Promise.all([
                User.updateOne(
                    { _id: authUser._id },
                    { $push: { savedJobs: { jobId } } }
                ),
                Job.updateOne(
                    { _id: jobId },
                    { $push: { bookmarkedBy: authUser._id } }
                ),
            ]);

            return res.status(200).json({
                success: true,
                message: "Job added to bookmarks",
                data: { jobId, isBookmarked: true },
            });
        }
    } catch (err) {
        next(err);
    }
};

/**
 * Get all bookmarked jobs for a user
 */
export const getBookmarkedJobsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authUser = req.user as { _id: string };

        if (!authUser || !authUser._id) {
            return next(customError(401, "Unauthorized"));
        }

        const user = await User.findById(authUser._id).populate({
            path: "savedJobs.jobId",
            populate: { path: "company recruiter skillsRequired jobCategory" },
        });

        if (!user) {
            return next(customError(404, "User not found"));
        }

        const savedJobs = (user.savedJobs ?? []).map((item) => item.jobId);

        res.status(200).json({
            success: true,
            message: "Bookmarked jobs fetched successfully",
            data: savedJobs,
        });
    } catch (err) {
        next(err);
    }
};

interface CustomRequest extends Request {
    io?: any;
}

export const applyJobController = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authUser = req.user as { _id: string; name: string };
        const { jobId } = req.params;
        const { resume, coverLetter } = req.body;

        if (!authUser || !authUser._id) {
            return next(customError(401, "Unauthorized"));
        }

        if (!jobId) {
            return next(customError(400, "Job ID is required"));
        }

        const job = await Job.findById(jobId).populate(
            "recruiter",
            "_id name email"
        );
        if (!job) {
            return next(customError(404, "Job not found"));
        }
        const recruiter = job.recruiter as {
            _id: string;
            name?: string;
            email?: string;
        };

        const alreadyApplied = job.applicants.some(
            (a: any) => a.user.toString() === authUser._id.toString()
        );

        if (alreadyApplied) {
            return next(
                customError(400, "You have already applied for this job")
            );
        }

        job.applicants.push({
            user: authUser.name,
            resume,
            coverLetter,
        });
        await job.save();

        await User.findByIdAndUpdate(authUser._id, {
            $push: {
                appliedJobs: {
                    jobId: job._id,
                },
            },
        });
        if (!recruiter || !recruiter._id) {
            return next(customError(400, "Job recruiter not found"));
        }

        const notification = await Notification.create({
            sender: authUser._id,
            recipient: recruiter._id,
            message: `New application received for "${job.title}"`,
            type: "application",
            link: `/dashboard/recruiter/jobs/${job._id}/applicants`,
        });

        if (req.io) {
            req.io.to(recruiter._id.toString()).emit("new_notification", {
                notification,
            });
        }

        res.status(200).json({
            success: true,
            message: "Job applied successfully",
        });
    } catch (error) {
        next(error);
    }
};
