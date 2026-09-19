import { env } from "#/env";

export const normalizeHost = (host: string) => host.toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");

export const getRequestHost = (headers: Headers) =>
    headers.get("x-forwarded-host")?.split(",")[0]?.trim() || headers.get("host");

const platformUrl = new URL(env.PLATFORM_URL);

export const rootDomain = normalizeHost(platformUrl.hostname);

/** Public origin for a site hostname, reusing the platform's scheme and port (e.g. `http://acme.localhost:3000`). */
export const siteOrigin = (hostname: string) =>
    `${platformUrl.protocol}//${hostname}${platformUrl.port ? `:${platformUrl.port}` : ""}`;
