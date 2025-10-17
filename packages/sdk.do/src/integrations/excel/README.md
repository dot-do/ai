# Excel Integration

Microsoft Excel is a powerful spreadsheet application for data analysis, calculations, and visualization, enabling users to organize and process data with formulas, charts, and pivot tables

**Category**: productivity
**Service**: Excel
**Base URL**: https://api.excel.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/excel](https://integrations.do/excel)

## Installation

```bash
npm install @dotdo/integration-excel
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-excel
```

## Quick Start

```typescript
import { ExcelClient } from '@dotdo/integration-excel'

// Initialize client
const client = new ExcelClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ExcelClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Excel actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ExcelError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ExcelError) {
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
