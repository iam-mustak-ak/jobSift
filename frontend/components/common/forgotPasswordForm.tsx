"use client";

import forgotPasswordAction from "@/actions/forgorPasswordAction";
import { Loader2, Mail } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import IconInput from "./iconInput";

const initialState = {
    success: false,
    message: "",
};

const ForgotPasswordForm = () => {
    const [state, formAction, pending] = useActionState(
        forgotPasswordAction,
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
            <div>
                <label htmlFor="forgotEmail" className="mb-2 block text-sm font-medium text-slate-800">Email address</label>
                <IconInput
                    Icon={Mail}
                    type="email"
                    name="email"
                    id="forgotEmail"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-10 text-sm focus-visible:bg-white focus-visible:border-violet-400 focus-visible:ring-violet-100"
                />
            </div>
            <Button disabled={pending} className="mt-1 h-11 w-full rounded-xl bg-violet-700 font-semibold shadow-md shadow-violet-700/15 hover:bg-violet-800">
                {pending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Mail className="mr-2 h-4 w-4" />
                )}
                {pending ? "Sending reset link…" : "Send reset link"}
            </Button>
        </form>
    );
};

export default ForgotPasswordForm;
