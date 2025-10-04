import { NextRequest } from "next/server";

export function extractDomain(request: NextRequest): { domain: string; subDomain: string | null } {
    const url = request.url;
    const host = request.headers.get("host") || "";
    const hostname = host.split(":")[0];

    // Local development environment
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
        // Try to extract subdomain from the full URL
        const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
        if (fullUrlMatch && fullUrlMatch[1]) {
            return {
                domain: "localhost",
                subDomain: fullUrlMatch[1],
            };
        }

        // Fallback: check host header
        if (hostname.includes(".localhost")) {
            return {
                domain: "localhost",
                subDomain: hostname.split(".")[0],
            };
        }

        return {
            domain: "localhost",
            subDomain: null,
        };
    }

    // Production environment
    const rootDomainFormatted = hostname.split(":")[0];

    // Handle preview deployments like tenant---branch.vercel.app
    if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
        const parts = hostname.split("---");
        return {
            domain: rootDomainFormatted,
            subDomain: parts.length > 0 ? parts[0] : null,
        };
    }

    // Regular domain/subdomain detection
    const isSubdomain =
        hostname !== rootDomainFormatted &&
        hostname !== `www.${rootDomainFormatted}` &&
        hostname.endsWith(`.${rootDomainFormatted}`);

    return {
        domain: rootDomainFormatted,
        subDomain: isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, "") : null,
    };
}
