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
import Link from "next/link";
export default function AppSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <Link href="/">
                    <Image
                        src="/logo-main.svg"
                        alt="logo"
                        width={500}
                        height={500}
                        className="w-full max-w-28"
                    />
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarJobNav projects={data.basic} />
                <NavMain label="Account" items={data.account} />
                <NavMain label="Job" items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <SidebarNavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
