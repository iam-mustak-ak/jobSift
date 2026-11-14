"use client";
import { API_BASE_URL } from "@/lib/api";
import useCountdown from "@/hooks/userCountDown";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "../ui/input-otp";

const OtpInput = () => {
    const [otp, setOtp] = useState<string>("");
    const [attemptsLeft, setAttemptsLeft] = useState(3);
    const router = useRouter();
    const email = useSearchParams().get("email");
    const [isPending, setIsPending] = useState<boolean>(false);

    const { canResend, startTimer, timer } = useCountdown(60);

    const handleResendOtp = async () => {
        setIsPending(true);
        try {
            if (email === null) {
                toast.error("Please enter a valid email");
                return;
            }

            const res = await fetch(
                `${API_BASE_URL}/auth/resend-email`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                    }),
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                toast.error(
                    data?.message || "We couldn’t send a new code. Please try again."
                );
                return;
            }
            toast.success(data?.message || "A new verification code has been sent.");

            setAttemptsLeft(3);
            setOtp("");
            startTimer();
        } catch {
            toast.error("We couldn’t reach the email service. Please try again.");
        } finally {
            setIsPending(false);
        }
    };

    const handleOtp = async () => {
        setIsPending(true);
        try {
            if (otp.length < 6) {
                toast.error("Please enter a valid OTP");
                return;
            }

            if (email === null) {
                toast.error("Please enter a valid email");
                return;
            }

            const res = await fetch(
                `${API_BASE_URL}/auth/verify-user`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                        otp,
                    }),
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                if (typeof data?.attemptsLeft === "number") {
                    setAttemptsLeft(Math.max(0, data.attemptsLeft));
                }
                toast.error(
                    data?.message || "That code couldn’t be verified. Please try again."
                );
                return;
            }

            toast.success("Your email is verified. You can now sign in.");
            router.push("/login");
        } catch {
            toast.error("We couldn’t reach the verification service. Please try again.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <InputOTP
                maxLength={6}
                value={otp}
                onChange={(otp) => setOtp(otp)}
                disabled={isPending || attemptsLeft === 0}
                containerClassName="w-full justify-center gap-3"
            >
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
            <p
                aria-live="polite"
                className={`mt-3 text-center text-xs font-medium ${attemptsLeft === 0 ? "text-red-600" : "text-slate-500"}`}
            >
                {attemptsLeft > 0
                    ? `${attemptsLeft} verification ${attemptsLeft === 1 ? "attempt" : "attempts"} remaining for this code.`
                    : "No attempts remain. Request a new code when available."}
            </p>
            {email && (
                <p className="mt-4 text-center text-sm text-slate-500">
                    Code sent to{" "}
                    <span className="font-semibold text-slate-800">{email}</span>
                </p>
            )}
            <Button
                onClick={handleOtp}
                disabled={isPending || otp.length !== 6 || attemptsLeft === 0}
                className="mt-6 h-12 w-full rounded-xl bg-violet-700 text-sm font-semibold shadow-md shadow-violet-700/15 transition hover:bg-violet-800 disabled:opacity-60"
            >
                {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <ShieldCheck className="mr-2 h-4 w-4" />
                )}
                {isPending ? "Verifying…" : "Verify email"}
            </Button>
            <div className="mt-5 flex flex-col items-center justify-center gap-1 text-sm sm:flex-row sm:gap-2">
                <span className="text-slate-500">
                    {canResend ? "Didn’t receive the code?" : `You can request another in ${timer}s`}
                </span>

                {canResend && (
                    <Button
                        disabled={isPending}
                        onClick={handleResendOtp}
                        variant="link"
                        className="h-auto p-1 font-semibold text-violet-700"
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            "Resend code"
                        )}
                    </Button>
                )}
            </div>
        </>
    );
};

export default OtpInput;
