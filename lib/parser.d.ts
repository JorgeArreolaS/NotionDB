export declare type Tag = {
    name: string;
    color?: string;
    id?: string;
};
declare type NotionPropType = 'title' | 'rich_text' | 'checkbox' | 'number' | 'url' | 'select' | 'multi_select' | 'people' | 'email' | 'phone_number' | 'date' | 'files' | 'formula' | 'relation' | 'created_time' | 'created_by' | 'last_edited_time' | 'last_edited_by' | 'rollup';
export declare const NotionParserBase: {
    [key: string]: any;
};
declare type NotionProp = {
    type: NotionPropType;
    [key: string]: any;
};
export declare const NotionParser: <K = undefined>(property: NotionProp, props?: {
    default?: K;
    [key: string]: any;
}) => K;
export declare const ParseNotionProps: <T extends Record<string, any>>(NotionProps: Record<string, NotionProp>, config: {
    default: T;
    bases?: Record<string, any>;
}) => T;
export {};
