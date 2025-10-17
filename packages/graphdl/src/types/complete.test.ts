/**
 * Tests for Complete Type Definitions
 */

import { describe, it, expect } from 'vitest'
import $ from '../index.js'
import {
  isSchemaEntity,
  isEPCISEntity,
  isOnetEntity,
  isNAICSEntity,
  isAPQCEntity,
  isEDIEntity,
  isZapierEntity,
  type SchemaEntity,
  type EPCISEntity,
  type OnetEntity,
  type NAICSEntity,
  type APQCEntity,
  type EDIEntity,
  type ZapierEntity,
  type EntityType,
} from './complete.js'

describe('Schema.org Entity Type Guards', () => {
  it('should correctly identify Schema.org entities', () => {
    expect(isSchemaEntity('Person')).toBe(true)
    expect(isSchemaEntity('Organization')).toBe(true)
    expect(isSchemaEntity('Product')).toBe(true)
    expect(isSchemaEntity('Article')).toBe(true)
    expect(isSchemaEntity('Book')).toBe(true)
    expect(isSchemaEntity('Restaurant')).toBe(true)
    expect(isSchemaEntity('Vehicle')).toBe(true)
  })

  it('should reject non-Schema.org entities', () => {
    expect(isSchemaEntity('Shipment')).toBe(false)
    expect(isSchemaEntity('Unknown')).toBe(false)
    expect(isSchemaEntity('')).toBe(false)
  })

  it('should include all Schema.org entity types', () => {
    const schemaEntities: SchemaEntity[] = [
      'Thing',
      'Action',
      'Person',
      'Organization',
      'Place',
      'Event',
      'Product',
      'Offer',
      'CreativeWork',
      'MediaObject',
      'Article',
      'BlogPosting',
      'Book',
      'Course',
      'Dataset',
      'HowTo',
      'ImageObject',
      'Movie',
      'MusicRecording',
      'Recipe',
      'SoftwareApplication',
      'VideoObject',
      'WebPage',
      'WebSite',
      'Intangible',
      'BrandName',
      'JobPosting',
      'Occupation',
      'Service',
      'Review',
      'Rating',
      'ContactPoint',
      'PostalAddress',
      'GeoCoordinates',
      'LocalBusiness',
      'Restaurant',
      'Store',
      'MedicalEntity',
      'Vehicle',
    ]

    schemaEntities.forEach((entity) => {
      expect(isSchemaEntity(entity)).toBe(true)
    })
  })
})

describe('EPCIS Entity Type Guards', () => {
  it('should correctly identify EPCIS entities', () => {
    expect(isEPCISEntity('Shipment')).toBe(true)
    expect(isEPCISEntity('Container')).toBe(true)
    expect(isEPCISEntity('Warehouse')).toBe(true)
    expect(isEPCISEntity('Batch')).toBe(true)
    expect(isEPCISEntity('Invoice')).toBe(true)
  })

  it('should reject non-EPCIS entities', () => {
    expect(isEPCISEntity('Person')).toBe(false)
    expect(isEPCISEntity('Unknown')).toBe(false)
  })

  it('should include all EPCIS entity types', () => {
    const epcisEntities: EPCISEntity[] = [
      'Product',
      'Shipment',
      'Container',
      'Pallet',
      'Case',
      'Item',
      'Batch',
      'Lot',
      'SerialNumber',
      'Location',
      'Warehouse',
      'Store',
      'Factory',
      'DistributionCenter',
      'Party',
      'Organization',
      'Supplier',
      'Manufacturer',
      'Retailer',
      'Carrier',
      'Event',
      'Transaction',
      'Invoice',
      'PurchaseOrder',
      'Receipt',
      'BillOfLading',
    ]

    epcisEntities.forEach((entity) => {
      expect(isEPCISEntity(entity)).toBe(true)
    })
  })
})

describe('O*NET Entity Type Guards', () => {
  it('should correctly identify O*NET entities', () => {
    expect(isOnetEntity('Occupation')).toBe(true)
    expect(isOnetEntity('Skill')).toBe(true)
    expect(isOnetEntity('Knowledge')).toBe(true)
    expect(isOnetEntity('WorkActivity')).toBe(true)
  })

  it('should reject non-O*NET entities', () => {
    expect(isOnetEntity('Person')).toBe(false)
    expect(isOnetEntity('Unknown')).toBe(false)
  })

  it('should include all O*NET entity types', () => {
    const onetEntities: OnetEntity[] = [
      'Occupation',
      'Ability',
      'Skill',
      'Knowledge',
      'Task',
      'WorkActivity',
      'WorkContext',
      'WorkValue',
      'WorkStyle',
      'Interest',
      'Tool',
      'Technology',
      'Education',
      'Experience',
      'Training',
      'JobZone',
      'Industry',
      'Career',
    ]

    onetEntities.forEach((entity) => {
      expect(isOnetEntity(entity)).toBe(true)
    })
  })
})

