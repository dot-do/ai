import { describe, it, expect } from 'vitest'
import { registerFunction, getFunction, executeFunction, searchFunctions, updateFunction, deleteFunction } from '../index.js'

describe('ai-functions', () => {
  describe('registerFunction', () => {
    it('should register a new function', async () => {
      const func = await registerFunction({
        name: 'testFunc',
        description: 'A test function',
        version: '1.0.0',
        code: 'export default function test() { return "test" }',
      })

      expect(func.id).toBeDefined()
      expect(func.name).toBe('testFunc')
      expect(func.version).toBe('1.0.0')
      expect(func.createdAt).toBeInstanceOf(Date)
    })

    it('should register a function with tags', async () => {
      const func = await registerFunction({
        name: 'mathFunc',
        description: 'Math function',
        version: '1.0.0',
        code: 'export default function add(a, b) { return a + b }',
        tags: ['math', 'arithmetic'],
      })

      expect(func.tags).toEqual(['math', 'arithmetic'])
    })
  })

  describe('getFunction', () => {
    it('should retrieve a registered function', async () => {
      const registered = await registerFunction({
        name: 'getTest',
        version: '1.0.0',
        code: 'export default function() {}',
      })

      const retrieved = await getFunction(registered.id)
      expect(retrieved).toBeDefined()
      expect(retrieved?.id).toBe(registered.id)
      expect(retrieved?.name).toBe('getTest')
    })

    it('should return undefined for non-existent function', async () => {
      const result = await getFunction('non-existent-id')
      expect(result).toBeUndefined()
    })
  })

  describe('updateFunction', () => {
    it('should update a function', async () => {
      const func = await registerFunction({
        name: 'updateTest',
        version: '1.0.0',
        code: 'export default function() {}',
      })

      const updated = await updateFunction(func.id, {
        version: '2.0.0',
        description: 'Updated function',
      })

      expect(updated.version).toBe('2.0.0')
      expect(updated.description).toBe('Updated function')
      expect(updated.updatedAt.getTime()).toBeGreaterThan(func.updatedAt.getTime())
    })

    it('should throw error for non-existent function', async () => {
      await expect(updateFunction('non-existent-id', { version: '2.0.0' })).rejects.toThrow('Function not found')
    })
  })

  describe('deleteFunction', () => {
    it('should delete a function', async () => {
      const func = await registerFunction({
        name: 'deleteTest',
        version: '1.0.0',
        code: 'export default function() {}',
      })

      const deleted = await deleteFunction(func.id)
      expect(deleted).toBe(true)

      const retrieved = await getFunction(func.id)
      expect(retrieved).toBeUndefined()
    })

    it('should return false for non-existent function', async () => {
      const result = await deleteFunction('non-existent-id')
      expect(result).toBe(false)
    })
  })

  describe('executeFunction', () => {
    it('should execute a function', async () => {
      const func = await registerFunction({
        name: 'execTest',
        version: '1.0.0',
        code: 'export default function(x) { return x * 2 }',
      })

      const result = await executeFunction(func.id, 5)
      expect(result.status).toBe('success')
      expect(result.executionId).toBeDefined()
      expect(result.duration).toBeGreaterThanOrEqual(0)
    })

    it('should return error for non-existent function', async () => {
      const result = await executeFunction('non-existent-id', {})
      expect(result.status).toBe('error')
      expect(result.error).toContain('Function not found')
    })
  })

  describe('searchFunctions', () => {
    it('should search functions by query', async () => {
      await registerFunction({
        name: 'calculator',
        description: 'Calculate sums',
        version: '1.0.0',
        code: 'export default function() {}',
      })

      await registerFunction({
        name: 'greeter',
        description: 'Greet users',
        version: '1.0.0',
        code: 'export default function() {}',
      })

      const results = await searchFunctions({ query: 'calculate' })
      expect(results.total).toBeGreaterThanOrEqual(1)
      expect(results.functions.some((e) => e.function.name === 'calculator')).toBe(true)
    })

    it('should search functions by tags', async () => {
      await registerFunction({
        name: 'mathAdd',
        version: '1.0.0',
        code: 'export default function() {}',
        tags: ['math', 'arithmetic'],
      })

      const results = await searchFunctions({ tags: ['math'] })
      expect(results.total).toBeGreaterThanOrEqual(1)
      expect(results.functions.some((e) => e.function.name === 'mathAdd')).toBe(true)
    })

    it('should paginate results', async () => {
      for (let i = 0; i < 5; i++) {
        await registerFunction({
          name: `paginationTest${i}`,
          version: '1.0.0',
          code: 'export default function() {}',
        })
      }

      const page1 = await searchFunctions({ limit: 2, offset: 0 })
      const page2 = await searchFunctions({ limit: 2, offset: 2 })

      expect(page1.functions.length).toBeLessThanOrEqual(2)
      expect(page2.functions.length).toBeLessThanOrEqual(2)
    })
  })
})
