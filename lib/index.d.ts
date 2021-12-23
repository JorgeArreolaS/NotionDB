import { Client } from '@notionhq/client';
declare class Database<T> {
    id: string;
    private client;
    private template;
    constructor(id: string, template: T, client: Client);
    get: () => Promise<T[]>;
}
export declare class NotionDatabase {
    private client;
    constructor(token: string);
    database: <T>(id: string, template: T) => Database<T>;
}
export {};