describe('NAICS Entity Type Guards', () => {
  it('should correctly identify NAICS entities', () => {
    expect(isNAICSEntity('Manufacturing')).toBe(true)
    expect(isNAICSEntity('Healthcare')).toBe(true)
    expect(isNAICSEntity('Construction')).toBe(true)
  })

  it('should reject non-NAICS entities', () => {
    expect(isNAICSEntity('Person')).toBe(false)
    expect(isNAICSEntity('Unknown')).toBe(false)
  })

  it('should include all NAICS entity types', () => {
    const naicsEntities: NAICSEntity[] = [
      'Agriculture',
      'Mining',
      'Utilities',
      'Construction',
      'Manufacturing',
      'Wholesale',
      'Retail',
      'Transportation',
      'Information',
      'Finance',
      'RealEstate',
      'Professional',
      'Management',
      'Administrative',
      'Educational',
      'Healthcare',
      'Arts',
      'Accommodation',
      'OtherServices',
      'PublicAdministration',
      'IndustryClassification',
    ]

    naicsEntities.forEach((entity) => {
      expect(isNAICSEntity(entity)).toBe(true)
    })
  })
})

describe('APQC Entity Type Guards', () => {
  it('should correctly identify APQC entities', () => {
    expect(isAPQCEntity('DevelopProduct')).toBe(true)
    expect(isAPQCEntity('MarketProduct')).toBe(true)
    expect(isAPQCEntity('ManageCustomer')).toBe(true)
  })

  it('should reject non-APQC entities', () => {
    expect(isAPQCEntity('Person')).toBe(false)
    expect(isAPQCEntity('Unknown')).toBe(false)
  })

  it('should include all APQC entity types', () => {
    const apqcEntities: APQCEntity[] = [
      'DevelopVision',
      'DevelopProduct',
      'MarketProduct',
      'DeliverProduct',
      'ManageCustomer',
      'DevelopHumanCapital',
      'ManageInformation',
      'ManageFinancial',
      'AcquireAssets',
      'ManageEnterprise',
      'ManageEnvironmental',
      'ManageExternal',
      'ManageKnowledge',
      'BusinessProcess',
    ]

    apqcEntities.forEach((entity) => {
      expect(isAPQCEntity(entity)).toBe(true)
    })
  })
})

describe('EDI Entity Type Guards', () => {
  it('should correctly identify EDI entities', () => {
    expect(isEDIEntity('ORDERS')).toBe(true)
    expect(isEDIEntity('INVOIC')).toBe(true)
    expect(isEDIEntity('DESADV')).toBe(true)
  })

  it('should reject non-EDI entities', () => {
    expect(isEDIEntity('Person')).toBe(false)
    expect(isEDIEntity('Unknown')).toBe(false)
  })

  it('should include all EDI entity types', () => {
    const ediEntities: EDIEntity[] = [
      'ORDERS',
      'ORDCHG',
      'ORDRSP',
      'DESADV',
      'RECADV',
      'INVOIC',
      'REMADV',
      'PRICAT',
      'PRODAT',
      'SLSRPT',
      'INVRPT',
      'PARTIN',
      'QUOTES',
      'REQOTE',
      'APERAK',
      'CONTRL',
      'EDIMessage',
    ]

    ediEntities.forEach((entity) => {
      expect(isEDIEntity(entity)).toBe(true)
    })
  })
})

describe('Zapier Entity Type Guards', () => {
  it('should correctly identify Zapier entities', () => {
    expect(isZapierEntity('Gmail')).toBe(true)
    expect(isZapierEntity('Slack')).toBe(true)
    expect(isZapierEntity('GitHub')).toBe(true)
  })

  it('should reject non-Zapier entities', () => {
    expect(isZapierEntity('Person')).toBe(false)
    expect(isZapierEntity('Unknown')).toBe(false)
  })

  it('should include all Zapier entity types', () => {
    const zapierEntities: ZapierEntity[] = [
      'Gmail',
      'Slack',
      'GoogleSheets',
      'Trello',
      'Asana',
      'Salesforce',
      'HubSpot',
      'Mailchimp',
      'Dropbox',
      'GoogleDrive',
      'Airtable',
      'Notion',
      'GitHub',
      'Shopify',
      'Stripe',
      'Integration',
    ]

    zapierEntities.forEach((entity) => {
      expect(isZapierEntity(entity)).toBe(true)
    })
  })
})

