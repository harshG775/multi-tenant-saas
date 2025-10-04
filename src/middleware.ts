import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { extractSubdomain } from "./tenant/lib/utils";

export async function middleware(req: NextRequest) {
    const subdomain = extractSubdomain(req);
    const requestHeaders = new Headers(req.headers);

    if (subdomain) {
        requestHeaders.set("x-tenant", subdomain);
    }

    if (req.method === "GET") {
        // Rewrite routes that match "/[...puckPath]/edit" to "/puck/[...puckPath]"
        if (req.nextUrl.pathname.endsWith("/edit")) {
            const pathWithoutEdit = req.nextUrl.pathname.slice(0, req.nextUrl.pathname.length - 5);
            const pathWithEditPrefix = `/puck${pathWithoutEdit}`;

            return NextResponse.rewrite(new URL(pathWithEditPrefix, req.url), { request: { headers: requestHeaders } });
        }

        // Disable "/puck/[...puckPath]"
        if (req.nextUrl.pathname.startsWith("/puck")) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
    matcher: ["/((?!api|_next|[\\w-]+\\.\\w+).*)"],
};
