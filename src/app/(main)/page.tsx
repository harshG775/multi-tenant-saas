"use client";

import { useTenant } from "@/tenant/components/contexts/tenant-context";

export default function MainPage() {
    const { tenant } = useTenant();
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <section>
                <h1>{tenant.name}</h1>
                <p>{tenant.domain}</p>
                <p>{tenant.status}</p>
                <p>{tenant.slug}</p>
            </section>
        </main>
    );
}
