import OtpInput from "@/components/common/otpInput";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";

const Page = () => {
    return (
        <div className="flex h-screen w-full items-center justify-center  flex-col gap-4">
            <Card>
                <CardContent>
                    <div className="flex flex-col items-center justify-center gap-4 mb-4">
                        <h1 className="text-2xl font-bold">Verify OTP</h1>
                        <p className="text-sm text-gray-500">
                            Enter the OTP sent to your email
                        </p>
                    </div>
                    <Suspense fallback={<p>Loading..</p>}>
                        <OtpInput />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
