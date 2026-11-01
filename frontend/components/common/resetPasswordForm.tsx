"use client";
import resetPasswordAction from "@/actions/resetPasswordAction";
import { KeyRound, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import IconInput from "./iconInput";

const initialSate = {
    success: false,
    message: "",
};

const ResetPasswordForm = ({
    email,
    resetId,
}: {
    email?: string;
    resetId?: string;
}) => {
    const resetAction = resetPasswordAction.bind(null, {
        email,
        resetId,
    });

    const [state, formAction, pending] = useActionState(
        resetAction,
        initialSate
    );
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);

            router.push("/login");
        } else if (state?.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, router]);

    return (
        <form action={formAction} className="grid gap-4">
            <IconInput
                Icon={Lock}
                type="password"
                name="password"
                id="resetPassword"
                placeholder="New password"
                autoComplete="new-password"
                required
                className="h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-10 text-sm focus-visible:border-violet-400 focus-visible:bg-white focus-visible:ring-violet-100"
            />
            <IconInput
                Icon={Lock}
                type="password"
                name="confirmPassword"
                id="resetConfirmPassword"
                placeholder="Confirm new password"
                autoComplete="new-password"
                required
                className="h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-10 text-sm focus-visible:border-violet-400 focus-visible:bg-white focus-visible:ring-violet-100"
            />
            <p className="text-xs leading-5 text-slate-500">
                Use at least 8 characters with uppercase and lowercase letters, a number, and a symbol.
            </p>
            <Button disabled={pending} className="mt-1 h-11 w-full rounded-xl bg-violet-700 font-semibold shadow-md shadow-violet-700/15 hover:bg-violet-800">
                {pending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <KeyRound className="mr-2 h-4 w-4" />
                )}
                {pending ? "Updating password…" : "Set new password"}
            </Button>
        </form>
    );
};

export default ResetPasswordForm;
