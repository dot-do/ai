/**
 * Sentry Types
 *
 * Auto-generated TypeScript types for Sentry Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sentry
 */

/**
 * Sentry client options
 */
export interface SentryClientOptions {
  /** API key for authentication */
  apiKey: string
  /** Base URL override (optional) */
  baseUrl?: string
  /** Request timeout in milliseconds (optional) */
  timeout?: number
  /** Number of retry attempts (optional) */
  retryAttempts?: number
}

/**
 * Event resource types
 */
/**
 * Parameters for Event.get
 */
export interface EventGetParams {
  /** Organization slug */
  organization_slug: string
  /** Event ID */
  event_id: string
}

/**
 * Parameters for Event.list
 */
export interface EventListParams {
  /** Organization slug */
  organization_slug: string
  /** Search query */
  query?: string
}

/**
 * Issue resource types
 */
/**
 * Parameters for Issue.get
 */
export interface IssueGetParams {
  /** Organization slug */
  organization_slug: string
  /** Issue ID */
  issue_id: string
}

/**
 * Parameters for Issue.update
 */
export interface IssueUpdateParams {
  /** Organization slug */
  organization_slug: string
  /** Issue ID */
  issue_id: string
  /** Issue status (resolved, ignored, unresolved) */
  status?: string
}

/**
 * Parameters for Issue.delete
 */
export interface IssueDeleteParams {
  /** Organization slug */
  organization_slug: string
  /** Issue ID */
  issue_id: string
}

/**
 * Parameters for Issue.list
 */
export interface IssueListParams {
  /** Organization slug */
  organization_slug: string
  /** Search query */
  query?: string
}

/**
 * Project resource types
 */
/**
 * Parameters for Project.create
 */
export interface ProjectCreateParams {
  /** Organization slug */
  organization_slug: string
  /** Team slug */
  team_slug: string
  /** Project name */
  name: string
  /** Project platform (javascript, python, etc.) */
  platform?: string
}

/**
 * Parameters for Project.get
 */
export interface ProjectGetParams {
  /** Organization slug */
  organization_slug: string
  /** Project slug */
  project_slug: string
}

/**
 * Parameters for Project.update
 */
export interface ProjectUpdateParams {
  /** Organization slug */
  organization_slug: string
  /** Project slug */
  project_slug: string
  /** Updated name */
  name?: string
}

/**
 * Parameters for Project.delete
 */
export interface ProjectDeleteParams {
  /** Organization slug */
  organization_slug: string
  /** Project slug */
  project_slug: string
}

/**
 * Parameters for Project.list
 */
export interface ProjectListParams {
  /** Organization slug */
  organization_slug: string
}

/**
 * Release resource types
 */
/**
 * Parameters for Release.create
 */
export interface ReleaseCreateParams {
  /** Organization slug */
  organization_slug: string
  /** Release version */
  version: string
  /** Project slugs */
  projects: any[]
}

/**
 * Parameters for Release.get
 */
export interface ReleaseGetParams {
  /** Organization slug */
  organization_slug: string
  /** Release version */
  version: string
}

/**
 * Parameters for Release.update
 */
export interface ReleaseUpdateParams {
  /** Organization slug */
  organization_slug: string
  /** Release version */
  version: string
  /** Release date (ISO 8601) */
  dateReleased?: string
}

/**
 * Parameters for Release.delete
 */
export interface ReleaseDeleteParams {
  /** Organization slug */
  organization_slug: string
  /** Release version */
  version: string
}

/**
 * Parameters for Release.list
 */
export interface ReleaseListParams {
  /** Organization slug */
  organization_slug: string
}

/**
 * SDK type re-exports
 */
export type * from '@sentry/node'
