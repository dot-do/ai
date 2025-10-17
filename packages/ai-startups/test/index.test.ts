import { describe, it, expect } from 'vitest'
import { Startup } from '../src'

describe('Startup', () => {
  it('should create a startup instance with the provided configuration', () => {
    const startup = Startup({
      name: 'Test Startup',
      vision: 'Test vision statement',
      goals: [{ objective: 'Test Objective', keyResults: ['KR1', 'KR2'] }],
    })

    expect(startup).toBeDefined()
    expect(startup.name).toBe('Test Startup')
    expect(startup.vision).toBe('Test vision statement')
    expect(startup.goals).toHaveLength(1)
    expect(startup.goals[0].objective).toBe('Test Objective')
  })

  it('should initialize services when provided', () => {
    const startup = Startup({
      name: 'Test Startup',
      vision: 'Test vision statement',
      goals: [{ objective: 'Test Objective', keyResults: ['KR1', 'KR2'] }],
      services: [
        {
          name: 'Test Service',
          objective: 'Test service objective',
          pricing: {
            model: 'subscription',
            subscription: {
              price: 9.99,
              interval: 'month',
            },
          },
          implementation: {
            type: 'function',
            id: 'test-function',
          },
        },
      ],
    })

    expect(startup.services).toBeDefined()
    expect(startup.services).toHaveLength(1)
    expect(startup.services[0].name).toBe('Test Service')
  })

  it('should generate a site based on startup configuration', () => {
    const startup = Startup({
      name: 'Test Startup',
      vision: 'Test vision statement',
      goals: [{ objective: 'Test Objective', keyResults: ['KR1', 'KR2'] }],
    })

    const site = startup.generateSite()

    expect(site).toBeDefined()
    expect(site.pages).toBeDefined()
    expect(site.pages.home).toContain('Test Startup')
    expect(site.pages.about).toContain('Test vision statement')
  })

  it('should generate a database schema based on startup configuration', () => {
    const startup = Startup({
      name: 'Test Startup',
      vision: 'Test vision statement',
      goals: [{ objective: 'Test Objective', keyResults: ['KR1', 'KR2'] }],
    })

    const db = startup.generateDatabase()

    expect(db).toBeDefined()
    expect(db.collections).toBeDefined()
    expect(db.collections.startup).toBeDefined()
    expect(db.relationships).toBeInstanceOf(Array)
    expect(db.indexes).toBeInstanceOf(Array)
  })
})
