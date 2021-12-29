import { Client } from '@notionhq/client'
import { getBase, ParseNotionProps } from './parser'

type Base = Record<string, any>
type Bases<T> = { [key in keyof T]?: Base[] | Database<any> }

export class Database<T extends Record<string, any>> {
  id: string
  private client: Client
  private template: T
  private bases: Bases<T> = {}

  constructor(id: string, template: T, config: { client: Client; bases?: Bases<T> }) {
    this.id = id
    this.client = config.client
    this.template = template
    if (config.bases) this.bases = config.bases
  }
  get: (config?: { bases?: Bases<T> }) => Promise<T[]> = async (config) => {
    // console.log('Quering Database: ' + this.id)
    const res = await this.client.databases.query({
      database_id: this.id,
    })
    const items = res.results

    const bases: Record<string, Base> = {}
    const ListOfBases = Object.assign({}, this.bases || {}, config?.bases || {})

    if (ListOfBases !== undefined) {
      for (const key in ListOfBases) {
        if (!ListOfBases.hasOwnProperty(key)) break

        if (ListOfBases[key]?.hasOwnProperty('id')) {
          const database = ListOfBases[key] as Database<any>
          const payload = await database.get()
          bases[key] = getBase(payload)
        } else if (ListOfBases[key]?.hasOwnProperty('length')) {
          let payload = ListOfBases[key] as any[]
          bases[key] = getBase(payload)
        }
      }
    }

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
        default: _default as T,
        bases: bases,
      })
    })
    return results
  }
}
