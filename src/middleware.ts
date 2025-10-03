import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { extractSubdomain } from "./tenant/lib/utils";

export async function middleware(req: NextRequest) {
    const subdomain = extractSubdomain(req);

    const requestHeaders = new Headers(req.headers);
    if (subdomain) {
        console.log("subdomain:", { subdomain });
        requestHeaders.set("x-tenant", subdomain);
    }
    const res = NextResponse.next({ request: { headers: requestHeaders } });

    if (req.method === "GET") {
        // Rewrite routes that match "/[...puckPath]/edit" to "/puck/[...puckPath]"
        if (req.nextUrl.pathname.endsWith("/edit")) {
            const pathWithoutEdit = req.nextUrl.pathname.slice(0, req.nextUrl.pathname.length - 5);
            const pathWithEditPrefix = `/puck${pathWithoutEdit}`;

            return NextResponse.rewrite(new URL(pathWithEditPrefix, req.url));
        }

        // Disable "/puck/[...puckPath]"
        if (req.nextUrl.pathname.startsWith("/puck")) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return res;
}
export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api|_next|[\\w-]+\\.\\w+).*)",
    ],
};
