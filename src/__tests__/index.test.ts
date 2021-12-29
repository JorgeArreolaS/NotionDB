import { Tag } from '../parser'
import { NotionDatabase } from '../index'

describe('General tests', () => {
  test('Test users', async () => {
    require('dotenv').config()
    const test_users_db_id = '1104dd21183a458fb71d5c1110f0bbfc'

    const token = process.env.DEV_NOTION_TOKEN
    if (!token) return

    let notion = new NotionDatabase(token)

    interface User {
      emoji: string
      name: string
      hobby: Tag
    }

    const db = notion.database(test_users_db_id, <User>{
      emoji: '',
      name: '',
      hobby: null,
    })
    const users = await db.get()

    expect(users[1].name).toBe('jorge')
    expect(users[0].name).toBe('liz')
    expect(users[1].hobby?.name).toBe('programación')
    expect(users[0].hobby?.name).toBe('repostería')
  })
})
