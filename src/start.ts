import { createStart, createCsrfMiddleware } from "@tanstack/react-start"
import { tenantMiddleware } from "./modules/tenant"

const csrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" })

export const startInstance = createStart(() => {
    return { requestMiddleware: [csrfMiddleware, tenantMiddleware] }
})
