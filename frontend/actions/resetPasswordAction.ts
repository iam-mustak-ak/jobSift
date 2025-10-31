"use server";

import { cookies } from "next/headers";

const resetPasswordAction = async (
    extras: {
        email?: string;
        resetId?: string;
    },
    prevState: any,
    formData: FormData
) => {
    "use server";

    const storedCookies = await cookies();
    storedCookies.delete("accessToken");
    storedCookies.delete("refreshToken");

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
        return {
            success: false,
            message: "Password and Confirm password is required",
        };
    }

    if (password !== confirmPassword) {
        return {
            success: false,
            message: "Password do not match",
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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/reset-password`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email: extras.email,
                resetId: extras.resetId,
                password,
                confirmPassword,
            }),
        }
    );

    const data = await res.json();

    return {
        success: data.success,
        message: data.message,
    };
};

export default resetPasswordAction;
