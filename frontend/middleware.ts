import { NextRequest, NextResponse } from "next/server";
import { fetcherSever } from "./utils/fetcherSever";

const protectedRoutes = [
    "/build-resume",
    "/profile",
    "/post-job",
    "/apply",
    "/apply/*",
    "/forgot-password",
];

const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.some(
        (route) => path === route || path.startsWith(route + "/")
    );

    const isPublicRoute = publicRoutes.some(
        (route) => path === route || path.startsWith(route + "/")
    );

    const data = await fetcherSever("/auth/check-auth");
    const isLoggedIn = data?.success;

    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (
        isPublicRoute &&
        isLoggedIn &&
        (path === "/login" || path === "/signup")
    ) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    if (
        isLoggedIn &&
        path === "/post-job" &&
        data?.data?.role !== "recruiter"
    ) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/signup",
        "/build-resume",
        "/profile",
        "/post-job",
        "/apply/:path*",
        "/forgot-password",
    ],
};
