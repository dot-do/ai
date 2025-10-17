# Sslmate cert spotter api Integration

Cert Spotter API by SSLMate monitors Certificate Transparency logs to alert users about SSL/TLS certificates issued for their domains, helping detect unauthorized certificates and potential security issues.

**Category**: productivity
**Service**: SslmateCertSpotterApi
**Base URL**: https://api.sslmate_cert_spotter_api.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/sslmate_cert_spotter_api](https://integrations.do/sslmate_cert_spotter_api)

## Installation

```bash
npm install @dotdo/integration-sslmate_cert_spotter_api
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-sslmate_cert_spotter_api
```

## Quick Start

```typescript
import { SslmateCertSpotterApiClient } from '@dotdo/integration-sslmate_cert_spotter_api'

// Initialize client
const client = new SslmateCertSpotterApiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SslmateCertSpotterApiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Sslmate cert spotter api actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SslmateCertSpotterApiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SslmateCertSpotterApiError) {
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
