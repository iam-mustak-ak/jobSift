"use client";

import signInAction from "@/actions/signInAction";
import Googlesvg from "@/lib/LogoProvider/googlesvg";
import LinkendInSvg from "@/lib/LogoProvider/linkendInSvg";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import CustomInput from "./customInput";
import SubmitButton from "./submitButton";

const initialState = {
    success: false,
    message: "",
};

const SigninForm = () => {
    const [state, formAction, pending] = useActionState(
        signInAction,
        initialState
    );

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
        } else if (state?.message && !state.success) {
            toast.error(state.message);
        }
    }, [state]);
    return (
        <div className="w-full md:w-[425px] mx-4 md:mx-auto border p-4 rounded-md shadow-md ">
            <h4 className="font-bold text-lg">Login </h4>
            <p className="text-base">Welcome Back</p>
            <form className="w-full" action={formAction}>
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

                    <SubmitButton label="Sign In" pending={pending} />

                    <div className="flex items-center justify-center gap-2 text-sm">
                        <span>Don't Have an Account?</span>{" "}
                        <Link href="/signup" className="hover:underline">
                            Sign Up
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-full h-[1px] bg-black/10" />
                        <p>OR</p>
                        <div className="w-full h-[1px] bg-black/10" />
                    </div>

                    <div className="grid gap-2">
                        <Button
                            variant="outline"
                            className="flex items-center justify-center w-full cursor-pointer"
                        >
                            <Googlesvg />
                            <span>Sign in With Google</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex items-center justify-center w-full cursor-pointer"
                        >
                            <LinkendInSvg />
                            <span>Sign in With LinkedIn</span>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SigninForm;
