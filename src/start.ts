import { createStart } from "@tanstack/react-start"
import { globalTenantMiddleware } from "./middleware"

export const startInstance = createStart(() => {
    return {
        requestMiddleware: [globalTenantMiddleware],
    }
})
