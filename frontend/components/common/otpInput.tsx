"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "../ui/input-otp";

const OtpInput = () => {
    const [otp, setOtp] = useState("");
    console.log(otp);
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
            <Button className="w-full mt-4">Verify</Button>
            <div className="flex items-center justify-center text-sm mt-4">
                <span>Didn't Receive the Code?</span>
                <Button variant="link">Resend Code</Button>
            </div>
        </>
    );
};

export default OtpInput;
