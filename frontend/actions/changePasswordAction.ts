"use server";

import { cookies } from "next/headers";

const chnagePasswordAction = async (prevState: any, formData: FormData) => {
    "use server";

    const storedCookies = await cookies();

    const oldPassword = formData.get("oldPassword") as string;
    const password = formData.get("password") as string;
    const newPassword = formData.get("newPassword") as string;

    if (password !== newPassword) {
        return {
            success: false,
            message: "Password do not match",
        };
    }

    if (!password || !newPassword || !oldPassword) {
        return {
            success: false,
            message: "All field are required",
        };
    }

    const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
        return {
            success: false,
            message:
                "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
        };
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/change-password`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Cookie: storedCookies.toString(),
            },
            body: JSON.stringify({
                oldPassword,
                newPassword,
            }),
        }
    );

    const data = await res.json();

    return {
        success: data.success,
        message: data.message,
    };
};

export default chnagePasswordAction;
