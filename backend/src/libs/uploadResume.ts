import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import customError from "../utils/customError";

export const uploadResume = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const file = req.file;

    try {
        if (!file) {
            return next(customError(400, "Resume file is required"));
        }

        // Convert file buffer to Base64
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;

        // Upload to Cloudinary (resume → raw type)
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
            resource_type: "raw",
            folder: "resumes",
            upload_preset: "jobsift",
        });

        if (!uploadResponse) {
            return next(customError(500, "Failed to upload resume"));
        }

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            data: {
                resumeUrl: uploadResponse.secure_url,
                publicId: uploadResponse.public_id,
                format: file.mimetype,
                size: file.size,
            },
        });
    } catch (err) {
        next(err);
    }
};
