import { describe, it, expect, vi } from 'vitest'
import { Experiment } from '../src/experiment'

describe('Experiment', () => {
  it('should return a valid experiment result', async () => {
    const result = await Experiment('test-experiment', {
      models: ['gpt-4o'],
      temperature: 0.7,
      prompt: 'Test prompt',
    })

    expect(result).toHaveProperty('name', 'test-experiment')
    expect(result).toHaveProperty('results')
    expect(result).toHaveProperty('totalTime')
    expect(result).toHaveProperty('timestamp')
    expect(Array.isArray(result.results)).toBe(true)
  })

  it('should handle multiple models and temperatures', async () => {
    const result = await Experiment('multi-param-test', {
      models: ['gpt-4o', 'gpt-4o-mini'],
      temperature: [0, 0.7],
      prompt: 'Test prompt',
    })

    expect(result.results.length).toBe(4) // 2 models × 2 temperatures

    const combinations = result.results.map((r) => ({
      model: r.params.model,
      temperature: r.params.temperature,
    }))

    expect(combinations).toContainEqual({ model: 'gpt-4o', temperature: 0 })
    expect(combinations).toContainEqual({ model: 'gpt-4o', temperature: 0.7 })
    expect(combinations).toContainEqual({ model: 'gpt-4o-mini', temperature: 0 })
    expect(combinations).toContainEqual({ model: 'gpt-4o-mini', temperature: 0.7 })
  })

  it('should handle custom inputs', async () => {
    const inputs = ['input1', 'input2']
    const result = await Experiment('input-test', {
      models: ['gpt-4o'],
      temperature: 0.7,
      inputs,
      prompt: ({ input }) => [`Process: ${input}`],
    })

    expect(result.results.length).toBe(2) // 1 model × 1 temperature × 2 inputs

    const processedInputs = result.results.map((r) => r.params.input)
    expect(processedInputs).toContain('input1')
    expect(processedInputs).toContain('input2')
  })

  it('should handle async inputs function', async () => {
    const asyncInputs = async () => ['async1', 'async2', 'async3']
    const result = await Experiment('async-input-test', {
      models: ['gpt-4o'],
      temperature: 0.5,
      inputs: asyncInputs,
    })

    expect(result.results.length).toBe(3)
    const inputs = result.results.map((r) => r.params.input)
    expect(inputs).toContain('async1')
    expect(inputs).toContain('async2')
    expect(inputs).toContain('async3')
  })

  it('should handle schema parameter', async () => {
    const schema = { type: 'object', properties: { answer: { type: 'string' } } }
    const result = await Experiment('schema-test', {
      models: ['gpt-4o'],
      temperature: 0.7,
      prompt: 'What is 2+2?',
      schema,
    })

    expect(result.results.length).toBe(1)
    expect(result.results[0].output).toHaveProperty('structured')
  })

  it('should handle seed parameter', async () => {
    const result = await Experiment('seed-test', {
      models: ['gpt-4o'],
      temperature: 0.7,
      seed: [42, 123],
      prompt: 'Generate a random number',
    })

    expect(result.results.length).toBe(2)
    const seeds = result.results.map((r) => r.params.seed)
    expect(seeds).toContain(42)
    expect(seeds).toContain(123)
  })

  it('should handle multiple parameters with seed', async () => {
    const result = await Experiment('multi-seed-test', {
      models: ['gpt-4o', 'gpt-4o-mini'],
      temperature: [0, 0.7],
      seed: [42, 123],
      prompt: 'Test prompt',
    })

    expect(result.results.length).toBe(8) // 2 models × 2 temperatures × 2 seeds
  })
})