describe('EntityType Union', () => {
  it('should accept entities from any ontology', () => {
    const entities: EntityType[] = [
      'Person', // Schema.org
      'Shipment', // EPCIS
      'Occupation', // O*NET
      'Manufacturing', // NAICS
      'DevelopProduct', // APQC
      'ORDERS', // EDI
      'Gmail', // Zapier
      'CustomEntity', // Custom
    ]

    expect(entities.length).toBe(8)
  })
})

describe('Type Guard Cross-Validation', () => {
  it('should not have false positives across different ontologies', () => {
    // Schema.org entity should not be detected by other guards
    expect(isEPCISEntity('Person')).toBe(false)
    expect(isOnetEntity('Person')).toBe(false)
    expect(isNAICSEntity('Person')).toBe(false)

    // EPCIS entity should not be detected by other guards (except overlaps)
    expect(isSchemaEntity('Shipment')).toBe(false)
    expect(isOnetEntity('Shipment')).toBe(false)

    // O*NET entity should not be detected by other guards (except overlaps)
    expect(isSchemaEntity('Ability')).toBe(false)
    expect(isEPCISEntity('Ability')).toBe(false)
  })

  it('should handle known overlapping entity names correctly', () => {
    // Product exists in both Schema.org and EPCIS
    expect(isSchemaEntity('Product')).toBe(true)
    expect(isEPCISEntity('Product')).toBe(true)

    // Store exists in both Schema.org and EPCIS
    expect(isSchemaEntity('Store')).toBe(true)
    expect(isEPCISEntity('Store')).toBe(true)

    // Organization exists in both Schema.org and EPCIS
    expect(isSchemaEntity('Organization')).toBe(true)
    expect(isEPCISEntity('Organization')).toBe(true)

    // Event exists in both Schema.org and EPCIS
    expect(isSchemaEntity('Event')).toBe(true)
    expect(isEPCISEntity('Event')).toBe(true)

    // Occupation exists in both Schema.org and O*NET
    expect(isSchemaEntity('Occupation')).toBe(true)
    expect(isOnetEntity('Occupation')).toBe(true)
  })
})

describe('$ Proxy Runtime Integration', () => {
  // Import $ dynamically to test runtime behavior
  let $: any

  beforeEach(async () => {
    const module = await import('../index.js')
    $ = module.default
  })

  it('should create semantic paths with Schema.org entities', () => {
    const path1 = $.Person.worksFor.Organization
    const path2 = $.Product.locatedAt.Store
    const path3 = $.Article.author.Person

    expect(String(path1)).toBe('$.Person.worksFor.Organization')
    expect(String(path2)).toBe('$.Product.locatedAt.Store')
    expect(String(path3)).toBe('$.Article.author.Person')
  })

  it('should create semantic paths with EPCIS entities', () => {
    const path1 = $.Shipment.contains.Product
    const path2 = $.Warehouse.stores.Pallet
    const path3 = $.Invoice.relatesTo.PurchaseOrder

    expect(String(path1)).toBe('$.Shipment.contains.Product')
    expect(String(path2)).toBe('$.Warehouse.stores.Pallet')
    expect(String(path3)).toBe('$.Invoice.relatesTo.PurchaseOrder')
  })

  it('should create semantic paths with O*NET entities', () => {
    const path1 = $.Occupation.requires.Skill
    const path2 = $.Task.involves.WorkActivity
    const path3 = $.Education.providesKnowledge.Knowledge

    expect(String(path1)).toBe('$.Occupation.requires.Skill')
    expect(String(path2)).toBe('$.Task.involves.WorkActivity')
    expect(String(path3)).toBe('$.Education.providesKnowledge.Knowledge')
  })

  it('should create semantic paths with NAICS entities', () => {
    const path = $.Manufacturing.operatesIn.Industry

    expect(String(path)).toBe('$.Manufacturing.operatesIn.Industry')
  })

  it('should create semantic paths with APQC entities', () => {
    const path = $.DevelopProduct.partOf.BusinessProcess

    expect(String(path)).toBe('$.DevelopProduct.partOf.BusinessProcess')
  })

  it('should create semantic paths with EDI entities', () => {
    const path = $.ORDERS.generatesDocument.INVOIC

    expect(String(path)).toBe('$.ORDERS.generatesDocument.INVOIC')
  })

  it('should create semantic paths with Zapier entities', () => {
    const path = $.Gmail.sendsTo.Slack

    expect(String(path)).toBe('$.Gmail.sendsTo.Slack')
  })

  it('should support arbitrary predicate chains', () => {
    const path = $.Person.hasOccupation.SoftwareDeveloper.requiresSkill.TypeScript

    expect(String(path)).toBe('$.Person.hasOccupation.SoftwareDeveloper.requiresSkill.TypeScript')
  })

  it('should handle custom entity types', () => {
    const path = $.CustomEntity.customPredicate.AnotherEntity

    expect(String(path)).toBe('$.CustomEntity.customPredicate.AnotherEntity')
  })

  it('should support toString() method', () => {
    const path = $.Person.worksFor.Organization

    expect(path.toString()).toBe('$.Person.worksFor.Organization')
  })

  it('should support valueOf() method', () => {
    const path = $.Person.worksFor.Organization

    expect(path.valueOf()).toBe('$.Person.worksFor.Organization')
  })

  it('should support path property access', () => {
    const path = $.Person.worksFor.Organization

    expect(path.path).toBe('$.Person.worksFor.Organization')
  })

  it('should handle deeply nested paths', () => {
    const path = $.A.b.C.d.E.f.G.h.I

    expect(String(path)).toBe('$.A.b.C.d.E.f.G.h.I')
  })
})

