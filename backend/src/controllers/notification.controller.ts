import { NextFunction, Request, Response } from "express";
import Notification from "../models/notification.model";
import customError from "../utils/customError";

export const getNotificationsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authUser = req.user as { _id: string };
        if (!authUser?._id) return next(customError(401, "Unauthorized"));

        const notifications = await Notification.find({
            recipient: authUser._id,
        })
            .sort({ createdAt: -1 })
            .limit(50); // latest 50 notifications

        res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            data: notifications,
        });
    } catch (err) {
        next(err);
    }
};
