# Datadog Integration

Infrastructure monitoring, APM, and log management platform

**Category**: developer-tools
**Service**: Datadog
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/datadog](https://integrations.do/datadog)

## Installation

```bash
npm install @dotdo/integration-datadog
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-datadog
```

## Quick Start

```typescript
import { DatadogClient } from '@dotdo/integration-datadog'

// Initialize client
const client = new DatadogClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DatadogClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Metric

Submit and query metrics data

#### `metric.submit()`

```typescript
const result = await client.metric.submit({
  series: [], // Array of metric series
})
```

#### `metric.query()`

```typescript
const result = await client.metric.query({
  query: 'example', // Metric query
  from: 123, // Start timestamp (seconds)
  to: 123, // End timestamp (seconds)
})
```

#### `metric.list()`

```typescript
const result = await client.metric.list({
  from: 123, // Start timestamp
})
```

### Event

Post and retrieve events

#### `event.create()`

```typescript
const result = await client.event.create({
  title: 'example', // Event title
  text: 'example', // Event text
  tags: [], // Event tags
})
```

#### `event.get()`

```typescript
const result = await client.event.get({
  event_id: 123, // Event ID
})
```

#### `event.list()`

```typescript
const result = await client.event.list({
  start: 123, // Start timestamp
  end: 123, // End timestamp
})
```

### Monitor

Create and manage monitors

#### `monitor.create()`

```typescript
const result = await client.monitor.create({
  type: 'example', // Monitor type (metric alert, service check, etc.)
  query: 'example', // Monitor query
  name: 'example', // Monitor name
  message: 'example', // Alert message
})
```

#### `monitor.get()`

```typescript
const result = await client.monitor.get({
  monitor_id: 123, // Monitor ID
})
```

#### `monitor.update()`

```typescript
const result = await client.monitor.update({
  monitor_id: 123, // Monitor ID
  query: 'example', // Updated query
})
```

#### `monitor.delete()`

```typescript
const result = await client.monitor.delete({
  monitor_id: 123, // Monitor ID
})
```

#### `monitor.list()`

```typescript
const result = await client.monitor.list({
  group_states: 'example', // Filter by states (all, alert, warn, no data)
})
```

### Dashboard

Create and manage dashboards

#### `dashboard.create()`

```typescript
const result = await client.dashboard.create({
  title: 'example', // Dashboard title
  layout_type: 'example', // Layout type (ordered or free)
  widgets: [], // Dashboard widgets
})
```

#### `dashboard.get()`

```typescript
const result = await client.dashboard.get({
  dashboard_id: 'example', // Dashboard ID
})
```

#### `dashboard.update()`

```typescript
const result = await client.dashboard.update({
  dashboard_id: 'example', // Dashboard ID
  title: 'example', // Updated title
})
```

#### `dashboard.delete()`

```typescript
const result = await client.dashboard.delete({
  dashboard_id: 'example', // Dashboard ID
})
```

#### `dashboard.list()`

```typescript
const result = await client.dashboard.list()
```

## Error Handling

All errors are thrown as `DatadogError` instances with additional metadata:

```typescript
try {
  const result = await client.metric.list()
} catch (error) {
  if (error instanceof DatadogError) {
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

## License

MIT
