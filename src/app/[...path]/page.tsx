import { Metadata } from "next";

import { resolveTenant } from "@/tenant/lib/tenant-resolver";

export async function generateMetadata({ params }: { params: Promise<{ path: string[] }> }): Promise<Metadata> {
    const { path = [] } = await params;
    const finalPath = `/${path.join("/")}`;
    const tenant = await resolveTenant();
    const root = tenant.data?.pages?.[finalPath]?.root;

    return {
        title: root?.props?.title ?? tenant.data.Layout?.root?.props?.title ?? tenant.domain,
        description:
            root?.props?.description ?? tenant.data.Layout?.root?.props?.description ?? "Default description",
        icons: {
            icon: root?.props?.favicon ?? tenant.data.Layout?.root?.props?.favicon ?? "/favicon.ico",
        },
    };
}
export default async function MainPage({ params }: { params: Promise<{ path: string[] }> }) {
    const { path = [] } = await params;
    const finalPath = `/${path.join("/")}`;
    const tenant = await resolveTenant();

    const data = tenant.data?.pages?.[finalPath]?.content;
    return (
        <div>
            <h1 className="p-16 text-4xl font-bold">{JSON.stringify(data)}</h1>
        </div>
    );
}
