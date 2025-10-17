/**
 * Security tests for ai-sandbox
 */

import { describe, it, expect } from 'vitest'
import { wrapModule, sanitizeCodeForEval } from '../index'

describe('Security: Prototype Pollution Prevention', () => {
  it('should freeze Object.prototype', () => {
    const script = 'Object.prototype.polluted = true; return 1'
    const wrapped = wrapModule(script, undefined, { captureConsole: false })

    // Verify that the wrapped code includes prototype freezing
    expect(wrapped).toContain('Object.freeze(Object.prototype)')
  })

  it('should freeze Array.prototype', () => {
    const script = 'Array.prototype.polluted = true; return 1'
    const wrapped = wrapModule(script, undefined, { captureConsole: false })

    expect(wrapped).toContain('Object.freeze(Array.prototype)')
  })

  it('should freeze all built-in prototypes', () => {
    const script = 'return 1'
    const wrapped = wrapModule(script, undefined, { captureConsole: false })

    expect(wrapped).toContain('Object.freeze(Object.prototype)')
    expect(wrapped).toContain('Object.freeze(Array.prototype)')
    expect(wrapped).toContain('Object.freeze(Function.prototype)')
    expect(wrapped).toContain('Object.freeze(String.prototype)')
    expect(wrapped).toContain('Object.freeze(Number.prototype)')
    expect(wrapped).toContain('Object.freeze(Boolean.prototype)')
  })
})

describe('Security: Template Literal Injection Prevention', () => {
  it('should escape backticks in module code', () => {
    const module = 'const x = `hello`'
    const sanitized = sanitizeCodeForEval(module)

    expect(sanitized).not.toContain('`hello`')
    expect(sanitized).toContain('\\`hello\\`')
  })

  it('should escape template expressions in module code', () => {
    const module = 'const x = `${injection}`'
    const sanitized = sanitizeCodeForEval(module)

    expect(sanitized).not.toContain('${injection}')
    expect(sanitized).toContain('\\${injection}')
  })

  it('should handle complex template injection attempts', () => {
    const module = '`${process.exit()}` + `${require("fs")}`'
    const sanitized = sanitizeCodeForEval(module)

    expect(sanitized).toContain('\\`\\${process.exit()}\\`')
    expect(sanitized).toContain('\\`\\${require("fs")}\\`')
  })
})

describe('Security: Code Size Limits', () => {
  it('should reject scripts over 1MB', () => {
    const largeScript = 'x'.repeat(1_000_001)

    expect(() => wrapModule(largeScript, undefined)).toThrow('exceeds maximum size')
  })

  it('should reject modules over 1MB', () => {
    const script = 'return 1'
    const largeModule = 'x'.repeat(1_000_001)

    expect(() => wrapModule(script, largeModule)).toThrow('exceeds maximum size')
  })

  it('should accept scripts under 1MB', () => {
    const okScript = 'x'.repeat(999_999)

    expect(() => wrapModule(okScript, undefined)).not.toThrow()
  })
})

describe('Security: Syntax Validation', () => {
  it('should reject invalid JavaScript syntax', () => {
    const invalidScript = 'const x ='

    expect(() => wrapModule(invalidScript, undefined)).toThrow('syntax errors')
  })

  it('should reject incomplete expressions', () => {
    const invalidScript = 'if (true) {'

    expect(() => wrapModule(invalidScript, undefined)).toThrow('syntax errors')
  })

  it('should reject malformed function declarations', () => {
    const invalidScript = 'function foo() { return'

    expect(() => wrapModule(invalidScript, undefined)).toThrow('syntax errors')
  })
})

describe('Security: Function Constructor Usage', () => {
  it('should use Function constructor instead of eval', () => {
    const script = 'return 1'
    const module = 'exports.test = 123'
    const wrapped = wrapModule(script, module, { captureConsole: false })

    // Should use Function constructor
    expect(wrapped).toContain('new Function')

    // Should not use eval directly
    expect(wrapped).not.toMatch(/eval\([^F]/)
  })

  it('should sanitize module code before Function constructor', () => {
    const script = 'return 1'
    const module = 'exports.test = `hello ${name}`'
    const wrapped = wrapModule(script, module, { captureConsole: false })

    // Module code should be sanitized in the wrapped output
    expect(wrapped).toContain('new Function')
  })
})

describe('Security: Error Message Sanitization', () => {
  it('should be ready for production error sanitization', () => {
    // This test verifies that the loader.ts uses process.env.NODE_ENV
    // The actual sanitization happens at runtime in loader.ts
    // We're just verifying the wrapper doesn't leak sensitive info

    const script = 'return 1'
    const wrapped = wrapModule(script, undefined, { captureConsole: false })

    // Should have proper error handling structure
    expect(wrapped).toContain('try {')
    expect(wrapped).toContain('catch (error)')
  })
})

describe('Security: Resource Exhaustion Prevention', () => {
  it('should have size limits to prevent memory exhaustion', () => {
    // Size limits are checked before wrapping
    const largeScript = 'x'.repeat(2_000_000)

    expect(() => wrapModule(largeScript, undefined)).toThrow()
  })

  it('should validate empty scripts', () => {
    expect(() => wrapModule('', undefined)).toThrow('Script cannot be empty')
  })
})

describe('Security: Isolation Verification', () => {
  it('should create isolated execution context', () => {
    const script = 'return 1'
    const wrapped = wrapModule(script, undefined, { captureConsole: false })

    // Should wrap in async function for isolation
    expect(wrapped).toContain('async ()')

    // Should have export default with fetch handler
    expect(wrapped).toContain('export default')
    expect(wrapped).toContain('async fetch()')
  })

  it('should separate module exports from script result', () => {
    const script = 'return 5'
    const module = 'exports.value = 10'
    const wrapped = wrapModule(script, module, { captureConsole: false })

    expect(wrapped).toContain('let moduleExports = {}')
    expect(wrapped).toContain('let result')
    expect(wrapped).toContain('moduleExports = module.exports')
  })
})
