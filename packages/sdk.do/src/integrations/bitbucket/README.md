# Bitbucket Integration

Git hosting and CI/CD pipelines for teams

**Category**: developer-tools
**Service**: Bitbucket
**Base URL**: https://api.bitbucket.org/2.0

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bitbucket](https://integrations.do/bitbucket)

## Installation

```bash
npm install @dotdo/integration-bitbucket
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bitbucket
```

## Quick Start

```typescript
import { BitbucketClient } from '@dotdo/integration-bitbucket'

// Initialize client
const client = new BitbucketClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new BitbucketClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Repository

Git repository management

#### `repository.create()`

```typescript
const result = await client.repository.create({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
  scm: 'example', // SCM type (git or hg)
  is_private: true, // Private repository flag
})
```

#### `repository.get()`

```typescript
const result = await client.repository.get({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
})
```

#### `repository.update()`

```typescript
const result = await client.repository.update({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
  description: 'example', // Updated description
})
```

#### `repository.delete()`

```typescript
const result = await client.repository.delete({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
})
```

#### `repository.list()`

```typescript
const result = await client.repository.list({
  workspace: 'example', // Workspace ID
  role: 'example', // Filter by role (owner, contributor, member)
})
```

### PullRequest

Code review and pull requests

#### `pullRequest.create()`

```typescript
const result = await client.pullRequest.create({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
  title: 'example', // Pull request title
  source: {}, // Source branch info
  destination: {}, // Destination branch info
})
```

#### `pullRequest.get()`

```typescript
const result = await client.pullRequest.get({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
  pull_request_id: 123, // Pull request ID
})
```

#### `pullRequest.update()`

```typescript
const result = await client.pullRequest.update({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
  pull_request_id: 123, // Pull request ID
  title: 'example', // Updated title
})
```

#### `pullRequest.merge()`

```typescript
const result = await client.pullRequest.merge({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
  pull_request_id: 123, // Pull request ID
  merge_strategy: 'example', // Merge strategy (merge_commit, squash, fast_forward)
})
```

#### `pullRequest.list()`

```typescript
const result = await client.pullRequest.list({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
  state: 'example', // Filter by state (OPEN, MERGED, DECLINED, SUPERSEDED)
})
```

### Issue

Issue tracking

#### `issue.create()`

```typescript
const result = await client.issue.create({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
  title: 'example', // Issue title
  content: {}, // Issue content
})
```

#### `issue.get()`

```typescript
const result = await client.issue.get({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
  issue_id: 123, // Issue ID
})
```

#### `issue.update()`

```typescript
const result = await client.issue.update({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
  issue_id: 123, // Issue ID
  title: 'example', // Updated title
})
```

#### `issue.list()`

```typescript
const result = await client.issue.list({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
})
```

### Pipeline

CI/CD pipeline management

#### `pipeline.create()`

```typescript
const result = await client.pipeline.create({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
  target: {}, // Pipeline target (branch, commit, etc.)
})
```

#### `pipeline.get()`

```typescript
const result = await client.pipeline.get({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
  pipeline_uuid: 'example', // Pipeline UUID
})
```

#### `pipeline.stop()`

```typescript
const result = await client.pipeline.stop({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
  pipeline_uuid: 'example', // Pipeline UUID
})
```

#### `pipeline.list()`

```typescript
const result = await client.pipeline.list({
  workspace: 'example', // Workspace ID
  repo_slug: 'example', // Repository slug
})
```

## Error Handling

All errors are thrown as `BitbucketError` instances with additional metadata:

```typescript
try {
  const result = await client.repository.list()
} catch (error) {
  if (error instanceof BitbucketError) {
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
import { BitbucketWebhookHandler, WebhookEventRouter } from '@dotdo/integration-bitbucket'

// Initialize webhook handler
const handler = new BitbucketWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onRepoPush(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `repo:push` - Code pushed to repository
- `repo:commit_status_created` - Commit status created
- `repo:commit_status_updated` - Commit status updated
- `pullrequest:created` - Pull request created
- `pullrequest:updated` - Pull request updated
- `pullrequest:approved` - Pull request approved
- `pullrequest:fulfilled` - Pull request merged
- `issue:created` - Issue created
- `issue:updated` - Issue updated

## License

MIT
