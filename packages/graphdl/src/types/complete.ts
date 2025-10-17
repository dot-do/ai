/**
 * Complete Type Definitions
 * Aggregates all ontologies for comprehensive type support
 */

import type { SemanticPath } from './paths.js'

/**
 * Schema.org Entity Types
 * Core types available without peer dependencies
 */
export type SchemaEntity =
  | 'Thing'
  | 'Action'
  | 'Person'
  | 'Organization'
  | 'Place'
  | 'Event'
  | 'Product'
  | 'Offer'
  | 'CreativeWork'
  | 'MediaObject'
  | 'Article'
  | 'BlogPosting'
  | 'Book'
  | 'Course'
  | 'Dataset'
  | 'HowTo'
  | 'ImageObject'
  | 'Movie'
  | 'MusicRecording'
  | 'Recipe'
  | 'SoftwareApplication'
  | 'VideoObject'
  | 'WebPage'
  | 'WebSite'
  | 'Intangible'
  | 'BrandName'
  | 'JobPosting'
  | 'Occupation'
  | 'Service'
  | 'Review'
  | 'Rating'
  | 'ContactPoint'
  | 'PostalAddress'
  | 'GeoCoordinates'
  | 'LocalBusiness'
  | 'Restaurant'
  | 'Store'
  | 'MedicalEntity'
  | 'Vehicle'

/**
 * GS1/EPCIS Entity Types
 * Core types available without peer dependencies
 */
export type EPCISEntity =
  | 'Product'
  | 'Shipment'
  | 'Container'
  | 'Pallet'
  | 'Case'
  | 'Item'
  | 'Batch'
  | 'Lot'
  | 'SerialNumber'
  | 'Location'
  | 'Warehouse'
  | 'Store'
  | 'Factory'
  | 'DistributionCenter'
  | 'Party'
  | 'Organization'
  | 'Supplier'
  | 'Manufacturer'
  | 'Retailer'
  | 'Carrier'
  | 'Event'
  | 'Transaction'
  | 'Invoice'
  | 'PurchaseOrder'
  | 'Receipt'
  | 'BillOfLading'

/**
 * O*NET Entity Types
 * Core types available without peer dependencies
 */
export type OnetEntity =
  | 'Occupation'
  | 'Ability'
  | 'Skill'
  | 'Knowledge'
  | 'Task'
  | 'WorkActivity'
  | 'WorkContext'
  | 'WorkValue'
  | 'WorkStyle'
  | 'Interest'
  | 'Tool'
  | 'Technology'
  | 'Education'
  | 'Experience'
  | 'Training'
  | 'JobZone'
  | 'Industry'
  | 'Career'

/**
 * NAICS Industry Classifications
 */
export type NAICSEntity =
  | 'Agriculture'
  | 'Mining'
  | 'Utilities'
  | 'Construction'
  | 'Manufacturing'
  | 'Wholesale'
  | 'Retail'
  | 'Transportation'
  | 'Information'
  | 'Finance'
  | 'RealEstate'
  | 'Professional'
  | 'Management'
  | 'Administrative'
  | 'Educational'
  | 'Healthcare'
  | 'Arts'
  | 'Accommodation'
  | 'OtherServices'
  | 'PublicAdministration'
  | 'IndustryClassification'

/**
 * APQC Process Framework
 */
export type APQCEntity =
  | 'DevelopVision'
  | 'DevelopProduct'
  | 'MarketProduct'
  | 'DeliverProduct'
  | 'ManageCustomer'
  | 'DevelopHumanCapital'
  | 'ManageInformation'
  | 'ManageFinancial'
  | 'AcquireAssets'
  | 'ManageEnterprise'
  | 'ManageEnvironmental'
  | 'ManageExternal'
  | 'ManageKnowledge'
  | 'BusinessProcess'

/**
 * UN/EDIFACT Message Types
 */
