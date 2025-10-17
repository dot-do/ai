/**
 * Tests for GS1 GLN Location Types
 *
 * These tests demonstrate GLN (Global Location Number) usage
 * for identifying physical, functional, or legal entities
 */

import { describe, it, expect } from 'vitest'
import type { Location, Warehouse, Store, DistributionCenter, ManufacturingPlant } from '../types/locations.js'
import { isValidGLN, glnToEpcUri } from '../types/locations.js'

describe('GLN Locations', () => {
  describe('GLN Validation', () => {
    it('should validate correct GLN with check digit', () => {
      // GLN with valid check digit
      expect(isValidGLN('0614141000012')).toBe(true)
      expect(isValidGLN('1234567890128')).toBe(true)
    })

    it('should reject invalid GLN format', () => {
      expect(isValidGLN('invalid')).toBe(false)
      expect(isValidGLN('12345')).toBe(false)
      expect(isValidGLN('12345678901234')).toBe(false) // Too long
    })

    it('should reject GLN with incorrect check digit', () => {
      // Same GLN but with wrong check digit
      expect(isValidGLN('0614141000013')).toBe(false)
    })

    it('should validate edge case GLNs', () => {
      // All zeros except check digit
      expect(isValidGLN('0000000000000')).toBe(true)
      // All nines with correct check digit
      expect(isValidGLN('9999999999994')).toBe(true)
      // Minimum valid GLN
      expect(isValidGLN('0000000000000')).toBe(true)
    })

    it('should reject GLN with non-numeric characters', () => {
      expect(isValidGLN('061414100001a')).toBe(false)
      expect(isValidGLN('061414100001-')).toBe(false)
      expect(isValidGLN(' 0614141000012')).toBe(false)
    })

    it('should reject empty or null-like values', () => {
      expect(isValidGLN('')).toBe(false)
      expect(isValidGLN('             ')).toBe(false)
    })
  })

  describe('Base Location', () => {
    it('should create a valid location with GLN', () => {
      const location: Location = {
        $type: 'Location',
        $id: 'urn:epc:id:sgln:0614141.00001.0',
        gln: '0614141000012',
        name: 'Main Facility',
        locationType: 'warehouse',
        address: {
          street: '123 Supply Chain Ave',
          city: 'Commerce City',
          state: 'CO',
          postalCode: '80022',
          country: 'US',
        },
      }

      expect(location.$type).toBe('Location')
      expect(location.gln).toBe('0614141000012')
      expect(location.locationType).toBe('warehouse')
    })

    it('should support coordinates in address', () => {
      const location: Location = {
        $type: 'Location',
        $id: 'urn:epc:id:sgln:0614141.00001.0',
        gln: '0614141000012',
        name: 'GPS Tracked Location',
        locationType: 'warehouse',
        address: {
          coordinates: {
            latitude: 39.8097,
            longitude: -104.8847,
          },
        },
      }

      expect(location.address?.coordinates?.latitude).toBe(39.8097)
      expect(location.address?.coordinates?.longitude).toBe(-104.8847)
    })
  })

  describe('Warehouse', () => {
    it('should create a warehouse with capacity', () => {
      const warehouse: Warehouse = {
        $type: 'Location',
        $id: 'urn:epc:id:sgln:0614141.00001.0',
        gln: '0614141000012',
        name: 'Main Distribution Center',
        locationType: 'warehouse',
        capacity: {
          palletPositions: 5000,
          squareFeet: 100000,
          cubicFeet: 1500000,
        },
      }

      expect(warehouse.locationType).toBe('warehouse')
      expect(warehouse.capacity?.palletPositions).toBe(5000)
      expect(warehouse.capacity?.squareFeet).toBe(100000)
    })
  })

  describe('Store', () => {
    it('should create a retail store', () => {
      const store: Store = {
        $type: 'Location',
        $id: 'urn:epc:id:sgln:0614141.00777.0',
        gln: '0614141007777',
        name: 'Downtown Store',
        locationType: 'store',
        storeNumber: 'ST-777',
        format: 'supermarket',
      }

      expect(store.locationType).toBe('store')
      expect(store.storeNumber).toBe('ST-777')
      expect(store.format).toBe('supermarket')
    })

    it('should support different store formats', () => {
      const formats: Store['format'][] = ['supermarket', 'convenience', 'hypermarket', 'specialty', 'online']

      formats.forEach((format) => {
        const store: Store = {
          $type: 'Location',
          $id: 'urn:epc:id:sgln:0614141.00777.0',
          gln: '0614141007777',
          name: `${format} Store`,
          locationType: 'store',
          format,
        }

        expect(store.format).toBe(format)
      })
    })
  })

  describe('Distribution Center', () => {
    it('should create a distribution center', () => {
      const dc: DistributionCenter = {
        $type: 'Location',
        $id: 'urn:epc:id:sgln:0614141.00888.0',
        gln: '0614141008888',
        name: 'Regional Distribution Center',
        locationType: 'distributionCenter',
        servesRegion: ['CO', 'WY', 'MT'],
        throughputCapacity: 10000,
      }

      expect(dc.locationType).toBe('distributionCenter')
      expect(dc.servesRegion).toContain('CO')
      expect(dc.throughputCapacity).toBe(10000)
    })
  })

  describe('Manufacturing Plant', () => {
    it('should create a manufacturing plant', () => {
      const plant: ManufacturingPlant = {
        $type: 'Location',
        $id: 'urn:epc:id:sgln:0614141.00999.0',
        gln: '0614141009999',
        name: 'Main Manufacturing Plant',
        locationType: 'manufacturingPlant',
        productionLines: 5,
        certifications: ['ISO9001', 'ISO14001', 'HACCP'],
      }

      expect(plant.locationType).toBe('manufacturingPlant')
      expect(plant.productionLines).toBe(5)
      expect(plant.certifications).toContain('ISO9001')
    })

    it('should validate multiple certifications', () => {
      const certifications = ['ISO9001', 'ISO14001', 'HACCP', 'GMP', 'FSSC22000']

      const plant: ManufacturingPlant = {
        $type: 'Location',
        $id: 'urn:epc:id:sgln:0614141.00999.0',
        gln: '0614141009999',
        name: 'Certified Plant',
        locationType: 'manufacturingPlant',
        certifications,
      }

      expect(plant.certifications).toHaveLength(5)
      expect(plant.certifications).toEqual(certifications)
      certifications.forEach((cert) => {
        expect(plant.certifications).toContain(cert)
      })
    })

    it('should support plant without certifications', () => {
      const plant: ManufacturingPlant = {
        $type: 'Location',
        $id: 'urn:epc:id:sgln:0614141.00999.0',
        gln: '0614141009999',
        name: 'Uncertified Plant',
        locationType: 'manufacturingPlant',
      }

      expect(plant.certifications).toBeUndefined()
    })
  })

  describe('Location Hierarchy', () => {
    it('should support parent-child location relationships', () => {
      const campus: Location = {
        $type: 'Location',
        $id: 'urn:epc:id:sgln:0614141.00001.0',
        gln: '0614141000012',
        name: 'Corporate Campus',
        locationType: 'facility',
      }

      const building: Location = {
        $type: 'Location',
        $id: 'urn:epc:id:sgln:0614141.00002.0',
        gln: '0614141000024',
        name: 'Building A',
        locationType: 'warehouse',
        parentLocation: campus.gln,
      }

      expect(building.parentLocation).toBe(campus.gln)
    })
  })

  describe('GLN to EPC URI Conversion', () => {
    it('should convert GLN to SGLN EPC URI', () => {
      const gln = '0614141000012'
      const epcUri = glnToEpcUri(gln)

      expect(epcUri).toContain('urn:epc:id:sgln:')
      expect(epcUri).toContain('0614141')
      expect(epcUri).toContain('.0')
    })

    it('should convert GLN with extension', () => {
      const gln = '0614141000012'
      const extension = '123'
      const epcUri = glnToEpcUri(gln, extension)

      expect(epcUri).toContain('urn:epc:id:sgln:')
      expect(epcUri).toContain('.123')
    })

    it('should throw error for invalid GLN', () => {
      expect(() => glnToEpcUri('invalid')).toThrow('Invalid GLN')
    })
  })

  describe('Location Types', () => {
    it('should support all location type values', () => {
      const types: Location['locationType'][] = [
        'warehouse',
        'store',
        'distributionCenter',
        'manufacturingPlant',
        'depot',
        'terminal',
        'port',
        'airport',
        'railyard',
        'office',
        'farm',
        'facility',
      ]

      types.forEach((locationType) => {
        const location: Location = {
          $type: 'Location',
          $id: 'urn:epc:id:sgln:0614141.00001.0',
          gln: '0614141000012',
          name: `Test ${locationType}`,
          locationType,
        }

        expect(location.locationType).toBe(locationType)
      })
    })
  })
})
