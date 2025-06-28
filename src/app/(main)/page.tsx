"use client";

import { useTenant } from "@/tenant/tenant-context";

export default function MainPage() {
    const { tenant } = useTenant();
    return <div>{tenant.name}</div>;
}
