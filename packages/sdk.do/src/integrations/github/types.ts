/**
 * GitHub Types
 *
 * Auto-generated TypeScript types for GitHub Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/github
 */

/**
 * GitHub client options
 */
export interface GithubClientOptions {
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
 * Repository resource types
 */
/**
 * Parameters for Repository.get
 */
export interface RepositoryGetParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
}

/**
 * Parameters for Repository.list
 */
export interface RepositoryListParams {
  /** Results per page */
  per_page?: number
  /** Page number */
  page?: number
  /** Sort field */
  sort?: string
  /** Sort direction */
  direction?: string
  /** Filter by visibility */
  visibility?: string
  /** Filter by affiliation */
  affiliation?: string
  /** Type of repositories to list */
  type?: string
}

/**
 * Parameters for Repository.create
 */
export interface RepositoryCreateParams {
  /** Repository name */
  name: string
  /** Repository description */
  description?: string
  /** Whether the repository should be private */
  private?: boolean
  /** Initialize with a README */
  auto_init?: boolean
  /** License template to use */
  license_template?: string
  /** .gitignore template to use */
  gitignore_template?: string
  /** Whether to allow squash merging */
  allow_squash_merge?: boolean
  /** Whether to allow merge commits */
  allow_merge_commit?: boolean
  /** Whether to allow rebase merging */
  allow_rebase_merge?: boolean
}

/**
 * Parameters for Repository.update
 */
export interface RepositoryUpdateParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** Repository name */
  name?: string
  /** Repository description */
  description?: string
  /** Whether the repository should be private */
  private?: boolean
  /** Whether to archive the repository */
  archived?: boolean
  /** Default branch name */
  default_branch?: string
}

/**
 * Parameters for Repository.delete
 */
export interface RepositoryDeleteParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
}

/**
 * Issue resource types
 */
/**
 * Parameters for Issue.list
 */
export interface IssueListParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** Results per page */
  per_page?: number
  /** Page number */
  page?: number
  /** Filter by issue state (open, closed, all) */
  state?: string
  /** Filter by labels (comma-separated) */
  labels?: string
  /** Sort by field (created, updated, comments) */
  sort?: string
  /** Sort direction */
  direction?: string
  /** Filter by assignee */
  assignee?: string
  /** Filter by creator */
  creator?: string
  /** Filter by mentioned user */
  mentioned?: string
  /** Filter by milestone number */
  milestone?: string
}

/**
 * Parameters for Issue.get
 */
export interface IssueGetParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** Issue number */
  issue_number: number
}

/**
 * Parameters for Issue.create
 */
export interface IssueCreateParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** Issue title */
  title: string
  /** Issue body/description */
  body?: string
  /** Usernames to assign to the issue */
  assignees?: any
  /** Labels to apply to the issue */
  labels?: any
  /** Milestone number */
  milestone?: number
}

/**
 * Parameters for Issue.update
 */
export interface IssueUpdateParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** Issue number */
  issue_number: number
  /** Issue title */
  title?: string
  /** Issue body/description */
  body?: string
  /** Issue state (open or closed) */
  state?: string
  /** Usernames to assign to the issue */
  assignees?: any
  /** Labels to apply to the issue */
  labels?: any
  /** Milestone number */
  milestone?: number
}

/**
 * Parameters for Issue.lock
 */
export interface IssueLockParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** Issue number */
  issue_number: number
}

/**
 * Parameters for Issue.addLabels
 */
export interface IssueAddLabelsParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** Issue number */
  issue_number: number
  /** Array of label names */
  labels: any
}

/**
 * PullRequest resource types
 */
/**
 * Parameters for PullRequest.list
 */
export interface PullRequestListParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** Results per page */
  per_page?: number
  /** Page number */
  page?: number
  /** Filter by PR state (open, closed, all) */
  state?: string
  /** Filter by head branch */
  head?: string
  /** Filter by base branch */
  base?: string
  /** Sort by field (created, updated, popularity, long-running) */
  sort?: string
  /** Sort direction */
  direction?: string
}

/**
 * Parameters for PullRequest.get
 */
export interface PullRequestGetParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** Pull request number */
  pull_number: number
}

/**
 * Parameters for PullRequest.create
 */
export interface PullRequestCreateParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** Pull request title */
  title: string
  /** Branch name containing changes */
  head: string
  /** Branch name to merge into */
  base: string
  /** Pull request body/description */
  body?: string
  /** Whether to create as draft PR */
  draft?: boolean
  /** Whether maintainers can modify the PR */
  maintainer_can_modify?: boolean
}

/**
 * Parameters for PullRequest.update
 */
export interface PullRequestUpdateParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** Pull request number */
  pull_number: number
  /** Pull request title */
  title?: string
  /** Pull request body/description */
  body?: string
  /** Pull request state (open or closed) */
  state?: string
  /** Base branch name */
  base?: string
}

/**
 * Parameters for PullRequest.merge
 */
export interface PullRequestMergeParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** Pull request number */
  pull_number: number
  /** Merge commit message */
  commit_title?: string
  /** Merge commit description */
  commit_message?: string
  /** Merge method to use (merge, squash, rebase) */
  merge_method?: string
  /** SHA that pull request head must match */
  sha?: string
}

/**
 * Content resource types
 */
/**
 * Parameters for Content.get
 */
export interface ContentGetParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** File path */
  path: string
  /** Branch, tag, or commit SHA (defaults to default branch) */
  ref?: string
}

/**
 * Parameters for Content.createOrUpdate
 */
export interface ContentCreateOrUpdateParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** File path */
  path: string
  /** Commit message */
  message: string
  /** File content (base64 encoded) */
  content: string
  /** SHA of the file being replaced (required for updates) */
  sha?: string
  /** Branch name */
  branch?: string
  /** Committer information (name, email) */
  committer?: Record<string, any>
  /** Author information (name, email) */
  author?: Record<string, any>
}

/**
 * Parameters for Content.delete
 */
export interface ContentDeleteParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** File path */
  path: string
  /** Commit message */
  message: string
  /** SHA of the file being deleted */
  sha: string
  /** Branch name */
  branch?: string
  /** Committer information (name, email) */
  committer?: Record<string, any>
  /** Author information (name, email) */
  author?: Record<string, any>
}

/**
 * Branch resource types
 */
/**
 * Parameters for Branch.list
 */
export interface BranchListParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
}

/**
 * Parameters for Branch.get
 */
export interface BranchGetParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** Branch name */
  branch: string
}

/**
 * Parameters for Branch.create
 */
export interface BranchCreateParams {
  /** Repository owner (username or organization) */
  owner: string
  /** Repository name */
  repo: string
  /** Branch name (will be prefixed with refs/heads/) */
  ref: string
  /** SHA to create branch from */
  sha: string
}

/**
 * SDK type re-exports
 */
export type * from '@octokit/rest'
