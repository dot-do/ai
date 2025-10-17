import { describe, it, expect } from 'vitest'
import * as collections from '../src/collections'

describe('collections', () => {
  it('should export all required collections', () => {
    expect(collections).toHaveProperty('Completions')
    expect(collections).toHaveProperty('Functions')
    expect(collections).toHaveProperty('Executions')
    expect(collections).toHaveProperty('Batches')
    expect(collections).toHaveProperty('Evals')
    expect(collections).toHaveProperty('Experiments')
  })

  it('should configure Completions collection correctly', () => {
    expect(collections.Completions).toHaveProperty('slug', 'completions')
    expect(collections.Completions).toHaveProperty('admin')
    expect(collections.Completions).toHaveProperty('fields')
  })

  it('should configure Functions collection correctly', () => {
    expect(collections.Functions).toHaveProperty('slug', 'functions')
    expect(collections.Functions).toHaveProperty('admin')
    expect(collections.Functions).toHaveProperty('fields')
  })
})