export type EDIEntity =
  | 'ORDERS'
  | 'ORDCHG'
  | 'ORDRSP'
  | 'DESADV'
  | 'RECADV'
  | 'INVOIC'
  | 'REMADV'
  | 'PRICAT'
  | 'PRODAT'
  | 'SLSRPT'
  | 'INVRPT'
  | 'PARTIN'
  | 'QUOTES'
  | 'REQOTE'
  | 'APERAK'
  | 'CONTRL'
  | 'EDIMessage'

/**
 * Zapier Integration Apps
 */
export type ZapierEntity =
  | 'Gmail'
  | 'Slack'
  | 'GoogleSheets'
  | 'Trello'
  | 'Asana'
  | 'Salesforce'
  | 'HubSpot'
  | 'Mailchimp'
  | 'Dropbox'
  | 'GoogleDrive'
  | 'Airtable'
  | 'Notion'
  | 'GitHub'
  | 'Shopify'
  | 'Stripe'
  | 'Integration'

/**
 * Complete Entity Type - Union of all ontologies plus custom extensions
 *
 * Enables type-safe semantic paths across all standard domains while maintaining
 * extensibility for custom entity types.
 *
 * **Design Decision**: The `| string` union allows custom entity types beyond the
 * standard ontologies, which is essential for:
 * - Domain-specific extensions (e.g., custom business entities)
 * - Third-party integrations not yet in standard vocabularies
 * - Experimental or internal entity types
 *
 * **Trade-off**: This makes TypeScript autocomplete less strict, as any string is
 * technically valid. However, runtime type guards (isSchemaEntity, isEPCISEntity, etc.)
 * provide validation for standard types, and the flexibility enables real-world usage.
 *
 * **Future Enhancement**: Consider branded types in v1.1.0 to preserve extensibility
 * while improving type safety:
 * ```typescript
 * type CustomEntity = string & { __brand: 'CustomEntity' }
 * type EntityType = SchemaEntity | EPCISEntity | ... | CustomEntity
 * ```
 *
 * @example
 * ```typescript
 * // Standard entities (autocomplete in union)
 * const person: EntityType = 'Person'        // ✓ Valid
 * const product: EntityType = 'Product'      // ✓ Valid
 *
 * // Custom entities (fallback to string)
 * const custom: EntityType = 'MyCustomType'  // ✓ Valid (extensibility)
 *
 * // Runtime validation for standard types
 * if (isSchemaEntity(person)) {
 *   // TypeScript knows it's a SchemaEntity
 * }
 * ```
 */
export type EntityType = SchemaEntity | EPCISEntity | OnetEntity | NAICSEntity | APQCEntity | EDIEntity | ZapierEntity | string // Allow custom entity types

/**
 * Type-safe proxy path builder with autocomplete support for common entities
 *
 * Provides type inference for $.Subject.predicate.Object patterns across all ontologies.
 * This interface includes ~60 of the most commonly used entity types from Schema.org,
 * GS1/EPCIS, O*NET, NAICS, APQC, EDI, and Zapier vocabularies.
 *
 * **Curated Subset**: This is a carefully selected subset of the most frequently used
 * entities, not the complete 200+ entity types. The fallback index signature `[entity: string]`
 * allows access to all other entities while maintaining full runtime support.
 *
 * @example
 * ```typescript
 * import $ from 'graphdl'
 * import type { TypedPathProxy } from 'graphdl/types/complete'
 *
 * // Cast $ to TypedPathProxy for autocomplete on common entities
 * const typed = $ as unknown as TypedPathProxy
 *
 * // IDE will autocomplete common entity types
 * typed.Person       // Schema.org Person entity (autocomplete ✓)
 * typed.Shipment     // GS1/EPCIS Shipment entity (autocomplete ✓)
 * typed.Occupation   // O*NET Occupation entity (autocomplete ✓)
 * typed.Industry     // NAICS Industry entity (autocomplete ✓)
 *
 * // Other entities still work via index signature
 * typed.CustomEntity // Works at runtime, no autocomplete
 *
 * // Continue building paths with autocomplete
 * String(typed.Person.worksFor.Organization)  // "$.Person.worksFor.Organization"
 * ```
 *
 * **When to use**: Use TypedPathProxy when working with common entities and you want
 * IDE autocomplete. The default `$` export works identically at runtime and supports
 * all entity types (common and custom), but provides no autocomplete.
 *
 * **Future**: Consider generating the complete TypedPathProxy programmatically in v1.1.0
 * to include all 200+ entities with full autocomplete support.
 */
