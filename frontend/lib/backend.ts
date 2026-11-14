export function getBackendUrl(path: string): string {
    const base = (process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL)?.trim().replace(/\/+$/, "");
    if (!base) throw new Error("Backend URL is not configured");
    const url = new URL(`${base}/${path.replace(/^\/+/, "")}`);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("Backend URL must use HTTP or HTTPS");
    return url.toString();
}
