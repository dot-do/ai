/**
 * Tests for graphdl semantic proxy ($)
 * Run: pnpm test
 */

import { describe, it, expect } from 'vitest'
import $ from '../index'

describe('$ semantic proxy', () => {
  it('should create simple path', () => {
    const result = $.Person
    expect(result.path).toBe('$.Person')
    expect(String(result)).toBe('$.Person')
  })

  it('should create Subject.predicate.Object pattern', () => {
    const pattern = $.Order.created.Customer
    expect(pattern.path).toBe('$.Order.created.Customer')
    expect(String(pattern)).toBe('$.Order.created.Customer')
  })

  it('should support chained properties', () => {
    const pattern = $.Business.owns.Brand
    expect(pattern.path).toBe('$.Business.owns.Brand')
  })

  it('should support deeply nested paths', () => {
    const pattern = $.Person.worksFor.Organization.locatedIn.City
    expect(pattern.path).toBe('$.Person.worksFor.Organization.locatedIn.City')
  })

  it('should support valueOf()', () => {
    const pattern = $.Product.hasPrice.Amount
    expect(pattern.valueOf()).toBe('$.Product.hasPrice.Amount')
  })

  it('should support toString()', () => {
    const pattern = $.Shipment.inTransit.Container
    expect(pattern.toString()).toBe('$.Shipment.inTransit.Container')
  })

  it('should handle arbitrary property names', () => {
    const pattern = $.MyCustomEntity.hasRelation.AnotherEntity
    expect(pattern.path).toBe('$.MyCustomEntity.hasRelation.AnotherEntity')
  })

  it('should support numeric properties', () => {
    const pattern = $.Entity['123'].property
    expect(pattern.path).toBe('$.Entity.123.property')
  })

  it('should create different instances for different paths', () => {
    const path1 = $.Person.hasSkill.TypeScript
    const path2 = $.Person.hasSkill.JavaScript
    expect(String(path1)).not.toBe(String(path2))
    expect(String(path1)).toBe('$.Person.hasSkill.TypeScript')
    expect(String(path2)).toBe('$.Person.hasSkill.JavaScript')
  })

  it('should support template literal conversion', () => {
    const pattern = $.User.follows.User
    expect(`${pattern}`).toBe('$.User.follows.User')
  })

  it('should handle Symbol.toStringTag introspection', () => {
    const pattern = $.Test.pattern.Example
    // TypeScript's Object.prototype.toString calls Symbol.toStringTag
    expect(typeof pattern).toBe('object')
  })

  it('should return undefined for symbol properties', () => {
    const pattern = $.Test.pattern.Example as any
    const symbolProp = pattern[Symbol.iterator]
    expect(symbolProp).toBeUndefined()
  })

  it('should create proxy for each property access', () => {
    const base = $.Product
    const withPredicate = base.hasCategory
    const withObject = withPredicate.Electronics

    expect(String(base)).toBe('$.Product')
    expect(String(withPredicate)).toBe('$.Product.hasCategory')
    expect(String(withObject)).toBe('$.Product.hasCategory.Electronics')
  })

  it('should support Schema.org patterns', () => {
    const pattern = $.Person.worksFor.Organization
    expect(String(pattern)).toBe('$.Person.worksFor.Organization')
  })

  it('should support GS1/EPCIS patterns', () => {
    const pattern = $.Product.locatedAt.Warehouse
    expect(String(pattern)).toBe('$.Product.locatedAt.Warehouse')
  })

  it('should support O*NET patterns', () => {
    const pattern = $.Person.hasOccupation.SoftwareDeveloper
    expect(String(pattern)).toBe('$.Person.hasOccupation.SoftwareDeveloper')
  })

  it('should work in template literals', () => {
    const entity = 'Order'
    const predicate = 'created'
    const object = 'Customer'
    const pattern = $[entity][predicate][object]
    expect(String(pattern)).toBe('$.Order.created.Customer')
  })
})
