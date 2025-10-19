import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/build-resume", "/profile", "/post-job"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.some(
        (route) => path === route || path.startsWith(route + "/")
    );
    const isPublicRoute = publicRoutes.some(
        (route) => path === route || path.startsWith(route + "/")
    );

    // Forward cookies & headers to your API
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/check-auth`,
        {
            headers: {
                cookie: req.headers.get("cookie") || "",
            },
            cache: "no-store",
        }
    );

    const data = await res.json();

    if (isProtectedRoute && !data.success) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (isPublicRoute && data.success) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
