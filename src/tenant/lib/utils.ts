import { NextRequest } from "next/server";

export const defaultDomain = process.env.DEFAULT_DOMAIN || "multi-tenant-saas-delta.vercel.app";
export function extractdomain(request: NextRequest): string | null {
    const url = request.url;
    const host = request.headers.get("host") || "";
    const hostname = host.split(":")[0];

    // Local development environment
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
        // Try to extract subdomain from the full URL
        const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
        if (fullUrlMatch && fullUrlMatch[1]) {
            return fullUrlMatch[1];
        }

        // Fallback to host header approach
        if (hostname.includes(".localhost")) {
            return hostname.split(".")[0];
        }

        return null;
    }

    return defaultDomain;
}