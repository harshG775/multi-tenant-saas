import { createServerFn } from "@tanstack/react-start";
import { env } from "#/env";

/** The site for this request's host, plus what the not-found page needs when the host matches no site. */
export const getSiteFn = createServerFn({ method: "GET" }).handler(async ({ context }) => {
    return { site: context.site, unknownHost: context.unknownHost, platformUrl: env.PLATFORM_URL };
});
