/**
 * Database type detection and adapter configuration for Payload CMS
 */

export type DatabaseType = 'mongodb' | 'postgres' | 'sqlite'

/**
 * Detects the database type from a connection URI
 * @param uri - Database connection URI
 * @returns The detected database type
 */
export const detectDatabaseType = (uri?: string): DatabaseType => {
  if (!uri) return 'sqlite' // Default per requirements

  if (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://')) {
    return 'mongodb'
  }

  if (uri.startsWith('postgresql://') || uri.startsWith('postgres://')) {
    return 'postgres'
  }

  return 'sqlite' // Default to SQLite for any other format
}

/**
 * Gets the database adapter based on the detected type
 * @param uri - Database connection URI
 * @returns The appropriate database adapter configuration
 */
export const getDatabaseAdapter = (uri?: string) => {
  const type = detectDatabaseType(uri)

  switch (type) {
    case 'mongodb': {
      const { mongooseAdapter } = require('@payloadcms/db-mongodb')
      return mongooseAdapter({
        url: uri || '',
      })
    }
    case 'postgres': {
      const { postgresAdapter } = require('@payloadcms/db-postgres')
      return postgresAdapter({
        pool: {
          connectionString: uri || '',
        },
      })
    }
    case 'sqlite':
    default: {
      const { sqliteAdapter } = require('@payloadcms/db-sqlite')
      return sqliteAdapter({
        client: {
          url: uri || 'sqlite://.data/ai-observability.db',
        },
      })
    }
  }
}
