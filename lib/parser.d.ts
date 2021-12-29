import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
declare type NotionPropType = 'title' | 'rich_text' | 'checkbox' | 'number' | 'url' | 'select' | 'multi_select' | 'people' | 'email' | 'phone_number' | 'date' | 'files' | 'formula' | 'relation' | 'created_time' | 'created_by' | 'last_edited_time' | 'last_edited_by' | 'rollup';
declare type resultType = QueryDatabaseResponse['results'][number];
declare type pageType = Extract<resultType, {
    properties: any;
}>;
declare type NotionPropertiesType = pageType['properties'][string];
export declare type Property<T extends NotionPropType> = Extract<NotionPropertiesType, {
    type: T;
}>;
export declare type Tag<T extends string = string> = {
    name: T;
    color?: string;
    id?: string;
} | null;
export declare type Tags<T extends string> = Tag<T>[];
export declare const getBase: <T>(list: T[], key?: string) => Record<string, T>;
export declare const NotionParserBase: {
    [key in NotionPropType]?: (...args: any[]) => any;
};
declare type NotionProp = {
    type: NotionPropType;
    [key: string]: any;
};
export declare const NotionParser: (property: NotionProp, props?: {
    default?: NotionPropertiesType;
    bases?: Record<string, any>;
    [key: string]: any;
}) => NotionPropertiesType;
export declare const ParseNotionProps: <T extends Record<string, any>>(NotionProps: Record<string, NotionPropertiesType>, config: {
    default: T;
    bases?: Record<string, Record<string, any[]>>;
}) => T;
export {};
