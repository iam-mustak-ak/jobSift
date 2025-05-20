import { model, Schema, Types } from "mongoose";

const messageSchema = new Schema(
    {
        sender: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        sentAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Message = model("Message", messageSchema);
export default Message;
