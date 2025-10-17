/**
 * Payload CMS initialization utilities
 *
 * Handles initialization of Payload CMS on Cloudflare Durable Objects
 * using the @payloadcms/db-do-sqlite adapter.
 */

import type { PayloadInitOptions, PayloadInstance, DatabaseMetadata } from './types.js'
import { getEnabledCollections, isPayloadEnabled } from './metadata.js'

/**
 * Initialize Payload CMS with Durable Objects SQLite adapter
 *
 * @param options - Initialization options
 * @returns Payload instance wrapper
 *
 * @example
 * ```typescript
 * const payloadInstance = await initializePayload({
 *   state: this.ctx,
 *   secret: env.PAYLOAD_SECRET,
 *   metadata: databaseMetadata,
 *   debug: false,
 * })
 *
 * if (payloadInstance.enabled) {
 *   // Use Payload
 *   return payloadInstance.handleRequest(request)
 * }
 * ```
 */
export async function initializePayload(options: PayloadInitOptions): Promise<PayloadInstance> {
  const { state, secret, metadata, debug = false } = options

  // Check if Payload is enabled
  if (!isPayloadEnabled(metadata)) {
    console.log('Payload CMS not enabled for this database')
    return createDisabledPayloadInstance(metadata)
  }

  try {
    // Import Payload and DO adapter (optional peer dependencies)
    // Using Function constructor to bypass TypeScript's static analysis
    const importModule = new Function('specifier', 'return import(specifier)')

    const payloadModule = await importModule('payload')
    const getPayload = payloadModule.getPayload

    const adapterModule = await importModule('@payloadcms/db-do-sqlite')
    const DOSQLiteAdapter = adapterModule.DOSQLiteAdapter

    // Import platform collections (optional peer dependency)
    const platformModule = await importModule('@dotdo/platform/collections')
    const allCollections = platformModule.collections

    // Filter enabled collections
    const enabledSlugs = getEnabledCollections(metadata)
    const enabledCollections = allCollections.filter((collection: any) => enabledSlugs.includes(collection.slug))

    if (enabledCollections.length === 0) {
      console.warn('No collections enabled, Payload will not be initialized')
      return createDisabledPayloadInstance(metadata)
    }

    console.log(`Initializing Payload with ${enabledCollections.length} collections:`, enabledSlugs)

    // Initialize Payload (using any to bypass strict type checking for dynamic config)
    const payload: any = await getPayload({
      config: {
        collections: enabledCollections as any,
        db: DOSQLiteAdapter({
          storage: state.storage,
          debug,
        }),
        secret,
        admin: {
          disable: false,
        } as any,
        routes: {
          api: metadata.payload!.apiPath,
          admin: metadata.payload!.adminPath,
        } as any,
        email: {
          // Use console transport in DO environment
          transport: 'console',
        } as any,
        telemetry: false,
      } as any,
    })

    console.log('Payload CMS initialized successfully')

    return {
      payload,
      enabled: true,
      config: metadata.payload!,
      // Payload request handler (type as any for runtime flexibility)
      handleRequest: (request: Request) => (payload as any).fetch?.(request) || Promise.resolve(new Response('Not implemented', { status: 501 })),
    }
  } catch (error) {
    console.error('Failed to initialize Payload:', error)
    throw error
  }
}

/**
 * Create a disabled Payload instance
 */
function createDisabledPayloadInstance(metadata: DatabaseMetadata): PayloadInstance {
  return {
    payload: null,
    enabled: false,
    config: metadata.payload || {
      enabled: false,
      collections: [],
      adminPath: '/admin',
      apiPath: '/api',
    },
    handleRequest: async () => {
      return Response.json(
        {
          error: 'Payload CMS not enabled',
          message: 'This database does not have Payload CMS enabled. Please configure Payload collections in the Database settings.',
        },
        { status: 404 }
      )
    },
  }
}

/**
 * Check if a request should be handled by Payload
 *
 * @param request - HTTP request
 * @param config - Payload configuration
 * @returns True if request should be handled by Payload
 */
export function shouldHandleWithPayload(request: Request, config: { adminPath: string; apiPath: string }): boolean {
  const url = new URL(request.url)
  const path = url.pathname

  // Check if request is for Payload admin UI or API
  return path.startsWith(config.adminPath) || path.startsWith(config.apiPath)
}

/**
 * Create a Payload health check response
 *
 * @param metadata - Database metadata
 * @param payloadInstance - Payload instance
 * @returns Health check response
 */
export function createPayloadHealthResponse(metadata: DatabaseMetadata, payloadInstance: PayloadInstance): Response {
  return Response.json({
    status: 'healthy',
    database: {
      id: metadata.id,
      name: metadata.name,
      slug: metadata.slug,
      type: metadata.type,
      status: metadata.status,
    },
    payload: {
      enabled: payloadInstance.enabled,
      collections: payloadInstance.enabled ? getEnabledCollections(metadata) : [],
      adminPath: payloadInstance.config.adminPath,
      apiPath: payloadInstance.config.apiPath,
    },
    tenantId: metadata.tenant.tenantId,
  })
}
