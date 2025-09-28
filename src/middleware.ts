import { NextResponse } from "next/server";
export function middleware(req: Request) {
    const hostname = req.headers.get("host") || "";
    const tenantKey = hostname.split(".")[0];

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-tenant", tenantKey);

    return NextResponse.next({ request: { headers: requestHeaders } });
}
