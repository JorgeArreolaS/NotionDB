import { Tag, Tags } from '../parser'
// import * as util from 'util'
import { NotionDatabase, Relation } from '../index'

interface Pet {
  id: string
  name: string
  colors: Tags<'orange' | 'white' | 'black' | 'gray'>
  users: Relation<User>
  toys: Relation<Toy>
}
const default_pet: Pet = {
  id: '',
  name: '',
  colors: [],
  users: [],
  toys: [],
}

type User = {
  id: string
  emoji: string
  name: string
  hobby: Tag
  pets: Relation<Pet>
}

const default_user: User = {
  id: '',
  emoji: '',
  name: '',
  hobby: null,
  pets: [],
}

interface Toy {
  id: string
  name: string
  pets: Pet[]
}
const default_toy: Toy = {
  id: '',
  name: '',
  pets: [],
}

describe('Parser bases tests', () => {
  require('dotenv').config()

  const token = process.env.DEV_NOTION_TOKEN
  if (!token) return

  let notion = new NotionDatabase(token)

  const toys_db = notion.database('288fdf4d7dae4ef6ab784d577802cb0b', <Toy>default_toy)
  const pets_db = notion.database('4786bb9c1f254f1e9fa2831d67672c9c', <Pet>default_pet, {
    bases: {
      toys: toys_db,
    },
  })
  const users_db = notion.database('1104dd21183a458fb71d5c1110f0bbfc', <User>default_user, {
    bases: {
      pets: pets_db,
    },
  })

  test('Manual base', async () => {
    const pets = await pets_db.get()

    const users = await users_db.get({
      bases: {
        pets: pets,
      },
    })

    const liz = users.find((user) => user.name === 'liz')
    if (!liz) throw Error('"Liz" user not found')
    expect(pets).toContainEqual(liz.pets[0])
    expect(pets).toContainEqual(liz.pets[1])
    const tom = pets.find((pet) => pet.name === 'tom')
    if (!tom) throw Error('"Tom" pet not found')
    expect(liz.pets).not.toContain(tom)
  })

  test('Database as base', async () => {
    const users = await users_db.get()

    // console.log(users)
    // console.log(util.inspect(users, false, null, true /* enable colors */))

    const pets = await pets_db.get()
    const liz = users.find((user) => user.name === 'liz')
    if (!liz) throw Error('"Liz" user not found')
    expect(pets).toContainEqual(liz.pets[0])
    expect(pets).toContainEqual(liz.pets[1])

    const tom = pets.find((pet) => pet.name === 'tom')
    if (!tom) throw Error('"Tom" pet not found')
    expect(liz.pets).not.toContain(tom)
  })

  test('Keys tests', async () => {
    const users = await users_db.get({ keys: ['name', 'emoji', 'pets'] })

    const firstUser = users[0]
    const properties = Object.getOwnPropertyNames(firstUser)
    expect(properties).toEqual(['name', 'emoji', 'pets'])
  })
})
