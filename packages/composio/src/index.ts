/**
 * Composio client for .do platform
 *
 * @example
 * ```typescript
 * import { ComposioClient } from 'composio'
 *
 * const client = new ComposioClient({
 *   apiKey: process.env.COMPOSIO_API_KEY
 * })
 *
 * // List apps
 * const apps = await client.listApps()
 *
 * // Execute action
 * const result = await client.executeAction({
 *   actionName: 'GITHUB_CREATE_ISSUE',
 *   userId: 'user-123',
 *   params: {
 *     title: 'Bug report',
 *     body: 'Description'
 *   }
 * })
 * ```
 */

export { ComposioClient } from './client.js'
export * from './types.js'
export * from './errors.js'
export * from './utils.js'

// Default export
export { ComposioClient as default } from './client.js'
