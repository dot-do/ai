/**
 * Tests for GS1 Product Hierarchy Types
 *
 * These tests demonstrate the hierarchical relationships between
 * Item → Case → Pallet → Container
 */

import { describe, it, expect } from 'vitest'
import type { Item, Case, Pallet, Container, ProductHierarchy, PackagingConfig } from '../types/hierarchy.js'
import { isValidSSCC, isValidGTIN, ssccToEpcUri, gtinToEpcUri, calculateTotalItems, getParentLevel, getChildLevel } from '../types/hierarchy.js'

describe('Product Hierarchy', () => {
  describe('Item', () => {
    it('should create a valid item with GTIN', () => {
      const item: Item = {
        $type: 'Item',
        $id: 'urn:epc:id:sgtin:0614141.107346.2017',
        gtin: '00614141107346',
        name: 'Test Product',
        serialNumber: '2017',
        weight: {
          value: 1.5,
          unit: 'kg',
        },
      }

      expect(item.$type).toBe('Item')
      expect(item.gtin).toBe('00614141107346')
      expect(item.serialNumber).toBe('2017')
    })
  })

  describe('Case', () => {
    it('should create a case containing multiple items', () => {
      const productCase: Case = {
        $type: 'Case',
        $id: 'urn:epc:id:sscc:0614141.1234567890',
        sscc: '106141411234567897',
        containedItems: [
          {
            gtin: '00614141107346',
            quantity: 24,
          },
        ],
        packDate: '2024-01-15',
      }

      expect(productCase.$type).toBe('Case')
      expect(productCase.sscc).toBe('106141411234567897')
      expect(productCase.containedItems[0].quantity).toBe(24)
    })

    it('should validate case SSCC', () => {
      expect(isValidSSCC('106141411234567897')).toBe(true)
      expect(isValidSSCC('123456789012345675')).toBe(true)
      expect(isValidSSCC('invalid')).toBe(false)
      expect(isValidSSCC('12345')).toBe(false)
    })

    it('should validate edge case SSCCs', () => {
      // All zeros with correct check digit
      expect(isValidSSCC('000000000000000000')).toBe(true)
      // All nines with correct check digit
      expect(isValidSSCC('999999999999999995')).toBe(true)
    })

    it('should reject SSCC with incorrect check digit', () => {
      // Valid format but wrong check digit
      expect(isValidSSCC('106141411234567890')).toBe(false)
      expect(isValidSSCC('106141411234567891')).toBe(false)
    })

    it('should reject SSCC with non-numeric characters', () => {
      expect(isValidSSCC('10614141123456789a')).toBe(false)
      expect(isValidSSCC('106141411234567-95')).toBe(false)
      expect(isValidSSCC(' 106141411234567895')).toBe(false)
    })
  })

  describe('GTIN Validation', () => {
    it('should validate GTIN-14', () => {
      expect(isValidGTIN('00614141107346')).toBe(true)
      expect(isValidGTIN('12345678901231')).toBe(true)
    })

    it('should validate GTIN-13', () => {
      expect(isValidGTIN('0614141107346')).toBe(true)
      expect(isValidGTIN('1234567890128')).toBe(true)
    })

    it('should validate GTIN-12 (UPC)', () => {
      expect(isValidGTIN('123456789012')).toBe(true)
      expect(isValidGTIN('614141107346')).toBe(true)
    })

    it('should validate GTIN-8', () => {
      expect(isValidGTIN('12345670')).toBe(true)
      expect(isValidGTIN('96385074')).toBe(true)
    })

    it('should reject invalid GTIN formats', () => {
      expect(isValidGTIN('invalid')).toBe(false)
      expect(isValidGTIN('12345')).toBe(false)
      expect(isValidGTIN('123456789')).toBe(false) // 9 digits - invalid
      expect(isValidGTIN('12345678901')).toBe(false) // 11 digits - invalid
    })

    it('should reject GTIN with incorrect check digit', () => {
      expect(isValidGTIN('00614141107347')).toBe(false) // Wrong check digit
      expect(isValidGTIN('1234567890120')).toBe(false) // Wrong check digit
    })

    it('should validate edge case GTINs', () => {
      // All zeros with correct check digit
      expect(isValidGTIN('00000000000000')).toBe(true)
      expect(isValidGTIN('0000000000000')).toBe(true)
    })

    it('should reject GTIN with non-numeric characters', () => {
      expect(isValidGTIN('0061414110734a')).toBe(false)
      expect(isValidGTIN('00614141107-46')).toBe(false)
    })
  })

  describe('Pallet', () => {
    it('should create a pallet containing multiple cases', () => {
      const pallet: Pallet = {
        $type: 'Pallet',
        $id: 'urn:epc:id:sscc:0614141.2345678901',
        sscc: '106141412345678908',
        containedCases: ['106141411234567897', '106141411234567903'],
        palletType: 'standard',
        weight: {
          value: 500,
          unit: 'kg',
        },
        stackable: true,
      }

      expect(pallet.$type).toBe('Pallet')
      expect(pallet.containedCases).toHaveLength(2)
      expect(pallet.palletType).toBe('standard')
    })
  })

  describe('Container', () => {
    it('should create a container with multiple pallets', () => {
      const container: Container = {
        $type: 'Container',
        $id: 'urn:epc:id:sscc:0614141.3456789012',
        sscc: '106141413456789019',
        containerType: 'shipping',
        containedPallets: ['106141412345678908', '106141412345678915'],
        sealNumber: 'SEAL123456',
        weight: {
          value: 12000,
          unit: 'kg',
        },
      }

      expect(container.$type).toBe('Container')
      expect(container.containedPallets).toHaveLength(2)
      expect(container.sealNumber).toBe('SEAL123456')
    })

    it('should support ISO container types', () => {
      const container: Container = {
        $type: 'Container',
        $id: 'urn:epc:id:sscc:0614141.3456789012',
        containerType: 'intermodal',
        containerNumber: 'ABCU1234567',
        isoType: '22G1',
        containedPallets: [],
      }

      expect(container.containerType).toBe('intermodal')
      expect(container.isoType).toBe('22G1')
    })

    it('should support container with SSCC only', () => {
      const container: Container = {
        $type: 'Container',
        $id: 'urn:epc:id:sscc:0614141.3456789012',
        sscc: '106141413456789019',
        containerType: 'cargo',
        containedPallets: ['106141412345678908'],
      }

      expect(container.sscc).toBe('106141413456789019')
      expect(container.containerNumber).toBeUndefined()
    })

    it('should support container with ISO number only', () => {
      const container: Container = {
        $type: 'Container',
        $id: 'urn:epc:id:sscc:0614141.3456789012',
        containerNumber: 'MSCU1234567',
        containerType: 'shipping',
        containedPallets: [],
      }

      expect(container.containerNumber).toBe('MSCU1234567')
      expect(container.sscc).toBeUndefined()
    })

    it('should support container with both SSCC and ISO number', () => {
      const container: Container = {
        $type: 'Container',
        $id: 'urn:epc:id:sscc:0614141.3456789012',
        sscc: '106141413456789019',
        containerNumber: 'ABCU7654321',
        containerType: 'intermodal',
        containedPallets: [],
      }

      expect(container.sscc).toBe('106141413456789019')
      expect(container.containerNumber).toBe('ABCU7654321')
    })
  })

  describe('Complete Hierarchy', () => {
    it('should create a complete product hierarchy', () => {
      const item: Item = {
        $type: 'Item',
        $id: 'urn:epc:id:sgtin:0614141.107346.2017',
        gtin: '00614141107346',
        name: 'Test Product',
        serialNumber: '2017',
      }

      const productCase: Case = {
        $type: 'Case',
        $id: 'urn:epc:id:sscc:0614141.1234567890',
        sscc: '106141411234567897',
        containedItems: [{ gtin: item.gtin, quantity: 24 }],
      }

      const pallet: Pallet = {
        $type: 'Pallet',
        $id: 'urn:epc:id:sscc:0614141.2345678901',
        sscc: '106141412345678908',
        containedCases: [productCase.sscc],
      }

      const container: Container = {
        $type: 'Container',
        $id: 'urn:epc:id:sscc:0614141.3456789012',
        sscc: '106141413456789019',
        containerType: 'shipping',
        containedPallets: [pallet.sscc],
      }

      const hierarchy: ProductHierarchy = {
        item,
        case: productCase,
        pallet,
        container,
      }

      expect(hierarchy.item.$type).toBe('Item')
      expect(hierarchy.case?.sscc).toBe('106141411234567897')
      expect(hierarchy.pallet?.sscc).toBe('106141412345678908')
      expect(hierarchy.container?.sscc).toBe('106141413456789019')
    })
  })

  describe('Helper Functions', () => {
    it('should calculate total items in packaging', () => {
      const config: PackagingConfig = {
        itemsPerCase: 24,
        casesPerPallet: 40,
        palletsPerContainer: 20,
      }

      const total = calculateTotalItems(config)
      expect(total).toBe(19200) // 24 * 40 * 20
    })

    it('should use provided totalItems if available', () => {
      const config: PackagingConfig = {
        itemsPerCase: 24,
        casesPerPallet: 40,
        palletsPerContainer: 20,
        totalItems: 50000, // Override calculated value
      }

      const total = calculateTotalItems(config)
      expect(total).toBe(50000) // Uses provided value instead of calculating
    })

    it('should get parent level in hierarchy', () => {
      expect(getParentLevel('item')).toBeNull()
      expect(getParentLevel('case')).toBe('item')
      expect(getParentLevel('pallet')).toBe('case')
      expect(getParentLevel('container')).toBe('pallet')
    })

    it('should get child level in hierarchy', () => {
      expect(getChildLevel('item')).toBe('case')
      expect(getChildLevel('case')).toBe('pallet')
      expect(getChildLevel('pallet')).toBe('container')
      expect(getChildLevel('container')).toBeNull()
    })

    it('should convert SSCC to EPC URI', () => {
      const sscc = '106141411234567897'
      const epcUri = ssccToEpcUri(sscc)

      expect(epcUri).toContain('urn:epc:id:sscc:')
      expect(epcUri).toContain('0614141')
    })

    it('should convert GTIN-14 to EPC URI', () => {
      const gtin = '00614141107346'
      const serial = '2017'
      const epcUri = gtinToEpcUri(gtin, serial)

      expect(epcUri).toContain('urn:epc:id:sgtin:')
      expect(epcUri).toContain('0614141')
      expect(epcUri).toContain('2017')
    })

    it('should convert GTIN-13 to EPC URI with padding', () => {
      const gtin = '0614141107346' // 13 digits
      const serial = '2017'
      const epcUri = gtinToEpcUri(gtin, serial)

      expect(epcUri).toContain('urn:epc:id:sgtin:')
      expect(epcUri).toContain('0614141')
      expect(epcUri).toContain('2017')
      // Should pad to 14 digits internally
    })

    it('should convert GTIN-12 (UPC) to EPC URI with padding', () => {
      const gtin = '123456789012' // 12 digits, valid UPC
      const serial = '5000'
      const epcUri = gtinToEpcUri(gtin, serial)

      expect(epcUri).toContain('urn:epc:id:sgtin:')
      expect(epcUri).toContain('5000')
      // Should pad to 14 digits internally
    })

    it('should convert GTIN-8 to EPC URI with padding', () => {
      const gtin = '12345670' // 8 digits
      const serial = '1000'
      const epcUri = gtinToEpcUri(gtin, serial)

      expect(epcUri).toContain('urn:epc:id:sgtin:')
      expect(epcUri).toContain('1000')
      // Should pad to 14 digits internally
    })

    it('should throw error for invalid SSCC', () => {
      expect(() => ssccToEpcUri('invalid')).toThrow('Invalid SSCC')
    })

    it('should throw error for invalid GTIN format', () => {
      expect(() => gtinToEpcUri('invalid')).toThrow('Invalid GTIN format')
    })

    it('should throw error for GTIN with invalid check digit', () => {
      expect(() => gtinToEpcUri('00614141107347')).toThrow('Invalid GTIN check digit')
    })
  })

  describe('Partial Hierarchy', () => {
    it('should support item and case only (no pallet/container)', () => {
      const item: Item = {
        $type: 'Item',
        $id: 'urn:epc:id:sgtin:0614141.107346.2017',
        gtin: '00614141107346',
        name: 'Test Product',
      }

      const productCase: Case = {
        $type: 'Case',
        $id: 'urn:epc:id:sscc:0614141.1234567890',
        sscc: '106141411234567897',
        containedItems: [{ gtin: item.gtin, quantity: 24 }],
      }

      const hierarchy: ProductHierarchy = {
        item,
        case: productCase,
        // No pallet or container
      }

      expect(hierarchy.item.$type).toBe('Item')
      expect(hierarchy.case?.sscc).toBe('106141411234567897')
      expect(hierarchy.pallet).toBeUndefined()
      expect(hierarchy.container).toBeUndefined()
    })

    it('should support item through pallet (no container)', () => {
      const item: Item = {
        $type: 'Item',
        $id: 'urn:epc:id:sgtin:0614141.107346.2017',
        gtin: '00614141107346',
        name: 'Test Product',
      }

      const productCase: Case = {
        $type: 'Case',
        $id: 'urn:epc:id:sscc:0614141.1234567890',
        sscc: '106141411234567897',
        containedItems: [{ gtin: item.gtin, quantity: 24 }],
      }

      const pallet: Pallet = {
        $type: 'Pallet',
        $id: 'urn:epc:id:sscc:0614141.2345678901',
        sscc: '106141412345678908',
        containedCases: [productCase.sscc],
      }

      const hierarchy: ProductHierarchy = {
        item,
        case: productCase,
        pallet,
        // No container
      }

      expect(hierarchy.item.$type).toBe('Item')
      expect(hierarchy.case?.sscc).toBe('106141411234567897')
      expect(hierarchy.pallet?.sscc).toBe('106141412345678908')
      expect(hierarchy.container).toBeUndefined()
    })
  })
})
