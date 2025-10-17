# Virustotal Integration

VirusTotal is a free online service that analyzes files and URLs for viruses, worms, trojans, and other kinds of malicious content using multiple antivirus engines and website scanners.

**Category**: productivity
**Service**: Virustotal
**Base URL**: https://api.virustotal.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/virustotal](https://integrations.do/virustotal)

## Installation

```bash
npm install @dotdo/integration-virustotal
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-virustotal
```

## Quick Start

```typescript
import { VirustotalClient } from '@dotdo/integration-virustotal'

// Initialize client
const client = new VirustotalClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new VirustotalClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Virustotal actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `VirustotalError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof VirustotalError) {
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
