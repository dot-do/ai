import { describe, it, expect } from 'vitest'
import { config as configPromise } from 'ai-primitives'
import { getPayload } from 'payload'

const config = await configPromise
if (!config.secret) config.secret = 'test-secret-key-for-payload'

describe('config', () => {
  it('should have collections', () => {
    expect(config.collections.length).toBeGreaterThan(5)
  })

  it('should have a secret', () => {
    expect(config.secret).toBeDefined()
  })

  it('should have a secret', () => {
    expect(config.secret).toBeDefined()
  })
})

describe('payload', async () => {
  const payload = await getPayload({ config })

  it('should be initialized', () => {
    expect(payload).toBeDefined()
  })

  it('can create a user', async () => {
    const results = await payload.create({ collection: 'users', data: { email: 'test@example.com', password: 'password', enableAPIKey: true } })
    expect(results.id).toBeDefined()
  })

  it('can authenticate a user', async () => {
    const session = await payload.login({ collection: 'users', data: { email: 'test@example.com', password: 'password' } })
    expect(session.user.email).toBe('test@example.com')
    expect(session.token).toBeDefined()
  })
})
