// middleware.ts - for advanced routing)
import { NextRequest, NextResponse } from "next/server";
import { getTenantByDomain } from "./tenant/tenant";

export async function middleware(request: NextRequest) {
    const host = request.headers.get("host") || "localhost:3000";
    const domain = host.split(":")[0];

    // Check if tenant exists
    const tenant = await getTenantByDomain(domain);

    if (!tenant) {
        // Redirect to main marketing site or show tenant not found
        return NextResponse.redirect(new URL("/tenant-not-found", request.url));
    }

    // Check tenant status
    if (tenant.status === "suspended") {
        return NextResponse.redirect(new URL("/suspended", request.url));
    }

    if (tenant.status === "cancelled") {
        return NextResponse.redirect(new URL("/cancelled", request.url));
    }

    // Add tenant info to headers for use in components
    const response = NextResponse.next();
    response.headers.set("x-tenant-id", tenant.id);
    response.headers.set("x-tenant-name", tenant.name);

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
