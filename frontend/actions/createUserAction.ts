"use server";

import { redirect } from "next/navigation";

export default async function createUserAction(
    prevState: unknown,
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

    // Server actions can use a runtime URL instead of the public URL frozen at build time.
    const serverUrl = (process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL)?.trim();
    let signupUrl: URL;
    try {
        if (!serverUrl) throw new Error("Missing backend URL");
        signupUrl = new URL(`${serverUrl.replace(/\/+$/, "")}/auth/create-user`);
        if (!["http:", "https:"].includes(signupUrl.protocol)) {
            throw new Error("Backend URL must use HTTP or HTTPS");
        }
        if (
            process.env.NODE_ENV === "production" &&
            ["localhost", "127.0.0.1", "[::1]", "0.0.0.0"].includes(signupUrl.hostname)
        ) {
            throw new Error("Production backend URL points to localhost");
        }
    } catch (error) {
        console.error("[signup] Invalid backend configuration", {
            reason: error instanceof Error ? error.message : "Invalid backend URL",
        });
        return { success: false, message: "Account service is not configured. Please contact support." };
    }

    let res: Response;
    try {
        res = await fetch(signupUrl, {
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
            signal: AbortSignal.timeout(60000),
        });
    } catch (error) {
        const requestError = error as Error & { cause?: { code?: string } };
        const timedOut = requestError.name === "TimeoutError";
        // Keep passwords, email addresses, and URL credentials out of deployment logs.
        console.error("[signup] Backend request failed", {
            host: signupUrl.host,
            name: requestError.name,
            code: requestError.cause?.code,
            timedOut,
        });
        return {
            success: false,
            message: timedOut
                ? "The account service took too long to respond. Please try again in a moment."
                : "We couldn’t reach the account service. Please try again in a moment.",
        };
    }

    if (!res.ok) {
        console.error("[signup] Backend rejected request", {
            host: signupUrl.host,
            status: res.status,
        });
        const error = await res.json().catch(() => null);
        return {
            success: false,
            message: error?.message || "We couldn’t create your account. Please try again.",
        };
    }

    redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
}
