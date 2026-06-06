import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { getContext } from "./integrations/tanstack-query/root-provider"
import { getTenantConfigFn } from "./tenant/utils/serverFns/tenant.functions"

export const getRouter = async () => {
    const tenantConfig = await getTenantConfigFn()
    const context = getContext()

    const router = createTanStackRouter({
        routeTree,
        context: { ...context, tenantConfig },
        scrollRestoration: true,
        defaultPreload: "intent",
        defaultPreloadStaleTime: 0,
    })

    setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient })

    return router
}

declare module "@tanstack/react-router" {
    interface Register {
        router: Awaited<ReturnType<typeof getRouter>>
    }
}
