import { describe, it, expect } from 'vitest'
import { detectDatabaseType, getDatabaseAdapter } from '../src/lib/database'

describe('database', () => {
  describe('detectDatabaseType', () => {
    it('should detect mongodb from uri', () => {
      expect(detectDatabaseType('mongodb://localhost:27017/db')).toBe('mongodb')
      expect(detectDatabaseType('mongodb+srv://user:pass@cluster.mongodb.net/db')).toBe('mongodb')
    })

    it('should detect postgres from uri', () => {
      expect(detectDatabaseType('postgresql://localhost:5432/db')).toBe('postgres')
      expect(detectDatabaseType('postgres://user:pass@host:5432/db')).toBe('postgres')
    })

    it('should default to sqlite', () => {
      expect(detectDatabaseType()).toBe('sqlite')
      expect(detectDatabaseType('sqlite://.data/db.sqlite')).toBe('sqlite')
      expect(detectDatabaseType('unknown://localhost/db')).toBe('sqlite')
    })
  })
})
