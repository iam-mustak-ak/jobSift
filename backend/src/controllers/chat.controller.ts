import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import Conversation from "../models/conversation.model";
import Job from "../models/job.model";
import Message from "../models/message.model";
import Notification from "../models/notification.model";
import User from "../models/user.model";
import customError from "../utils/customError";

interface ChatRequest extends Request {
    io?: any;
}

type ChatUser = { _id: string | Types.ObjectId; role?: string; name?: string };
const conversationPopulation = [
    { path: "job", select: "title company", populate: { path: "company", select: "name logo" } },
    { path: "recruiter", select: "name profilePicture" },
    { path: "candidate", select: "name profilePicture" },
];

const getChatUser = (req: Request) => req.user as unknown as ChatUser | undefined;
const isParticipant = (conversation: any, userId: string) =>
    String(conversation.recruiter) === userId || String(conversation.candidate) === userId;

export const getConversationsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = getChatUser(req);
        if (!user?._id) return next(customError(401, "Authentication required"));
        const userId = String(user._id);
        if (!["candidate", "recruiter"].includes(user.role ?? "")) return next(customError(403, "Chat is available to candidates and recruiters"));

        const field = user.role === "recruiter" ? "recruiter" : "candidate";
        const conversations = await Conversation.find({ [field]: userId })
            .populate(conversationPopulation)
            .sort({ lastMessageAt: -1, createdAt: -1 })
            .limit(100);
        const unreadCounts = conversations.length ? await Message.aggregate([
            { $match: { conversation: { $in: conversations.map((conversation) => conversation._id) }, receiver: new Types.ObjectId(userId), isRead: false } },
            { $group: { _id: "$conversation", count: { $sum: 1 } } },
        ]) : [];
        const unreadByConversation = new Map(unreadCounts.map((item) => [String(item._id), item.count]));

        res.status(200).json({
            success: true,
            message: "Conversations fetched",
            data: conversations.map((conversation) => ({
                ...conversation.toObject(),
                unreadCount: unreadByConversation.get(String(conversation._id)) ?? 0,
            })),
        });
    } catch (error) {
        next(error);
    }
};

export const startConversationController = async (req: ChatRequest, res: Response, next: NextFunction) => {
    try {
        const user = getChatUser(req);
        if (!user?._id) return next(customError(401, "Authentication required"));
        if (user.role !== "recruiter") return next(customError(403, "Only a recruiter can start a conversation"));

        const { jobId, applicationId } = req.body as { jobId?: string; applicationId?: string };
        if (!jobId || !applicationId) return next(customError(400, "Job and applicant are required"));
        const job = await Job.findById(jobId);
        if (!job) return next(customError(404, "Job not found"));
        if (String(job.recruiter) !== String(user._id)) return next(customError(403, "You can only contact applicants for your own job posts"));

        const applicants = job.applicants as any[];
        const applicant = applicants.find((entry) => String(entry._id) === String(applicationId));
        if (!applicant) return next(customError(404, "Application not found"));

        let candidateId = applicant.candidateId ? String(applicant.candidateId) : "";
        if (!candidateId) {
            let candidates = await User.find({ "appliedJobs.jobId": job._id, role: "candidate" }).select("_id").limit(2);
            if (candidates.length !== 1) {
                candidates = await User.find({ name: applicant.user, "appliedJobs.jobId": job._id, role: "candidate" }).select("_id").limit(2);
            }
            if (candidates.length !== 1) return next(customError(409, "This application cannot be safely linked to a candidate account"));
            candidateId = String(candidates[0]._id);
            applicant.candidateId = candidates[0]._id;
            await job.save();
        }

        const candidate = await User.findById(candidateId).select("_id role");
        if (!candidate || candidate.role !== "candidate") return next(customError(404, "Candidate account not found"));

        let conversation = await Conversation.findOne({ job: job._id, candidate: candidate._id });
        let created = false;
        if (!conversation) {
            conversation = await Conversation.create({
                job: job._id,
                applicationId: applicant._id,
                candidate: candidate._id,
                recruiter: user._id,
                startedBy: user._id,
                status: "open",
            });
            created = true;
        }
        await conversation.populate(conversationPopulation);

        if (created) {
            try {
                const notification = await Notification.create({
                    sender: user._id,
                    recipient: candidate._id,
                    message: `${user.name || "A recruiter"} started a conversation about ${job.title}.`,
                    type: "message",
                    link: `/profile/${candidate._id}/messages?conversation=${conversation._id}`,
                });
                await notification.populate("sender", "name profilePicture");
                req.io?.to(String(candidate._id)).emit("new_notification", { notification });
            } catch (notificationError) {
                console.error("Conversation created, but candidate notification failed:", notificationError);
            }
            req.io?.to(String(candidate._id)).emit("chat:conversation", conversation);
            req.io?.to(String(user._id)).emit("chat:conversation", conversation);
        }

        res.status(created ? 201 : 200).json({
            success: true,
            message: created ? "Conversation started" : "Conversation already exists",
            data: conversation,
        });
    } catch (error: any) {
        if (error?.code === 11000) {
            try {
                const conversation = await Conversation.findOne({ job: req.body.jobId, applicationId: req.body.applicationId }).populate(conversationPopulation);
                if (conversation) return res.status(200).json({ success: true, message: "Conversation already exists", data: conversation });
            } catch (lookupError) {
                return next(lookupError);
            }
        }
        next(error);
    }
};

