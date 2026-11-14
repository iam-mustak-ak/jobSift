import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "./lib/backend";
import { frontendCookie, refreshedCookieHeader } from "./lib/authCookies";

const protectedRoutes = [
    "/build-resume", "/profile", "/post-job", "/edit-job", "/apply",
    "/suggested-jobs", "/analyze-resume", "/complete-profile",
];

export default async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const protectedPage = protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`));
    const authPage = path === "/login" || path === "/signup";
    if (!protectedPage && !authPage) return NextResponse.next();

    const requestHeaders = new Headers(req.headers);
    let updates: string[] = [];
    const respond = (destination?: string) => {
        const response = destination
            ? NextResponse.redirect(new URL(destination, req.url))
            : NextResponse.next({ request: { headers: requestHeaders } });
        for (const cookie of updates) response.headers.append("Set-Cookie", frontendCookie(cookie));
        return response;
    };
    const login = () => respond(`/login?next=${encodeURIComponent(path + req.nextUrl.search)}`);
    if (!req.cookies.has("accessToken") && !req.cookies.has("refreshToken")) {
        return protectedPage ? login() : respond();
    }

    try {
        const response = await fetch(getBackendUrl("/auth/check-auth"), {
            headers: { Cookie: req.headers.get("cookie") || "" },
            cache: "no-store",
            signal: AbortSignal.timeout(15000),
        });
        updates = response.headers.getSetCookie();
        if (updates.length) {
            requestHeaders.set("cookie", refreshedCookieHeader(req.headers.get("cookie") || "", updates));
        }
        if (response.status === 401 || response.status === 403) return protectedPage ? login() : respond();
        if (!response.ok) throw new Error("Authentication service unavailable");
        const result = await response.json();
        if (!result?.success || !result.data?._id) throw new Error("Invalid authentication response");
        if (authPage) return respond("/");
        if ((path === "/post-job" || path.startsWith("/edit-job/")) && result.data.role !== "recruiter") return respond("/");
        if (path.startsWith("/apply/") && result.data.role !== "candidate") return respond("/find-jobs?page=1");
        return respond();
    } catch {
        // An API outage is not evidence that the user has logged out.
        return new NextResponse("The account service is temporarily unavailable. Please reload in a moment.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
        });
    }
}

export const config = {
    matcher: [
        "/login", "/signup", "/build-resume/:path*", "/profile/:path*",
        "/post-job/:path*", "/edit-job/:path*", "/apply/:path*",
        "/suggested-jobs/:path*", "/analyze-resume/:path*", "/complete-profile/:path*",
    ],
};
