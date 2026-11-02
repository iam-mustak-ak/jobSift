/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAuthStore } from "@/state/store";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

interface Notification {
    _id?: string;
    message: string;
    type?: string;
    isRead: boolean;
    sender?: string | { name?: string; profilePicture?: string } | null;
    createdAt?: string;
    [key: string]: any;
}

interface SocketContextType {
    socket: Socket | null;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuthStore((state) => state);
    const userId = user?._id;
    const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (!userId) {
            setSocketInstance(null);
            setNotifications([]);
            return;
        }

        const fetchNotifications = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/notification`,
                    { credentials: "include" }
                );
                if (!res.ok)
                    return toast.error("Failed to fetch notifications");
                const data = await res.json();
                setNotifications(data.data || []);
            } catch (err) {
                console.error("Fetch notifications error:", err);
            }
        };

        fetchNotifications();

        const connection = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`, { withCredentials: true });
        setSocketInstance(connection);

        const handleNewNotification = (data: any) => {
            setNotifications((prev) => [data.notification, ...prev]);
        };

        connection.on("new_notification", handleNewNotification);

        return () => {
            connection.off("new_notification", handleNewNotification);
            connection.disconnect();
            setSocketInstance((current) => current === connection ? null : current);
        };
    }, [userId]);

    return (
        <SocketContext.Provider
            value={{
                socket: socketInstance,
                notifications,
                setNotifications,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