export interface TypedPathProxy {
  // Schema.org entities
  Person: EntityPath<'Person'>
  Organization: EntityPath<'Organization'>
  Product: EntityPath<'Product'>
  Place: EntityPath<'Place'>
  Event: EntityPath<'Event'>
  Thing: EntityPath<'Thing'>
  CreativeWork: EntityPath<'CreativeWork'>
  Article: EntityPath<'Article'>
  Book: EntityPath<'Book'>
  Course: EntityPath<'Course'>
  JobPosting: EntityPath<'JobPosting'>
  Service: EntityPath<'Service'>
  LocalBusiness: EntityPath<'LocalBusiness'>
  Restaurant: EntityPath<'Restaurant'>
  Store: EntityPath<'Store'>

  // GS1/EPCIS supply chain entities
  Shipment: EntityPath<'Shipment'>
  Container: EntityPath<'Container'>
  Pallet: EntityPath<'Pallet'>
  Warehouse: EntityPath<'Warehouse'>
  Location: EntityPath<'Location'>
  Batch: EntityPath<'Batch'>
  Lot: EntityPath<'Lot'>
  Supplier: EntityPath<'Supplier'>
  Manufacturer: EntityPath<'Manufacturer'>
  Retailer: EntityPath<'Retailer'>
  Carrier: EntityPath<'Carrier'>
  Transaction: EntityPath<'Transaction'>
  Invoice: EntityPath<'Invoice'>
  PurchaseOrder: EntityPath<'PurchaseOrder'>
  Receipt: EntityPath<'Receipt'>

  // O*NET occupation entities
  Occupation: EntityPath<'Occupation'>
  Ability: EntityPath<'Ability'>
  Skill: EntityPath<'Skill'>
  Knowledge: EntityPath<'Knowledge'>
  Task: EntityPath<'Task'>
  WorkActivity: EntityPath<'WorkActivity'>
  WorkContext: EntityPath<'WorkContext'>
  WorkValue: EntityPath<'WorkValue'>
  Interest: EntityPath<'Interest'>
  Tool: EntityPath<'Tool'>
  Technology: EntityPath<'Technology'>
  Education: EntityPath<'Education'>
  Experience: EntityPath<'Experience'>
  Training: EntityPath<'Training'>

  // NAICS industries
  Agriculture: EntityPath<'Agriculture'>
  Mining: EntityPath<'Mining'>
  Construction: EntityPath<'Construction'>
  Manufacturing: EntityPath<'Manufacturing'>
  Information: EntityPath<'Information'>
  Finance: EntityPath<'Finance'>
  Healthcare: EntityPath<'Healthcare'>

  // APQC processes
  DevelopVision: EntityPath<'DevelopVision'>
  DevelopProduct: EntityPath<'DevelopProduct'>
  MarketProduct: EntityPath<'MarketProduct'>
  DeliverProduct: EntityPath<'DeliverProduct'>
  ManageCustomer: EntityPath<'ManageCustomer'>
  BusinessProcess: EntityPath<'BusinessProcess'>

  // EDI messages
  ORDERS: EntityPath<'ORDERS'>
  INVOIC: EntityPath<'INVOIC'>
  DESADV: EntityPath<'DESADV'>
  EDIMessage: EntityPath<'EDIMessage'>

  // Zapier integrations
  Gmail: EntityPath<'Gmail'>
  Slack: EntityPath<'Slack'>
  GoogleSheets: EntityPath<'GoogleSheets'>
  Integration: EntityPath<'Integration'>

  // Allow any other entity (fallback for custom types)
  [entity: string]: EntityPath<string>
}

/**
 * Entity path with predicate support
 * Enables $.Entity.predicate syntax with type safety
 */
