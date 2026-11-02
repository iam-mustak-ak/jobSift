"use client";

import { useAuthStore } from "@/state/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import CustomInput from "./customInput";
import SubmitButton from "./submitButton";

const SigninForm = () => {
    const [pending, setPending] = useState(false);
    const router = useRouter();
    const { setAuth } = useAuthStore((state) => state);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setPending(true);

        try {
            const formData = new FormData(
                event.currentTarget as HTMLFormElement
            );
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            if (!email || !password) {
                return toast.error("Please fill all the fields");
            }
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) return toast.error("Login Error");

            const data = await response.json();

            if (!data?.success) {
                return toast.error("Login Error");
            }

            setAuth(data.data);
            router.push(`/profile/${data.data._id}`);
        } catch (error) {
            toast.error("Invalid credentials");
            console.log(error);
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="w-full max-w-md">
            <div>
                <p className="text-sm font-semibold text-violet-700">Welcome back</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    Sign in to JobSift
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Pick up where you left off and keep your next move on track.
                </p>
            </div>
            <form className="mt-7 w-full" onSubmit={handleSubmit}>
                <div className="grid gap-5">
                    <CustomInput
                        type="email"
                        id="email"
                        label="Email"
                        name="email"
                        placeholder="you@example.com"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50 px-3.5 text-sm focus-visible:bg-white"
                    />
                    <CustomInput
                        type="password"
                        id="password"
                        label="Password"
                        name="password"
                        placeholder="Enter your password"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50 px-3.5 text-sm focus-visible:bg-white"
                    />

                    <div className="-mt-1 flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-sm font-semibold text-violet-700 transition-colors hover:text-violet-900 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <SubmitButton
                        label="Sign in"
                        pending={pending}
                        className="h-11 w-full rounded-xl text-sm font-semibold shadow-md shadow-violet-700/15"
                    />
                </div>
            </form>
            {/* Google login is temporarily disabled.
            <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                or continue with
                <span className="h-px flex-1 bg-slate-200" />
            </div>
            <SocialLoginButtons isLogIn={true} />
            */}
            <p className="mt-7 text-center text-sm text-slate-600">
                New to JobSift?{" "}
                <Link
                    href="/signup"
                    className="font-semibold text-violet-700 hover:text-violet-900 hover:underline"
                >
                    Create an account
                </Link>
            </p>
        </div>
    );
};

export default SigninForm;
