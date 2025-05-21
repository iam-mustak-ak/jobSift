"use server";

import { redirect } from "next/navigation";

export default async function createUserAction(
    prevState: any,
    formData: FormData
) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (!email || !password || !confirmPassword) {
        return {
            success: false,
            message: "Please fill all the fields",
        };
    }

    if (password !== confirmPassword) {
        return {
            success: false,
            message: "Passwords do not match",
        };
    }

    redirect("/verify-otp");
}
