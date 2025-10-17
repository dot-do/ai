# Sentry Integration

Error tracking and performance monitoring platform

**Category**: developer-tools
**Service**: Sentry
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/sentry](https://integrations.do/sentry)

## Installation

```bash
npm install @dotdo/integration-sentry
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-sentry
```

## Quick Start

```typescript
import { SentryClient } from '@dotdo/integration-sentry'

// Initialize client
const client = new SentryClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SentryClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Event

Error and exception events

#### `event.get()`

```typescript
const result = await client.event.get({
  organization_slug: 'example', // Organization slug
  event_id: 'example', // Event ID
})
```

#### `event.list()`

```typescript
const result = await client.event.list({
  organization_slug: 'example', // Organization slug
  query: 'example', // Search query
})
```

### Issue

Grouped error events

#### `issue.get()`

```typescript
const result = await client.issue.get({
  organization_slug: 'example', // Organization slug
  issue_id: 'example', // Issue ID
})
```

#### `issue.update()`

```typescript
const result = await client.issue.update({
  organization_slug: 'example', // Organization slug
  issue_id: 'example', // Issue ID
  status: 'example', // Issue status (resolved, ignored, unresolved)
})
```

#### `issue.delete()`

```typescript
const result = await client.issue.delete({
  organization_slug: 'example', // Organization slug
  issue_id: 'example', // Issue ID
})
```

#### `issue.list()`

```typescript
const result = await client.issue.list({
  organization_slug: 'example', // Organization slug
  query: 'example', // Search query
})
```

### Project

Sentry projects

#### `project.create()`

```typescript
const result = await client.project.create({
  organization_slug: 'example', // Organization slug
  team_slug: 'example', // Team slug
  name: 'example', // Project name
  platform: 'example', // Project platform (javascript, python, etc.)
})
```

#### `project.get()`

```typescript
const result = await client.project.get({
  organization_slug: 'example', // Organization slug
  project_slug: 'example', // Project slug
})
```

#### `project.update()`

```typescript
const result = await client.project.update({
  organization_slug: 'example', // Organization slug
  project_slug: 'example', // Project slug
  name: 'example', // Updated name
})
```

#### `project.delete()`

```typescript
const result = await client.project.delete({
  organization_slug: 'example', // Organization slug
  project_slug: 'example', // Project slug
})
```

#### `project.list()`

```typescript
const result = await client.project.list({
  organization_slug: 'example', // Organization slug
})
```

### Release

Release tracking and deploys

#### `release.create()`

```typescript
const result = await client.release.create({
  organization_slug: 'example', // Organization slug
  version: 'example', // Release version
  projects: [], // Project slugs
})
```

#### `release.get()`

```typescript
const result = await client.release.get({
  organization_slug: 'example', // Organization slug
  version: 'example', // Release version
})
```

#### `release.update()`

```typescript
const result = await client.release.update({
  organization_slug: 'example', // Organization slug
  version: 'example', // Release version
  dateReleased: 'example', // Release date (ISO 8601)
})
```

#### `release.delete()`

```typescript
const result = await client.release.delete({
  organization_slug: 'example', // Organization slug
  version: 'example', // Release version
})
```

#### `release.list()`

```typescript
const result = await client.release.list({
  organization_slug: 'example', // Organization slug
})
```

## Error Handling

All errors are thrown as `SentryError` instances with additional metadata:

```typescript
try {
  const result = await client.event.list()
} catch (error) {
  if (error instanceof SentryError) {
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
import { SentryWebhookHandler, WebhookEventRouter } from '@dotdo/integration-sentry'

// Initialize webhook handler
const handler = new SentryWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onErrorCreated(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `error.created` - New error event
- `issue.created` - New issue created
- `issue.resolved` - Issue resolved
- `issue.ignored` - Issue ignored
- `issue.assigned` - Issue assigned

## License

MIT
