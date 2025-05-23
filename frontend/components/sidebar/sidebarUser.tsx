"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import UserDropDown from "../common/userDropDown";

export function SidebarNavUser({
    user,
}: {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
}) {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <UserDropDown user={user} />
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
