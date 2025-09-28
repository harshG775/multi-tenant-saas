"use client";

import { config } from "@/page-builder/config/config";
import { Data, Render } from "@/page-builder/renderer/Render";

export function Client({ data }: { data: Data }) {
    return <Render config={config} data={data} />;
}
