import { createAuthClient } from "better-auth/react";

export const ownerAuthClient = createAuthClient({ basePath: "/api/v1/auth/owner" });
