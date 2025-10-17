# Google Analytics Integration

Web analytics and reporting platform

**Category**: analytics
**Service**: Googleanalytics
**Base URL**: https://analyticsreporting.googleapis.com/v4

This Integration is auto-generated from MDXLD definition: [https://integrations.do/googleanalytics](https://integrations.do/googleanalytics)

## Installation

```bash
npm install @dotdo/integration-googleanalytics
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-googleanalytics
```

## Quick Start

```typescript
import { GoogleanalyticsClient } from '@dotdo/integration-googleanalytics'

// Initialize client
const client = new GoogleanalyticsClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GoogleanalyticsClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Report

Access analytics reports

#### `report.get()`

```typescript
const result = await client.report.get({
  viewId: 'example', // View (Profile) ID
  dateRanges: [], // Date ranges
  metrics: [], // Metrics to query
  dimensions: [], // Dimensions to query
})
```

### Account

Access account information

#### `account.list()`

```typescript
const result = await client.account.list()
```

### Property

Access property information

#### `property.list()`

```typescript
const result = await client.property.list({
  account_id: 'example', // Account ID
})
```

## Error Handling

All errors are thrown as `GoogleanalyticsError` instances with additional metadata:

```typescript
try {
  const result = await client.report.list()
} catch (error) {
  if (error instanceof GoogleanalyticsError) {
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
