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

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/check-auth`,
            {
                method: "GET",
                headers: {
                    cookie: req.headers.get("cookie") || "",
                },
                cache: "no-store",
            }
        );

        const data = await res.json();

        console.log(data);

        if (isProtectedRoute && !data.data.success) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (isPublicRoute && data.data.success) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
