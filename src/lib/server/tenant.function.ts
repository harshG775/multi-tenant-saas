import { createServerFn } from "@tanstack/react-start";

export const getTenantFn = createServerFn({ method: "GET" }).handler(async ({ context }) => {
    return context.tenant;
});