describe('Edge Case Tests', () => {
  describe('Type Guards with Edge Cases', () => {
    it('should reject empty strings', () => {
      expect(isSchemaEntity('')).toBe(false)
      expect(isEPCISEntity('')).toBe(false)
      expect(isOnetEntity('')).toBe(false)
      expect(isNAICSEntity('')).toBe(false)
      expect(isAPQCEntity('')).toBe(false)
      expect(isEDIEntity('')).toBe(false)
      expect(isZapierEntity('')).toBe(false)
    })

    it('should be case-sensitive', () => {
      expect(isSchemaEntity('person')).toBe(false) // lowercase
      expect(isSchemaEntity('PERSON')).toBe(false) // uppercase
      expect(isSchemaEntity('Person')).toBe(true) // correct case

      expect(isEPCISEntity('shipment')).toBe(false)
      expect(isEPCISEntity('SHIPMENT')).toBe(false)
      expect(isEPCISEntity('Shipment')).toBe(true)
    })

    it('should reject strings with whitespace', () => {
      expect(isSchemaEntity(' Person')).toBe(false)
      expect(isSchemaEntity('Person ')).toBe(false)
      expect(isSchemaEntity(' Person ')).toBe(false)
      expect(isSchemaEntity('Per son')).toBe(false)

      expect(isEPCISEntity(' Shipment')).toBe(false)
      expect(isEPCISEntity('Shipment ')).toBe(false)
    })

    it('should reject strings with special characters', () => {
      expect(isSchemaEntity('Person!')).toBe(false)
      expect(isSchemaEntity('Person@')).toBe(false)
      expect(isSchemaEntity('Person#')).toBe(false)
      expect(isSchemaEntity('Person$')).toBe(false)
    })

    it('should reject partial matches', () => {
      expect(isSchemaEntity('Pers')).toBe(false)
      expect(isSchemaEntity('Perso')).toBe(false)
      expect(isEPCISEntity('Ship')).toBe(false)
    })

    it('should reject numeric strings', () => {
      expect(isSchemaEntity('123')).toBe(false)
      expect(isEPCISEntity('456')).toBe(false)
      expect(isOnetEntity('789')).toBe(false)
    })
  })

  describe('$ Proxy Edge Cases', () => {
    it('should handle single property access', () => {
      const path = $.Person
      expect(String(path)).toBe('$.Person')
    })

    it('should handle numeric property access', () => {
      // @ts-expect-error - numeric properties work at runtime
      const path = $.Entity[123].predicate
      expect(String(path)).toBe('$.Entity.123.predicate')
    })

    it('should handle properties with numbers', () => {
      const path = $.Entity1.predicate2.Object3
      expect(String(path)).toBe('$.Entity1.predicate2.Object3')
    })

    it('should handle very long chains', () => {
      const path = $.A.b.C.d.E.f.G.h.I.j.K.l.M.n.O.p.Q.r.S.t.U
      expect(String(path)).toBe('$.A.b.C.d.E.f.G.h.I.j.K.l.M.n.O.p.Q.r.S.t.U')
    })
  })
})
