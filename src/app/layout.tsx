import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TenantProvider } from "@/tenant/components/contexts/tenant-context";
import { resolveTenant } from "@/tenant/lib/tenant-resolver";
import { ModeToggle, ThemeProvider } from "@/components/ui/theme-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
    const tenant = await resolveTenant();

    return tenant.metadata;
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const tenant = await resolveTenant();

    return (
        <html lang="en" suppressHydrationWarning>
            {tenant.theme.customCss && (
                <head>
                    <style>{tenant.theme.customCss || ""}</style>
                </head>
            )}
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <TenantProvider tenant={tenant}>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        {children}
                        <ModeToggle className="fixed bottom-4 right-4" />
                    </ThemeProvider>
                </TenantProvider>
            </body>
        </html>
    );
}
