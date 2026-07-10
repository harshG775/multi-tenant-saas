import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools"

import appCss from "../styles.css?url"

import type { QueryClient } from "@tanstack/react-query"
import { getTenantFn } from "#/lib/server/tenant.function"

interface MyRouterContext {
    queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    beforeLoad: async () => {
        const tenant = await getTenantFn()
        return { tenant }
    },
    head: ({ match }) => {
        const tenant = match.context.tenant
        const title = tenant.meta.name || "TanStack Start Starter"
        const description = tenant.meta.description || "Default app description"
        const favicon = tenant.meta.favicon || "/favicon.ico"
        const image = tenant.meta.logo
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
