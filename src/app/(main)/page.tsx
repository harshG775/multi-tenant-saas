"use client";

import { useTenant } from "@/tenant/components/contexts/tenant-context";

export default function MainPage() {
    const { tenant } = useTenant();
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <section>
                <h1 className="text-3xl font-semibold">{tenant.name}</h1>
                <p className="text-3xl text-muted-foreground">{tenant.domain}</p>
                <div className="text-sm bg-primary text-primary-foreground rounded-2xl px-4 py-2">{tenant.status}</div>
            </section>
        </main>
    );
}
