# Dadata ru Integration

DaData provides APIs for data validation, standardization, and enrichment, including address parsing, company information retrieval, and more.

**Category**: productivity
**Service**: DadataRu
**Base URL**: https://api.dadata_ru.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/dadata_ru](https://integrations.do/dadata_ru)

## Installation

```bash
npm install @dotdo/integration-dadata_ru
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-dadata_ru
```

## Quick Start

```typescript
import { DadataRuClient } from '@dotdo/integration-dadata_ru'

// Initialize client
const client = new DadataRuClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DadataRuClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Dadata ru actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DadataRuError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DadataRuError) {
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
