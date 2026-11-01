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
        <form action={formAction} className="grid gap-4">
            <IconInput
                Icon={Lock}
                name="oldPassword"
                placeholder="Current password"
                type="password"
                autoComplete="current-password"
                className="h-11 w-full rounded-xl border-slate-200 bg-white pl-10 shadow-sm focus-visible:border-violet-400 focus-visible:ring-violet-100"
            />
            <IconInput
                Icon={Lock}
                name="password"
                placeholder="New password"
                type="password"
                autoComplete="new-password"
                className="h-11 w-full rounded-xl border-slate-200 bg-white pl-10 shadow-sm focus-visible:border-violet-400 focus-visible:ring-violet-100"
            />
            <IconInput
                Icon={Lock}
                name="newPassword"
                placeholder="Confirm new password"
                type="password"
                autoComplete="new-password"
                className="h-11 w-full rounded-xl border-slate-200 bg-white pl-10 shadow-sm focus-visible:border-violet-400 focus-visible:ring-violet-100"
            />

            <p className="text-xs leading-5 text-slate-500">Use at least 8 characters with uppercase and lowercase letters, a number, and a symbol.</p>

            <Button type="submit" disabled={pending} className="mt-1 h-11 rounded-xl bg-violet-700 font-semibold shadow-sm shadow-violet-700/15 hover:bg-violet-800">
                {pending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Lock className="mr-2 h-4 w-4" />
                )}
                {pending ? "Updating password…" : "Update password"}
            </Button>
        </form>
    );
};

export default ChangePasswordForm;
