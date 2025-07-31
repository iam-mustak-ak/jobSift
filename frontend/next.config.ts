import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.brandfetch.io",
            },
            {
                hostname: "localhost",
            },
        ],
    },
};

export default nextConfig;
