export const normalizeHost = (host: string) => host.toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");

export const getRequestHost = (headers: Headers) =>
    headers.get("x-forwarded-host")?.split(",")[0]?.trim() || headers.get("host");
