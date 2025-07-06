"use client";

import { useTenant } from "@/tenant/contexts/tenant-context";

export default function DefaultPage() {
    const { tenant } = useTenant();

    return (
        <main className="flex min-h-screen flex-col items-center p-8">
            <div className="w-full max-w-4xl space-y-8">
                {/* Header with logo and basic info */}
                <div className="flex items-center gap-6">
                    {tenant.theme.branding.logo && (
                        <div className="w-24 h-24 rounded-lg overflow-hidden border">
                            <img
                                src={tenant.theme.branding.logo}
                                alt={`${tenant.name} logo`}
                                width={96}
                                height={96}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    )}
                    <div>
                        <h1 className="text-4xl font-bold">{tenant.name}</h1>
                        <p className="text-lg text-muted-foreground">{tenant.domain}</p>
                        <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 
              ${tenant.status === "active" ? "bg-green-100 text-green-800" : ""}
              ${tenant.status === "suspended" ? "bg-red-100 text-red-800" : ""}
              ${tenant.status === "trial" ? "bg-blue-100 text-blue-800" : ""}
              ${tenant.status === "cancelled" ? "bg-gray-100 text-gray-800" : ""}
            `}
                        >
                            {tenant.status}
                        </div>
                    </div>
                </div>
                <div className="bg-primary text-primary-foreground h-20 w-full flex items-center justify-center text-2xl">Primary</div>
                <div className="bg-secondary text-secondary-foreground h-20 w-full flex items-center justify-center text-2xl">Secondary</div>
                <div className="bg-accent text-accent-foreground h-20 w-full flex items-center justify-center text-2xl">Accent</div>
                <div>
                    <div className="text-2xl font-bold">font: {tenant.theme.fontStyle.id}</div>
                    <ul className="flex flex-wrap gap-4">
                        <li className="font-primary text-2xl border p-2">Primary</li>
                        <li className="font-secondary text-2xl border p-2">Secondary</li>
                        <li className="font-accent text-2xl border p-2">Accent</li>
                        <li className="font-display text-2xl border p-2">Display</li>
                        <li className="font-code text-2xl border p-2">Code</li>
                        <li className="font-quote text-2xl border p-2">Quote</li>
                        <li className="font-navigation text-2xl border p-2">Navigation</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
