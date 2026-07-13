import { auth } from "@/lib/auth"
import { createFileRoute } from "@tanstack/react-router"

const withTenantHeader = (request: Request, tenantId: string | undefined) => {
    if (!tenantId) return request
    const headers = new Headers(request.headers)
    headers.set("x-tenant-id", tenantId)
    const hasBody = request.method !== "GET" && request.method !== "HEAD"
    return new Request(request.url, {
        method: request.method,
        headers,
        body: hasBody ? request.body : undefined,
        // @ts-expect-error - duplex is required by Node's fetch implementation for streaming bodies
        duplex: hasBody ? "half" : undefined,
    })
}

export const Route = createFileRoute("/api/auth/$")({
    server: {
        handlers: {
            GET: async ({ request, context }) => {
                return await auth.handler(withTenantHeader(request, context.tenant?.id))
            },
            POST: async ({ request, context }) => {
                return await auth.handler(withTenantHeader(request, context.tenant?.id))
            },
        },
    },
})
