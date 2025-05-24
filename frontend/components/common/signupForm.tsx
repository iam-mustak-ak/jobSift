"use client";
import createUserAction from "@/actions/createUserAction";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import CustomInput from "./customInput";
import SocialLoginButtons from "./socialLoginButtons";
import SubmitButton from "./submitButton";

const initialState = {
    success: false,
    message: "",
};

const SignupForm = () => {
    const [state, formAction, pending] = useActionState(
        createUserAction,
        initialState
    );

    const [role, setRole] = useState("candidate");

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <div className="w-full md:w-[425px] mx-4 md:mx-auto border p-4 rounded-md shadow-md">
            <h4 className="font-bold text-lg">Sign Up </h4>
            <p className="text-base">Fill The Details</p>
            <form className="w-full" action={formAction}>
                <div className="grid gap-4 py-4">
                    <p className=" text-md font-medium text-secondary-foreground">
                        Sign up as
                    </p>
                    <RadioGroup
                        defaultValue="candidate"
                        name="role"
                        className="flex items-center gap-4"
                        onValueChange={(value) => setRole(value)}
                        required
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="candidate" id="candidate" />
                            <Label htmlFor="candidate">Candidate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="recruiter" id="recruiter" />
                            <Label htmlFor="recruiter">Recruiter</Label>
                        </div>
                    </RadioGroup>

                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                        <CustomInput
                            type="text"
                            id="full-name"
                            label="Full Name"
                            name="name"
                        />
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
                        <CustomInput
                            type="password"
                            id="confirm-pasword"
                            label="Confirm Password"
                            name="confirm-password"
                        />
                    </div>

                    <SubmitButton label="Sign Up" pending={pending} />

                    <div className="flex items-center justify-center gap-2 text-sm">
                        <span>Have an Account?</span>{" "}
                        <Link href="/login" className="hover:underline">
                            Sign In
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-full h-[1px] bg-black/10" />
                        <p>OR</p>
                        <div className="w-full h-[1px] bg-black/10" />
                    </div>
                </div>
            </form>
            <SocialLoginButtons isLogIn={false} role={role} />
        </div>
    );
};

export default SignupForm;
