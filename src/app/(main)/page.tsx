"use client";

import { useTenant } from "@/tenant/components/contexts/tenant-context";

export default function MainPage() {
    const { tenant } = useTenant();
    return <div>{tenant.name}</div>;
}
