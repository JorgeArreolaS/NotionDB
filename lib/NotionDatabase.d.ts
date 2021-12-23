import { Database } from './Database';
export declare class NotionDatabase {
    private client;
    constructor(token: string);
    database: <T>(id: string, template: T) => Database<T>;
}
