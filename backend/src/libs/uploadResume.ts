import { NextFunction, Request, Response } from "express";
import fs from "fs";
import cloudinary from "../config/cloudinary";
import customError from "../utils/customError";

export const uploadResume = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const file = req.file;
    try {
        if (!file) return next(customError(400, "Resume file is required"));

        const allowedMimes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowedMimes.includes(file.mimetype)) {
            fs.unlinkSync(file.path);
            return next(
                customError(400, "Only PDF or Word documents are allowed")
            );
        }

        if (file.size > 5 * 1024 * 1024) {
            fs.unlinkSync(file.path);
            return next(customError(400, "File size must be less than 5MB"));
        }

        const result = await cloudinary.uploader.upload(file.path, {
            folder: "resumes",
        });

        fs.unlink(file.path, (err) => {
            if (err) console.error("Failed to delete temp file:", err);
        });

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            data: {
                resumeUrl: result.secure_url,
                publicId: result.public_id,
                format: file.mimetype,
                size: file.size,
            },
        });
    } catch (err) {
        if (file?.path) fs.unlink(file.path, () => {});
        next(err);
    }
};
