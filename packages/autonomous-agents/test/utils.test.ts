import { describe, it, expect, vi } from 'vitest'
import { createAgentProxy, createEventHandler, monitorKeyResult, callIntegration, performSearch } from '../src/utils'

describe('utils', () => {
  describe('createAgentProxy', () => {
    it('should create a proxy for dynamic method invocation', async () => {
      const config = {
        name: 'TestAgent',
        actions: ['testAction'],
      }
      const state = {}

      const proxy = createAgentProxy(config, state)

      expect(proxy).toBeDefined()
      expect(typeof proxy).toBe('function')
    })

    it('should execute an action and store the result in state', async () => {
      const config = {
        name: 'TestAgent',
        actions: ['testAction'],
      }
      const state: Record<string, any> = {}

      const proxy = createAgentProxy(config, state)
      const result = await proxy('testAction', 'param1', 'param2')

      expect(result).toBeDefined()
      expect(result.action).toBe('testAction')
      expect(result.params).toEqual(['param1', 'param2'])
      expect(result.agent).toBe('TestAgent')
      expect(result.success).toBe(true)

      expect(state.actions).toBeDefined()
      expect(state.actions.length).toBe(1)
      expect(state.actions[0].action).toBe('testAction')
    })

    it('should throw an error for undefined actions', async () => {
      const config = {
        name: 'TestAgent',
        actions: ['testAction'],
      }
      const state = {}

      const proxy = createAgentProxy(config, state)

      await expect(async () => {
        await proxy('undefinedAction')
      }).rejects.toThrow("Action 'undefinedAction' is not defined for agent TestAgent")
    })
  })

  describe('createEventHandler', () => {
    it('should create an event handler function', () => {
      const trigger = 'onTest'
      const config = { name: 'TestAgent' }

      const handler = createEventHandler(trigger, config)

      expect(handler).toBeDefined()
      expect(typeof handler).toBe('function')
    })

    it('should process events and return a result', async () => {
      const trigger = 'onTest'
      const config = { name: 'TestAgent' }

      const handler = createEventHandler(trigger, config)
      const result = await handler('arg1', 'arg2')

      expect(result).toBeDefined()
      expect(result.trigger).toBe('onTest')
      expect(result.args).toEqual(['arg1', 'arg2'])
      expect(result.agent).toBe('TestAgent')
      expect(result.processed).toBe(true)
      expect(result.executionTime).toBeDefined()
    })
  })

  describe('monitorKeyResult', () => {
    it('should initialize keyResults in state if not present', () => {
      const state: Record<string, any> = {}

      monitorKeyResult('testMetric', 100, state)

      expect(state.keyResults).toBeDefined()
      expect(state.keyResults.testMetric).toBeDefined()
      expect(state.keyResults.testMetric.length).toBe(1)
      expect(state.keyResults.testMetric[0].value).toBe(100)
    })

    it('should add to existing keyResults if present', () => {
      const state: Record<string, any> = {
        keyResults: {
          testMetric: [{ value: 100, timestamp: new Date().toISOString() }],
        },
      }

      monitorKeyResult('testMetric', 200, state)

      expect(state.keyResults.testMetric.length).toBe(2)
      expect(state.keyResults.testMetric[1].value).toBe(200)
    })
  })

  describe('callIntegration', () => {
    it('should return integration result with correct structure', () => {
      const result = callIntegration('testIntegration', 'testMethod', 'param1', 'param2')

      expect(result).toBeDefined()
      expect(result.integration).toBe('testIntegration')
      expect(result.method).toBe('testMethod')
      expect(result.params).toEqual(['param1', 'param2'])
      expect(result.success).toBe(true)
      expect(result.timestamp).toBeDefined()
    })
  })

  describe('performSearch', () => {
    it('should return search result with correct structure', () => {
      const result = performSearch('testSearch', 'query')

      expect(result).toBeDefined()
      expect(result.searchType).toBe('testSearch')
      expect(result.query).toBe('query')
      expect(result.results).toEqual([])
      expect(result.timestamp).toBeDefined()
    })
  })
})
