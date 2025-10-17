# Dictionary api Integration

The Merriam-Webster Dictionary API provides developers with access to comprehensive dictionary and thesaurus content, including definitions, etymologies, audio pronunciations, synonyms, and antonyms.

**Category**: productivity
**Service**: DictionaryApi
**Base URL**: https://api.dictionary_api.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/dictionary_api](https://integrations.do/dictionary_api)

## Installation

```bash
npm install @dotdo/integration-dictionary_api
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-dictionary_api
```

## Quick Start

```typescript
import { DictionaryApiClient } from '@dotdo/integration-dictionary_api'

// Initialize client
const client = new DictionaryApiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DictionaryApiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Dictionary api actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DictionaryApiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DictionaryApiError) {
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
