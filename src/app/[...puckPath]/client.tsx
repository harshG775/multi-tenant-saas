"use client";
import config from "@/puck/config/config";
import type { Data } from "@measured/puck";
import { Render } from "@measured/puck";

export function Client({ data }: { data: Data }) {
    return <Render config={config} data={data} />;
}
