"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotionDatabase = void 0;
const client_1 = require("@notionhq/client");
const Database_1 = require("./Database");
class NotionDatabase {
    constructor(token) {
        this.database = (id, template) => {
            return new Database_1.Database(id, template, this.client);
        };
        this.client = new client_1.Client({
            auth: token,
        });
    }
}
exports.NotionDatabase = NotionDatabase;
