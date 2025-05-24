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
        <form action={formAction}>
            <IconInput Icon={Mail} type="email" name="email" id="forgotEmail" />
            <Button disabled={pending} className="w-full mt-5">
                {pending ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    "Send Reset Link"
                )}
            </Button>
        </form>
    );
};

export default ForgotPasswordForm;
