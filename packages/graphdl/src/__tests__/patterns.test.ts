/**
 * Tests for $.Subject.predicate.Object patterns
 * Run: pnpm test
 */

import { describe, it, expect } from 'vitest'
import $ from '../index'

describe('$.Subject.predicate.Object patterns', () => {
  describe('Business patterns', () => {
    it('should support Order patterns', () => {
      expect(String($.Order.created.Customer)).toBe('$.Order.created.Customer')
      expect(String($.Order.contains.Product)).toBe('$.Order.contains.Product')
      expect(String($.Order.shipped.Warehouse)).toBe('$.Order.shipped.Warehouse')
    })

    it('should support Organization patterns', () => {
      expect(String($.Organization.employs.Person)).toBe('$.Organization.employs.Person')
      expect(String($.Organization.offers.Product)).toBe('$.Organization.offers.Product')
      expect(String($.Organization.locatedIn.Place)).toBe('$.Organization.locatedIn.Place')
    })

    it('should support Product patterns', () => {
      expect(String($.Product.belongsTo.Category)).toBe('$.Product.belongsTo.Category')
      expect(String($.Product.manufacturedBy.Organization)).toBe('$.Product.manufacturedBy.Organization')
      expect(String($.Product.hasPrice.Offer)).toBe('$.Product.hasPrice.Offer')
    })
  })

  describe('Supply chain patterns', () => {
    it('should support Shipment patterns', () => {
      expect(String($.Shipment.contains.Product)).toBe('$.Shipment.contains.Product')
      expect(String($.Shipment.from.Location)).toBe('$.Shipment.from.Location')
      expect(String($.Shipment.to.Location)).toBe('$.Shipment.to.Location')
    })

    it('should support Location patterns', () => {
      expect(String($.Location.stores.Product)).toBe('$.Location.stores.Product')
      expect(String($.Location.partOf.Region)).toBe('$.Location.partOf.Region')
    })
  })

  describe('People patterns', () => {
    it('should support Person patterns', () => {
      expect(String($.Person.worksFor.Organization)).toBe('$.Person.worksFor.Organization')
      expect(String($.Person.hasSkill.Skill)).toBe('$.Person.hasSkill.Skill')
      expect(String($.Person.knows.Person)).toBe('$.Person.knows.Person')
    })

    it('should support occupation patterns', () => {
      expect(String($.Person.hasOccupation.SoftwareDeveloper)).toBe('$.Person.hasOccupation.SoftwareDeveloper')
      expect(String($.Person.hasOccupation.DataScientist)).toBe('$.Person.hasOccupation.DataScientist')
    })
  })

  describe('Event patterns', () => {
    it('should support event lifecycle', () => {
      expect(String($.Event.occurred.Time)).toBe('$.Event.occurred.Time')
      expect(String($.Event.involves.Agent)).toBe('$.Event.involves.Agent')
      expect(String($.Event.affects.Object)).toBe('$.Event.affects.Object')
    })

    it('should support workflow events', () => {
      expect(String($.Workflow.triggered.Event)).toBe('$.Workflow.triggered.Event')
      expect(String($.Workflow.executes.Action)).toBe('$.Workflow.executes.Action')
      expect(String($.Workflow.produces.Result)).toBe('$.Workflow.produces.Result')
    })
  })

  describe('Complex nested patterns', () => {
    it('should support multi-level relationships', () => {
      const pattern = $.Person.worksFor.Organization.locatedIn.City.inCountry.Country
      expect(String(pattern)).toBe('$.Person.worksFor.Organization.locatedIn.City.inCountry.Country')
    })

    it('should support branching patterns', () => {
      const base = $.Order
      const customer = base.belongsTo.Customer
      const product = base.contains.Product

      expect(String(customer)).toBe('$.Order.belongsTo.Customer')
      expect(String(product)).toBe('$.Order.contains.Product')
    })
  })

  describe('Custom domain patterns', () => {
    it('should support arbitrary domain entities', () => {
      expect(String($.Invoice.issuedTo.Client)).toBe('$.Invoice.issuedTo.Client')
      expect(String($.Contract.signedBy.Party)).toBe('$.Contract.signedBy.Party')
      expect(String($.Project.managedBy.Manager)).toBe('$.Project.managedBy.Manager')
    })

    it('should support custom predicates', () => {
      expect(String($.Asset.acquiredOn.Date)).toBe('$.Asset.acquiredOn.Date')
      expect(String($.Report.generatedFrom.Data)).toBe('$.Report.generatedFrom.Data')
    })
  })

  describe('Pattern comparisons', () => {
    it('should create equivalent patterns', () => {
      const pattern1 = $.User.follows.User
      const pattern2 = $.User.follows.User

      expect(String(pattern1)).toBe(String(pattern2))
      expect(pattern1.path).toBe(pattern2.path)
    })

    it('should distinguish different patterns', () => {
      const pattern1 = $.User.follows.User
      const pattern2 = $.User.blocks.User

      expect(String(pattern1)).not.toBe(String(pattern2))
      expect(pattern1.path).not.toBe(pattern2.path)
    })
  })

  describe('Edge cases', () => {
    it('should handle single property access', () => {
      expect(String($.Entity)).toBe('$.Entity')
    })

    it('should handle two-part paths', () => {
      expect(String($.Entity.property)).toBe('$.Entity.property')
    })

    it('should handle empty string properties gracefully', () => {
      const pattern = $['']['']
      expect(String(pattern)).toBe('$..')
    })

    it('should handle special characters in property names', () => {
      const pattern = $['Order-123']['created-by']['User-456']
      expect(String(pattern)).toBe('$.Order-123.created-by.User-456')
    })
  })

  describe('Type semantics', () => {
    it('should differentiate between Subject and Object of same type', () => {
      const follows = $.Person.follows.Person
      const followedBy = $.Person.followedBy.Person

      expect(String(follows)).toBe('$.Person.follows.Person')
      expect(String(followedBy)).toBe('$.Person.followedBy.Person')
      expect(String(follows)).not.toBe(String(followedBy))
    })

    it('should support reflexive relationships', () => {
      expect(String($.Thing.relatesTo.Thing)).toBe('$.Thing.relatesTo.Thing')
      expect(String($.Concept.extends.Concept)).toBe('$.Concept.extends.Concept')
    })
  })
})
