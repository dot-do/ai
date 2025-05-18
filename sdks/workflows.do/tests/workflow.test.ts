import { describe, it, expect } from 'vitest'
import type { AIWorkflowDefinition } from '../src'

describe('APIs Type', () => {
  it('should have functions', () => {
    const AI: AIWorkflowDefinition = {
      leanCanvas: {
        
      }
    }
    expect(AI.leanCanvas).toBeDefined()
  })
})
