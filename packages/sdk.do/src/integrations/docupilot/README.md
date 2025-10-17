# Docupilot Integration

Docupilot is a document automation tool that enables users to generate PDFs, DOCX files, contracts, invoices, and more by integrating with various online services.

**Category**: productivity
**Service**: Docupilot
**Base URL**: https://api.docupilot.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/docupilot](https://integrations.do/docupilot)

## Installation

```bash
npm install @dotdo/integration-docupilot
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-docupilot
```

## Quick Start

```typescript
import { DocupilotClient } from '@dotdo/integration-docupilot'

// Initialize client
const client = new DocupilotClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DocupilotClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Docupilot actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DocupilotError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DocupilotError) {
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
