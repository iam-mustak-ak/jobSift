import { NextFunction, Request, Response } from "express";
import { Schema } from "mongoose";
import Resume from "../models/resume.model";
import customError from "../utils/customError";

export const createResume = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.user;
    const data = req.body;

    try {
        if (!user) {
            next(customError(400, "All fields are required"));
            return;
        }

        const newResume = new Resume({
            user,
            ...data,
        });
        await newResume.save();

        res.status(200).json({
            success: true,
            message: "Resume created successfully",
            data: newResume,
        });
    } catch (err) {
        next(err);
    }
};

export const getAllResume = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.user;
    const { _id } = user as { _id: { _id: string } };

    try {
        if (!user) {
            next(customError(404, "User not found"));
            return;
        }
        const resumes = await Resume.find({
            user: _id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Resumes Fetched Successfully",
            data: resumes,
        });
    } catch (error) {
        next(error);
    }
};

export const getResumeById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { resumeId } = req.params;

    console.log(resumeId);

    try {
        if (!resumeId) {
            next(customError(400, "Resume id is required"));
            return;
        }

        const resume = await Resume.findById({ _id: resumeId });

        if (!resume) {
            next(customError(404, "Resume Not found"));
            return;
        }

        res.status(200).json({
            success: true,
            message: "Resume Fetched",
            data: resume,
        });
    } catch (error) {
        next(error);
    }
};

export const saveResume = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { resumeUpdateId } = req.params;
    const data = req.body;
    const user = req.user;
    const { _id } = user as { _id: Schema.Types.ObjectId };

    try {
        if (!user) {
            return next(customError(404, "User not found"));
        }

        if (!resumeUpdateId) {
            return next(customError(400, "Resume ID is required for update"));
        }

        const updatedResume = await Resume.findOneAndUpdate(
            { _id: resumeUpdateId, user: _id },
            { ...data },
            { new: true }
        );

        if (!updatedResume) {
            return next(
                customError(404, "Resume not found or not owned by user")
            );
        }

        res.status(200).json({
            success: true,
            message: "Resume updated successfully",
            data: updatedResume,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteResume = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { deleteResumeId } = req.params;
    const user = req.user as { _id: Schema.Types.ObjectId };

    try {
        if (!user) {
            return next(customError(404, "User not found"));
        }

        if (!deleteResumeId) {
            return next(customError(400, "Resume ID is required"));
        }

        const deletedResume = await Resume.findOneAndDelete({
            _id: deleteResumeId,
            user: user._id,
        });

        if (!deletedResume) {
            return next(
                customError(404, "Resume not found or not owned by user")
            );
        }

        res.status(200).json({
            success: true,
            message: "Resume deleted successfully",
            data: deletedResume,
        });
    } catch (error) {
        next(error);
    }
};
