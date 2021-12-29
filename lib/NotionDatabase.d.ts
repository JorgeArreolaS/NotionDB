import { Database } from './Database';
declare type DatabaseConstructorArgs = ConstructorParameters<typeof Database>;
declare type config = DatabaseConstructorArgs[2];
declare type filteredConfig = Omit<config, 'client'>;
export declare class NotionDatabase {
    private client;
    constructor(token: string);
    database: <T>(id: string, template: T, _config?: filteredConfig | undefined) => Database<Record<string, any>>;
}
export {};
