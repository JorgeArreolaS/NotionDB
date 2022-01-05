import { NotionDatabase } from '../index'
import { User, Pet } from './types'

describe('Extract keys from database', () => {
  require('dotenv').config()

  const token = process.env.DEV_NOTION_TOKEN
  if (!token) return

  const notion = new NotionDatabase(token)
  const pets_db = notion.database<Pet>('4786bb9c1f254f1e9fa2831d67672c9c', {
    id: '',
    name: '',
    users: [],
  })

  test('Keys tests', async () => {
    const _users_db = notion.database<User>('1104dd21183a458fb71d5c1110f0bbfc', {
      pets: pets_db,
    })
    const users = await _users_db.get({ keys: ['name', 'emoji', 'pets'] })

    const firstUser = users[0]
    // console.log(firstUser)
    const properties = Object.getOwnPropertyNames(firstUser)
    expect(properties).toEqual(['name', 'emoji', 'pets'])
  })
})
