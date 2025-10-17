# Google address validation Integration

The Address Validation API allows developers to verify the accuracy of addresses by validating and standardizing them, and determining their geocode.

**Category**: productivity
**Service**: GoogleAddressValidation
**Base URL**: https://api.google_address_validation.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/google_address_validation](https://integrations.do/google_address_validation)

## Installation

```bash
npm install @dotdo/integration-google_address_validation
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-google_address_validation
```

## Quick Start

```typescript
import { GoogleAddressValidationClient } from '@dotdo/integration-google_address_validation'

// Initialize client
const client = new GoogleAddressValidationClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new GoogleAddressValidationClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Google address validation actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GoogleAddressValidationError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GoogleAddressValidationError) {
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
