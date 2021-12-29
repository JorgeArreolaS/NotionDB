import { Client } from '@notionhq/client'
import { Database } from './Database'

type DatabaseConstructorArgs = ConstructorParameters<typeof Database>
type config = DatabaseConstructorArgs[2]
type filteredConfig = Omit<config, 'client'>

export class NotionDatabase {
  private client: Client
  constructor(token: string) {
    this.client = new Client({
      auth: token,
    })
  }
  database = <T>(id: string, template: T, _config?: filteredConfig) => {
    return new Database(id, template, { client: this.client, ..._config })
  }
}
