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
            .populate("sender", "name profilePicture")
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

export const markNotificationReadController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authUser = req.user as { _id: string };
        if (!authUser?._id) return next(customError(401, "Unauthorized"));

        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.notificationId, recipient: authUser._id },
            { $set: { isRead: true } },
            { new: true }
        );
        if (!notification) return next(customError(404, "Notification not found"));

        res.status(200).json({ success: true, message: "Notification marked as read", data: notification });
    } catch (err) {
        next(err);
    }
};

export const markAllNotificationsReadController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authUser = req.user as { _id: string };
        if (!authUser?._id) return next(customError(401, "Unauthorized"));

        await Notification.updateMany(
            { recipient: authUser._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (err) {
        next(err);
    }
};
