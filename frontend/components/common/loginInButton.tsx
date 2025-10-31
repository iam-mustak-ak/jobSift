"use client";
import useLogout from "@/hooks/useLogout";
import { useAuthStore } from "@/state/store";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "../ui/dropdown-menu";

const LoginInButton = () => {
    const user = useAuthStore((state) => state.user);
    const { handleLogout, loading, error } = useLogout({
        redirect: "login",
    });
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);
    return user! ? (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.profilePicture} alt={user?.name} />
                    <AvatarFallback className="rounded-lg">
                        {user?.name?.slice(0, 2)}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href={`/profile/${user._id}`}>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={loading} onClick={handleLogout}>
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                {" "}
                                <LogOut />
                                Log out
                            </>
                        )}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <Button className="max-lg:hidden" asChild>
            <Link href="/login">Login / Sign Up</Link>
        </Button>
    );
};

export default LoginInButton;
