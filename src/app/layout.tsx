import "./globals.css";
import { TenantProvider } from "@/tenant/contexts/tenant-context";
import { resolveTenant } from "@/tenant/lib/tenant-resolver";

async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const tenant = await resolveTenant();
    return (
        <TenantProvider tenant={tenant}>
            <html lang="en">
                <body className={`antialiased`}>{children}</body>
            </html>
        </TenantProvider>
    );
}
export default RootLayout;
