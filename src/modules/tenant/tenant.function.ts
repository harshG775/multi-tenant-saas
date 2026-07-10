import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

import { getRequestUrl } from "@tanstack/react-start/server"

export const getTenantFn = createServerFn({ method: "GET" }).handler(async ({ context }) => {
    if (!context.tenant) {
        const url = getRequestUrl()
        console.log(url)

        throw redirect({
            href: `https://onboard.yourapp.com?redirect=${encodeURIComponent(url.href)}`,
        })
    }
    return context.tenant
})
