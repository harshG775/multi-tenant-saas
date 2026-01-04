export const resolveDomain = (request: Request) => {
    const hostHeader = request.headers.get("x-forwarded-host") || request.headers.get("host") || ""
    const hostname = hostHeader.split(":")[0]

    const parts = hostname.split(".")

    let rootDomain = hostname
    let subdomain: string | null = null

    // Handle Localhost (e.g., "tenant.localhost")
    if (hostname.endsWith("localhost")) {
        rootDomain = "localhost"
        if (parts.length > 1) {
            subdomain = parts[0]
        }
    }
    // Handle Production (e.g., "tenant.myapp.com" or "myapp.com")
    else if (parts.length >= 2) {
        // This logic assumes a standard TLD like .com or .io
        // If using .co.uk, you'd need a library like 'tldts'
        rootDomain = parts.slice(-2).join(".")

        if (parts.length > 2) {
            subdomain = parts.slice(0, -2).join(".")
        }
    }

    return {
        hostname,
        rootDomain,
        subdomain,
    }
}
