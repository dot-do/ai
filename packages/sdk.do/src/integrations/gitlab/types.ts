/**
 * GitLab Types
 *
 * Auto-generated TypeScript types for GitLab Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gitlab
 */

/**
 * GitLab client options
 */
export interface GitlabClientOptions {
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
 * Project resource types
 */
/**
 * Parameters for Project.create
 */
export interface ProjectCreateParams {
  /** Project name */
  name: string
  /** Project description */
  description?: string
  /** Project visibility (private, internal, public) */
  visibility?: string
}

/**
 * Parameters for Project.get
 */
export interface ProjectGetParams {
  /** Project ID or path */
  project_id: string
}

/**
 * Parameters for Project.update
 */
export interface ProjectUpdateParams {
  /** Project ID */
  project_id: string
  /** Updated name */
  name?: string
  /** Updated description */
  description?: string
}

/**
 * Parameters for Project.delete
 */
export interface ProjectDeleteParams {
  /** Project ID */
  project_id: string
}

/**
 * Parameters for Project.list
 */
export interface ProjectListParams {
  /** Limit by owned projects */
  owned?: boolean
  /** Limit by membership */
  membership?: boolean
}

/**
 * Issue resource types
 */
/**
 * Parameters for Issue.create
 */
export interface IssueCreateParams {
  /** Project ID */
  project_id: string
  /** Issue title */
  title: string
  /** Issue description */
  description?: string
  /** Comma-separated label names */
  labels?: string
}

/**
 * Parameters for Issue.get
 */
export interface IssueGetParams {
  /** Project ID */
  project_id: string
  /** Issue IID (internal ID) */
  issue_iid: number
}

/**
 * Parameters for Issue.update
 */
export interface IssueUpdateParams {
  /** Project ID */
  project_id: string
  /** Issue IID */
  issue_iid: number
  /** Updated title */
  title?: string
  /** State change (close, reopen) */
  state_event?: string
}

/**
 * Parameters for Issue.list
 */
export interface IssueListParams {
  /** Project ID */
  project_id: string
  /** Filter by state (opened, closed, all) */
  state?: string
}

/**
 * MergeRequest resource types
 */
/**
 * Parameters for MergeRequest.create
 */
export interface MergeRequestCreateParams {
  /** Project ID */
  project_id: string
  /** Source branch name */
  source_branch: string
  /** Target branch name */
  target_branch: string
  /** Merge request title */
  title: string
}

/**
 * Parameters for MergeRequest.get
 */
export interface MergeRequestGetParams {
  /** Project ID */
  project_id: string
  /** Merge request IID */
  merge_request_iid: number
}

/**
 * Parameters for MergeRequest.update
 */
export interface MergeRequestUpdateParams {
  /** Project ID */
  project_id: string
  /** Merge request IID */
  merge_request_iid: number
  /** Updated title */
  title?: string
  /** State change (close, reopen) */
  state_event?: string
}

/**
 * Parameters for MergeRequest.merge
 */
export interface MergeRequestMergeParams {
  /** Project ID */
  project_id: string
  /** Merge request IID */
  merge_request_iid: number
  /** Custom merge commit message */
  merge_commit_message?: string
}

/**
 * Parameters for MergeRequest.list
 */
export interface MergeRequestListParams {
  /** Project ID */
  project_id: string
  /** Filter by state (opened, closed, merged, all) */
  state?: string
}

/**
 * Pipeline resource types
 */
/**
 * Parameters for Pipeline.create
 */
export interface PipelineCreateParams {
  /** Project ID */
  project_id: string
  /** Branch or tag name */
  ref: string
  /** Pipeline variables */
  variables?: any[]
}

/**
 * Parameters for Pipeline.get
 */
export interface PipelineGetParams {
  /** Project ID */
  project_id: string
  /** Pipeline ID */
  pipeline_id: number
}

/**
 * Parameters for Pipeline.cancel
 */
export interface PipelineCancelParams {
  /** Project ID */
  project_id: string
  /** Pipeline ID */
  pipeline_id: number
}

/**
 * Parameters for Pipeline.retry
 */
export interface PipelineRetryParams {
  /** Project ID */
  project_id: string
  /** Pipeline ID */
  pipeline_id: number
}

/**
 * Parameters for Pipeline.list
 */
export interface PipelineListParams {
  /** Project ID */
  project_id: string
  /** Filter by status (running, pending, success, failed) */
  status?: string
}

/**
 * SDK type re-exports
 */
export type * from '@gitbeaker/rest'
