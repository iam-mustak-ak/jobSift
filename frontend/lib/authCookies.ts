export function frontendCookie(cookie: string): string {
    return cookie.replace(/;\s*Domain=[^;]*/gi, "").replace(/;\s*SameSite=[^;]*/gi, "") + "; SameSite=Lax";
}

export function refreshedCookieHeader(current: string, updates: string[]): string {
    const values = new Map(current.split(";").filter(Boolean).map((part) => {
        const separator = part.indexOf("=");
        return [part.slice(0, separator).trim(), part.slice(separator + 1).trim()];
    }));
    for (const cookie of updates) {
        const pair = cookie.split(";", 1)[0];
        const separator = pair.indexOf("=");
        const name = pair.slice(0, separator);
        if (/;\s*Max-Age=0(?:;|$)/i.test(cookie)) values.delete(name);
        else values.set(name, pair.slice(separator + 1));
    }
    return Array.from(values, ([name, value]) => `${name}=${value}`).join("; ");
}
