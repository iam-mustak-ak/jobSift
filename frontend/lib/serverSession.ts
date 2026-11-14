import { cookies } from "next/headers";

// Server actions must explicitly return refreshed API cookies to the browser.
export async function persistBackendCookies(headers: Headers) {
    const store = await cookies();
    for (const cookie of headers.getSetCookie()) {
        const pair = cookie.split(";", 1)[0];
        const separator = pair.indexOf("=");
        const name = pair.slice(0, separator);
        if (name !== "accessToken" && name !== "refreshToken") continue;
        const maxAge = cookie.match(/;\s*Max-Age=(-?\d+)/i)?.[1];
        const expires = cookie.match(/;\s*Expires=([^;]+)/i)?.[1];
        store.set(name, pair.slice(separator + 1), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            ...(maxAge !== undefined ? { maxAge: Number(maxAge) } : {}),
            ...(expires ? { expires: new Date(expires) } : {}),
        });
    }
}
