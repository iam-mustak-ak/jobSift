import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import Company from "../models/company.model";
import Job from "../models/job.model";
import Notification from "../models/notification.model";
import User from "../models/user.model";
import customError from "../utils/customError";

interface AuthenticatedRecruiter {
    _id: Types.ObjectId | string;
    role?: string;
    company?: Types.ObjectId | string;
}

export const createJobController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authUser = req.user as unknown as AuthenticatedRecruiter | undefined;
        if (!authUser?._id) return next(customError(401, "Authentication required"));
        if (authUser.role !== "recruiter") {
            return next(customError(403, "Only recruiter accounts can post jobs"));
        }

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
            deadline,
            isDraft,
            tags,
        } = req.body;
        const draft = isDraft === true;
        const jobTitle = typeof title === "string" ? title.trim() : "";
        const descriptionText = typeof description === "string"
            ? description.replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/gi, " ").trim()
            : "";
        if (!jobTitle) return next(customError(400, "Job title is required"));

        if (!draft) {
            const requiredMissing =
                !descriptionText ||
                !jobType || !employmentMode || !location?.trim?.() || !company ||
                !Array.isArray(skillsRequired) || skillsRequired.length === 0 ||
                !Array.isArray(jobCategory) || jobCategory.length === 0 || !deadline;
            if (requiredMissing) {
                return next(customError(400, "Add the job details, company, skills, category, and application deadline before publishing"));
            }
            const deadlineDate = new Date(deadline);
            if (Number.isNaN(deadlineDate.getTime()) || deadlineDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                return next(customError(400, "Application deadline must be today or later"));
            }
        } else if (deadline && Number.isNaN(new Date(deadline).getTime())) {
            return next(customError(400, "Enter a valid application deadline"));
        }

        if (company) {
            if (!Types.ObjectId.isValid(company)) return next(customError(400, "Invalid company"));
            const linkedCompanyId = authUser.company?.toString();
            if (!linkedCompanyId || linkedCompanyId !== String(company)) {
                return next(customError(403, "Jobs can only be posted for the company linked to your recruiter account"));
            }
            if (!(await Company.exists({ _id: company }))) return next(customError(404, "Company not found"));
        }

        const minSalary = salaryRange?.min == null || salaryRange.min === "" ? 0 : Number(salaryRange.min);
        const maxSalary = salaryRange?.max == null || salaryRange.max === "" ? 0 : Number(salaryRange.max);
        if (!Number.isFinite(minSalary) || !Number.isFinite(maxSalary) || minSalary < 0 || maxSalary < 0 || (minSalary > 0 && maxSalary > 0 && minSalary > maxSalary)) {
            return next(customError(400, "Enter a valid salary range"));
        }

        const newJob = new Job({
            title: jobTitle,
            description: typeof description === "string" ? description.trim() : "",
            jobType: jobType || "full-time",
            employmentMode: employmentMode || "Remote",
            location: typeof location === "string" ? location.trim() : "",
            salaryRange: { min: minSalary, max: maxSalary },
            experienceLevel: experienceLevel || "entry",
            recruiter: authUser._id,
            company: company || undefined,
            skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
            jobCategory: Array.isArray(jobCategory) ? jobCategory : [],
            deadline: deadline ? new Date(deadline) : undefined,
            isActive: true,
            isFeatured: false,
            isPublished: !draft,
            tags: Array.isArray(tags) ? tags.filter((tag: unknown) => typeof tag === "string").map((tag: string) => tag.trim()).filter(Boolean) : [],
            isDraft: draft,
        });

        await newJob.save();

        res.status(201).json({
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
        const authUser = req.user as unknown as AuthenticatedRecruiter | undefined;
        if (!authUser?._id || String(authUser._id) !== recruiterId) {
            return next(customError(403, "You can only view your own hiring activity"));
        }
        if (authUser.role !== "recruiter") {
            return next(customError(403, "Recruiter account required"));
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
        const authUser = req.user as unknown as AuthenticatedRecruiter | undefined;

        if (!authUser?._id) return next(customError(401, "Authentication required"));
        if (authUser.role !== "recruiter") return next(customError(403, "Only recruiter accounts can update jobs"));

        if (!id) {
            return next(customError(400, "Job ID is required"));
        }

        const existingJob = await Job.findById(id);

        if (!existingJob) {
            return next(customError(404, "Job not found"));
        }

        if (existingJob.recruiter?.toString() !== authUser._id.toString()) {
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
        if (updates.company === "") delete updates.company;
        if (updates.deadline === "") delete updates.deadline;

        const nextIsDraft = updates.isDraft === undefined
            ? existingJob.isDraft
            : updates.isDraft === true;
        const nextCompanyId = updates.company ?? existingJob.company;
        if (nextCompanyId) {
            if (!Types.ObjectId.isValid(nextCompanyId)) return next(customError(400, "Invalid company"));
            if (authUser.company?.toString() !== String(nextCompanyId)) {
                return next(customError(403, "Jobs can only be posted for the company linked to your recruiter account"));
            }
            if (!(await Company.exists({ _id: nextCompanyId }))) return next(customError(404, "Company not found"));
        }

        const candidate = { ...existingJob.toObject(), ...updates };
        if (!nextIsDraft) {
            const descriptionText = typeof candidate.description === "string"
                ? candidate.description.replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/gi, " ").trim()
                : "";
            if (!candidate.title?.trim() || !descriptionText || !candidate.jobType || !candidate.employmentMode || !candidate.location?.trim() || !candidate.company || !candidate.skillsRequired?.length || !candidate.jobCategory?.length || !candidate.deadline) {
                return next(customError(400, "Complete the required job details before publishing"));
            }
            const deadlineDate = new Date(candidate.deadline);
            const deadlineChangedOrDraftPublished = updates.deadline !== undefined || (existingJob.isDraft && !nextIsDraft);
            if (Number.isNaN(deadlineDate.getTime()) || (deadlineChangedOrDraftPublished && deadlineDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))) {
                return next(customError(400, "Application deadline must be today or later"));
            }
        }

        if (updates.salaryRange) {
            const min = Number(updates.salaryRange.min ?? 0);
            const max = Number(updates.salaryRange.max ?? 0);
            if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < 0 || (min > 0 && max > 0 && min > max)) {
                return next(customError(400, "Enter a valid salary range"));
            }
        }
        if (updates.isDraft !== undefined) {
            updates.isDraft = nextIsDraft;
            updates.isPublished = !nextIsDraft;
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
        const authUser = req.user as unknown as {
            _id: string | Types.ObjectId;
            name?: string;
            role?: string;
            appliedJobs?: { jobId: string | Types.ObjectId }[];
        } | undefined;
        const { jobId } = req.params;
        const { resume, coverLetter } = req.body;

        if (!authUser || !authUser._id) {
            return next(customError(401, "Unauthorized"));
        }
        if (authUser.role !== "candidate") {
            return next(customError(403, "Only candidate accounts can apply for jobs"));
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
        if (!job.isActive || (job.deadline && new Date(String(job.deadline)).getTime() < Date.now())) {
            return next(customError(400, "This job is no longer accepting applications"));
        }
        if (typeof resume !== "string" || !resume.trim()) {
            return next(customError(400, "A resume is required to apply"));
        }
        try {
            const resumeUrl = new URL(resume);
            if (resumeUrl.protocol !== "https:") throw new Error("Invalid resume URL");
        } catch {
            return next(customError(400, "Upload a valid resume before applying"));
        }
        if (coverLetter != null && (typeof coverLetter !== "string" || coverLetter.length > 5000)) {
            return next(customError(400, "Cover letter must be 5,000 characters or fewer"));
        }
        const recruiter = job.recruiter as {
            _id: string;
            name?: string;
            email?: string;
        };

        const alreadyApplied =
            authUser.appliedJobs?.some((application) => String(application.jobId) === String(job._id)) ||
            job.applicants.some((a: any) => a.user.toString() === authUser._id.toString());

        if (alreadyApplied) {
            return next(
                customError(400, "You have already applied for this job")
            );
        }

        job.applicants.push({
            user: authUser.name || "Candidate",
            resume: resume.trim(),
            coverLetter: typeof coverLetter === "string" ? coverLetter.trim() : "",
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
