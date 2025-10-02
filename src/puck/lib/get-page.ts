import { Data } from "@measured/puck";
import fs from "fs";

// Replace with call to your database
export const getPage = (path: string, id: string) => {
    const allData: Record<string, Data> | null = fs.existsSync(`src/puck/database/${id}.json`)
        ? JSON.parse(fs.readFileSync(`src/puck/database/${id}.json`, "utf-8"))
        : null;

    return allData ? allData[path] : null;
};
