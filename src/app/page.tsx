import { Metadata } from "next";

import { resolveTenant } from "@/tenant/lib/tenant-resolver";

export async function generateMetadata(): Promise<Metadata> {
    const tenant = await resolveTenant();
    const page = tenant.data.pages["/"];

    return {
        title: page?.root?.props?.title ?? tenant.data.Layout?.root?.props?.title ?? tenant.domain,
        description:
            page?.root?.props?.description ?? tenant.data.Layout?.root?.props?.description ?? "Default description",
        icons: {
            icon: page?.root?.props?.favicon ?? tenant.data.Layout?.root?.props?.favicon ?? "/favicon.ico",
        },
    };
}
export default async function MainPage() {
    const data = await resolveTenant();
    return (
        <div>
            <h1 className="p-16 text-4xl font-bold">{data?.domain}</h1>
        </div>
    );
}
