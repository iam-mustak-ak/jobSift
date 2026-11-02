import { model, Schema, Types } from "mongoose";

const messageSchema = new Schema(
    {
        conversation: {
            type: Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true,
        },
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
            trim: true,
            maxlength: 4000,
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

messageSchema.index({ conversation: 1, createdAt: -1 });

const Message = model("Message", messageSchema);
export default Message;
