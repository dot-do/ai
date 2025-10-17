/**
 * Linear Types
 *
 * Auto-generated TypeScript types for Linear Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/linear
 */

/**
 * Linear client options
 */
export interface LinearClientOptions {
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
 * Issue resource types
 */
/**
 * Parameters for Issue.create
 * Create a new issue
 */
export interface IssueCreateParams {
  /** Issue creation parameters including teamId, title, description, priority, assigneeId */
  input: any
}

/**
 * Parameters for Issue.get
 * Get an issue by ID
 */
export interface IssueGetParams {
  /** Issue ID */
  id: string
}

/**
 * Parameters for Issue.update
 * Update an issue
 */
export interface IssueUpdateParams {
  /** Issue ID */
  id: string
  /** Issue update parameters */
  input: any
}

/**
 * Parameters for Issue.delete
 * Delete (archive) an issue
 */
export interface IssueDeleteParams {
  /** Issue ID */
  id: string
}

/**
 * Parameters for Issue.list
 * List issues with optional filters
 */
export interface IssueListParams {
  /** Pagination and filter options */
  options?: any
}

/**
 * Parameters for Issue.search
 * Search issues with query and filters
 */
export interface IssueSearchParams {
  /** Search query and filter options */
  options: any
}

/**
 * Project resource types
 */
/**
 * Parameters for Project.create
 * Create a new project
 */
export interface ProjectCreateParams {
  /** Project creation parameters including name, teamIds, description */
  input: any
}

/**
 * Parameters for Project.get
 * Get a project by ID
 */
export interface ProjectGetParams {
  /** Project ID */
  id: string
}

/**
 * Parameters for Project.update
 * Update a project
 */
export interface ProjectUpdateParams {
  /** Project ID */
  id: string
  /** Project update parameters */
  input: any
}

/**
 * Parameters for Project.delete
 * Delete (archive) a project
 */
export interface ProjectDeleteParams {
  /** Project ID */
  id: string
}

/**
 * Parameters for Project.list
 * List projects
 */
export interface ProjectListParams {
  /** Pagination options */
  options?: any
}

/**
 * Team resource types
 */
/**
 * Parameters for Team.get
 * Get a team by ID
 */
export interface TeamGetParams {
  /** Team ID */
  id: string
}

/**
 * Parameters for Team.list
 * List all teams
 */
export interface TeamListParams {
  /** Pagination options */
  options?: any
}

/**
 * Parameters for Team.getMembers
 * Get team members
 */
export interface TeamGetMembersParams {
  /** Team ID */
  teamId: string
}

/**
 * User resource types
 */
/**
 * Parameters for User.get
 * Get a user by ID
 */
export interface UserGetParams {
  /** User ID */
  id: string
}

/**
 * Parameters for User.list
 * List all users
 */
export interface UserListParams {
  /** Pagination options */
  options?: any
}

/**
 * Comment resource types
 */
/**
 * Parameters for Comment.create
 * Create a new comment
 */
export interface CommentCreateParams {
  /** Comment creation parameters including issueId and body */
  input: any
}

/**
 * Parameters for Comment.get
 * Get a comment by ID
 */
export interface CommentGetParams {
  /** Comment ID */
  id: string
}

/**
 * Parameters for Comment.update
 * Update a comment
 */
export interface CommentUpdateParams {
  /** Comment ID */
  id: string
  /** Comment update parameters */
  input: any
}

/**
 * Parameters for Comment.delete
 * Delete a comment
 */
export interface CommentDeleteParams {
  /** Comment ID */
  id: string
}

/**
 * Label resource types
 */
/**
 * Parameters for Label.create
 * Create a new label
 */
export interface LabelCreateParams {
  /** Label creation parameters including teamId, name, color */
  input: any
}

/**
 * Parameters for Label.get
 * Get a label by ID
 */
export interface LabelGetParams {
  /** Label ID */
  id: string
}

/**
 * Parameters for Label.update
 * Update a label
 */
export interface LabelUpdateParams {
  /** Label ID */
  id: string
  /** Label update parameters */
  input: any
}

/**
 * Parameters for Label.delete
 * Delete a label
 */
export interface LabelDeleteParams {
  /** Label ID */
  id: string
}

/**
 * Parameters for Label.list
 * List labels
 */
export interface LabelListParams {
  /** Team ID to filter by */
  teamId?: string
  /** Pagination options */
  options?: any
}

/**
 * WorkflowState resource types
 */
/**
 * Parameters for WorkflowState.get
 * Get a workflow state by ID
 */
export interface WorkflowStateGetParams {
  /** Workflow state ID */
  id: string
}

/**
 * Parameters for WorkflowState.list
 * List workflow states
 */
export interface WorkflowStateListParams {
  /** Team ID to filter by */
  teamId?: string
  /** Pagination options */
  options?: any
}

/**
 * Cycle resource types
 */
/**
 * Parameters for Cycle.get
 * Get a cycle by ID
 */
export interface CycleGetParams {
  /** Cycle ID */
  id: string
}

/**
 * Parameters for Cycle.list
 * List cycles
 */
export interface CycleListParams {
  /** Cycle filter options */
  filter?: any
  /** Pagination options */
  options?: any
}

/**
 * Parameters for Cycle.active
 * Get the active cycle for a team
 */
export interface CycleActiveParams {
  /** Team ID */
  teamId: string
}

/**
 * Milestone resource types
 */
/**
 * Parameters for Milestone.create
 * Create a new milestone
 */
export interface MilestoneCreateParams {
  /** Milestone creation parameters */
  input: any
}

/**
 * Parameters for Milestone.get
 * Get a milestone by ID
 */
export interface MilestoneGetParams {
  /** Milestone ID */
  id: string
}

/**
 * Parameters for Milestone.update
 * Update a milestone
 */
export interface MilestoneUpdateParams {
  /** Milestone ID */
  id: string
  /** Milestone update parameters */
  input: any
}

/**
 * Parameters for Milestone.delete
 * Delete a milestone
 */
export interface MilestoneDeleteParams {
  /** Milestone ID */
  id: string
}

/**
 * SDK type re-exports
 */
export type * from '@linear/sdk'
