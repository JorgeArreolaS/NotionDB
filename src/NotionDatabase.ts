import { Client } from '@notionhq/client'
import { Database } from './Database'

export class NotionDatabase {
  private client: Client
  constructor(token: string) {
    this.client = new Client({
      auth: token,
    })
  }
  database = <T>(id: string, template: T) => {
    return new Database(id, template, this.client)
  }
}
