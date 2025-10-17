# GitLab Integration

DevSecOps platform for repository management and CI/CD

**Category**: developer-tools
**Service**: Gitlab
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/gitlab](https://integrations.do/gitlab)

## Installation

```bash
npm install @dotdo/integration-gitlab
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-gitlab
```

## Quick Start

```typescript
import { GitlabClient } from '@dotdo/integration-gitlab'

// Initialize client
const client = new GitlabClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GitlabClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Project

Repository and project management

#### `project.create()`

```typescript
const result = await client.project.create({
  name: 'example', // Project name
  description: 'example', // Project description
  visibility: 'example', // Project visibility (private, internal, public)
})
```

#### `project.get()`

```typescript
const result = await client.project.get({
  project_id: 'example', // Project ID or path
})
```

#### `project.update()`

```typescript
const result = await client.project.update({
  project_id: 'example', // Project ID
  name: 'example', // Updated name
  description: 'example', // Updated description
})
```

#### `project.delete()`

```typescript
const result = await client.project.delete({
  project_id: 'example', // Project ID
})
```

#### `project.list()`

```typescript
const result = await client.project.list({
  owned: true, // Limit by owned projects
  membership: true, // Limit by membership
})
```

### Issue

Project issue tracking

#### `issue.create()`

```typescript
const result = await client.issue.create({
  project_id: 'example', // Project ID
  title: 'example', // Issue title
  description: 'example', // Issue description
  labels: 'example', // Comma-separated label names
})
```

#### `issue.get()`

```typescript
const result = await client.issue.get({
  project_id: 'example', // Project ID
  issue_iid: 123, // Issue IID (internal ID)
})
```

#### `issue.update()`

```typescript
const result = await client.issue.update({
  project_id: 'example', // Project ID
  issue_iid: 123, // Issue IID
  title: 'example', // Updated title
  state_event: 'example', // State change (close, reopen)
})
```

#### `issue.list()`

```typescript
const result = await client.issue.list({
  project_id: 'example', // Project ID
  state: 'example', // Filter by state (opened, closed, all)
})
```

### MergeRequest

Code review and merge requests

#### `mergeRequest.create()`

```typescript
const result = await client.mergeRequest.create({
  project_id: 'example', // Project ID
  source_branch: 'example', // Source branch name
  target_branch: 'example', // Target branch name
  title: 'example', // Merge request title
})
```

#### `mergeRequest.get()`

```typescript
const result = await client.mergeRequest.get({
  project_id: 'example', // Project ID
  merge_request_iid: 123, // Merge request IID
})
```

#### `mergeRequest.update()`

```typescript
const result = await client.mergeRequest.update({
  project_id: 'example', // Project ID
  merge_request_iid: 123, // Merge request IID
  title: 'example', // Updated title
  state_event: 'example', // State change (close, reopen)
})
```

#### `mergeRequest.merge()`

```typescript
const result = await client.mergeRequest.merge({
  project_id: 'example', // Project ID
  merge_request_iid: 123, // Merge request IID
  merge_commit_message: 'example', // Custom merge commit message
})
```

#### `mergeRequest.list()`

```typescript
const result = await client.mergeRequest.list({
  project_id: 'example', // Project ID
  state: 'example', // Filter by state (opened, closed, merged, all)
})
```

### Pipeline

CI/CD pipeline management

#### `pipeline.create()`

```typescript
const result = await client.pipeline.create({
  project_id: 'example', // Project ID
  ref: 'example', // Branch or tag name
  variables: [], // Pipeline variables
})
```

#### `pipeline.get()`

```typescript
const result = await client.pipeline.get({
  project_id: 'example', // Project ID
  pipeline_id: 123, // Pipeline ID
})
```

#### `pipeline.cancel()`

```typescript
const result = await client.pipeline.cancel({
  project_id: 'example', // Project ID
  pipeline_id: 123, // Pipeline ID
})
```

#### `pipeline.retry()`

```typescript
const result = await client.pipeline.retry({
  project_id: 'example', // Project ID
  pipeline_id: 123, // Pipeline ID
})
```

#### `pipeline.list()`

```typescript
const result = await client.pipeline.list({
  project_id: 'example', // Project ID
  status: 'example', // Filter by status (running, pending, success, failed)
})
```

## Error Handling

All errors are thrown as `GitlabError` instances with additional metadata:

```typescript
try {
  const result = await client.project.list()
} catch (error) {
  if (error instanceof GitlabError) {
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
import { GitlabWebhookHandler, WebhookEventRouter } from '@dotdo/integration-gitlab'

// Initialize webhook handler
const handler = new GitlabWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onPush(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `Push Hook` - Push to repository
- `Tag Push Hook` - Tag push to repository
- `Issue Hook` - Issue created, updated, or closed
- `Merge Request Hook` - Merge request created, updated, or merged
- `Pipeline Hook` - Pipeline status changed
- `Job Hook` - Build/job status changed
- `Wiki Page Hook` - Wiki page created or updated
- `Deployment Hook` - Deployment created

## License

MIT
