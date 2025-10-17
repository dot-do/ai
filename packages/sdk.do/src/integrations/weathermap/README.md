# Weathermap Integration

WeatherMap provides visual weather data, forecasts, and mappings, helping users understand climate patterns or track severe weather conditions

**Category**: productivity
**Service**: Weathermap
**Base URL**: https://api.weathermap.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/weathermap](https://integrations.do/weathermap)

## Installation

```bash
npm install @dotdo/integration-weathermap
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-weathermap
```

## Quick Start

```typescript
import { WeathermapClient } from '@dotdo/integration-weathermap'

// Initialize client
const client = new WeathermapClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new WeathermapClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Weathermap actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WeathermapError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WeathermapError) {
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
