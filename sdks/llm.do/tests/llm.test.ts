import { describe, it, expect } from 'vitest'
import { llm } from '../src'

describe('llm', () => {
  it('should be defined', () => {
    expect(llm).toBeDefined()
  })
  it('should create a provider', () => {
    const model = llm('openai/gpt-4.1')
    expect(model).toBeDefined()
    expect(model.modelId).toBe('openai/gpt-4.1')
    expect(model.provider).toMatchInlineSnapshot(`"llm.do.chat"`)
  })
})
