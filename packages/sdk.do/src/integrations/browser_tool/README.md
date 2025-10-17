# Browser tool Integration

Composio enables AI Agents and LLMs to authenticate and integrate with various tools via function calling.

**Category**: developer-tools
**Service**: BrowserTool
**Base URL**: https://api.browser_tool.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/browser_tool](https://integrations.do/browser_tool)

## Installation

```bash
npm install @dotdo/integration-browser_tool
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-browser_tool
```

## Quick Start

```typescript
import { BrowserToolClient } from '@dotdo/integration-browser_tool'

// Initialize client
const client = new BrowserToolClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BrowserToolClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Browser tool actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BrowserToolError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BrowserToolError) {
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
