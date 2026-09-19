import { createCsrfMiddleware, createStart } from "@tanstack/react-start";
import { siteMiddleware } from "./lib/server/site.middleware";

const csrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });

export const startInstance = createStart(() => {
    return { requestMiddleware: [csrfMiddleware, siteMiddleware] };
});
