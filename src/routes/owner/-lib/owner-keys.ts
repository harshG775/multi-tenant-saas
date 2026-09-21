/** Query keys for owner data. Invalidate `all` to refresh everything tied to the signed-in owner. */
export const ownerKeys = {
    all: ["owner"] as const,
    state: ["owner", "state"] as const,
    sites: ["owner", "sites"] as const,
};
