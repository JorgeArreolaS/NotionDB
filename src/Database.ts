import { Client } from '@notionhq/client'
import { ParseNotionProps } from './parser'

export class Database<T> {
  id: string
  private client: Client
  private template: T

  constructor(id: string, template: T, client: Client) {
    this.id = id
    this.client = client
    this.template = template
  }
  get: (config?: { bases?: Record<string, any> }) => Promise<T[]> = async (config) => {
    const res = await this.client.databases.query({
      database_id: this.id,
    })
    const items = res.results

    // const { bases } = props || {}

    const results = items.map((item): T => {
      const _default = this.template as Record<string, any>
      if (!('properties' in item)) return this.template

      // prettier-ignore
      if ('emoji' in _default && _default['emoji'] !== undefined && item.icon?.type === 'emoji')
          _default['emoji'] = item.icon.emoji;

      // prettier-ignore
      if ('icon' in _default && _default['icon'] !== undefined && item.icon?.type === 'emoji')
          _default['icon'] = item.icon.emoji;

      // prettier-ignore
      if ('id' in _default && _default['id'] !== undefined)
          _default['id'] = item.id

      return ParseNotionProps<T>(item.properties, {
        ...config,
        default: _default as T,
      })
    })
    return results
  }
}
