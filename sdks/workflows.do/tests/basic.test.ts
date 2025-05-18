import { describe, it, expect } from 'vitest'
import { ai, db, every, on, AI, DB } from '../src'

describe('workflows.do exports', () => {
  it('ai should exist', () => {
    expect(ai).toBeDefined()
  })

  it('db should exist', () => {
    expect(db).toBeDefined()
  })

  it('every returns schedule object', () => {
    const fn = () => {}
    const result = every('hour', fn)
    expect(result).toEqual({ schedule: 'hour', fn })
  })

  it('on returns event handler object', () => {
    const fn = () => {}
    const result = on('test', fn)
    expect(result).toEqual({ event: 'test', fn })
  })

  it('AI returns schema', () => {
    const schema = { test: 'value' }
    expect(AI(schema)).toEqual(schema)
  })

  it('DB returns models', () => {
    const models = { items: {} }
    expect(DB(models)).toEqual(models)
  })
})
