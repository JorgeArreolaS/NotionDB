"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseNotionProps = exports.NotionParser = exports.NotionParserBase = void 0;
const relationParser = (x, { base }) => {
    return (x && base ? x.relation.map((item) => base[item.id] || undefined) : x.relation) || [];
};
exports.NotionParserBase = {
    title: (x) => (x && x.title.map((word) => word.text.content).join('')) || '',
    rich_text: (x) => (x && x.rich_text.map((s) => s.plain_text).join('')) || '',
    select: (x) => (x && x.select && { name: x.select.name, color: x.select.color }) || undefined,
    date: (x) => (x &&
        x.date &&
        x.date.start && {
        start: new Date(x.date.start),
        end: (x.date.end && new Date(x.date.end)) || undefined,
    }) ||
        undefined,
    relation: relationParser,
};
const NotionParser = (property, props) => {
    if (typeof property !== 'object')
        return (props === null || props === void 0 ? void 0 : props.default) || undefined;
    const _type = property.type;
    const _default = (props === null || props === void 0 ? void 0 : props.default) || undefined;
    if (_type in exports.NotionParserBase && exports.NotionParserBase[_type])
        return exports.NotionParserBase[_type](property, props) || _default;
    return _default;
};
exports.NotionParser = NotionParser;
const ParseNotionProps = (NotionProps, config) => {
    const obj = Object.assign({}, config.default);
    for (const key in obj) {
        if (obj[key]) {
            const item = NotionProps[key];
            const props = {};
            if (config.bases && config.bases[key] !== undefined)
                props.base = config.bases[key];
            const value = (0, exports.NotionParser)(item, Object.assign({ default: obj[key] }, props));
            if (value !== null || value !== undefined)
                obj[key] = value;
        }
    }
    return obj;
};
exports.ParseNotionProps = ParseNotionProps;