export type EntityPath<T extends string> = {
  [predicate: string]: PredicateObjectPath<T, string>
}

/**
 * Predicate-Object path
 * Enables $.Entity.predicate.Object syntax with type safety
 */
export type PredicateObjectPath<S extends string, P extends string> = {
  [object: string]: SemanticPath<S, P, string>
}

/**
 * Tree-shakeable entity type checks
 * Uses Set-based lookups for O(1) performance
 * Only imports what you use
 */

const SCHEMA_ENTITIES = new Set([
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
])

/**
 * Check if a type is a Schema.org entity
 * @param type - Entity type string to check
 * @returns True if type is a valid Schema.org entity
 * @example
 * ```typescript
 * isSchemaEntity('Person')      // true
 * isSchemaEntity('Organization') // true
 * isSchemaEntity('Invalid')      // false
 * ```
 */
export const isSchemaEntity = (type: string): type is SchemaEntity => {
  return SCHEMA_ENTITIES.has(type)
}

const EPCIS_ENTITIES = new Set([
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
])

/**
 * Check if a type is a GS1/EPCIS entity
 * @param type - Entity type string to check
 * @returns True if type is a valid GS1/EPCIS entity
 * @example
 * ```typescript
 * isEPCISEntity('Shipment')   // true
 * isEPCISEntity('Warehouse')  // true
 * isEPCISEntity('Invalid')    // false
 * ```
 */
export const isEPCISEntity = (type: string): type is EPCISEntity => {
  return EPCIS_ENTITIES.has(type)
}

const ONET_ENTITIES = new Set([
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
])

/**
 * Check if a type is an O*NET entity
 * @param type - Entity type string to check
 * @returns True if type is a valid O*NET entity
 * @example
 * ```typescript
 * isOnetEntity('Occupation')  // true
 * isOnetEntity('Skill')       // true
 * isOnetEntity('Invalid')     // false
 * ```
 */
export const isOnetEntity = (type: string): type is OnetEntity => {
  return ONET_ENTITIES.has(type)
}

const NAICS_ENTITIES = new Set([
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
])

/**
 * Check if a type is a NAICS entity
 * @param type - Entity type string to check
 * @returns True if type is a valid NAICS entity
 * @example
 * ```typescript
 * isNAICSEntity('Manufacturing')  // true
 * isNAICSEntity('Healthcare')     // true
 * isNAICSEntity('Invalid')        // false
 * ```
 */
export const isNAICSEntity = (type: string): type is NAICSEntity => {
  return NAICS_ENTITIES.has(type)
}

const APQC_ENTITIES = new Set([
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
])

/**
 * Check if a type is an APQC entity
 * @param type - Entity type string to check
 * @returns True if type is a valid APQC entity
 * @example
 * ```typescript
 * isAPQCEntity('DevelopProduct')     // true
 * isAPQCEntity('ManageCustomer')     // true
 * isAPQCEntity('Invalid')            // false
 * ```
 */
export const isAPQCEntity = (type: string): type is APQCEntity => {
  return APQC_ENTITIES.has(type)
}

const EDI_ENTITIES = new Set([
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
])

/**
 * Check if a type is an EDI entity
 * @param type - Entity type string to check
 * @returns True if type is a valid EDI entity
 * @example
 * ```typescript
 * isEDIEntity('ORDERS')    // true
 * isEDIEntity('INVOIC')    // true
 * isEDIEntity('Invalid')   // false
 * ```
 */
export const isEDIEntity = (type: string): type is EDIEntity => {
  return EDI_ENTITIES.has(type)
}

const ZAPIER_ENTITIES = new Set([
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
])

/**
 * Check if a type is a Zapier entity
 * @param type - Entity type string to check
 * @returns True if type is a valid Zapier entity
 * @example
 * ```typescript
 * isZapierEntity('Slack')      // true
 * isZapierEntity('Gmail')      // true
 * isZapierEntity('Invalid')    // false
 * ```
 */
export const isZapierEntity = (type: string): type is ZapierEntity => {
  return ZAPIER_ENTITIES.has(type)
}
