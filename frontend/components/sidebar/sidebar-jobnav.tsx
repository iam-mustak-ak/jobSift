"use client";

import { type LucideIcon, Building2, BriefcaseBusiness, MessagesSquare, Plus } from "lucide-react";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/state/store";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SidebarJobNav({
    projects,
}: {
    projects: {
        name: string;
        url: string;
        icon: LucideIcon;
    }[];
}) {
    const { user } = useAuthStore((state) => state);
    const params = useParams();
    const profileId = String(params.profileId ?? user?._id ?? "");
    const links = user?.role === "recruiter"
        ? [
            { name: "Dashboard", url: "/profile", icon: projects.find((item) => item.name === "Dashboard")?.icon },
            { name: "Company Profile", url: `/profile/${profileId}#company-profile`, icon: Building2 },
            { name: "My Jobs", url: `/profile/${profileId}/my-jobs?page=1`, icon: BriefcaseBusiness },
            { name: "Messages", url: `/profile/${profileId}/messages`, icon: MessagesSquare },
            { name: "Post a Job", url: "/post-job", icon: Plus },
        ].filter((item) => item.icon)
        : projects.filter((item) => item.name !== "My Jobs");

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Basic</SidebarGroupLabel>
            <SidebarMenu>
                {links.map((item) => {
                    return (
                        <SidebarMenuItem key={item.name}>
                            {user && (
                                <SidebarMenuButton asChild>
                                    <Link
                                        href={
                                            item.name === "Dashboard"
                                                ? `${item.url}/${profileId}`
                                                : item.name === "Saved Jobs"
                                                ? `/profile/${profileId}/saved-jobs`
                                                : item.name === "Applied Jobs"
                                                ? `/profile/${profileId}/applied-jobs`
                                                : item.name === "Messages"
                                                ? `/profile/${profileId}/messages`
                                                : item.url
                                        }
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
