import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
                {/* This link loads BEFORE Tailwind styles */}
                <link
                    rel="stylesheet"
                    href={
                        tenant.theme.style.href ||
                        `/themes/styles/${tenant.theme.style.id}.css` ||
                        "/themes/styles/default.css"
                    }
                />
            </head>
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
// This import goes AFTER the custom theme import
import "./globals.css";
export default RootLayout;
