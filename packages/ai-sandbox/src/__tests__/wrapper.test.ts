/**
 * Tests for wrapper utilities
 */

import { describe, it, expect } from 'vitest'
import { wrapModule, wrapCode, createSDKGlobals } from '../index'

describe('wrapModule', () => {
  it('should wrap simple script with auto-return', () => {
    const script = '5 + 5'
    const wrapped = wrapModule(script, undefined, { captureConsole: false })

    expect(wrapped).toContain('return (5 + 5)')
    expect(wrapped).toContain('async ()')
    expect(wrapped).toContain('Object.freeze(Object.prototype)')
  })

  it('should not auto-return if script has return', () => {
    const script = 'return 5 + 5'
    const wrapped = wrapModule(script, undefined, { captureConsole: false })

    expect(wrapped).toContain('return 5 + 5')
    expect(wrapped).not.toContain('return (return')
  })

  it('should include console capture when enabled', () => {
    const script = '5 + 5'
    const wrapped = wrapModule(script, undefined, { captureConsole: true })

    expect(wrapped).toContain('const consoleLogs = []')
    expect(wrapped).toContain('console.log = (...args) =>')
    expect(wrapped).toContain('console.error = (...args) =>')
    expect(wrapped).toContain('console.warn = (...args) =>')
    expect(wrapped).toContain('console.info = (...args) =>')
    expect(wrapped).toContain('console.debug = (...args) =>')
  })

  it('should not include console capture when disabled', () => {
    const script = '5 + 5'
    const wrapped = wrapModule(script, undefined, { captureConsole: false })

    expect(wrapped).not.toContain('consoleLogs')
  })

  it('should include module code execution', () => {
    const script = '5 + 5'
    const module = 'exports.test = 123'
    const wrapped = wrapModule(script, module, { captureConsole: false })

    expect(wrapped).toContain('const module = { exports: {} }')
    expect(wrapped).toContain('new Function')
    expect(wrapped).toContain('moduleExports = module.exports')
  })

  it('should inject SDK globals', () => {
    const script = 'ai.generate()'
    const sdkGlobals = 'const ai = createProxy()'
    const wrapped = wrapModule(script, undefined, {
      captureConsole: false,
      sdkGlobals,
    })

    expect(wrapped).toContain('const ai = createProxy()')
  })

  it('should freeze prototypes', () => {
    const script = '5 + 5'
    const wrapped = wrapModule(script, undefined, { captureConsole: false })

    expect(wrapped).toContain('Object.freeze(Object.prototype)')
    expect(wrapped).toContain('Object.freeze(Array.prototype)')
    expect(wrapped).toContain('Object.freeze(Function.prototype)')
    expect(wrapped).toContain('Object.freeze(String.prototype)')
    expect(wrapped).toContain('Object.freeze(Number.prototype)')
    expect(wrapped).toContain('Object.freeze(Boolean.prototype)')
  })

  it('should throw on invalid script', () => {
    expect(() => wrapModule('', undefined)).toThrow('Script cannot be empty')
    expect(() => wrapModule('const x =', undefined)).toThrow('syntax errors')
  })
})

describe('wrapCode', () => {
  it('should wrap simple code', () => {
    const code = 'return 5 + 5'
    const wrapped = wrapCode(code, false)

    expect(wrapped).toContain('(function() {')
    expect(wrapped).toContain('return 5 + 5')
    expect(wrapped).toContain('Response.json')
  })

  it('should include console capture when enabled', () => {
    const code = 'return 5'
    const wrapped = wrapCode(code, true)

    expect(wrapped).toContain('const consoleLogs = []')
    expect(wrapped).toContain('console.log = (...args) =>')
  })

  it('should throw on invalid code', () => {
    expect(() => wrapCode('')).toThrow('Script cannot be empty')
  })
})

describe('createSDKGlobals', () => {
  it('should create empty globals when no bindings', () => {
    const globals = createSDKGlobals()

    expect(globals).toContain('createServiceProxy')
    expect(globals).toContain('globalThis.$')
  })

  it('should create service proxies for bindings', () => {
    const bindings = {
      AI_SERVICE: {} as Fetcher,
      API_SERVICE: {} as Fetcher,
    }
    const globals = createSDKGlobals(bindings)

    expect(globals).toContain('AI_SERVICE')
    expect(globals).toContain('API_SERVICE')
    expect(globals).toContain('globalThis.ai_service')
    expect(globals).toContain('globalThis.api_service')
    expect(globals).toContain('createServiceProxy(AI_SERVICE')
    expect(globals).toContain('createServiceProxy(API_SERVICE')
  })

  it('should add services to global $ object', () => {
    const bindings = {
      AI_SERVICE: {} as Fetcher,
    }
    const globals = createSDKGlobals(bindings)

    expect(globals).toContain('globalThis.$ = {')
    expect(globals).toContain('ai_service: globalThis.ai_service')
  })

  it('should check for null bindings', () => {
    const bindings = {
      AI_SERVICE: {} as Fetcher,
    }
    const globals = createSDKGlobals(bindings)

    expect(globals).toContain("typeof AI_SERVICE !== 'undefined' && AI_SERVICE !== null")
  })
})
