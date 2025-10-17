/**
 * GS1 Product Packaging Hierarchy Types
 *
 * Defines the hierarchical relationships in product packaging:
 * Item → Case → Pallet → Container
 *
 * Each level uses different GS1 identifiers:
 * - Item: GTIN (Global Trade Item Number)
 * - Case/Pallet/Container: SSCC (Serial Shipping Container Code)
 */

import type { BizStep, Disposition } from './cbv.js'

/**
 * Base product/package with GTIN
 */
export interface Product {
  $type: 'Product'
  $id: string // EPC URI (e.g., urn:epc:id:sgtin:...)
  gtin: string // 14-digit GTIN
  name: string
  description?: string
  brand?: string
  manufacturer?: string
  metadata?: Record<string, unknown>
}

/**
 * Item - Base unit of product
 * Identified by GTIN
 */
export interface Item extends Omit<Product, '$type'> {
  $type: 'Item'
  serialNumber?: string
  lotNumber?: string
  expirationDate?: string
  weight?: {
    value: number
    unit: 'kg' | 'g' | 'lb' | 'oz'
  }
  dimensions?: {
    length: number
    width: number
    height: number
    unit: 'cm' | 'in' | 'm'
  }
}

/**
 * Case - Contains multiple items
 * Identified by SSCC
 */
export interface Case {
  $type: 'Case'
  $id: string // EPC URI (e.g., urn:epc:id:sscc:...)
  sscc: string // 18-digit SSCC
  gtin?: string // GTIN of the case itself
  containedItems: {
    gtin: string
    quantity: number
  }[]
  packDate?: string
  weight?: {
    value: number
    unit: 'kg' | 'g' | 'lb' | 'oz'
  }
  dimensions?: {
    length: number
    width: number
    height: number
    unit: 'cm' | 'in' | 'm'
  }
}

/**
 * Pallet - Contains multiple cases
 * Identified by SSCC
 */
export interface Pallet {
  $type: 'Pallet'
  $id: string // EPC URI (e.g., urn:epc:id:sscc:...)
  sscc: string // 18-digit SSCC
  containedCases: string[] // Array of case SSCCs
  palletType?: 'standard' | 'euro' | 'block' | 'custom'
  weight?: {
    value: number
    unit: 'kg' | 'lb'
  }
  height?: {
    value: number
    unit: 'cm' | 'in'
  }
  stackable?: boolean
}

/**
 * Base Container properties
 */
interface ContainerBase {
  $type: 'Container'
  $id: string // EPC URI (e.g., urn:epc:id:sscc:...)
  containerType?: 'shipping' | 'cargo' | 'intermodal'
  isoType?: string // ISO 6346 type code (e.g., '22G1', '42G1')
  containedPallets: string[] // Array of pallet SSCCs
  sealNumber?: string
  weight?: {
    value: number
    unit: 'kg' | 'lb'
  }
}

/**
 * Container with SSCC only
 */
export interface ContainerWithSSCC extends ContainerBase {
  sscc: string // 18-digit SSCC
  containerNumber?: never
}

/**
 * Container with ISO container number only
 */
export interface ContainerWithNumber extends ContainerBase {
  sscc?: never
  containerNumber: string // ISO container number
}

/**
 * Container with both SSCC and ISO container number
 */
export interface ContainerWithBoth extends ContainerBase {
  sscc: string // 18-digit SSCC
  containerNumber: string // ISO container number
}

/**
 * Container - Contains multiple pallets
 * Must have at least one identifier: SSCC, container number, or both
 */
export type Container = ContainerWithSSCC | ContainerWithNumber | ContainerWithBoth

/**
 * Complete product hierarchy
 */
export interface ProductHierarchy {
  item: Item
  case?: Case
  pallet?: Pallet
  container?: Container
}

/**
 * Hierarchy level type
 */
export type HierarchyLevel = 'item' | 'case' | 'pallet' | 'container'

/**
 * Packaging configuration
 */
export interface PackagingConfig {
  itemsPerCase: number
  casesPerPallet: number
  palletsPerContainer: number
  totalItems?: number // Optional: auto-calculated if not provided
}

/**
 * Hierarchy relationship
 */
export interface HierarchyRelationship {
  parent: {
    level: HierarchyLevel
    id: string // GTIN or SSCC
  }
  children: {
    level: HierarchyLevel
    id: string // GTIN or SSCC
    quantity: number
  }[]
}

/**
 * Event predicates for hierarchy levels
 *
 * These enable semantic patterns like:
 * - $.Product.receiving
 * - $.Case.shipping
 * - $.Pallet.inTransit
 * - $.Container.arrived
 */
export interface HierarchyEventPredicate {
  subject: 'Product' | 'Item' | 'Case' | 'Pallet' | 'Container'
  predicate: BizStep
  disposition?: Disposition
}

/**
 * Helper Functions
 */

/**
 * Calculate total items in hierarchy
 * Uses provided totalItems if available, otherwise calculates from components
 */
