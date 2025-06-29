"use client";

import { useTenant } from "@/tenant/components/contexts/tenant-context";

export default function MainPage() {
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

                {/* Subscription Info */}
                <div className="bg-card p-6 rounded-xl border">
                    <h2 className="text-2xl font-semibold mb-4">Subscription</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Plan</p>
                            <p className="font-medium">{tenant.planId.replace("plan-", "").toUpperCase()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="font-medium">{tenant.subscriptionStatus}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {tenant.subscriptionStatus === "trial" ? "Trial ends" : "Renews on"}
                            </p>
                            <p className="font-medium">
                                {tenant.subscriptionStatus === "trial"
                                    ? tenant.trialEndsAt?.toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                      })
                                    : tenant.currentPeriodEnd?.toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                      })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Limits & Features */}
                <div className="bg-card p-6 rounded-xl border">
                    <h2 className="text-2xl font-semibold mb-4">Resources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">User Limit</p>
                            <p className="font-medium">{tenant.userLimit}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Storage</p>
                            <p className="font-medium">{Math.floor(tenant.storageLimit / (1024 * 1024 * 1024))} GB</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">API Rate Limit</p>
                            <p className="font-medium">{tenant.apiRateLimit}/hour</p>
                        </div>
                    </div>

                    {tenant.featureFlags.length > 0 && (
                        <div className="mt-6">
                            <p className="text-sm text-muted-foreground mb-2">Enabled Features</p>
                            <div className="flex flex-wrap gap-2">
                                {tenant.featureFlags.map((feature) => (
                                    <span
                                        key={feature}
                                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                                    >
                                        {feature.replace(/-/g, " ")}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Theme Preview */}
                <div className="bg-card p-6 rounded-xl border">
                    <h2 className="text-2xl font-semibold mb-4">Branding Preview</h2>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <div
                                className="h-32 rounded-lg mb-4 flex items-center justify-center"
                                style={{ backgroundColor: tenant.theme.colors.primary }}
                            >
                                <p
                                    className="text-xl font-bold"
                                    style={{ color: tenant.theme.colors.primaryForeground }}
                                >
                                    Primary Color
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Mode: {tenant.theme.mode}</p>
                                <p className="text-sm text-muted-foreground">Border Radius: {tenant.theme.radius}</p>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="border rounded-lg p-4 h-32 flex items-center justify-center">
                                <img
                                    src={tenant.theme.branding.logo || "https://picsum.photos/200/200"}
                                    alt="Company Logo"
                                    width={160}
                                    height={80}
                                    className="object-contain max-h-full max-w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Open Graph Preview */}
                <div className="bg-card p-6 rounded-xl border">
                    <h2 className="text-2xl font-semibold mb-4">Social Preview</h2>
                    <div className="border rounded-lg overflow-hidden max-w-lg">
                        <img
                            src={tenant.metadata.openGraph.images[0]}
                            alt="Open Graph Preview"
                            width={1200}
                            height={630}
                            className="w-full h-auto"
                        />
                        <div className="p-4">
                            <h3 className="font-semibold">{tenant.metadata.openGraph.title}</h3>
                            <p className="text-sm text-muted-foreground">{tenant.metadata.openGraph.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
