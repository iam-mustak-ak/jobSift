"use client";

import { useMemo, useState } from "react";
import { useSocket } from "@/context/socketContext";
import { useAuthStore } from "@/state/store";
import { Bell, BriefcaseBusiness, Check, CheckCheck, FileCheck2, MessageCircle, Settings2, Sparkles, Video } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useSidebar } from "../ui/sidebar";

type Sender = string | { name?: string; profilePicture?: string } | null;
type Notice = {
    _id?: string;
    message: string;
    type?: string;
    sender?: Sender;
    isRead: boolean;
    createdAt?: string;
    link?: string;
};

const getPresentation = (notification: Notice) => {
    const message = notification.message || "You have a new update.";
    if (message.startsWith("New application received")) {
        return { title: "New candidate application", Icon: FileCheck2, tone: "bg-violet-50 text-violet-700" };
    }
    if (message.startsWith("Your application for")) {
        return { title: "Application status updated", Icon: BriefcaseBusiness, tone: "bg-blue-50 text-blue-700" };
    }
    switch (notification.type) {
        case "interview": return { title: "Interview update", Icon: Video, tone: "bg-amber-50 text-amber-700" };
        case "application": return { title: "Application update", Icon: BriefcaseBusiness, tone: "bg-blue-50 text-blue-700" };
        case "job": return { title: "Job update", Icon: BriefcaseBusiness, tone: "bg-violet-50 text-violet-700" };
        case "message": return { title: "New message", Icon: MessageCircle, tone: "bg-sky-50 text-sky-700" };
        default: return { title: "Account update", Icon: Settings2, tone: "bg-slate-100 text-slate-600" };
    }
};

const relativeTime = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const seconds = Math.round((date.getTime() - Date.now()) / 1000);
    const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    if (Math.abs(seconds) < 60) return formatter.format(seconds, "second");
    if (Math.abs(seconds) < 3600) return formatter.format(Math.round(seconds / 60), "minute");
    if (Math.abs(seconds) < 86400) return formatter.format(Math.round(seconds / 3600), "hour");
    if (Math.abs(seconds) < 604800) return formatter.format(Math.round(seconds / 86400), "day");
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const NotificationControl = () => {
    const { isMobile } = useSidebar();
    const { notifications, setNotifications } = useSocket();
    const { user } = useAuthStore((state) => state);
    const [updating, setUpdating] = useState(false);
    const unreadCount = useMemo(() => notifications.filter((notification) => !notification.isRead).length, [notifications]);

    const notificationHref = (notification: Notice) => {
        if (notification.link?.startsWith("/profile/")) return notification.link;
        if (notification.link?.startsWith("/dashboard/recruiter/jobs")) return `/profile/${user?._id}/my-jobs?page=1`;
        if (notification.link?.startsWith("/")) return notification.link;
        return user?.role === "recruiter" ? `/profile/${user?._id}/my-jobs?page=1` : `/profile/${user?._id}/applied-jobs`;
    };

    const markRead = async (notification: Notice) => {
        if (!notification._id || notification.isRead) return;
        setNotifications((current) => current.map((item) => item._id === notification._id ? { ...item, isRead: true } : item));
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/notification/${notification._id}/read`, { method: "PATCH", credentials: "include" });
            if (!response.ok) throw new Error("Could not update notification");
        } catch {
            setNotifications((current) => current.map((item) => item._id === notification._id ? { ...item, isRead: false } : item));
        }
    };

    const markAllRead = async () => {
        if (!unreadCount || updating) return;
        const previous = notifications;
        setUpdating(true);
        setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/notification/read-all`, { method: "PATCH", credentials: "include" });
            if (!response.ok) throw new Error("Could not update notifications");
        } catch {
            setNotifications(previous);
            toast.error("Notifications could not be marked as read. Please try again.");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label={unreadCount ? `${unreadCount} unread notifications` : "Notifications"} className="relative h-10 w-10 rounded-xl border-slate-200 bg-white text-slate-600 shadow-sm hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700">
                    <Bell className="h-[18px] w-[18px]" />
                    {unreadCount > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-violet-700 px-1 text-[10px] font-bold leading-none text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[min(92vw,390px)] overflow-hidden rounded-2xl border-slate-200 bg-white p-0 shadow-xl shadow-slate-900/10" side={isMobile ? "bottom" : "bottom"} align="end" sideOffset={10}>
                <DropdownMenuLabel className="flex items-center justify-between gap-3 px-4 py-4 font-normal sm:px-5">
                    <div><div className="flex items-center gap-2"><h2 className="text-base font-bold text-slate-950">Notifications</h2>{unreadCount > 0 && <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700">{unreadCount} new</span>}</div><p className="mt-1 text-xs text-slate-500">Updates about your jobs and applications</p></div>
                    {unreadCount > 0 && <button type="button" disabled={updating} onClick={(event) => { event.preventDefault(); event.stopPropagation(); void markAllRead(); }} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-50 disabled:opacity-50"><CheckCheck className="h-3.5 w-3.5" /><span className="hidden sm:inline">Mark all read</span><span className="sm:hidden">Read all</span></button>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-0" />

                {notifications.length ? <div className="max-h-[min(65vh,480px)] overflow-y-auto p-2">
                    {notifications.map((notification) => {
                        const { title, Icon, tone } = getPresentation(notification);
                        const sender = notification.sender && typeof notification.sender === "object" ? notification.sender.name : notification.sender;
                        return <DropdownMenuItem key={notification._id} asChild className="cursor-pointer rounded-xl p-0 focus:bg-slate-100">
                            <Link href={notificationHref(notification)} onClick={() => void markRead(notification)} className={`flex w-full items-start gap-3 whitespace-normal rounded-xl border p-3 transition ${notification.isRead ? "border-transparent bg-white hover:border-slate-100 hover:bg-slate-50" : "border-violet-100 bg-violet-50/60 hover:bg-violet-50"}`}>
                                <span className={`relative mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone}`}><Icon className="h-[18px] w-[18px]" />{!notification.isRead && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-violet-600" />}</span>
                                <span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-2"><span className="text-sm font-semibold leading-5 text-slate-900">{title}</span>{notification.createdAt && <time className="shrink-0 pt-0.5 text-[10px] text-slate-400">{relativeTime(notification.createdAt)}</time>}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{notification.message}</span>{sender && <span className="mt-1.5 block truncate text-[11px] font-medium text-slate-400">From {sender}</span>}</span>
                            </Link>
                        </DropdownMenuItem>;
                    })}
                </div> : <div className="px-5 py-10 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-violet-700"><Sparkles className="h-5 w-5" /></span><p className="mt-3 text-sm font-semibold text-slate-900">You’re all caught up</p><p className="mt-1 text-xs leading-5 text-slate-500">New application and account updates will show here.</p></div>}
                <DropdownMenuSeparator className="my-0" />
                <div className="px-4 py-2.5 text-center text-[11px] text-slate-400">Showing your latest {notifications.length ? Math.min(notifications.length, 50) : ""} updates</div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationControl;
