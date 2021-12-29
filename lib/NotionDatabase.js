"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotionDatabase = void 0;
const client_1 = require("@notionhq/client");
const Database_1 = require("./Database");
class NotionDatabase {
    constructor(token) {
        this.database = (id, template, _config) => {
            return new Database_1.Database(id, template, Object.assign({ client: this.client }, _config));
        };
        this.client = new client_1.Client({
            auth: token,
        });
    }
}
exports.NotionDatabase = NotionDatabase;
