/**
 * Bitbucket Types
 *
 * Auto-generated TypeScript types for Bitbucket Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bitbucket
 */

/**
 * Bitbucket client options
 */
export interface BitbucketClientOptions {
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
 * Repository resource types
 */
/**
 * Parameters for Repository.create
 */
export interface RepositoryCreateParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
  /** SCM type (git or hg) */
  scm?: string
  /** Private repository flag */
  is_private?: boolean
}

/**
 * Parameters for Repository.get
 */
export interface RepositoryGetParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
}

/**
 * Parameters for Repository.update
 */
export interface RepositoryUpdateParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
  /** Updated description */
  description?: string
}

/**
 * Parameters for Repository.delete
 */
export interface RepositoryDeleteParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
}

/**
 * Parameters for Repository.list
 */
export interface RepositoryListParams {
  /** Workspace ID */
  workspace: string
  /** Filter by role (owner, contributor, member) */
  role?: string
}

/**
 * PullRequest resource types
 */
/**
 * Parameters for PullRequest.create
 */
export interface PullRequestCreateParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
  /** Pull request title */
  title: string
  /** Source branch info */
  source: Record<string, any>
  /** Destination branch info */
  destination: Record<string, any>
}

/**
 * Parameters for PullRequest.get
 */
export interface PullRequestGetParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
  /** Pull request ID */
  pull_request_id: number
}

/**
 * Parameters for PullRequest.update
 */
export interface PullRequestUpdateParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
  /** Pull request ID */
  pull_request_id: number
  /** Updated title */
  title?: string
}

/**
 * Parameters for PullRequest.merge
 */
export interface PullRequestMergeParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
  /** Pull request ID */
  pull_request_id: number
  /** Merge strategy (merge_commit, squash, fast_forward) */
  merge_strategy?: string
}

/**
 * Parameters for PullRequest.list
 */
export interface PullRequestListParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
  /** Filter by state (OPEN, MERGED, DECLINED, SUPERSEDED) */
  state?: string
}

/**
 * Issue resource types
 */
/**
 * Parameters for Issue.create
 */
export interface IssueCreateParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
  /** Issue title */
  title: string
  /** Issue content */
  content?: Record<string, any>
}

/**
 * Parameters for Issue.get
 */
export interface IssueGetParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
  /** Issue ID */
  issue_id: number
}

/**
 * Parameters for Issue.update
 */
export interface IssueUpdateParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
  /** Issue ID */
  issue_id: number
  /** Updated title */
  title?: string
}

/**
 * Parameters for Issue.list
 */
export interface IssueListParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
}

/**
 * Pipeline resource types
 */
/**
 * Parameters for Pipeline.create
 */
export interface PipelineCreateParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
  /** Pipeline target (branch, commit, etc.) */
  target: Record<string, any>
}

/**
 * Parameters for Pipeline.get
 */
export interface PipelineGetParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
  /** Pipeline UUID */
  pipeline_uuid: string
}

/**
 * Parameters for Pipeline.stop
 */
export interface PipelineStopParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
  /** Pipeline UUID */
  pipeline_uuid: string
}

/**
 * Parameters for Pipeline.list
 */
export interface PipelineListParams {
  /** Workspace ID */
  workspace: string
  /** Repository slug */
  repo_slug: string
}
