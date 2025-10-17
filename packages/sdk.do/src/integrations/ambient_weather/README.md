# Ambient weather Integration

Ambient Weather provides personal weather stations and an API for accessing real-time and historical weather data.

**Category**: productivity
**Service**: AmbientWeather
**Base URL**: https://api.ambient_weather.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ambient_weather](https://integrations.do/ambient_weather)

## Installation

```bash
npm install @dotdo/integration-ambient_weather
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ambient_weather
```

## Quick Start

```typescript
import { AmbientWeatherClient } from '@dotdo/integration-ambient_weather'

// Initialize client
const client = new AmbientWeatherClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AmbientWeatherClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Ambient weather actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AmbientWeatherError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AmbientWeatherError) {
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
