import { Property, Tag, Tags } from '../parser'
import { NotionDatabase } from '../index'

describe('Parser bases tests', () => {
  test('Manual base', async () => {
    require('dotenv').config()
    const test_users_db_id = '1104dd21183a458fb71d5c1110f0bbfc'
    const test_pets_db_id = '4786bb9c1f254f1e9fa2831d67672c9c'

    const token = process.env.DEV_NOTION_TOKEN
    if (!token) return

    let notion = new NotionDatabase(token)

    interface Pet {
      id: string
      name: string
      colors: Tags<'orange' | 'white' | 'black' | 'gray'>
      users: User[]
    }

    interface User {
      id: ''
      emoji: string
      name: string
      hobby: Tag
      pets: Pet[]
    }

    const pets_db = notion.database(test_pets_db_id, <Pet>{
      id: '',
      name: '',
      colors: [],
      users: [],
    })
    const pets = await pets_db.get()

    const users_db = notion.database(test_users_db_id, <User>{
      id: '',
      emoji: '',
      name: '',
      hobby: {},
      pets: {},
    })
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
})
