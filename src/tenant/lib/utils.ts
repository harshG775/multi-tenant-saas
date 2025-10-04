import { NextRequest } from "next/server";

export function extractDomain(request: NextRequest): { domain: string; subDomain: string | null; isLocal: boolean } {
    const url = request.url;
    const host = request.headers.get("host") || "";
    const hostname = host.split(":")[0]; // Remove port if present

    const isLocal = isLocalEnvironment(hostname, url);

    if (isLocal) {
        return extractLocalDomain(hostname, url);
    }

    return extractProductionDomain(hostname);
}

// Helper functions for better organization
function isLocalEnvironment(hostname: string, url: string): boolean {
    return (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.endsWith(".localhost") ||
        url.includes("localhost") ||
        url.includes("127.0.0.1")
    );
}

function extractLocalDomain(
    hostname: string,
    url: string
): { domain: string; subDomain: string | null; isLocal: boolean } {
    // Try to extract subdomain from the full URL first
    const urlSubdomain = extractSubdomainFromUrl(url);
    if (urlSubdomain) {
        return {
            domain: "localhost",
            subDomain: urlSubdomain,
            isLocal: true,
        };
    }

    // Fallback: check host header for subdomain pattern
    const hostSubdomain = extractSubdomainFromHost(hostname);
    if (hostSubdomain) {
        return {
            domain: "localhost",
            subDomain: hostSubdomain,
            isLocal: true,
        };
    }

    return {
        domain: "localhost",
        subDomain: null,
        isLocal: true,
    };
}

function extractProductionDomain(hostname: string): { domain: string; subDomain: string | null; isLocal: boolean; } {
    // Handle Vercel deployment specifically
    if (hostname.endsWith(".vercel.app")) {
        const domainParts = hostname.split(".");

        // For vercel.app, the subdomain is everything before the main domain
        if (domainParts.length > 2) {
            const subDomain = domainParts.slice(0, -2).join(".") || null;
            return {
                domain: hostname,
                subDomain: subDomain,
                isLocal: false,
            };
        }

        return {
            domain: hostname,
            subDomain: null,
            isLocal: false,
        };
    }

    // Standard domain parsing for production
    const domainParts = hostname.split(".");

    if (domainParts.length > 2) {
        // For domains like sub.example.com
        const subDomain = domainParts.slice(0, -2).join(".") || domainParts[0];
        const domain = domainParts.slice(-2).join(".");

        return {
            domain,
            subDomain: subDomain || null,
            isLocal: false,
        };
    }

    // No subdomain (e.g., example.com)
    return {
        domain: hostname,
        subDomain: null,
        isLocal: false,
    };
}

function extractSubdomainFromUrl(url: string): string | null {
    const patterns = [
        /http:\/\/([^.]+)\.localhost(?::\d+)?/,
        /https:\/\/([^.]+)\.localhost(?::\d+)?/,
        /http:\/\/([^.]+)\.127\.0\.0\.1(?::\d+)?/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

function extractSubdomainFromHost(hostname: string): string | null {
    if (hostname.includes(".localhost")) {
        const parts = hostname.split(".");
        return parts.length > 1 ? parts[0] : null;
    }

    return null;
}
