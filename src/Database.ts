import { Client } from '@notionhq/client'
import { getBase, ParseNotionProps } from './parser'

export type Base = Record<string, any>
type Bases<T> = { [key in keyof T]?: Base[] | Database<any> }

export type Relation<T extends Base> = T[]
export type RelationTemplate<T extends Base> = Database<T> | T[]

export type TransformRecord<T> = {
  [x in keyof T]?: T[x] extends Relation<infer Q> ? RelationTemplate<Q> : T[x]
}

export class Database<T extends Record<string, any>> {
  id: string
  private client: Client
  private template: Record<string, any> = {}
  private bases: Bases<T> = {}

  constructor(id: string, template: TransformRecord<T>, config: { client: Client; bases?: Bases<T> }) {
    this.id = id
    this.client = config.client
    for (const key of Object.keys(template)) {
      const keyType = typeof template[key]
      if (template[key] === undefined) continue

      if (keyType === 'object') {
        if ((template[key] && template[key]?.hasOwnProperty('id')) || template[key]?.hasOwnProperty('length')) {
          this.bases[key as keyof T] = template[key]
          this.template[key] = []
          continue
        }
      }
      this.template[key] = template[key]
    }

    if (config.bases) this.bases = config.bases
  }
  get: <K extends keyof T>(config?: {
    bases?: Bases<T>
    keys?: K[]
  }) => Exclude<typeof config, undefined>['keys'] extends undefined ? Promise<T[]> : Promise<Pick<T, K>[]> = async (
    config,
  ) => {
    // console.log('Quering Database: ' + this.id)
    const res = await this.client.databases.query({
      database_id: this.id,
    })
    const items = res.results

    const bases: Record<string, Base> = {}
    const ListOfBases = Object.assign({}, this.bases || {}, config?.bases || {})

    if (ListOfBases !== undefined) {
      for (const key in ListOfBases) {
        if (ListOfBases.hasOwnProperty(key)) {
          if (ListOfBases[key]?.hasOwnProperty('id')) {
            const database = ListOfBases[key] as Database<any>
            const payload = await database.get()
            bases[key] = getBase(payload)
          } else if (ListOfBases[key]?.hasOwnProperty('length')) {
            const payload = ListOfBases[key] as any[]
            bases[key] = getBase(payload)
          }
        }
      }
    }

    const results = items.map((item): T => {
      let _default: Record<string, any> = Object.assign(this.template || {})

      if (config?.keys) {
        const tempDefault: Partial<T> = {}
        for (const key of config.keys) {
          tempDefault[key] = _default[key as string]
        }
        _default = tempDefault
      }

      if (!('properties' in item)) return _default as T

      // prettier-ignore
      if ('emoji' in _default && item.icon?.type === 'emoji')
        _default['emoji'] = item.icon.emoji;

      // prettier-ignore
      if ('icon' in _default && item.icon?.type === 'emoji')
        _default['icon'] = item.icon.emoji;

      // prettier-ignore
      if ('id' in _default)
        _default['id'] = item.id

      return ParseNotionProps<T>(item.properties, {
        default: _default as T,
        bases,
      })
    })
    return results as any
  }
}
