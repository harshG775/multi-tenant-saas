"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function ModeToggle({ ...props }: React.HTMLAttributes<HTMLButtonElement>) {
    const { theme, setTheme } = useTheme();

    return (
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} {...props}>
            {theme === "light" ? "🌜" : "🌞"}
        </button>
    );
}
