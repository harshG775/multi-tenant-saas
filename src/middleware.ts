import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const hostname = req.headers.get("host") || "";
    const tenantKey = hostname.split(".")[0];

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-tenant", tenantKey);
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
    matcher: "/:path*",
};