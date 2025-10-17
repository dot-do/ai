import { describe, it, expect, vi } from 'vitest'
import { Agent } from '../src/agent'

describe('Agent', () => {
  it('should create an agent with the provided configuration', () => {
    const config = {
      name: 'TestAgent',
      url: 'https://test-agent.com',
      role: 'Tester',
      objective: 'Test things',
      keyResults: ['key1', 'key2'],
      integrations: ['slack', 'email'],
      triggers: ['onTaskAssigned', 'onKpiUpdate'],
      searches: ['search1'],
      actions: ['action1'],
    }

    const agent = Agent(config)

    expect(agent).toBeDefined()
    expect(agent.config).toEqual(config)
    expect(typeof agent.execute).toBe('function')
    expect(agent.do).toBeDefined()
    expect(typeof agent.onTaskAssigned).toBe('function')
    expect(typeof agent.onKpiUpdate).toBe('function')
  })

  it('should execute tasks and return results', async () => {
    const config = {
      name: 'TestAgent',
      url: 'https://test-agent.com',
      role: 'Tester',
      objective: 'Test things',
      keyResults: [],
      integrations: [],
      triggers: [],
      searches: [],
      actions: [],
    }

    const agent = Agent(config)
    const input = { action: 'test', data: 'value' }
    const options = { option1: true }

    const result = await agent.execute(input, options)

    expect(result).toEqual(
      expect.objectContaining({
        data: 'executed',
        input,
        options,
        agent: 'TestAgent',
        timestamp: expect.any(String),
      })
    )
  })

  it('should create a proxy for dynamic method invocation', async () => {
    const config = {
      name: 'TestAgent',
      url: 'https://test-agent.com',
      role: 'Tester',
      objective: 'Test things',
      keyResults: [],
      integrations: [],
      triggers: [],
      searches: [],
      actions: [],
    }

    const agent = Agent(config)
    const result = await agent.do.customAction({ param: 'value' })

    expect(result).toEqual(
      expect.objectContaining({
        action: 'customAction',
        input: { param: 'value' },
        agent: 'TestAgent',
        timestamp: expect.any(String),
      })
    )
  })

  it('should handle event triggers', async () => {
    const config = {
      name: 'TestAgent',
      url: 'https://test-agent.com',
      role: 'Tester',
      objective: 'Test things',
      keyResults: [],
      integrations: [],
      triggers: ['onEvent'],
      searches: [],
      actions: [],
    }

    const agent = Agent(config)
    const eventData = { key: 'value' }

    const result = await agent.onEvent(eventData)

    expect(result).toEqual(
      expect.objectContaining({
        event: 'onEvent',
        data: eventData,
        handled: true,
        agent: 'TestAgent',
        timestamp: expect.any(String),
      })
    )
  })
})
