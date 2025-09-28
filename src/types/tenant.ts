export interface Tenant {
    id: string;
    name: string;
    domain: string;

    data: any;

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
