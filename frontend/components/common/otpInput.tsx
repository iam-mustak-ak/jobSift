"use client";
import useCountdown from "@/hooks/userCountDown";
import { Loader2 } from "lucide-react";
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
                `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/resend-email`,
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

            const data = await res.json();
            toast.success(data.message);

            startTimer();
        } catch (err) {
            toast.error("Otp send Faild");
            console.log(err);
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
                `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/verify-otp`,
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

            router.push("/login");
        } catch (error) {
            toast.error("Invalid OTP");
            console.log(error);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <InputOTP maxLength={6} value={otp} onChange={(otp) => setOtp(otp)}>
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
            <Button onClick={handleOtp} className="w-full mt-4">
                {isPending ? <Loader2 className="animate-spin" /> : "Verify"}
            </Button>
            <div className="flex items-center justify-center text-sm mt-4">
                <span>
                    {canResend
                        ? "Didn't Get The code? :"
                        : `Please Try again after :${timer}`}
                </span>

                {canResend && (
                    <Button
                        disabled={isPending}
                        onClick={handleResendOtp}
                        variant="link"
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            " Resend Code"
                        )}
                    </Button>
                )}
            </div>
        </>
    );
};

export default OtpInput;
