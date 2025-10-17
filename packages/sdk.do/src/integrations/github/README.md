# GitHub Integration

Source control, collaboration, and development platform for software projects

**Category**: developer-tools
**Service**: Github
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/github](https://integrations.do/github)

## Installation

```bash
npm install @dotdo/integration-github
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-github
```

## Quick Start

```typescript
import { GithubClient } from '@dotdo/integration-github'

// Initialize client
const client = new GithubClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new GithubClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Repository

#### `repository.get()`

```typescript
const result = await client.repository.get({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
})
```

#### `repository.list()`

```typescript
const result = await client.repository.list({
  per_page: 30, // Results per page
  page: 1, // Page number
  sort: 'updated', // Sort field
  direction: 'example', // Sort direction
  visibility: 'example', // Filter by visibility
  affiliation: 'example', // Filter by affiliation
  type: 'example', // Type of repositories to list
})
```

#### `repository.create()`

```typescript
const result = await client.repository.create({
  name: 'example', // Repository name
  description: 'example', // Repository description
  private: false, // Whether the repository should be private
  auto_init: false, // Initialize with a README
  license_template: 'example', // License template to use
  gitignore_template: 'example', // .gitignore template to use
  allow_squash_merge: true, // Whether to allow squash merging
  allow_merge_commit: true, // Whether to allow merge commits
  allow_rebase_merge: true, // Whether to allow rebase merging
})
```

#### `repository.update()`

```typescript
const result = await client.repository.update({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  name: 'example', // Repository name
  description: 'example', // Repository description
  private: true, // Whether the repository should be private
  archived: true, // Whether to archive the repository
  default_branch: 'example', // Default branch name
})
```

#### `repository.delete()`

```typescript
const result = await client.repository.delete({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
})
```

### Issue

#### `issue.list()`

```typescript
const result = await client.issue.list({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  per_page: 30, // Results per page
  page: 1, // Page number
  state: 'open', // Filter by issue state (open, closed, all)
  labels: 'example', // Filter by labels (comma-separated)
  sort: 'created', // Sort by field (created, updated, comments)
  direction: 'example', // Sort direction
  assignee: 'example', // Filter by assignee
  creator: 'example', // Filter by creator
  mentioned: 'example', // Filter by mentioned user
  milestone: 'example', // Filter by milestone number
})
```

#### `issue.get()`

```typescript
const result = await client.issue.get({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  issue_number: 123, // Issue number
})
```

#### `issue.create()`

```typescript
const result = await client.issue.create({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  title: 'example', // Issue title
  body: 'example', // Issue body/description
  assignees: value, // Usernames to assign to the issue
  labels: value, // Labels to apply to the issue
  milestone: 123, // Milestone number
})
```

#### `issue.update()`

```typescript
const result = await client.issue.update({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  issue_number: 123, // Issue number
  title: 'example', // Issue title
  body: 'example', // Issue body/description
  state: 'example', // Issue state (open or closed)
  assignees: value, // Usernames to assign to the issue
  labels: value, // Labels to apply to the issue
  milestone: 123, // Milestone number
})
```

#### `issue.lock()`

```typescript
const result = await client.issue.lock({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  issue_number: 123, // Issue number
})
```

#### `issue.addLabels()`

```typescript
const result = await client.issue.addLabels({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  issue_number: 123, // Issue number
  labels: value, // Array of label names
})
```

### PullRequest

#### `pullRequest.list()`

```typescript
const result = await client.pullRequest.list({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  per_page: 30, // Results per page
  page: 1, // Page number
  state: 'open', // Filter by PR state (open, closed, all)
  head: 'example', // Filter by head branch
  base: 'example', // Filter by base branch
  sort: 'created', // Sort by field (created, updated, popularity, long-running)
  direction: 'example', // Sort direction
})
```

#### `pullRequest.get()`

```typescript
const result = await client.pullRequest.get({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  pull_number: 123, // Pull request number
})
```

#### `pullRequest.create()`

```typescript
const result = await client.pullRequest.create({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  title: 'example', // Pull request title
  head: 'example', // Branch name containing changes
  base: 'example', // Branch name to merge into
  body: 'example', // Pull request body/description
  draft: false, // Whether to create as draft PR
  maintainer_can_modify: true, // Whether maintainers can modify the PR
})
```

#### `pullRequest.update()`

```typescript
const result = await client.pullRequest.update({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  pull_number: 123, // Pull request number
  title: 'example', // Pull request title
  body: 'example', // Pull request body/description
  state: 'example', // Pull request state (open or closed)
  base: 'example', // Base branch name
})
```

#### `pullRequest.merge()`

```typescript
const result = await client.pullRequest.merge({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  pull_number: 123, // Pull request number
  commit_title: 'example', // Merge commit message
  commit_message: 'example', // Merge commit description
  merge_method: 'merge', // Merge method to use (merge, squash, rebase)
  sha: 'example', // SHA that pull request head must match
})
```

### Content

#### `content.get()`

```typescript
const result = await client.content.get({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  path: 'example', // File path
  ref: 'example', // Branch, tag, or commit SHA (defaults to default branch)
})
```

#### `content.createOrUpdate()`

```typescript
const result = await client.content.createOrUpdate({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  path: 'example', // File path
  message: 'example', // Commit message
  content: 'example', // File content (base64 encoded)
  sha: 'example', // SHA of the file being replaced (required for updates)
  branch: 'example', // Branch name
  committer: {}, // Committer information (name, email)
  author: {}, // Author information (name, email)
})
```

#### `content.delete()`

```typescript
const result = await client.content.delete({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  path: 'example', // File path
  message: 'example', // Commit message
  sha: 'example', // SHA of the file being deleted
  branch: 'example', // Branch name
  committer: {}, // Committer information (name, email)
  author: {}, // Author information (name, email)
})
```

### Branch

#### `branch.list()`

```typescript
const result = await client.branch.list({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
})
```

#### `branch.get()`

```typescript
const result = await client.branch.get({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  branch: 'example', // Branch name
})
```

#### `branch.create()`

```typescript
const result = await client.branch.create({
  owner: 'example', // Repository owner (username or organization)
  repo: 'example', // Repository name
  ref: 'example', // Branch name (will be prefixed with refs/heads/)
  sha: 'example', // SHA to create branch from
})
```

## Error Handling

All errors are thrown as `GithubError` instances with additional metadata:

```typescript
try {
  const result = await client.repository.list()
} catch (error) {
  if (error instanceof GithubError) {
    console.error('Error type:', error.type)
    console.error('Error code:', error.code)
    console.error('Status code:', error.statusCode)
    console.error('Retryable:', error.isRetriable())
  }
}
```

**Error Types:**

- `authentication` - Authentication failed
- `authorization` - Insufficient permissions
- `validation` - Invalid parameters
- `not_found` - Resource not found
- `rate_limit` - Rate limit exceeded
- `server` - Server error
- `network` - Network error
- `unknown` - Unknown error

## Webhooks

This Integration supports webhooks for real-time event notifications.

```typescript
import { GithubWebhookHandler, WebhookEventRouter } from '@dotdo/integration-github'

// Initialize webhook handler
const handler = new GithubWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onRepositoryCreated(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `repository` - Triggered when a repository is created
- `repository` - Triggered when a repository is deleted
- `repository` - Triggered when a repository is archived
- `repository` - Triggered when a repository is unarchived
- `repository` - Triggered when a repository is renamed
- `repository` - Triggered when a repository is transferred
- `push` - Triggered when commits are pushed to a repository
- `pull_request` - Triggered when a pull request is opened
- `pull_request` - Triggered when a pull request is closed
- `pull_request` - Triggered when a pull request is reopened
- `pull_request` - Triggered when a pull request is edited
- `pull_request` - Triggered when a pull request is assigned
- `pull_request` - Triggered when a review is requested on a pull request
- `pull_request` - Triggered when a pull request's head branch is updated
- `pull_request_review` - Triggered when a pull request review is submitted
- `pull_request_review` - Triggered when a pull request review is edited
- `pull_request_review` - Triggered when a pull request review is dismissed
- `pull_request_review_comment` - Triggered when a comment is created on a pull request review
- `issues` - Triggered when an issue is opened
- `issues` - Triggered when an issue is edited
- `issues` - Triggered when an issue is deleted
- `issues` - Triggered when an issue is closed
- `issues` - Triggered when an issue is reopened
- `issues` - Triggered when an issue is assigned
- `issues` - Triggered when a label is added to an issue
- `issue_comment` - Triggered when a comment is created on an issue
- `issue_comment` - Triggered when a comment on an issue is edited
- `issue_comment` - Triggered when a comment on an issue is deleted
- `create` - Triggered when a branch or tag is created
- `delete` - Triggered when a branch or tag is deleted
- `release` - Triggered when a release is published
- `release` - Triggered when a release is created
- `status` - Triggered when the status of a commit changes
- `check_run` - Triggered when a check run is created
- `check_run` - Triggered when a check run is completed
- `workflow_run` - Triggered when a workflow run is completed
- `star` - Triggered when a user stars a repository
- `fork` - Triggered when a repository is forked

## License

MIT
