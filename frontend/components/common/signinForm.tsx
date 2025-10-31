"use client";

import { useAuthStore } from "@/state/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import CustomInput from "./customInput";
import SocialLoginButtons from "./socialLoginButtons";
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
        <div className="w-full md:w-[425px] mx-4 md:mx-auto border p-4 rounded-md shadow-md ">
            <h4 className="font-bold text-lg">Login </h4>
            <p className="text-base">Welcome Back</p>
            <form className="w-full" onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                    <CustomInput
                        type="email"
                        id="email"
                        label="Email"
                        name="email"
                    />
                    <CustomInput
                        type="password"
                        id="password"
                        label="Password"
                        name="password"
                    />

                    <Link
                        href="/forgot-password"
                        className="justify-end cursor-pointer text-primary text-right hover:underline"
                    >
                        Forgot Password?
                    </Link>

                    <SubmitButton label="Sign In" pending={pending} />

                    <div className="flex items-center justify-center gap-2 text-sm">
                        <span>Don&apos;t Have an Account?</span>
                        <Link href="/signup" className="hover:underline">
                            Sign Up
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-full h-[1px] bg-black/10" />
                        <p>OR</p>
                        <div className="w-full h-[1px] bg-black/10" />
                    </div>
                </div>
            </form>
            <SocialLoginButtons isLogIn={true} />
        </div>
    );
};

export default SigninForm;
