// middleware.ts - for advanced routing)
import { NextRequest, NextResponse } from "next/server";
import { getTenantByDomain } from "./tenant/services/tenant-services";

export async function middleware(request: NextRequest) {
    const host = request.headers.get("host") || "localhost:3000";
    const domain = host.split(":")[0];

    // Check if tenant exists
    const tenant = await getTenantByDomain(domain);

    if (!tenant) {
        // Redirect to main marketing site or show tenant not found
        return NextResponse.redirect(new URL("/tenant-not-found", request.url));
    }

    // Add tenant info to headers for use in components
    const response = NextResponse.next();
    response.headers.set("x-tenant-id", tenant.id);
    response.headers.set("x-tenant-slug", tenant.slug); // optional, if used in routing
    response.headers.set("x-tenant-template", tenant.theme.template.id);
    response.headers.set("x-tenant-style", tenant.theme.style.id);
    response.headers.set("x-tenant-style-href", tenant.theme.style.href || "");

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
