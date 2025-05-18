import { describe, it, expect, beforeAll, vi } from 'vitest'
import { config as configPromise } from 'ai-primitives'
import { getPayload } from 'payload'

vi.mock('ai', () => ({
  generateText: vi.fn().mockResolvedValue({
    text: 'Generated test text',
    reasoning: 'Test reasoning',
    response: { choices: [{ message: { content: 'Test content' } }] }
  }),
  generateObject: vi.fn().mockResolvedValue({
    object: { name: 'Test name', value: 123 },
    response: { choices: [{ message: { content: '{"name":"Test name","value":123}' } }] }
  })
}))

vi.mock('../primitives/lib/ai', () => ({
  model: vi.fn(() => 'mocked-model'),
  getModels: vi.fn().mockResolvedValue(['test-model-1', 'test-model-2'])
}))

let payload: Awaited<ReturnType<typeof getPayload>>

const config = await configPromise
if (!config.secret) config.secret = 'test-secret-key-for-payload'

beforeAll(async () => {
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

describe('generate task', () => {
  const baseInput = {
    prompt: 'Test prompt',
    model: 'test-model',
    system: 'Test system prompt',
  }

  it('can generate text content', async () => {
    const input = { ...baseInput, format: 'Text' }
    const job = await payload.jobs.queue({ task: 'generate', input })
    await payload.jobs.run()
    
    const result = await payload.findByID({
      collection: 'jobs',
      id: job.doc.id,
    })
    
    expect(result.status).toBe('completed')
    expect(result.output).toBeDefined()
    expect(result.output.content).toBeDefined()
    expect(result.output.error).toBeUndefined()
  })

  it('can generate object content', async () => {
    const input = { 
      ...baseInput, 
      format: 'Object',
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          value: { type: 'number' }
        }
      }
    }
    const job = await payload.jobs.queue({ task: 'generate', input })
    await payload.jobs.run()
    
    const result = await payload.findByID({
      collection: 'jobs',
      id: job.doc.id,
    })
    
    expect(result.status).toBe('completed')
    expect(result.output).toBeDefined()
    expect(result.output.data).toBeDefined()
    expect(typeof result.output.data).toBe('object')
    expect(result.output.error).toBeUndefined()
  })

  it('can generate list content', async () => {
    const input = { ...baseInput, format: 'List' }
    const job = await payload.jobs.queue({ task: 'generate', input })
    await payload.jobs.run()
    
    const result = await payload.findByID({
      collection: 'jobs',
      id: job.doc.id,
    })
    
    expect(result.status).toBe('completed')
    expect(result.output).toBeDefined()
    expect(result.output.data).toBeDefined()
    expect(Array.isArray(result.output.data)).toBe(true)
    expect(result.output.error).toBeUndefined()
  })

  it('can generate code content', async () => {
    const input = { ...baseInput, format: 'Code' }
    const job = await payload.jobs.queue({ task: 'generate', input })
    await payload.jobs.run()
    
    const result = await payload.findByID({
      collection: 'jobs',
      id: job.doc.id,
    })
    
    expect(result.status).toBe('completed')
    expect(result.output).toBeDefined()
    expect(result.output.content).toBeDefined()
    expect(typeof result.output.content).toBe('string')
    expect(result.output.error).toBeUndefined()
  })
})
