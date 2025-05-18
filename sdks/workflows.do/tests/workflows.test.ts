import { describe, it, expect } from 'vitest'
import { ai, AI, DB, every, on } from '..'

const MyAI = AI({
  greet: { message: 'hello' },
})

const MyDB = DB({
  items: {},
})

describe('ai helpers', () => {
  it('template', async () => {
    const res = await ai`test`
    expect(res).toBe('TEST')
  })

  it('list', async () => {
    const list = await ai.list('item')
    expect(list[0]).toContain('item')
  })
})

describe('db helpers', () => {
  it('crud', async () => {
    const created = await MyDB.items.create({ name: 'a' } as any)
    const read = await MyDB.items.read(created.id)
    expect(read?.name).toBe('a')
  })
})

describe('every/on', () => {
  it('runs callbacks', async () => {
    let flag = false
    await every('daily', async () => {
      flag = true
    })
    expect(flag).toBe(true)

    flag = false
    await on('event', async () => {
      flag = true
    })
    expect(flag).toBe(true)
  })
})
