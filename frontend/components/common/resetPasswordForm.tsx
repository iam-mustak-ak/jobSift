"use client";
import resetPasswordAction from "@/actions/resetPasswordAction";
import { Lock } from "lucide-react";
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
        <form action={formAction} className="grid gap-2">
            <IconInput
                Icon={Lock}
                type="password"
                name="password"
                id="resetPassword"
                placeholder="New Password"
            />
            <IconInput
                Icon={Lock}
                type="password"
                name="confirmPassword"
                id="resetConfirmPassword"
                placeholder="Confirm Passowrd"
            />
            <Button disabled={pending} className="w-full mt-5">
                Reset{" "}
            </Button>
        </form>
    );
};

export default ResetPasswordForm;
