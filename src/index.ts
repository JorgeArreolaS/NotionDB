import { Client } from '@notionhq/client'
import { Database, Relation } from './Database'

type DatabaseConstructorArgs = ConstructorParameters<typeof Database>
type config = DatabaseConstructorArgs[2]
type filteredConfig = Omit<config, 'client'>

export { Relation }

export class NotionDatabase {
  private client: Client
  constructor(token: string) {
    this.client = new Client({
      auth: token,
    })
  }
  database: <T extends Record<string, any>>(id: string, template: T, _config?: filteredConfig) => Database<T> = (
    id,
    template,
    _config,
  ) => {
    return new Database<typeof template>(id, template, { client: this.client, ..._config })
  }
}
