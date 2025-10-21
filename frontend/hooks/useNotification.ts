import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function useNotification(userId: string) {
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        if (!userId) return;

        // --- Fetch existing notifications from backend ---
        const fetchNotifications = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/notification`,
                    {
                        credentials: "include",
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch notifications");
                const data = await res.json();
                setNotifications(data.data || []);
            } catch (err) {
                console.error("Fetch notifications error:", err);
            }
        };

        fetchNotifications();

        // --- Connect socket ---
        if (!socket) {
            socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`, {
                withCredentials: true,
            });
        }

        socket.emit("register", userId);

        const handleNewNotification = (data: any) => {
            setNotifications((prev) => [data.notification, ...prev]);
        };

        socket.on("new_notification", handleNewNotification);

        return () => {
            socket.off("new_notification", handleNewNotification);
        };
    }, [userId]);

    return notifications;
}
