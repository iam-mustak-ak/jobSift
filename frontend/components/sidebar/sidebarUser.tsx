"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import UserDropDown from "../common/userDropDown";

export function SidebarNavUser() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <UserDropDown />
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
