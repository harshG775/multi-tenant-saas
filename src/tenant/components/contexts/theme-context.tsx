//theme-context.tsx
"use client";

import { Theme } from "@/types/tenant";
import { createContext, useContext } from "react";

export interface TenantTheme {
    theme: Theme;
    setTheme: (theme: string) => void;
}
const TenantThemeContext = createContext<TenantTheme | null>(null);

export function TenantThemeProvider({ theme, children }: { theme: TenantTheme; children: React.ReactNode }) {
    return <TenantThemeContext.Provider value={theme}>{children}</TenantThemeContext.Provider>;
}

export function useTenantTheme() {
    const context = useContext(TenantThemeContext);
    if (!context) {
        throw new Error("useTenantTheme must be used within a TenantThemeProvider");
    }
    return context;
}
