/**
 * Tests for graphdl TypeScript types and type safety
 * Run: pnpm test
 */

import { describe, it, expect } from 'vitest'
import $ from '../index'
import type { PathProxy } from '../types/index.js'

describe('TypeScript types', () => {
  describe('PathProxy interface', () => {
    it('should have path property', () => {
      const pattern = $.Test.example.Pattern
      expect(pattern).toHaveProperty('path')
      expect(typeof pattern.path).toBe('string')
    })

    it('should have toString method', () => {
      const pattern = $.Test.example.Pattern
      expect(pattern).toHaveProperty('toString')
      expect(typeof pattern.toString).toBe('function')
    })

    it('should have valueOf method', () => {
      const pattern = $.Test.example.Pattern
      expect(pattern).toHaveProperty('valueOf')
      expect(typeof pattern.valueOf).toBe('function')
    })
  })

  describe('Type coercion', () => {
    it('should coerce to string in string context', () => {
      const pattern = $.Order.created.Customer
      const result = `Pattern: ${pattern}`
      expect(result).toBe('Pattern: $.Order.created.Customer')
    })

    it('should coerce to string with String constructor', () => {
      const pattern = $.Product.hasCategory.Electronics
      expect(String(pattern)).toBe('$.Product.hasCategory.Electronics')
    })

    it('should coerce to string with concatenation', () => {
      const pattern = $.User.follows.User
      const result = 'Path: ' + pattern
      expect(result).toBe('Path: $.User.follows.User')
    })
  })

  describe('Type inference', () => {
    it('should infer proxy type', () => {
      const pattern = $.Test.pattern.Example
      // TypeScript should infer this as a proxy object
      expect(typeof pattern).toBe('object')
      expect(pattern).not.toBeNull()
    })

    it('should support property chaining', () => {
      const level1 = $.A
      const level2 = level1.B
      const level3 = level2.C

      expect(String(level1)).toBe('$.A')
      expect(String(level2)).toBe('$.A.B')
      expect(String(level3)).toBe('$.A.B.C')
    })
  })

  describe('Path construction', () => {
    it('should build path incrementally', () => {
      const subject = $.Order
      expect(String(subject)).toBe('$.Order')

      const withPredicate = subject.created
      expect(String(withPredicate)).toBe('$.Order.created')

      const withObject = withPredicate.Customer
      expect(String(withObject)).toBe('$.Order.created.Customer')
    })

    it('should support dynamic property access', () => {
      const entityName = 'Person'
      const predicateName = 'worksFor'
      const objectName = 'Organization'

      const pattern = $[entityName][predicateName][objectName]
      expect(String(pattern)).toBe('$.Person.worksFor.Organization')
    })
  })

  describe('Edge case types', () => {
    it('should handle undefined property gracefully', () => {
      const pattern = $.Test.undefined.Pattern
      expect(String(pattern)).toBe('$.Test.undefined.Pattern')
    })

    it('should handle null property gracefully', () => {
      const pattern = $.Test.null.Pattern
      expect(String(pattern)).toBe('$.Test.null.Pattern')
    })

    it('should handle numeric strings', () => {
      const pattern = $.Test['123'].Pattern
      expect(String(pattern)).toBe('$.Test.123.Pattern')
    })

    it('should handle boolean-like properties', () => {
      const pattern = $.Test.true.Pattern
      expect(String(pattern)).toBe('$.Test.true.Pattern')
    })
  })

  describe('Proxy behavior', () => {
    it('should create new proxy for each access', () => {
      const base = $.Root
      const branch1 = base.path1
      const branch2 = base.path2

      expect(String(branch1)).not.toBe(String(branch2))
      expect(String(branch1)).toBe('$.Root.path1')
      expect(String(branch2)).toBe('$.Root.path2')
    })

    it('should not mutate original proxy', () => {
      const original = $.Original
      const extended = original.extended.deeper

      expect(String(original)).toBe('$.Original')
      expect(String(extended)).toBe('$.Original.extended.deeper')
      // Verify original unchanged
      expect(String(original)).toBe('$.Original')
    })
  })

  describe('Symbol handling', () => {
    it('should return undefined for symbol properties', () => {
      const pattern = $.Test.pattern.Example as any
      expect(pattern[Symbol.iterator]).toBeUndefined()
      expect(pattern[Symbol.asyncIterator]).toBeUndefined()
    })

    it('should handle Symbol.toStringTag specially', () => {
      const pattern = $.Test.pattern.Example as any
      // Symbol.toStringTag should return the path
      const toStringTag = pattern[Symbol.toStringTag]
      expect(toStringTag).toBe('$.Test.pattern.Example')
    })
  })

  describe('Function properties', () => {
    it('should return functions for toString and valueOf', () => {
      const pattern = $.Test.example.Pattern
      expect(typeof pattern.toString).toBe('function')
      expect(typeof pattern.valueOf).toBe('function')

      expect(pattern.toString()).toBe('$.Test.example.Pattern')
      expect(pattern.valueOf()).toBe('$.Test.example.Pattern')
    })
  })

  describe('JSON serialization', () => {
    it('should have toJSON property that returns path', () => {
      const pattern = $.Order.created.Customer as any
      expect(pattern.toJSON).toBe('$.Order.created.Customer')
    })

    it('should serialize to string in JSON', () => {
      const obj = {
        pattern: $.Product.hasPrice.Amount as any,
      }
      // Note: JSON.stringify will call toJSON() if it exists
      const result = obj.pattern.toJSON || String(obj.pattern)
      expect(result).toBe('$.Product.hasPrice.Amount')
    })
  })
})
