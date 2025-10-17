/**
 * Jira Types
 *
 * Auto-generated TypeScript types for Jira Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/jira
 */

/**
 * Jira client options
 */
export interface JiraClientOptions {
  /** OAuth2 access token */
  accessToken: string
  /** Base URL override (optional) */
  baseUrl?: string
  /** Request timeout in milliseconds (optional) */
  timeout?: number
  /** Number of retry attempts (optional) */
  retryAttempts?: number
}

/**
 * Issue resource types
 */
/**
 * Parameters for Issue.create
 */
export interface IssueCreateParams {
  /** Issue fields (summary, project, issuetype, etc.) */
  fields: Record<string, any>
}

/**
 * Parameters for Issue.get
 */
export interface IssueGetParams {
  /** Issue ID or key */
  issue_id_or_key: string
}

/**
 * Parameters for Issue.update
 */
export interface IssueUpdateParams {
  /** Issue ID or key */
  issue_id_or_key: string
  /** Updated fields */
  fields: Record<string, any>
}

/**
 * Parameters for Issue.delete
 */
export interface IssueDeleteParams {
  /** Issue ID or key */
  issue_id_or_key: string
}

/**
 * Parameters for Issue.list
 */
export interface IssueListParams {
  /** JQL query string */
  jql?: string
  /** Fields to return */
  fields?: any[]
}

/**
 * Project resource types
 */
/**
 * Parameters for Project.create
 */
export interface ProjectCreateParams {
  /** Project key */
  key: string
  /** Project name */
  name: string
  /** Project type (software, business, service_desk) */
  projectTypeKey: string
  /** Project lead account ID */
  leadAccountId: string
}

/**
 * Parameters for Project.get
 */
export interface ProjectGetParams {
  /** Project ID or key */
  project_id_or_key: string
}

/**
 * Parameters for Project.update
 */
export interface ProjectUpdateParams {
  /** Project ID or key */
  project_id_or_key: string
  /** Updated name */
  name?: string
}

/**
 * Parameters for Project.delete
 */
export interface ProjectDeleteParams {
  /** Project ID or key */
  project_id_or_key: string
}

/**
 * Parameters for Project.list
 */
export interface ProjectListParams {
  /** Search query */
  query?: string
}

/**
 * Sprint resource types
 */
/**
 * Parameters for Sprint.create
 */
export interface SprintCreateParams {
  /** Sprint name */
  name: string
  /** Board ID */
  originBoardId: number
  /** Start date (ISO 8601) */
  startDate?: string
  /** End date (ISO 8601) */
  endDate?: string
}

/**
 * Parameters for Sprint.get
 */
export interface SprintGetParams {
  /** Sprint ID */
  sprint_id: number
}

/**
 * Parameters for Sprint.update
 */
export interface SprintUpdateParams {
  /** Sprint ID */
  sprint_id: number
  /** Updated name */
  name?: string
  /** Sprint state (future, active, closed) */
  state?: string
}

/**
 * Parameters for Sprint.delete
 */
export interface SprintDeleteParams {
  /** Sprint ID */
  sprint_id: number
}

/**
 * Parameters for Sprint.list
 */
export interface SprintListParams {
  /** Board ID */
  board_id: number
}

/**
 * Board resource types
 */
/**
 * Parameters for Board.create
 */
export interface BoardCreateParams {
  /** Board name */
  name: string
  /** Board type (scrum or kanban) */
  type: string
  /** Filter ID */
  filterId: number
}

/**
 * Parameters for Board.get
 */
export interface BoardGetParams {
  /** Board ID */
  board_id: number
}

/**
 * Parameters for Board.delete
 */
export interface BoardDeleteParams {
  /** Board ID */
  board_id: number
}

/**
 * Parameters for Board.list
 */
export interface BoardListParams {
  /** Filter by type (scrum or kanban) */
  type?: string
}

/**
 * SDK type re-exports
 */
export type * from 'jira-client'
