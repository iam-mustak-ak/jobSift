import ResetPasswordForm from "@/components/common/resetPasswordForm";
import AuthShell from "@/components/common/authShell";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import Link from "next/link";

const Page = async ({
    searchParams,
}: {
    searchParams?: Promise<{ email?: string; resetId: string }>;
}) => {
    const searchKey = await searchParams;
    const email = searchKey?.email;
    const resetId = searchKey?.resetId;

    return (
        <AuthShell>
            <div className="w-full max-w-md">
                <Link
                    href={email && resetId ? "/login" : "/forgot-password"}
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-violet-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {email && resetId ? "Back to sign in" : "Request a new link"}
                </Link>

                <div className="mb-7">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                        <KeyRound className="h-7 w-7" />
                    </div>
                    <p className="text-sm font-semibold text-violet-700">Account recovery</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                        {email && resetId ? "Choose a new password" : "Reset link unavailable"}
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {email && resetId
                            ? "Create a strong password to secure your JobSift account."
                            : "This reset link is incomplete. Request a fresh link to continue securely."}
                    </p>
                </div>

                {email && resetId ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.04] sm:p-6">
                        <ResetPasswordForm email={email} resetId={resetId} />
                    </div>
                ) : (
                    <Link
                        href="/forgot-password"
                        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-violet-700 px-5 text-sm font-semibold text-white shadow-md shadow-violet-700/15 transition hover:bg-violet-800"
                    >
                        Request password reset
                    </Link>
                )}

                <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    Your password is protected. Never share it with anyone.
                </div>
            </div>
        </AuthShell>
    );
};

export default Page;
