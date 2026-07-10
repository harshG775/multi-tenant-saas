import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools"

import appCss from "../styles.css?url"

import type { QueryClient } from "@tanstack/react-query"
import { getTenantConfigFn } from "#/tenant/lib/server/tenant.functions"

interface MyRouterContext {
    queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    beforeLoad: async ({ context }) => {
        const tenantConfig = await context.queryClient.ensureQueryData({
            queryKey: ["tenant-config"],
            queryFn: () => getTenantConfigFn(),
            staleTime: Infinity,
            gcTime: Infinity,
        })
        // const tenantConfig = await getTenantConfigFn()
        return { tenantConfig }
    },
    head: ({ match }) => {
        const tenantConfig = match.context.tenantConfig
        const title = tenantConfig.meta.name || "TanStack Start Starter"
        const description = tenantConfig.meta.description || "Default app description"
        const favicon = tenantConfig.meta.favicon || "/favicon.ico"
        const image = tenantConfig.meta.logo
        return {
            meta: [
                { charSet: "utf-8" },
                { name: "viewport", content: "width=device-width, initial-scale=1" },
                { title },
                { name: "description", content: description },

                // Open Graph
                { property: "og:title", content: title },
                { property: "og:description", content: description },
                { property: "og:image", content: image },

                // Twitter
                { name: "twitter:card", content: "summary_large_image" },
            ],
            links: [
                { rel: "stylesheet", href: appCss },
                { rel: "icon", href: favicon },
            ],
        }
    },
    shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <HeadContent />
            </head>
            <body>
                {children}
                <TanStackDevtools
                    config={{
                        position: "bottom-right",
                    }}
                    plugins={[
                        {
                            name: "Tanstack Router",
                            render: <TanStackRouterDevtoolsPanel />,
                        },
                        TanStackQueryDevtools,
                    ]}
                />
                <Scripts />
            </body>
        </html>
    )
}
