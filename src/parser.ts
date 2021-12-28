import {
  // QueryDatabaseParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints'

type NotionPropType =
  | 'title'
  | 'rich_text'
  | 'checkbox'
  | 'number'
  | 'url'
  | 'select'
  | 'multi_select'
  | 'people'
  | 'email'
  | 'phone_number'
  | 'date'
  | 'files'
  | 'formula'
  | 'relation'
  | 'created_time'
  | 'created_by'
  | 'last_edited_time'
  | 'last_edited_by'
  | 'rollup'

type resultType = QueryDatabaseResponse['results'][number]
type pageType = Extract<resultType, { properties: any }>
type properties = pageType['properties'][string]
export type Property<T extends NotionPropType> = Extract<properties, { type: T }>

export type Tag<T extends string = string> = {
  name: T
  color?: string
  id?: string
}
export type Tags<T extends string> = Tag<T>[]

const title = (x: Property<'title'>): string => (x && x.title.map((word: any) => word.plain_text).join('')) || ''

const rich_text = (x: Property<'rich_text'>): string => (x && x.rich_text.map((s: any) => s.plain_text).join('')) || ''

const select = (x: Property<'select'>): Tag | undefined =>
  (x && x.select && { name: x.select.name, color: x.select.color }) || undefined

const date = (x: Property<'date'>): { start: Date; end: Date | undefined } | undefined => {
  return (
    (x &&
      x.date &&
      x.date.start && {
        start: new Date(x.date.start),
        end: (x.date.end && new Date(x.date.end)) || undefined,
      }) ||
    undefined
  )
}

export const getBase = <T>(list: T[], key: string = 'id'): Record<string, T> => {
  // if (list == undefined) return {};
  let base: Record<string, T> = {}
  // console.log(typeof list, list);

  list.forEach((item: any) => {
    if (item[key]) base[item[key]] = item
  })
  return base
}

const relation: <T>(x: Property<'relation'>, props: { base: Record<string, T> }) => T[] = (x, { base }) => {
  return (x && base && x.relation.map((item: { id: string }) => base[item.id])) || []
}

export const NotionParserBase: {
  [key in NotionPropType]?: (...args: any[]) => any
} = {
  title,
  rich_text,
  select,
  date,
  relation,
}

type NotionProp = {
  type: NotionPropType
  [key: string]: any
}
export const NotionParser: <K = undefined>(
  property: NotionProp,
  props?: {
    default?: K
    [key: string]: any
  },
) => K = (property, props) => {
  if (typeof property !== 'object') return props?.default || undefined

  const _type = property.type
  const _default = props?.default || undefined
  if (_type in NotionParserBase && typeof NotionParserBase[_type] !== 'undefined') {
    const func = NotionParserBase[_type]
    if (func === undefined) return _default
    return func(property, props)
  }
  return _default
}

export const ParseNotionProps: <T extends Record<string, any>>(
  NotionProps: Record<string, NotionProp>,
  config: {
    default: T
    bases?: Record<string, any | any[]>
  },
) => T = (NotionProps, config) => {
  const obj = Object.assign({}, config.default)

  for (const key in config.bases) {
    if (!config.bases.hasOwnProperty(key)) break
    if (config.bases[key].hasOwnProperty('length')) {
      config.bases[key] = getBase(config.bases[key])
    }
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const item = NotionProps[key]
      const props: { [key: string]: any } = {}
      if (config.bases && config.bases[key] !== undefined) {
        props.base = config.bases[key]
      }
      const value = NotionParser(item, { default: obj[key], ...props })
      if (value !== null || value !== undefined) obj[key] = value
    }
  }

  return obj
}
