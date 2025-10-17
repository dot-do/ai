/**
 * Tests for validation utilities
 */

import { describe, it, expect } from 'vitest'
import { validateScript, validateModule, sanitizeCodeForEval, hasTopLevelReturn, SandboxValidationError } from '../index'

describe('validateScript', () => {
  it('should reject empty scripts', () => {
    expect(() => validateScript('')).toThrow(SandboxValidationError)
    expect(() => validateScript('')).toThrow('Script cannot be empty')
  })

  it('should reject oversized scripts', () => {
    const large = 'x'.repeat(1_000_001)
    expect(() => validateScript(large)).toThrow(SandboxValidationError)
    expect(() => validateScript(large)).toThrow('exceeds maximum size')
  })

  it('should reject invalid syntax', () => {
    expect(() => validateScript('const x =')).toThrow(SandboxValidationError)
    expect(() => validateScript('const x =')).toThrow('syntax errors')
  })

  it('should accept valid scripts', () => {
    expect(() => validateScript('console.log("hi")')).not.toThrow()
    expect(() => validateScript('const x = 5; return x * 2')).not.toThrow()
    expect(() => validateScript('async () => { await fetch() }')).not.toThrow()
  })
})

describe('validateModule', () => {
  it('should accept undefined modules', () => {
    expect(() => validateModule(undefined)).not.toThrow()
  })

  it('should reject oversized modules', () => {
    const large = 'x'.repeat(1_000_001)
    expect(() => validateModule(large)).toThrow(SandboxValidationError)
    expect(() => validateModule(large)).toThrow('exceeds maximum size')
  })

  it('should reject invalid syntax', () => {
    expect(() => validateModule('function foo() {')).toThrow(SandboxValidationError)
    expect(() => validateModule('function foo() {')).toThrow('syntax errors')
  })

  it('should accept valid modules', () => {
    expect(() => validateModule('module.exports = { foo: "bar" }')).not.toThrow()
    expect(() => validateModule('exports.test = () => 123')).not.toThrow()
  })
})

describe('sanitizeCodeForEval', () => {
  it('should escape backticks', () => {
    const input = 'const x = `hello`'
    const output = sanitizeCodeForEval(input)
    expect(output).toBe('const x = \\`hello\\`')
  })

  it('should escape template expressions', () => {
    const input = 'const x = `hello ${name}`'
    const output = sanitizeCodeForEval(input)
    expect(output).toBe('const x = \\`hello \\${name}\\`')
  })

  it('should handle multiple occurrences', () => {
    const input = '`foo` ${x} `bar` ${y}'
    const output = sanitizeCodeForEval(input)
    expect(output).toBe('\\`foo\\` \\${x} \\`bar\\` \\${y}')
  })

  it('should handle code without special characters', () => {
    const input = 'const x = "hello"'
    const output = sanitizeCodeForEval(input)
    expect(output).toBe(input)
  })
})

describe('hasTopLevelReturn', () => {
  it('should detect top-level return statements', () => {
    expect(hasTopLevelReturn('return 5')).toBe(true)
    expect(hasTopLevelReturn('const x = 5; return x')).toBe(true)
    expect(hasTopLevelReturn('if (true) { return 5 }')).toBe(true)
  })

  it('should not detect return in nested functions', () => {
    expect(hasTopLevelReturn('function foo() { return 5 }')).toBe(false)
    expect(hasTopLevelReturn('const bar = () => { return 10 }')).toBe(false)
    expect(hasTopLevelReturn('() => 5')).toBe(false)
  })

  it('should ignore return in comments', () => {
    expect(hasTopLevelReturn('// return 5')).toBe(false)
    expect(hasTopLevelReturn('/* return 5 */')).toBe(false)
    expect(hasTopLevelReturn('const x = 5 // return x')).toBe(false)
  })

  it('should ignore return in strings', () => {
    expect(hasTopLevelReturn('"return 5"')).toBe(false)
    expect(hasTopLevelReturn("'return 5'")).toBe(false)
    expect(hasTopLevelReturn('`return 5`')).toBe(false)
  })

  it('should handle complex code', () => {
    const code = `
      const helper = () => {
        return 'nested'
      }
      const x = helper()
      return x + ' result'
    `
    expect(hasTopLevelReturn(code)).toBe(true)
  })
})
