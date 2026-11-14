"use server";
import { getBackendUrl } from "@/lib/backend";

const forgotPasswordAction = async (prevState: any, formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;

    if (!email) {
        return {
            success: false,
            message: "Email is required",
        };
    }

    const res = await fetch(
        getBackendUrl("/auth/forgot-password"),
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email }),
        }
    );

    const data = await res.json();

    return {
        success: true,
        message: data.message,
    };
};

export default forgotPasswordAction;
