import ForgotPasswordForm from "@/components/common/forgotPasswordForm";
import AuthShell from "@/components/common/authShell";
import { Button } from "@/components/ui/button";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import Link from "next/link";

const Page = () => {
    return (
        <AuthShell>
            <div className="w-full max-w-md">
                <Link
                    href="/login"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-violet-700"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to sign in
                </Link>
                <div className="mb-7">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                        <KeyRound className="h-7 w-7" />
                    </div>
                    <p className="text-sm font-semibold text-violet-700">Account recovery</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                        Reset your password
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Enter the email associated with your account. We’ll send you a secure link to choose a new password.
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.04] sm:p-6">
                    <ForgotPasswordForm />
                </div>
                <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    The password reset link is sent only to the email registered with your account.
                </div>
                <p className="mt-7 text-center text-sm text-slate-600">
                    Don’t have an account?{" "}
                    <Button asChild variant="link" className="h-auto p-0 font-semibold text-violet-700">
                        <Link href="/signup">Create one</Link>
                    </Button>
                </p>
            </div>
        </AuthShell>
    );
};

export default Page;
