// middleware.ts - for advanced routing)
import { NextRequest, NextResponse } from "next/server";
import { getTenantByDomain } from "./tenant/services/tenant-services";
import { defaultDomain, extractdomain } from "./tenant/lib/utils";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const domain = extractdomain(request);

    // Check if tenant exists
    const tenant = await getTenantByDomain(domain || ""); //! un-optimized - should be cached using redis/memcached/etc

    if (defaultDomain !== domain) {
        // Block access to admin page from other domains
        if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // Add tenant info to headers for use in components
    const response = NextResponse.next();
    if (domain && tenant) {
        response.headers.set("x-tenant-id", tenant.id);
        response.headers.set("x-tenant-domain", domain);
        response.headers.set("x-tenant-template", tenant.theme.template.id);
        response.headers.set("x-tenant-style", tenant.theme.style.id);
        response.headers.set("x-tenant-style-href", tenant.theme.style.href || "");
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
