"use client";

import config from "@/puck/config/config";
import type { Data } from "@measured/puck";
import { Puck } from "@measured/puck";

export function Client({ path, data, tenantId }: { path: string; data: Partial<Data>; tenantId: string }) {
    return (
        <Puck
            config={config}
            data={data}
            onPublish={async (data) => {
                await fetch("/puck/api", {
                    method: "post",
                    body: JSON.stringify({ data, path, tenantId }),
                });
            }}
        />
    );
}
