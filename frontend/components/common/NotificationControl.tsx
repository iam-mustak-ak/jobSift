"use client";

import { useSocket } from "@/context/socketContext";
import { cn } from "@/lib/utils";

import { useAuthStore } from "@/state/store";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useSidebar } from "../ui/sidebar";

const NotificationControl = () => {
    const { isMobile } = useSidebar();
    const { notifications } = useSocket();
    const { user } = useAuthStore((state) => state);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="relative">
                        <Button variant={"outline"}>
                            <Bell />
                        </Button>
                        {notifications &&
                            Array.isArray(notifications) &&
                            notifications.length > 0 && (
                                <Badge className="absolute -right-2.5 -top-2.5 rounded-full">
                                    {notifications.length}
                                </Badge>
                            )}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-[300px] rounded-lg shadow-md "
                    side={isMobile ? "bottom" : "bottom"}
                    align="end"
                    sideOffset={4}
                >
                    <DropdownMenuLabel className="text-xl">
                        Notifications
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {notifications && notifications.length > 0 ? (
                            notifications?.map((notification) => (
                                <DropdownMenuItem
                                    asChild
                                    key={notification._id}
                                >
                                    <div
                                        className={cn(
                                            "text-sm rounded-md border p-2",
                                            notification.isRead
                                                ? ""
                                                : "bg-gray-300"
                                        )}
                                    >
                                        <Link
                                            href={`/profile/${user?._id}/my-jobs?page=1`}
                                        >
                                            <p>New Job Application</p>
                                            <p className="text-xs">
                                                An user Applied to your posted
                                                job.
                                            </p>
                                        </Link>
                                    </div>
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <p>No Notification!!</p>
                        )}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default NotificationControl;
