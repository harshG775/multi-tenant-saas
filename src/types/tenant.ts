import { Data } from "@measured/puck";

export interface Tenant {
    id: string;
    name: string;
    domain: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
