import { Client } from '@notionhq/client';
declare type Base = Record<string, any>;
declare type Bases<T> = {
    [key in keyof T]?: Base[] | Database<any>;
};
export declare class Database<T extends Record<string, any>> {
    id: string;
    private client;
    private template;
    private bases;
    constructor(id: string, template: T, config: {
        client: Client;
        bases?: Bases<T>;
    });
    get: (config?: {
        bases?: Bases<T>;
    }) => Promise<T[]>;
}
export {};
