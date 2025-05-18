import { describe, it, expect } from 'vitest'
import type { APIs, LLMs } from '../src'

describe('APIs Type', () => {
  it('should have functions', () => {
    const apiName: keyof APIs = 'functions'
    expect(apiName).toBeDefined()
  })
})

describe('LLMs Type', () => {
  it('openai/gpt-4.1 should be a valid model name', () => {
    const model: LLMs = 'openai/gpt-4.1'
    expect(model).toBeDefined()
  })
})
  
