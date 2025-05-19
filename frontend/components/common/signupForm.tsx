import Googlesvg from "@/lib/LogoProvider/googlesvg";
import LinkendInSvg from "@/lib/LogoProvider/linkendInSvg";
import Link from "next/link";
import { Button } from "../ui/button";
import CustomInput from "./customInput";

const SignupForm = () => {
    return (
        <div className="sm:w-[425px] mx-auto border p-4 rounded-md shadow-md">
            <h4 className="font-bold text-lg">Sign Up </h4>
            <p className="text-base">Fill The Details</p>
            <form className="w-full">
                <div className="grid gap-4 py-4">
                    <CustomInput type="email" id="email" label="Email" />
                    <CustomInput
                        type="password"
                        id="password"
                        label="Password"
                    />
                    <CustomInput
                        type="password"
                        id="confirm-pasword"
                        label="Confirm Password"
                    />
                    <Button type="submit">Sign Up</Button>

                    <div className="flex items-center justify-center gap-2 text-sm">
                        <span>Have an Account?</span>{" "}
                        <Link href="/auth/login" className="hover:underline">
                            Sign In
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
                            <span>Sign Up With Google</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex items-center justify-center w-full cursor-pointer"
                        >
                            <LinkendInSvg />
                            <span>Sign Up With LinkedIn</span>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SignupForm;
