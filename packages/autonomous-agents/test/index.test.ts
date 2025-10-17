import { describe, it, expect, vi } from 'vitest'
import { Agent } from '../src'
import type { AgentConfig, AutonomousAgent } from '../src/types'

describe('autonomous-agents', () => {
  it('should export the Agent function', () => {
    expect(Agent).toBeDefined()
    expect(typeof Agent).toBe('function')
  })

  it('should create an agent with the provided configuration', () => {
    const config: AgentConfig = {
      name: 'TestAgent',
      url: 'https://test.agent',
      role: 'Test Agent',
      objective: 'Testing the agent functionality',
      keyResults: ['testCoverage'],
      integrations: ['test'],
      triggers: ['onTest'],
      searches: ['testSearch'],
      actions: ['testAction'],
    }

    const agent = Agent(config)

    expect(agent).toBeDefined()
    expect(agent.config).toEqual(config)
  })

  it('should have an execute method', () => {
    const agent = Agent({
      name: 'TestAgent',
      url: 'https://test.agent',
      role: 'Test Agent',
      objective: 'Testing the agent functionality',
      keyResults: ['testCoverage'],
      integrations: ['test'],
      triggers: ['onTest'],
      searches: ['testSearch'],
      actions: ['testAction'],
    })

    expect(agent.execute).toBeDefined()
    expect(typeof agent.execute).toBe('function')
  })

  it('should have a do proxy for actions', () => {
    const agent = Agent({
      name: 'TestAgent',
      url: 'https://test.agent',
      role: 'Test Agent',
      objective: 'Testing the agent functionality',
      keyResults: ['testCoverage'],
      integrations: ['test'],
      triggers: ['onTest'],
      searches: ['testSearch'],
      actions: ['testAction'],
    })

    expect(agent.do).toBeDefined()
  })

  it('should create event handlers for triggers', () => {
    const agent = Agent({
      name: 'TestAgent',
      url: 'https://test.agent',
      role: 'Test Agent',
      objective: 'Testing the agent functionality',
      keyResults: ['testCoverage'],
      integrations: ['test'],
      triggers: ['onTest'],
      searches: ['testSearch'],
      actions: ['testAction'],
    })

    expect(agent.onTest).toBeDefined()
    expect(typeof agent.onTest).toBe('function')
  })

  it('should execute the agent with input and return a result', async () => {
    const agent = Agent({
      name: 'TestAgent',
      url: 'https://test.agent',
      role: 'Test Agent',
      objective: 'Testing the agent functionality',
      keyResults: ['testCoverage'],
      integrations: ['test'],
      triggers: ['onTest'],
      searches: ['testSearch'],
      actions: ['testAction'],
    })

    const result = await agent.execute({ test: 'input' })

    expect(result).toBeDefined()
    expect(result.data).toBe('executed')
    expect(result.agent).toBe('TestAgent')
    expect(result.input).toEqual({ test: 'input' })
  })

  it('should throw an error when trying to use an undefined action', async () => {
    const agent = Agent({
      name: 'TestAgent',
      url: 'https://test.agent',
      role: 'Test Agent',
      objective: 'Testing the agent functionality',
      keyResults: ['testCoverage'],
      integrations: ['test'],
      triggers: ['onTest'],
      searches: ['testSearch'],
      actions: ['testAction'],
    })

    await expect(async () => {
      await agent.do('undefinedAction')
    }).rejects.toThrow("Action 'undefinedAction' is not defined for agent TestAgent")
  })
})
