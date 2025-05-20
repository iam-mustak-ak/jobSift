import { model, Schema, Types } from "mongoose";

const notificationSchema = new Schema(
    {
        sender: {
            type: Types.ObjectId,
            ref: "User",
        },
        recipient: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["job", "application", "interview", "system", "message"],
            default: "system",
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
        link: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = model("Notification", notificationSchema);
export default Notification;
