"use client";
import * as React from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import SidebarJobNav from "./sidebar-jobnav";
import NavMain from "./sidebar-mainnav";
import { SidebarNavUser } from "./sidebarUser";
// This is sample data.
import { sideabrLinksData as data } from "@/constants/sidebarLinks";
import Image from "next/image";
export default function AppSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <Image
                    src="/logo-main.svg"
                    alt="logo"
                    width={500}
                    height={500}
                    className="w-full h-10"
                />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <SidebarJobNav projects={data.job} />
            </SidebarContent>
            <SidebarFooter>
                <SidebarNavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
