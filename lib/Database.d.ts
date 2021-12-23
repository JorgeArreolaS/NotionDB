import { Client } from '@notionhq/client';
export declare class Database<T> {
    id: string;
    private client;
    private template;
    constructor(id: string, template: T, client: Client);
    get: () => Promise<T[]>;
}
