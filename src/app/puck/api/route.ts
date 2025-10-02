import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
    const { tenantId, path: pagePath, data } = await request.json();
    const filePath = path.join(process.cwd(), "src/puck/database", `${tenantId}.json`);

    const existingData = JSON.parse(fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : "{}");

    const updatedData = {
        ...existingData,
        [pagePath]: data,
    };

    fs.writeFileSync(filePath, JSON.stringify(updatedData));

    // Purge Next.js cache
    revalidatePath(pagePath);

    return NextResponse.json({ status: "ok" });
}
