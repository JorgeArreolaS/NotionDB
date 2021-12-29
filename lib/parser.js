"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseNotionProps = exports.NotionParser = exports.NotionParserBase = exports.getBase = void 0;
const title = (x) => (x && x.title.map((word) => word.plain_text).join('')) || '';
const rich_text = (x) => (x && x.rich_text.map((s) => s.plain_text).join('')) || '';
const select = (x) => (x && x.select && { name: x.select.name, color: x.select.color }) || undefined;
const date = (x) => {
    return ((x &&
        x.date &&
        x.date.start && {
        start: new Date(x.date.start),
        end: (x.date.end && new Date(x.date.end)) || undefined,
    }) ||
        undefined);
};
const getBase = (list, key = 'id') => {
    // if (list == undefined) return {};
    const base = {};
    // console.log(typeof list, list);
    list.forEach((item) => {
        if (item[key])
            base[item[key]] = item;
    });
    return base;
};
exports.getBase = getBase;
const relation = (x, { base }) => {
    return (x && base && x.relation.map((item) => base[item.id])) || [];
};
exports.NotionParserBase = {
    title,
    rich_text,
    select,
    date,
    relation,
};
const NotionParser = (property, props) => {
    if (typeof property !== 'object')
        return (props === null || props === void 0 ? void 0 : props.default) || undefined;
    const _type = property.type;
    const _default = (props === null || props === void 0 ? void 0 : props.default) || undefined;
    if (_type in exports.NotionParserBase && typeof exports.NotionParserBase[_type] !== 'undefined') {
        const func = exports.NotionParserBase[_type];
        if (func === undefined)
            return _default;
        return func(property, props);
    }
    return _default;
};
exports.NotionParser = NotionParser;
const ParseNotionProps = (NotionProps, config) => {
    const obj = Object.assign({}, config.default);
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const item = NotionProps[key];
            const _default = obj[key];
            const props = {
                default: _default,
            };
            if (config.bases && config.bases[key] !== undefined) {
                props.base = config.bases[key];
            }
            const value = (0, exports.NotionParser)(item, props);
            if (value !== null || value !== undefined)
                obj[key] = value;
        }
    }
    return obj;
};
exports.ParseNotionProps = ParseNotionProps;