export const getConversationMessagesController = async (req: ChatRequest, res: Response, next: NextFunction) => {
    try {
        const user = getChatUser(req);
        if (!user?._id) return next(customError(401, "Authentication required"));
        const conversation = await Conversation.findById(req.params.conversationId);
        if (!conversation) return next(customError(404, "Conversation not found"));
        const userId = String(user._id);
        if (!isParticipant(conversation, userId)) return next(customError(403, "You do not have access to this conversation"));

        const readResult = await Message.updateMany(
            { conversation: conversation._id, receiver: user._id, isRead: false },
            { $set: { isRead: true } }
        );
        if (readResult.modifiedCount > 0) {
            const otherUserId = String(conversation.recruiter) === userId ? String(conversation.candidate) : String(conversation.recruiter);
            req.io?.to(otherUserId).emit("chat:read-receipt", { conversationId: String(conversation._id), readerId: userId });
        }
        const messages = await Message.find({ conversation: conversation._id })
            .populate("sender", "name profilePicture")
            .sort({ createdAt: -1 })
            .limit(100);

        res.status(200).json({ success: true, message: "Messages fetched", data: messages.reverse() });
    } catch (error) {
        next(error);
    }
};

export const updateConversationStatusController = async (req: ChatRequest, res: Response, next: NextFunction) => {
    try {
        const user = getChatUser(req);
        if (!user?._id) return next(customError(401, "Authentication required"));
        if (user.role !== "recruiter") return next(customError(403, "Only the recruiter can end or reopen a conversation"));
        const { status } = req.body as { status?: string };
        if (status !== "open" && status !== "closed") return next(customError(400, "Choose open or closed status"));

        const conversation = await Conversation.findById(req.params.conversationId);
        if (!conversation) return next(customError(404, "Conversation not found"));
        if (String(conversation.recruiter) !== String(user._id)) return next(customError(403, "Only the conversation recruiter can change its status"));
        const recruiterId = String(conversation.recruiter);
        const candidateId = String(conversation.candidate);

        conversation.status = status;
        conversation.closedAt = status === "closed" ? new Date() : undefined;
        conversation.closedBy = status === "closed" ? user._id as any : undefined;
        await conversation.save();
        await conversation.populate(conversationPopulation);

        const update = { conversationId: String(conversation._id), status, conversation };
        req.io?.to(recruiterId).emit("chat:conversation-updated", update);
        req.io?.to(candidateId).emit("chat:conversation-updated", update);

        try {
            const jobTitle = typeof conversation.job === "object" && "title" in conversation.job
                ? String((conversation.job as any).title)
                : "your application";
            const notification = await Notification.create({
                sender: recruiterId,
                recipient: candidateId,
                message: status === "closed"
                    ? `The recruiter ended the conversation about ${jobTitle}.`
                    : `The recruiter reopened the conversation about ${jobTitle}.`,
                type: "message",
                link: `/profile/${candidateId}/messages?conversation=${conversation._id}`,
            });
            await notification.populate("sender", "name profilePicture");
            req.io?.to(candidateId).emit("new_notification", { notification });
        } catch (notificationError) {
            console.error("Conversation status saved, but candidate notification failed:", notificationError);
        }

        res.status(200).json({ success: true, message: status === "closed" ? "Conversation ended" : "Conversation reopened", data: conversation });
    } catch (error) {
        next(error);
    }
};
