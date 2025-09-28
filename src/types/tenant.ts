import { Data } from "@/page-builder/renderer/Render";

export interface Tenant {
    id: string;
    name: string;
    domain: string;

    data: {
        layout: {
            root: {
                props: {
                    title: string;
                    description: string;
                    favicon: string;
                };
            };
        };
        pages: {
            [key: string]: Data;
        };
    };

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
