"use client";

import { type LucideIcon } from "lucide-react";

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
    const { profileId } = useParams();

    const { user } = useAuthStore((state) => state);

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Basic</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        {user &&
                            !(
                                user.role === "recruiter" &&
                                item.name === "Applied Jobs"
                            ) && (
                                <SidebarMenuButton asChild>
                                    <Link
                                        href={
                                            item.name === "Dashboard"
                                                ? `${item.url}/${profileId}`
                                                : item.name === "My Jobs"
                                                ? `/profile/${profileId}/${item.url}`
                                                : item.name === "Saved Jobs"
                                                ? `/profile/${profileId}${item.url}`
                                                : item.name === "Applied Jobs"
                                                ? `/profile/${profileId}${item.url}`
                                                : item.url
                                        }
                                    >
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
