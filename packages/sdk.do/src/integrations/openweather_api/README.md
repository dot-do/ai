# Openweather api Integration

Provides access to current weather data, forecasts, and historical weather data for any location worldwide.

**Category**: productivity
**Service**: OpenweatherApi
**Base URL**: https://api.openweather_api.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/openweather_api](https://integrations.do/openweather_api)

## Installation

```bash
npm install @dotdo/integration-openweather_api
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-openweather_api
```

## Quick Start

```typescript
import { OpenweatherApiClient } from '@dotdo/integration-openweather_api'

// Initialize client
const client = new OpenweatherApiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new OpenweatherApiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Openweather api actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `OpenweatherApiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof OpenweatherApiError) {
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
