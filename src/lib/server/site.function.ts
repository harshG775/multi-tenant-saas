import { createServerFn } from "@tanstack/react-start";

export const getSiteFn = createServerFn({ method: "GET" }).handler(async ({ context }) => {
    return context.site;
});
