import { model, Schema, Types } from "mongoose";

const conversationSchema = new Schema(
    {
        recruiter: { type: Types.ObjectId, ref: "User", required: true, index: true },
        candidate: { type: Types.ObjectId, ref: "User", required: true, index: true },
        job: { type: Types.ObjectId, ref: "Job", required: true, index: true },
        applicationId: { type: Types.ObjectId, required: true },
        status: { type: String, enum: ["open", "closed"], default: "open", index: true },
        startedBy: { type: Types.ObjectId, ref: "User", required: true },
        lastMessage: { type: String, default: "" },
        lastMessageAt: { type: Date, default: Date.now, index: true },
        closedAt: { type: Date },
        closedBy: { type: Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

conversationSchema.index({ job: 1, candidate: 1 }, { unique: true });
conversationSchema.index({ recruiter: 1, lastMessageAt: -1 });
conversationSchema.index({ candidate: 1, lastMessageAt: -1 });

const Conversation = model("Conversation", conversationSchema);
export default Conversation;
