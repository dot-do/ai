# Jira Integration

Agile project management and issue tracking platform

**Category**: developer-tools
**Service**: Jira
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/jira](https://integrations.do/jira)

## Installation

```bash
npm install @dotdo/integration-jira
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-jira
```

## Quick Start

```typescript
import { JiraClient } from '@dotdo/integration-jira'

// Initialize client
const client = new JiraClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new JiraClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Issue

Jira issue tracking

#### `issue.create()`

```typescript
const result = await client.issue.create({
  fields: {}, // Issue fields (summary, project, issuetype, etc.)
})
```

#### `issue.get()`

```typescript
const result = await client.issue.get({
  issue_id_or_key: 'example', // Issue ID or key
})
```

#### `issue.update()`

```typescript
const result = await client.issue.update({
  issue_id_or_key: 'example', // Issue ID or key
  fields: {}, // Updated fields
})
```

#### `issue.delete()`

```typescript
const result = await client.issue.delete({
  issue_id_or_key: 'example', // Issue ID or key
})
```

#### `issue.list()`

```typescript
const result = await client.issue.list({
  jql: 'example', // JQL query string
  fields: [], // Fields to return
})
```

### Project

Jira project management

#### `project.create()`

```typescript
const result = await client.project.create({
  key: 'example', // Project key
  name: 'example', // Project name
  projectTypeKey: 'example', // Project type (software, business, service_desk)
  leadAccountId: 'example', // Project lead account ID
})
```

#### `project.get()`

```typescript
const result = await client.project.get({
  project_id_or_key: 'example', // Project ID or key
})
```

#### `project.update()`

```typescript
const result = await client.project.update({
  project_id_or_key: 'example', // Project ID or key
  name: 'example', // Updated name
})
```

#### `project.delete()`

```typescript
const result = await client.project.delete({
  project_id_or_key: 'example', // Project ID or key
})
```

#### `project.list()`

```typescript
const result = await client.project.list({
  query: 'example', // Search query
})
```

### Sprint

Agile sprint management

#### `sprint.create()`

```typescript
const result = await client.sprint.create({
  name: 'example', // Sprint name
  originBoardId: 123, // Board ID
  startDate: 'example', // Start date (ISO 8601)
  endDate: 'example', // End date (ISO 8601)
})
```

#### `sprint.get()`

```typescript
const result = await client.sprint.get({
  sprint_id: 123, // Sprint ID
})
```

#### `sprint.update()`

```typescript
const result = await client.sprint.update({
  sprint_id: 123, // Sprint ID
  name: 'example', // Updated name
  state: 'example', // Sprint state (future, active, closed)
})
```

#### `sprint.delete()`

```typescript
const result = await client.sprint.delete({
  sprint_id: 123, // Sprint ID
})
```

#### `sprint.list()`

```typescript
const result = await client.sprint.list({
  board_id: 123, // Board ID
})
```

### Board

Agile board management

#### `board.create()`

```typescript
const result = await client.board.create({
  name: 'example', // Board name
  type: 'example', // Board type (scrum or kanban)
  filterId: 123, // Filter ID
})
```

#### `board.get()`

```typescript
const result = await client.board.get({
  board_id: 123, // Board ID
})
```

#### `board.delete()`

```typescript
const result = await client.board.delete({
  board_id: 123, // Board ID
})
```

#### `board.list()`

```typescript
const result = await client.board.list({
  type: 'example', // Filter by type (scrum or kanban)
})
```

## Error Handling

All errors are thrown as `JiraError` instances with additional metadata:

```typescript
try {
  const result = await client.issue.list()
} catch (error) {
  if (error instanceof JiraError) {
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
import { JiraWebhookHandler, WebhookEventRouter } from '@dotdo/integration-jira'

// Initialize webhook handler
const handler = new JiraWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onJiraIssueCreated(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `jira:issue_created` - Issue created
- `jira:issue_updated` - Issue updated
- `jira:issue_deleted` - Issue deleted
- `sprint_created` - Sprint created
- `sprint_started` - Sprint started
- `sprint_closed` - Sprint closed
- `board_created` - Board created
- `board_updated` - Board updated

## License

MIT
