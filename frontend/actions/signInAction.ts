"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function signInAction(prevState: any, formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cookieStore = await cookies();

    if (!email || !password) {
        return {
            success: false,
            message: "Please fill all the fields",
        };
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
        {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
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

    const data = await res.json();

    redirect(`/profile/${data.data._id}`);
}
