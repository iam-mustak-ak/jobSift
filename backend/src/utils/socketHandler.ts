import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";
import Notification from "../models/notification.model";
import Session from "../models/session.model";
import User from "../models/user.model";

const getCookie = (header: string | undefined, name: string) => {
    const value = header?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
    if (!value) return undefined;
    try {
        return decodeURIComponent(value.slice(name.length + 1));
    } catch {
        return value.slice(name.length + 1);
    }
};

const authenticateSocket = async (socket: Socket, next: (error?: Error) => void) => {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) return next(new Error("Socket authentication is unavailable"));
        const cookieHeader = socket.handshake.headers.cookie;
        const refreshToken = getCookie(cookieHeader, "refreshToken");
        if (!refreshToken) return next(new Error("Authentication required"));
        const refreshPayload = jwt.verify(refreshToken, secret) as { id?: string };
        const userId = refreshPayload.id;
        if (!userId) return next(new Error("Authentication required"));
        const activeSession = await Session.findOne({ user: userId, token: refreshToken, isValid: true, expiresAt: { $gt: new Date() } });
        if (!activeSession) return next(new Error("Authentication required"));

        const accessToken = getCookie(cookieHeader, "accessToken");
        if (accessToken) {
            try {
                const accessPayload = jwt.verify(accessToken, secret) as { id?: string };
                if (accessPayload.id && accessPayload.id !== userId) return next(new Error("Authentication required"));
            } catch {
                // The access token can expire while the authenticated refresh session remains active.
            }
        }
        const user = await User.findById(userId).select("_id role");
        if (!user || !["candidate", "recruiter"].includes(user.role ?? "")) return next(new Error("Authentication required"));
        socket.data.userId = String(user._id);
        socket.data.role = user.role;
        next();
    } catch {
        next(new Error("Authentication required"));
    }
};

export default function socketHandler(io: Server) {
    io.use((socket, next) => {
        void authenticateSocket(socket, next);
    });

    io.on("connection", (socket: Socket) => {
        const userId = String(socket.data.userId);
        socket.join(userId);

        socket.on("chat:send", async (payload: { conversationId?: string; content?: string }, acknowledge?: (result: any) => void) => {
            try {
                const conversationId = payload?.conversationId;
                const content = typeof payload?.content === "string" ? payload.content.trim() : "";
                if (!conversationId || !content) return acknowledge?.({ success: false, message: "Write a message before sending" });
                if (content.length > 4000) return acknowledge?.({ success: false, message: "Messages must be 4,000 characters or fewer" });

                const conversation = await Conversation.findById(conversationId);
                if (!conversation) return acknowledge?.({ success: false, message: "Conversation not found" });
                const isRecruiter = String(conversation.recruiter) === userId;
                const isCandidate = String(conversation.candidate) === userId;
                if (!isRecruiter && !isCandidate) return acknowledge?.({ success: false, message: "You do not have access to this conversation" });
                if (conversation.status !== "open") return acknowledge?.({ success: false, message: "This conversation has ended. You cannot send more messages." });

                const recipientId = isRecruiter ? String(conversation.candidate) : String(conversation.recruiter);
                const message = await Message.create({
                    conversation: conversation._id,
                    sender: userId,
                    receiver: recipientId,
                    content,
                });
                conversation.lastMessage = content;
                conversation.lastMessageAt = new Date();
                try {
                    await conversation.save();
                } catch (saveError) {
                    await message.deleteOne();
                    throw saveError;
                }
                await message.populate("sender", "name profilePicture");

                const messageData = message.toObject();
                io.to(userId).emit("chat:message", messageData);
                io.to(recipientId).emit("chat:message", messageData);

                try {
                    const sender = await User.findById(userId).select("name profilePicture");
                    const notification = await Notification.create({
                        sender: userId,
                        recipient: recipientId,
                        message: `${sender?.name || "A contact"} sent you a message.`,
                        type: "message",
                        link: `/profile/${recipientId}/messages?conversation=${conversation._id}`,
                    });
                    await notification.populate("sender", "name profilePicture");
                    io.to(recipientId).emit("new_notification", { notification });
                } catch (notificationError) {
                    console.error("Chat message sent, but notification failed:", notificationError);
                }

                acknowledge?.({ success: true, data: messageData });
            } catch (error) {
                console.error("Chat message could not be sent:", error);
                acknowledge?.({ success: false, message: "Message could not be sent. Please try again." });
            }
        });

        socket.on("chat:typing", async (payload: { conversationId?: string; isTyping?: boolean }) => {
            try {
                if (!payload?.conversationId) return;
                const conversation = await Conversation.findById(payload.conversationId).select("recruiter candidate status");
                if (!conversation || conversation.status !== "open") return;
                const isRecruiter = String(conversation.recruiter) === userId;
                const isCandidate = String(conversation.candidate) === userId;
                if (!isRecruiter && !isCandidate) return;
                const recipientId = isRecruiter ? String(conversation.candidate) : String(conversation.recruiter);
                io.to(recipientId).emit("chat:typing", { conversationId: payload.conversationId, userId, isTyping: Boolean(payload.isTyping) });
            } catch (error) {
                console.error("Chat typing event failed:", error);
            }
        });

        socket.on("chat:read", async (payload: { conversationId?: string }) => {
            try {
                if (!payload?.conversationId) return;
                const conversation = await Conversation.findById(payload.conversationId).select("recruiter candidate");
                if (!conversation) return;
                const isRecruiter = String(conversation.recruiter) === userId;
                const isCandidate = String(conversation.candidate) === userId;
                if (!isRecruiter && !isCandidate) return;
                await Message.updateMany(
                    { conversation: conversation._id, receiver: userId, isRead: false },
                    { $set: { isRead: true } }
                );
                const otherUserId = isRecruiter ? String(conversation.candidate) : String(conversation.recruiter);
                io.to(otherUserId).emit("chat:read-receipt", { conversationId: String(conversation._id), readerId: userId });
            } catch (error) {
                console.error("Chat messages could not be marked read:", error);
            }
        });
    });
}
