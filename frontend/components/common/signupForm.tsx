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
        <div className="w-full max-w-md">
            <div>
                <p className="text-sm font-semibold text-violet-700">
                    Get started
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    Create your account
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Join JobSift and take the next step in your career.
                </p>
            </div>
            <form className="mt-6 w-full" action={formAction}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <p className="text-sm font-semibold text-slate-800">
                            I&apos;m joining as a
                        </p>
                        <RadioGroup
                            defaultValue="candidate"
                            name="role"
                            className="grid grid-cols-2 gap-3"
                            onValueChange={(value) => setRole(value)}
                            required
                        >
                            <div
                                className={`flex min-w-0 items-start gap-2.5 rounded-xl border p-3 transition-colors ${
                                    role === "candidate"
                                        ? "border-violet-300 bg-violet-50"
                                        : "border-slate-200 bg-white"
                                }`}
                            >
                                <RadioGroupItem
                                    value="candidate"
                                    id="candidate"
                                    className="mt-0.5"
                                />
                                <div className="min-w-0">
                                    <Label
                                        htmlFor="candidate"
                                        className="cursor-pointer text-sm font-semibold text-slate-800"
                                    >
                                        Candidate
                                    </Label>
                                    <p className="mt-1 text-xs leading-4 text-slate-500">
                                        Find your next role
                                    </p>
                                </div>
                            </div>
                            <div
                                className={`flex min-w-0 items-start gap-2.5 rounded-xl border p-3 transition-colors ${
                                    role === "recruiter"
                                        ? "border-violet-300 bg-violet-50"
                                        : "border-slate-200 bg-white"
                                }`}
                            >
                                <RadioGroupItem
                                    value="recruiter"
                                    id="recruiter"
                                    className="mt-0.5"
                                />
                                <div className="min-w-0">
                                    <Label
                                        htmlFor="recruiter"
                                        className="cursor-pointer text-sm font-semibold text-slate-800"
                                    >
                                        Recruiter
                                    </Label>
                                    <p className="mt-1 text-xs leading-4 text-slate-500">
                                        Find great candidates
                                    </p>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <CustomInput
                            type="text"
                            id="full-name"
                            label="Full Name"
                            name="name"
                            placeholder="Your name"
                            className="h-11 rounded-xl border-slate-200 bg-slate-50 px-3.5 text-sm focus-visible:bg-white"
                        />
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
                            placeholder="Create a password"
                            className="h-11 rounded-xl border-slate-200 bg-slate-50 px-3.5 text-sm focus-visible:bg-white"
                        />
                        <CustomInput
                            type="password"
                            id="confirm-pasword"
                            label="Confirm Password"
                            name="confirm-password"
                            placeholder="Re-enter your password"
                            className="h-11 rounded-xl border-slate-200 bg-slate-50 px-3.5 text-sm focus-visible:bg-white"
                        />
                    </div>

                    {role === "recruiter" && (
                        <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4 sm:p-5">
                            <div className="mb-4">
                                <p className="text-sm font-semibold text-slate-900">Company details</p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">Add your organization so candidates can recognize your opportunities.</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <CustomInput
                                    type="text"
                                    id="company-name"
                                    label="Company name"
                                    name="companyName"
                                    placeholder="e.g. Acme Inc."
                                    required
                                    className="h-11 rounded-xl border-slate-200 bg-white px-3.5 text-sm"
                                />
                                <CustomInput
                                    type="url"
                                    id="company-website"
                                    label="Company website"
                                    name="companyWebsite"
                                    placeholder="https://example.com"
                                    className="h-11 rounded-xl border-slate-200 bg-white px-3.5 text-sm"
                                />
                                <CustomInput
                                    type="text"
                                    id="company-industry"
                                    label="Industry"
                                    name="companyIndustry"
                                    placeholder="e.g. Technology"
                                    className="h-11 rounded-xl border-slate-200 bg-white px-3.5 text-sm"
                                />
                                <CustomInput
                                    type="text"
                                    id="company-location"
                                    label="Company location"
                                    name="companyLocation"
                                    placeholder="City, country"
                                    className="h-11 rounded-xl border-slate-200 bg-white px-3.5 text-sm"
                                />
                            </div>
                        </div>
                    )}

                    <SubmitButton
                        label="Create account"
                        pending={pending}
                        className="mt-1 h-11 w-full rounded-xl text-sm font-semibold shadow-md shadow-violet-700/15"
                    />
                </div>
            </form>
            <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                or sign up with
                <span className="h-px flex-1 bg-slate-200" />
            </div>
            {role === "candidate" ? (
                <SocialLoginButtons isLogIn={false} role={role} />
            ) : (
                <p className="text-center text-xs leading-5 text-slate-500">
                    Recruiter accounts need company details, so please use the form above to sign up.
                </p>
            )}
            <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-semibold text-violet-700 hover:text-violet-900 hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default SignupForm;
