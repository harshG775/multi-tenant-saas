// lib/tenant-context.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";
import { Tenant } from "../../services/tenant-services";

interface TenantContextType {
    tenant: Tenant;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
    tenant: Tenant;
    children: ReactNode;
}

export function TenantProvider({ tenant, children }: TenantProviderProps) {
    return <TenantContext.Provider value={{ tenant }}>{children}</TenantContext.Provider>;
}

export function useTenant() {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error("useTenant must be used within a TenantProvider");
    }
    return context;
}
