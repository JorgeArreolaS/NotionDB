import { Client } from '@notionhq/client'
import { Tag, Tags } from './parser'
import { Database, Relation, TransformRecord } from './Database'

export { Relation, Tag, Tags }

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
  database: <T extends Record<string, any>>(
    id: string,
    template: TransformRecord<T>,
    _config?: filteredConfig,
    dummy?: T,
  ) => Database<T> = (id, template, _config, dummy) => {
    return new Database<Omit<typeof dummy, 'undefined'>>(id, template, { client: this.client, ..._config })
  }
}
