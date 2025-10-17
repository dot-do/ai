# SurveyMonkey Integration

Online survey creation and analysis platform

**Category**: forms
**Service**: Surveymonkey
**Base URL**: https://api.surveymonkey.com/v3

This Integration is auto-generated from MDXLD definition: [https://integrations.do/surveymonkey](https://integrations.do/surveymonkey)

## Installation

```bash
npm install @dotdo/integration-surveymonkey
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-surveymonkey
```

## Quick Start

```typescript
import { SurveymonkeyClient } from '@dotdo/integration-surveymonkey'

// Initialize client
const client = new SurveymonkeyClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new SurveymonkeyClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Survey

Create and manage surveys

#### `survey.create()`

```typescript
const result = await client.survey.create({
  title: 'example', // Survey title
})
```

#### `survey.get()`

```typescript
const result = await client.survey.get({
  survey_id: 'example', // Survey ID
})
```

#### `survey.update()`

```typescript
const result = await client.survey.update({
  survey_id: 'example', // Survey ID
  title: 'example', // Updated title
})
```

#### `survey.delete()`

```typescript
const result = await client.survey.delete({
  survey_id: 'example', // Survey ID
})
```

#### `survey.list()`

```typescript
const result = await client.survey.list({
  per_page: 123, // Results per page
})
```

### Response

Access survey responses

#### `response.get()`

```typescript
const result = await client.response.get({
  survey_id: 'example', // Survey ID
  response_id: 'example', // Response ID
})
```

#### `response.list()`

```typescript
const result = await client.response.list({
  survey_id: 'example', // Survey ID
  per_page: 123, // Results per page
})
```

## Error Handling

All errors are thrown as `SurveymonkeyError` instances with additional metadata:

```typescript
try {
  const result = await client.survey.list()
} catch (error) {
  if (error instanceof SurveymonkeyError) {
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

## Webhooks

This Integration supports webhooks for real-time event notifications.

```typescript
import { SurveymonkeyWebhookHandler, WebhookEventRouter } from '@dotdo/integration-surveymonkey'

// Initialize webhook handler
const handler = new SurveymonkeyWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onResponseCompleted(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `response_completed` - Survey response completed

## License

MIT
