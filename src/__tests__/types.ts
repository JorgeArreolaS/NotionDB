import { Relation, Tag, Tags } from '../index'

export interface Pet {
  id: string
  name: string
  colors: Tags<'orange' | 'white' | 'black' | 'gray'>
  users: Relation<User>
  toys: Relation<Toy>
}

export type User = {
  id: string
  emoji: string
  name: string
  hobby: Tag
  pets: Relation<Pet>
}

export interface Toy {
  id: string
  name: string
  pets: Pet[]
}
