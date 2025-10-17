# Mixpanel Integration

Product analytics platform for tracking user behavior and engagement

**Category**: analytics
**Service**: Mixpanel
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mixpanel](https://integrations.do/mixpanel)

## Installation

```bash
npm install @dotdo/integration-mixpanel
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mixpanel
```

## Quick Start

```typescript
import { MixpanelClient } from '@dotdo/integration-mixpanel'

// Initialize client
const client = new MixpanelClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MixpanelClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Event

Track user events

#### `event.track()`

```typescript
const result = await client.event.track({
  distinct_id: 'example', // Unique user identifier
  event: 'example', // Event name
  properties: {}, // Event properties
  ip: 'example', // IP address for geolocation
})
```

#### `event.import()`

```typescript
const result = await client.event.import({
  distinct_id: 'example', // Unique user identifier
  event: 'example', // Event name
  time: 123, // Unix timestamp
  properties: {}, // Event properties
})
```

### User

Manage user profiles

#### `user.set()`

```typescript
const result = await client.user.set({
  distinct_id: 'example', // Unique user identifier
  properties: {}, // User properties to set
  ip: 'example', // IP address
})
```

#### `user.increment()`

```typescript
const result = await client.user.increment({
  distinct_id: 'example', // Unique user identifier
  properties: {}, // Properties to increment
})
```

#### `user.append()`

```typescript
const result = await client.user.append({
  distinct_id: 'example', // Unique user identifier
  properties: {}, // Properties to append to lists
})
```

#### `user.delete()`

```typescript
const result = await client.user.delete({
  distinct_id: 'example', // Unique user identifier
})
```

### Cohort

Manage user cohorts

#### `cohort.get()`

```typescript
const result = await client.cohort.get({
  project_id: 123, // Project ID
})
```

#### `cohort.list()`

```typescript
const result = await client.cohort.list({
  project_id: 123, // Project ID
})
```

### Report

Query analytics reports

#### `report.insights()`

```typescript
const result = await client.report.insights({
  project_id: 123, // Project ID
  from_date: 'example', // Start date (YYYY-MM-DD)
  to_date: 'example', // End date (YYYY-MM-DD)
  event: 'example', // Event name
})
```

#### `report.funnels()`

```typescript
const result = await client.report.funnels({
  project_id: 123, // Project ID
  from_date: 'example', // Start date (YYYY-MM-DD)
  to_date: 'example', // End date (YYYY-MM-DD)
  funnel_id: 123, // Funnel ID
})
```

## Error Handling

All errors are thrown as `MixpanelError` instances with additional metadata:

```typescript
try {
  const result = await client.event.list()
} catch (error) {
  if (error instanceof MixpanelError) {
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
import { MixpanelWebhookHandler, WebhookEventRouter } from '@dotdo/integration-mixpanel'

// Initialize webhook handler
const handler = new MixpanelWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onCohortUpdated(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `cohort.updated` - Cohort membership updated
- `cohort.synced` - Cohort synced to destination

## License

MIT
