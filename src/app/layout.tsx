import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TenantProvider } from "@/tenant/components/contexts/tenant-context";
import { resolveTenant } from "@/tenant/lib/tenant-resolver";

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
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <TenantProvider tenant={tenant}>
                    {children}
                </TenantProvider>
            </body>
        </html>
    );
}
