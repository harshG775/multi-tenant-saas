import DefaultPage from "../tenant/templates/default/page";
import ClassicPage from "../tenant/templates/classic/page";
import { headers } from "next/headers";

export default async function MainPage() {
    const templateId = (await headers()).get("x-tenant-template") || "default";

    switch (templateId) {
        case "classic":
            return <ClassicPage />;
        default:
            return <DefaultPage />;
    }
}
