import { Server, Socket } from "socket.io";

const onlineUsers = new Map<string, string>();

export default function socketHandler(io: Server) {
    io.on("connection", (socket: Socket) => {
        console.log("⚡ User connected:", socket.id);

        socket.on("register", (userId: string) => {
            if (!userId) return;
            onlineUsers.set(userId, socket.id);
            socket.join(userId);
            console.log(`✅ User ${userId} joined room ${userId}`);
        });

        socket.on("disconnect", () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            console.log("❌ User disconnected:", socket.id);
        });
    });
}