export function calculateTotalItems(config: PackagingConfig): number {
  return config.totalItems ?? config.itemsPerCase * config.casesPerPallet * config.palletsPerContainer
}

/**
 * Get parent level in hierarchy
 */
export function getParentLevel(level: HierarchyLevel): HierarchyLevel | null {
  const hierarchy: HierarchyLevel[] = ['item', 'case', 'pallet', 'container']
  const index = hierarchy.indexOf(level)
  return index > 0 ? hierarchy[index - 1] : null
}

/**
 * Get child level in hierarchy
 */
export function getChildLevel(level: HierarchyLevel): HierarchyLevel | null {
  const hierarchy: HierarchyLevel[] = ['item', 'case', 'pallet', 'container']
  const index = hierarchy.indexOf(level)
  return index < hierarchy.length - 1 ? hierarchy[index + 1] : null
}

/**
 * Validate SSCC check digit
 * @param sscc - 18-digit SSCC string
 * @returns true if check digit is valid
 */
export function isValidSSCC(sscc: string): boolean {
  if (!/^\d{18}$/.test(sscc)) return false

  const digits = sscc.split('').map(Number)
  const checkDigit = digits[17]

  // GS1 General Specifications Section 7.9: Check Digit Calculation
  // For 18-digit codes (SSCC): alternate weights 3-1-3-1... from left to right
  // Formula: check_digit = (10 - (sum mod 10)) mod 10
  let sum = 0
  for (let i = 0; i < 17; i++) {
    const weight = i % 2 === 0 ? 3 : 1
    sum += digits[i] * weight
  }
  const calculated = (10 - (sum % 10)) % 10

  return calculated === checkDigit
}

/**
 * Convert SSCC to EPC URI
 * @param sscc - 18-digit SSCC
 * @returns EPC URI format
 */
export function ssccToEpcUri(sscc: string): string {
  if (!isValidSSCC(sscc)) {
    throw new Error(`Invalid SSCC: ${sscc}. Expected 18-digit numeric string with valid check digit.`)
  }

  // SSCC format: Extension digit (1) + Company prefix (6-12) + Serial reference (remainder) + Check digit (1)
  // Simplified: assume 7-digit company prefix
  const extension = sscc.substring(0, 1)
  const companyPrefix = sscc.substring(1, 8)
  const serialRef = sscc.substring(8, 17)

  return `urn:epc:id:sscc:${companyPrefix}.${extension}${serialRef}`
}

/**
 * Validate GTIN check digit
 * @param gtin - 8, 12, 13, or 14-digit GTIN string
 * @returns true if check digit is valid
 */
export function isValidGTIN(gtin: string): boolean {
  // GTIN can be 8, 12, 13, or 14 digits
  if (!/^\d{8}$|^\d{12}$|^\d{13}$|^\d{14}$/.test(gtin)) return false

  const digits = gtin.split('').map(Number)
  const lastIndex = digits.length - 1
  const checkDigit = digits[lastIndex]

  // GS1 General Specifications Section 7.9: Check Digit Calculation
  // For GTIN-8/12/13/14: alternate weights based on code length
  // Even-length codes (8, 12, 14): start with weight 3 from left
  // Odd-length codes (13): start with weight 1 from left
  // Formula: check_digit = (10 - (sum mod 10)) mod 10
  let sum = 0
  for (let i = 0; i < lastIndex; i++) {
    const weight = i % 2 === 0 ? (digits.length % 2 === 0 ? 3 : 1) : digits.length % 2 === 0 ? 1 : 3
    sum += digits[i] * weight
  }
  const calculated = (10 - (sum % 10)) % 10

  return calculated === checkDigit
}

/**
 * Convert GTIN to SGTIN EPC URI
 * @param gtin - 8, 12, 13, or 14-digit GTIN
 * @param serial - Serial number
 * @returns EPC URI format
 */
export function gtinToEpcUri(gtin: string, serial?: string): string {
  // Accept GTIN-8, GTIN-12, GTIN-13, or GTIN-14
  if (!/^\d{8}$|^\d{12}$|^\d{13}$|^\d{14}$/.test(gtin)) {
    throw new Error(`Invalid GTIN format: ${gtin}. Expected 8, 12, 13, or 14-digit numeric string.`)
  }

  if (!isValidGTIN(gtin)) {
    throw new Error(`Invalid GTIN check digit: ${gtin}. The check digit does not match the calculated value.`)
  }

  // Pad to 14 digits (standard GTIN-14 format for EPC URIs)
  const gtin14 = gtin.padStart(14, '0')

  // Simplified: assume 7-digit company prefix
  const indicator = gtin14.substring(0, 1)
  const companyPrefix = gtin14.substring(1, 8)
  const itemRef = gtin14.substring(8, 13)
  const serialNum = serial || '0'

  return `urn:epc:id:sgtin:${companyPrefix}.${indicator}${itemRef}.${serialNum}`
}
