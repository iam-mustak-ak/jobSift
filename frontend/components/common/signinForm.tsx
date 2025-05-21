import Googlesvg from "@/lib/LogoProvider/googlesvg";
import LinkendInSvg from "@/lib/LogoProvider/linkendInSvg";
import Link from "next/link";
import { Button } from "../ui/button";
import CustomInput from "./customInput";

const SigninForm = () => {
    return (
        <div className="sm:w-[425px] mx-auto border p-4 rounded-md shadow-md">
            <h4 className="font-bold text-lg">Login </h4>
            <p className="text-base">Welcome Back</p>
            <form className="w-full">
                <div className="grid gap-4 py-4">
                    <CustomInput type="email" id="email" label="Email" />
                    <CustomInput
                        type="password"
                        id="password"
                        label="Password"
                    />

                    <Button type="submit">Sign In</Button>

                    <div className="flex items-center justify-center gap-2 text-sm">
                        <span>Don't Have an Account?</span>{" "}
                        <Link href="/auth/signup" className="hover:underline">
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
