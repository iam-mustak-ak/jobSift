import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// 1. Specify protected and public routes
const protectedRoutes = ["/build-resume", "/profile"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(
        (route) => path === route || path.startsWith(route + "/")
    );
    const isPublicRoute = publicRoutes.some(
        (route) => path === route || path.startsWith(route + "/")
    );
    const cookieStore = await cookies();

    // 3. Decrypt the session from the cookie
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/check-auth`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            credentials: "include",
        }
    );

    const data = await res.json();

    // 4. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !data.success) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // 5. Redirect to /dashboard if the user is authenticated

    if (
        isPublicRoute &&
        data.success &&
        !req.nextUrl.pathname.startsWith("/")
    ) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
