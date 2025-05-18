import { describe, it, expect, beforeAll } from 'vitest'
import { config } from 'ai-primitives'
import { getPayload } from 'payload'

let payload: Awaited<ReturnType<typeof getPayload>>

beforeAll(async () => {
  if (!config.secret) config.secret = 'test-secret-key-for-payload'
  payload = await getPayload({ config })
})

describe('config', () => {
  it('should have collections', () => {
    expect(config.collections.length).toBeGreaterThan(5)
  })

  it('should have a secret', () => {
    expect(config.secret).toBeDefined()
  })
})

describe('payload collections', () => {
  it('can create a user', async () => {
    const results = await payload.create({ collection: 'users', data: { email: 'test@example.com', password: 'password', enableAPIKey: true } })
    expect(results.id).toBeDefined()
  })

  it('can authenticate a user', async () => {
    const session = await payload.login({ collection: 'users', data: { email: 'test@example.com', password: 'password' } })
    expect(session.user.email).toBe('test@example.com')
    expect(session.token).toBeDefined()
  })

  it('can create a noun', async () => {
    const noun = await payload.create({ collection: 'nouns', data: { name: 'Test' } })
    expect(noun.id).toBeDefined()
  })

  it('can create a thing', async () => {
    const noun = await payload.create({ collection: 'nouns', data: { name: 'Parent' } })
    const thing = await payload.create({ collection: 'things', data: { name: 'Child', type: noun.id } })
    expect(thing.id).toBeDefined()
  })
})
