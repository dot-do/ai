/**
 * Integration Types for Zapier/n8n/O*NET Triggers/Searches/Actions
 *
 * These types define the structure for integration points from:
 * - Zapier apps (~7,000 apps with triggers/searches/actions)
 * - n8n nodes (~400+ nodes with operations)
 * - O*NET tools/technology (tools and software used by occupations)
 */

/**
 * Field definition for integration inputs/outputs
 */
export interface IntegrationField {
  /** Unique key for the field */
  key: string
  /** Human-readable label */
  label: string
  /** Field type (string, number, boolean, array, object, etc.) */
  type: string
  /** Whether the field is required */
  required: boolean
  /** Optional description of the field */
  description?: string
  /** Default value if any */
  default?: string | number | boolean | null
  /** List of allowed values (for enums) */
  choices?: string[]
  /** Placeholder text for UI */
  placeholder?: string
  /** Help text for the field */
  helpText?: string
}

/**
 * Trigger definition - starts workflows when events occur
 */
export interface IntegrationTrigger {
  $type: 'Trigger'
  $id: string
  /** Unique key for the trigger */
  key: string
  /** Human-readable name */
  name: string
  /** Display name for UI */
  displayName?: string
  /** Detailed description */
  description: string
  /** Input fields for configuring the trigger */
  inputFields: IntegrationField[]
  /** Output fields returned by the trigger */
  outputFields: IntegrationField[]
  /** Whether this is a polling trigger */
  polling?: boolean
  /** Whether this is a webhook/instant trigger */
  webhook?: boolean
  /** Polling interval in seconds (if polling) */
  pollingInterval?: number
  /** Whether trigger is visible/active */
  visible?: boolean
  /** Whether trigger is deprecated */
  deprecated?: boolean
}

/**
 * Search definition - finds existing records
 */
export interface IntegrationSearch {
  $type: 'Search'
  $id: string
  /** Unique key for the search */
  key: string
  /** Human-readable name */
  name: string
  /** Display name for UI */
  displayName?: string
  /** Detailed description */
  description: string
  /** Input fields for the search query */
  inputFields: IntegrationField[]
  /** Output fields returned by the search */
  outputFields: IntegrationField[]
  /** Whether search is visible/active */
  visible?: boolean
  /** Whether search is deprecated */
  deprecated?: boolean
}

/**
 * Action definition - performs operations
 */
export interface IntegrationAction {
  $type: 'Action'
  $id: string
  /** Unique key for the action */
  key: string
  /** Human-readable name */
  name: string
  /** Display name for UI */
  displayName?: string
  /** Detailed description */
  description: string
  /** Input fields for the action */
  inputFields: IntegrationField[]
  /** Output fields returned by the action */
  outputFields: IntegrationField[]
  /** Whether action is visible/active */
  visible?: boolean
  /** Whether action is deprecated */
  deprecated?: boolean
}

/**
 * Main integration app/node definition
 */
export interface Integration {
  $type: 'Integration'
  $id: string
  /** Unique key for the integration */
  key: string
  /** Human-readable name */
  name: string
  /** Short description */
  description: string
  /** Platform this integration belongs to */
  platform: 'zapier' | 'n8n' | 'onet'
  /** Category or type */
  category: string
  /** URL to icon/logo */
  imageUrl?: string
  /** URL to app page */
  url?: string
  /** App version */
  version?: string
  /** Authentication type */
  authType?: 'oauth2' | 'api_key' | 'basic' | 'custom' | 'none'
  /** List of triggers */
  triggers: IntegrationTrigger[]
  /** List of searches */
  searches: IntegrationSearch[]
  /** List of actions */
  actions: IntegrationAction[]
  /** Whether integration is visible/active */
  visible?: boolean
  /** Whether integration is deprecated */
  deprecated?: boolean
  /** Tags for categorization */
  tags?: string[]
}

/**
 * Semantic path patterns for integrations
 *
 * Examples:
 * - $.Gmail.triggers.newEmail
 * - $.Gmail.searches.findEmail
 * - $.Gmail.actions.sendEmail
 * - $.Slack.triggers.messageReceived
 * - $.n8n.HTTP.actions.request
 * - $.SoftwareDeveloper.usesTool.Git
 */
export type IntegrationPath = `$.${string}.triggers.${string}` | `$.${string}.searches.${string}` | `$.${string}.actions.${string}`

/**
 * Integration event for workflow triggers
 */
export interface IntegrationEvent<T = unknown> {
  /** Event type */
  type: 'trigger' | 'search' | 'action'
  /** Integration key */
  integration: string
  /** Trigger/search/action key */
  operation: string
  /** Event data */
  data: T
  /** Timestamp */
  timestamp: number
  /** Event ID */
  id: string
  /** Metadata */
  meta?: Record<string, unknown>
}

/**
 * O*NET specific types for tools/technology
 */
export interface ONetTool {
  $type: 'ONetTool'
  $id: string
  /** Tool name */
  name: string
  /** Tool description */
  description: string
  /** Category (software, hardware, etc.) */
  category: 'software' | 'hardware' | 'technology' | 'tool'
  /** Associated occupations (SOC codes) */
  occupations: string[]
  /** Vendor/manufacturer */
  vendor?: string
  /** Tool URL */
  url?: string
}

/**
 * Type guards
 */
export function isIntegrationTrigger(obj: unknown): obj is IntegrationTrigger {
  return typeof obj === 'object' && obj !== null && '$type' in obj && obj.$type === 'Trigger'
}

export function isIntegrationSearch(obj: unknown): obj is IntegrationSearch {
  return typeof obj === 'object' && obj !== null && '$type' in obj && obj.$type === 'Search'
}

export function isIntegrationAction(obj: unknown): obj is IntegrationAction {
  return typeof obj === 'object' && obj !== null && '$type' in obj && obj.$type === 'Action'
}

export function isIntegration(obj: unknown): obj is Integration {
  return typeof obj === 'object' && obj !== null && '$type' in obj && obj.$type === 'Integration'
}
