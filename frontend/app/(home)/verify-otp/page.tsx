import OtpInput from "@/components/common/otpInput";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BadgeCheck, MailCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const Page = () => {
    return (
        <div className="relative flex min-h-[calc(100vh-5rem)] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-violet-50/80 via-white to-white px-4 py-12">
            <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl" />
            <Card className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/[0.06]">
                <div className="h-1.5 bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500" />
                <CardContent className="px-6 py-8 sm:px-9 sm:py-10">
                    <Link href="/signup" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-violet-700">
                        <ArrowLeft className="h-4 w-4" /> Back to sign up
                    </Link>
                    <div className="mb-7 flex flex-col items-center text-center">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                            <MailCheck className="h-8 w-8" strokeWidth={1.8} />
                        </div>
                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            <BadgeCheck className="h-3.5 w-3.5" /> One quick step
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Check your inbox</h1>
                        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                            Enter the 6-digit verification code we sent to your email to finish creating your account.
                        </p>
                    </div>
                    <Suspense fallback={<div className="h-36 animate-pulse rounded-2xl bg-slate-100" />}>
                        <OtpInput />
                    </Suspense>
                    <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">
                        <ShieldCheck className="h-4 w-4 text-slate-400" />
                        Your account is protected with secure verification
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
