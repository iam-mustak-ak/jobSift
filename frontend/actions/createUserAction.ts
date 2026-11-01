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
    const companyName = (formData.get("companyName") as string | null)?.trim() ?? "";
    const companyWebsite = (formData.get("companyWebsite") as string | null)?.trim() ?? "";
    const companyIndustry = (formData.get("companyIndustry") as string | null)?.trim() ?? "";
    const companyLocation = (formData.get("companyLocation") as string | null)?.trim() ?? "";

    if (!name || !email || !password || !confirmPassword) {
        return {
            success: false,
            message: "Please fill all the fields",
        };
    }

    if (role !== "candidate" && role !== "recruiter") {
        return { success: false, message: "Please select a valid account type" };
    }
    if (role === "recruiter" && !companyName) {
        return { success: false, message: "Company name is required for recruiter accounts" };
    }
    if (companyWebsite) {
        try {
            const website = new URL(companyWebsite);
            if (!["http:", "https:"].includes(website.protocol)) throw new Error();
        } catch {
            return { success: false, message: "Please enter a valid company website URL" };
        }
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

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) {
        return { success: false, message: "Account service is not configured. Please contact support." };
    }

    let res: Response;
    try {
        res = await fetch(`${serverUrl}/auth/create-user`, {
            method: "POST",
            body: JSON.stringify({
                role,
                name,
                email,
                password,
                ...(role === "recruiter" && {
                    company: {
                        name: companyName,
                        website: companyWebsite,
                        industry: companyIndustry,
                        location: companyLocation,
                    },
                }),
            }),
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(15000),
        });
    } catch {
        return {
            success: false,
            message: "We couldn’t reach the account service. Please try again in a moment.",
        };
    }

    if (!res.ok) {
        const error = await res.json().catch(() => null);
        return {
            success: false,
            message: error?.message || "We couldn’t create your account. Please try again.",
        };
    }

    redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
}
