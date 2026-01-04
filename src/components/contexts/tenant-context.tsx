import { TenantType } from "@/lib/api/tenant"
import { createContext, ReactNode, useContext } from "react"

interface TenantContextType {
    tenant: TenantType
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

interface TenantProviderProps {
    tenant: TenantType
    children: ReactNode
}

export function TenantProvider({ tenant, children }: TenantProviderProps) {
    return <TenantContext.Provider value={{ tenant }}>{children}</TenantContext.Provider>
}

export function useTenant() {
    const context = useContext(TenantContext)
    if (context === undefined) {
        throw new Error("useTenant must be used within a TenantProvider")
    }
    return context
}
