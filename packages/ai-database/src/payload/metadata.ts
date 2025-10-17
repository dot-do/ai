/**
 * Database metadata fetching utilities
 *
 * Fetches database configuration from central Payload CMS.
 */

import type { DatabaseMetadata, MetadataFetchOptions, MetadataFetchResult } from './types.js'

/**
 * Fetch database metadata from central Payload CMS
 *
 * @param options - Fetch options
 * @returns Metadata fetch result
 *
 * @example
 * ```typescript
 * const { metadata } = await fetchDatabaseMetadata({
 *   payloadBinding: env.PAYLOAD,
 *   doId: ctx.id.toString(),
 * })
 * ```
 */
export async function fetchDatabaseMetadata(options: MetadataFetchOptions): Promise<MetadataFetchResult> {
  const { payloadBinding, doId } = options

  try {
    // Query central Payload for this database
    const response = await payloadBinding.fetch('https://admin.dotdo.workers.dev/api/databases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        where: {
          'durableObject.doId': { equals: doId },
        },
        limit: 1,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch database metadata: ${response.status}`)
    }

    const result = await response.json<any>()
    const metadata = result.docs?.[0]

    if (!metadata) {
      throw new Error(`Database not found for DO ID: ${doId}`)
    }

    return {
      metadata,
      fromCache: false,
    }
  } catch (error) {
    console.error('Error fetching metadata:', error)

    // Return default metadata on error
    const defaultMetadata: DatabaseMetadata = {
      id: doId,
      name: 'Unknown',
      slug: doId,
      type: 'sqlite',
      status: 'active',
      tenant: {
        type: 'system',
        tenantId: doId,
      },
      durableObject: {
        doId,
        namespace: 'DB_INSTANCE',
        endpoint: '',
      },
      payload: {
        enabled: false,
        collections: [],
        adminPath: '/admin',
        apiPath: '/api',
      },
    }

    return {
      metadata: defaultMetadata,
      fromCache: false,
    }
  }
}

/**
 * Create a metadata cache key
 */
export function createMetadataCacheKey(doId: string): string {
  return `metadata:${doId}`
}

/**
 * Check if Payload is enabled for a database
 */
export function isPayloadEnabled(metadata: DatabaseMetadata): boolean {
  return metadata.payload?.enabled === true && (metadata.payload?.collections?.length ?? 0) > 0
}

/**
 * Get enabled collection slugs from metadata
 */
export function getEnabledCollections(metadata: DatabaseMetadata): string[] {
  if (!metadata.payload?.enabled) {
    return []
  }

  return metadata.payload.collections.filter((c) => c.enabled).map((c) => c.slug)
}
