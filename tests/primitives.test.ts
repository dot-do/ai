import { describe, it, expect } from 'vitest'
import { config } from 'ai-primitives'
import { getPayload } from 'payload'

describe('config', () => {
  it('should have collections', () => {
    expect(config.collections.length).toBeGreaterThan(5)
  })
})

describe('payload', () => {
  it('should initialize', async () => {
    const payload = await getPayload({ config })
    expect(payload).toBeDefined()
  })

  it('can create a user', async () => {
    const payload = await getPayload({ config })
    const results = await payload.create({ collection: 'users', data: { email: 'test@example.com', password: 'password', enableAPIKey: true } })
    expect(results.id).toBeDefined()
  })

  it('can authenticate a user', async () => {
    const payload = await getPayload({ config })
    const session = await payload.login({ collection: 'users', data: { email: 'test@example.com', password: 'password' } })
    expect(session.user.email).toBe('test@example.com')
    expect(session.token).toBeDefined()
  })
})
  