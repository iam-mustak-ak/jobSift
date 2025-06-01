"use client";

import chnagePasswordAction from "@/actions/changePasswordAction";
import { Loader2, Lock } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import IconInput from "./iconInput";

const initialState = {
    success: false,
    message: "",
};

const ChangePasswordForm = () => {
    const [state, formAction, pending] = useActionState(
        chnagePasswordAction,
        initialState
    );

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <form action={formAction} className="grid gap-2">
            <IconInput
                Icon={Lock}
                name="oldPassword"
                placeholder="Old password"
                type="password"
                className="w-full"
            />
            <IconInput
                Icon={Lock}
                name="password"
                placeholder="New Password"
                type="password"
                className="w-full"
            />
            <IconInput
                Icon={Lock}
                name="newPassword"
                placeholder="New Password"
                type="password"
                className="w-full"
            />

            <Button type="submit" disabled={pending}>
                {pending ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    "Change Password"
                )}
            </Button>
        </form>
    );
};

export default ChangePasswordForm;
