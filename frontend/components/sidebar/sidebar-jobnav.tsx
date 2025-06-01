"use client";

import { type LucideIcon } from "lucide-react";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
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
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Basic</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            {item.name === "Dashboard" ? (
                                <Link href={`${item.url}/${profileId}`}>
                                    <item.icon />
                                    <span>{item.name}</span>
                                </Link>
                            ) : (
                                <Link href={item.url}>
                                    <item.icon />
                                    <span>{item.name}</span>
                                </Link>
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
