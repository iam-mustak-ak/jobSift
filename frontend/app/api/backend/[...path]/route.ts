import { getBackendUrl } from "@/lib/backend";
import { frontendCookie } from "@/lib/authCookies";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Context = { params: Promise<{ path: string[] }> };

async function forward(request: NextRequest, context: Context) {
    const { path } = await context.params;
    if (path.some((segment) => segment === "." || segment === "..")) {
        return Response.json({ success: false, message: "Invalid API path" }, { status: 400 });
    }
    const origin = request.headers.get("origin");
    if (!["GET", "HEAD"].includes(request.method) && origin && origin !== request.nextUrl.origin) {
        return Response.json({ success: false, message: "Request origin is not allowed" }, { status: 403 });
    }
    try {
        const url = new URL(getBackendUrl(path.map(encodeURIComponent).join("/")));
        if ((path[0] === "socket.io" || request.nextUrl.pathname.endsWith("/")) && !url.pathname.endsWith("/")) url.pathname += "/";
        url.search = request.nextUrl.search;
        const headers = new Headers();
        for (const name of ["accept", "content-type", "cookie", "authorization", "user-agent"]) {
            const value = request.headers.get(name);
            if (value) headers.set(name, value);
        }
        const upstream = await fetch(url, {
            method: request.method,
            headers,
            body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
            redirect: "manual",
            cache: "no-store",
            signal: AbortSignal.timeout(60000),
        });
        const responseHeaders = new Headers({ "Cache-Control": "private, no-store" });
        for (const name of ["content-type", "location"]) {
            const value = upstream.headers.get(name);
            if (value) responseHeaders.set(name, value);
        }
        for (const cookie of upstream.headers.getSetCookie()) {
            responseHeaders.append("Set-Cookie", frontendCookie(cookie));
        }
        return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
    } catch (error) {
        console.error("[api] Backend request failed", { name: error instanceof Error ? error.name : "UnknownError" });
        return Response.json({ success: false, message: "The service is temporarily unavailable. Please try again." }, { status: 502 });
    }
}

export { forward as GET, forward as HEAD, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
