import "./globals.css";
import type { Metadata } from "next";
import { TenantProvider } from "@/tenant/contexts/tenant-context";
import { resolveTenant } from "@/tenant/lib/tenant-resolver";
import { ModeToggle, ThemeProvider } from "@/components/ui/theme-provider";

export async function generateMetadata(): Promise<Metadata> {
    const tenant = await resolveTenant();
    return tenant.metadata.root;
}

async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const tenant = await resolveTenant();
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link
                    rel="stylesheet"
                    href={tenant?.theme?.style?.href ? tenant.theme.style.href : "/themes/styles/default.css"}
                />
                <link
                    rel="stylesheet"
                    href={tenant?.theme?.fontStyle?.href ? tenant.theme.fontStyle.href : `/themes/fonts/default.css`}
                />
            </head>
            <body className={` antialiased`}>
                <TenantProvider tenant={tenant}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme={tenant?.theme?.style?.mode || "light"}
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <ModeToggle className="fixed bottom-4 right-4" />
                    </ThemeProvider>
                </TenantProvider>
            </body>
        </html>
    );
}
export default RootLayout;
