/**
 * Basic tests for mdxai agent
 */

import { describe, it, expect } from 'vitest'
import { MdxAgent, createAgent } from './agent'

describe('MdxAgent', () => {
  it('should create an agent with default config', () => {
    // This will fail without API key, but we can test the creation
    expect(() => createAgent()).toThrow('OpenRouter API key is required')
  })

  it('should create an agent with provided API key', () => {
    const agent = createAgent({ apiKey: 'test-key' })
    expect(agent).toBeInstanceOf(MdxAgent)
    const config = agent.getConfig()
    expect(config.apiKey).toBe('test-key')
    expect(config.model).toBe('openai/gpt-5')
  })

  it('should accept custom model', () => {
    const agent = createAgent({ apiKey: 'test-key', model: 'openai/gpt-3.5-turbo' })
    const config = agent.getConfig()
    expect(config.model).toBe('openai/gpt-3.5-turbo')
  })

  it('should accept custom temperature and maxTokens', () => {
    const agent = createAgent({
      apiKey: 'test-key',
      temperature: 0.5,
      maxTokens: 2000,
    })
    const config = agent.getConfig()
    expect(config.temperature).toBe(0.5)
    expect(config.maxTokens).toBe(2000)
  })
})
