export type Tag = {
  name: string
  color?: string
  id?: string
}
// import {
//   QueryDatabaseParameters,
//   QueryDatabaseResponse,
// } from '@notionhq/client/build/src/api-endpoints';

type Property<T> = {
  type: T
  [x: string]: any
}

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

const relationParser: <T>(x: Property<'relation'>, props: { base: Record<string, T> }) => T[] = (x, { base }) => {
  return (x && base ? x.relation.map((item: { id: string }) => base[item.id] || undefined) : x.relation) || []
}
export const NotionParserBase: {
  [key: string]: any
} = {
  title: (x: Property<'title'>): string => (x && x.title.map((word: any) => word.text.content).join('')) || '',

  rich_text: (x: Property<'rich_text'>): string => (x && x.rich_text.map((s: any) => s.plain_text).join('')) || '',

  select: (x: Property<'select'>): Tag | undefined =>
    (x && x.select && { name: x.select.name, color: x.select.color }) || undefined,

  date: (x: Property<'date'>): { start: Date; end: Date | undefined } | undefined =>
    (x &&
      x.date &&
      x.date.start && {
        start: new Date(x.date.start),
        end: (x.date.end && new Date(x.date.end)) || undefined,
      }) ||
    undefined,

  relation: relationParser,
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
  if (typeof property != 'object') return props?.default || undefined

  const _type = property.type
  const _default = props?.default || undefined
  if (_type in NotionParserBase && NotionParserBase[_type]) return NotionParserBase[_type](property, props) || _default
  return _default
}

export const ParseNotionProps: <T extends Record<string, any>>(
  NotionProps: Record<string, NotionProp>,
  config: {
    default: T
    bases?: Record<string, any>
  },
) => T = (NotionProps, config) => {
  let obj = Object.assign({}, config.default)

  for (let key in obj) {
    let item = NotionProps[key]
    let props: { [key: string]: any } = {}
    if (config.bases && config.bases[key] != undefined) props.base = config.bases[key]
    let value = NotionParser(item, { default: obj[key], ...props })
    if (value != null || value != undefined) obj[key] = value
  }

  return obj
}
