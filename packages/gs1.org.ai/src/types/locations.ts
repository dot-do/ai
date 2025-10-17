/**
 * GS1 Global Location Number (GLN) Types
 *
 * GLN identifies physical, functional, or legal entities in the supply chain.
 * A GLN is a 13-digit number that uniquely identifies locations worldwide.
 */

/**
 * Physical address for a location
 */
export interface PhysicalAddress {
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

/**
 * Location type vocabulary
 */
export type LocationType =
  | 'warehouse'
  | 'store'
  | 'distributionCenter'
  | 'manufacturingPlant'
  | 'depot'
  | 'terminal'
  | 'port'
  | 'airport'
  | 'railyard'
  | 'office'
  | 'farm'
  | 'facility'

/**
 * Base Location with GLN
 *
 * @example
 * ```typescript
 * const warehouse: Location = {
 *   $type: 'Location',
 *   $id: 'urn:epc:id:sgln:0614141.00001.0',
 *   gln: '0614141000012',
 *   name: 'Main Distribution Center',
 *   locationType: 'distributionCenter',
 *   address: {
 *     street: '123 Supply Chain Ave',
 *     city: 'Commerce City',
 *     state: 'CO',
 *     postalCode: '80022',
 *     country: 'US'
 *   }
 * }
 * ```
 */
export interface Location {
  $type: 'Location'
  $id: string // EPC URI format (e.g., urn:epc:id:sgln:...)
  gln: string // 13-digit GLN
  name: string
  locationType: LocationType
  address?: PhysicalAddress
  parentLocation?: string // GLN of parent location
  metadata?: Record<string, unknown>
}

/**
 * Warehouse location
 */
export interface Warehouse extends Location {
  locationType: 'warehouse'
  capacity?: {
    palletPositions?: number
    squareFeet?: number
    cubicFeet?: number
  }
}

/**
 * Store/Retail location
 */
export interface Store extends Location {
  locationType: 'store'
  storeNumber?: string
  format?: 'supermarket' | 'convenience' | 'hypermarket' | 'specialty' | 'online'
}

/**
 * Distribution center
 */
export interface DistributionCenter extends Location {
  locationType: 'distributionCenter'
  servesRegion?: string[]
  throughputCapacity?: number
}

/**
 * Manufacturing plant
 */
export interface ManufacturingPlant extends Location {
  locationType: 'manufacturingPlant'
  productionLines?: number
  certifications?: string[]
}

/**
 * GLN Helper Functions
 */

/**
 * Validate GLN check digit
 * @param gln - 13-digit GLN string
 * @returns true if check digit is valid
 */
export function isValidGLN(gln: string): boolean {
  if (!/^\d{13}$/.test(gln)) return false

  const digits = gln.split('').map(Number)
  const checkDigit = digits[12]

  // GS1 General Specifications Section 7.9: Check Digit Calculation
  // For 13-digit codes (GLN): alternate weights 1-3-1-3... from left to right
  // Formula: check_digit = (10 - (sum mod 10)) mod 10
  let sum = 0
  for (let i = 0; i < 12; i++) {
    const weight = i % 2 === 0 ? 1 : 3
    sum += digits[i] * weight
  }
  const calculated = (10 - (sum % 10)) % 10

  return calculated === checkDigit
}

/**
 * Convert GLN to SGLN EPC URI
 * @param gln - 13-digit GLN
 * @param extension - Optional location extension
 * @returns EPC URI format
 */
export function glnToEpcUri(gln: string, extension?: string): string {
  if (!isValidGLN(gln)) {
    throw new Error(`Invalid GLN: ${gln}. Expected 13-digit numeric string with valid check digit.`)
  }

  // Split GLN into company prefix and location reference
  // This is simplified - actual implementation needs GS1 prefix table
  const companyPrefix = gln.substring(0, 7)
  const locationRef = gln.substring(7, 12)
  const ext = extension || '0'

  return `urn:epc:id:sgln:${companyPrefix}.${locationRef}.${ext}`
}
