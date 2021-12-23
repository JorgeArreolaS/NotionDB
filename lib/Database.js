"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const parser_1 = require("./parser");
class Database {
    constructor(id, template, client) {
        this.get = () => __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.databases.query({
                database_id: this.id,
            });
            const items = res.results;
            const results = items.map((item) => {
                var _a, _b;
                const _default = this.template;
                if (!('properties' in item))
                    return this.template;
                // prettier-ignore
                if ('emoji' in _default && _default['emoji'] !== undefined && ((_a = item.icon) === null || _a === void 0 ? void 0 : _a.type) === 'emoji')
                    _default['emoji'] = item.icon.emoji;
                // prettier-ignore
                if ('icon' in _default && _default['icon'] !== undefined && ((_b = item.icon) === null || _b === void 0 ? void 0 : _b.type) === 'emoji')
                    _default['icon'] = item.icon.emoji;
                // prettier-ignore
                if ('id' in _default && _default['id'] !== undefined)
                    _default['id'] = item.id;
                return (0, parser_1.ParseNotionProps)(item.properties, {
                    // ...config,
                    default: _default,
                });
            });
            return results;
        });
        this.id = id;
        this.client = client;
        this.template = template;
    }
}
exports.Database = Database;
