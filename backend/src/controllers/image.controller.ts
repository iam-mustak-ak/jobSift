import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import ImageModel from "../models/images.model";
import customError from "../utils/customError";

export const postImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const image = req.file;
    const { type, resumeId, jobId } = req.query;

    try {
        if (!image) {
            return next(customError(403, "Image required"));
        }

        const b64 = Buffer.from(image!.buffer).toString("base64");
        let dataURI = "data:" + image?.mimetype + ";base64," + b64;
        const data = await cloudinary.uploader.upload(dataURI, {
            resource_type: "image",
            upload_preset: "jobsift",
        });

        if (!data) {
            return next(
                customError(403, "some went wrong while uploading the image")
            );
        }

        const newImage = new ImageModel({
            imageUrl: data.secure_url,
            type,
            resumeId,
        });

        await newImage.save();

        res.status(200).json({
            success: true,
            message: "Image upload successfull",
            data: data.secure_url,
        });
    } catch (err) {
        next(err);
    }
};

export const getImageById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        if (!id) {
            return next(customError(209, "Id is required"));
        }

        const resumeImg = await ImageModel.findOne({ resumeId: id });

        if (!resumeImg) {
            return next(customError(404, "Resume Not Found"));
        }

        res.status(200).json({
            success: true,
            message: "Fetch Successfull",
            data: resumeImg,
        });
    } catch (err) {
        next(err);
    }
};
