"use server";

import { redirect } from "next/navigation";

export default async function createUserAction(
    prevState: any,
    formData: FormData
) {
    "use server";
    const role = formData.get("role") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (!name || !email || !password || !confirmPassword) {
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

    const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
        return {
            success: false,
            message:
                "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
        };
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/create-user`,
        {
            method: "POST",
            body: JSON.stringify({
                role,
                name,
                email,
                password,
            }),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    if (!res.ok) {
        const error = await res.json();
        return {
            success: false,
            message: error.message,
        };
    }

    redirect(`/verify-otp?email=${email}`);
}
