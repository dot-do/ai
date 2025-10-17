# apis.do

TypeScript SDK for the `.do` API platform.

## Installation

```bash
npm install apis.do
# or
pnpm add apis.do
# or
yarn add apis.do
```

## Usage

### Basic Example

```typescript
import { createClient } from 'apis.do'

// Create a client (uses https://apis.do by default)
const api = createClient()

// Check API health
const health = await api.health()
console.log(health.api.status) // 'healthy'

// Get user information
const user = await api.user()
console.log(user.country) // 'US'
```

### Custom Configuration

```typescript
import { createClient } from 'apis.do'

const api = createClient({
  baseUrl: 'https://custom-api.example.com',
  apiKey: 'your-api-key', // Optional: for authenticated requests
  timeout: 10000, // Optional: request timeout in ms (default: 30000)
})
```

### API Methods

#### `health()`

Get API health and metadata:

```typescript
const health = await api.health()
console.log(health)
// {
//   $context: 'https://api.do',
//   $type: 'ApiGateway',
//   $id: 'https://apis.do',
//   api: {
//     name: 'api-worker',
//     version: '1.0.0',
//     status: 'healthy',
//     environment: 'production',
//     protocol: 'https',
//     host: 'apis.do'
//   },
//   endpoints: { ... },
//   user: { ... }
// }
```

#### `user()`

Get user information and request metadata:

```typescript
const user = await api.user()
console.log(user)
// {
//   authenticated: false,
//   ip: '1.2.3.4',
//   asn: 13335,
//   country: 'US',
//   colo: 'SFO',
//   timestamp: 1234567890,
//   latency: 42,
//   login: 'https://apis.do/login'
// }
```

#### `isHealthy(options?)`

Check if API is healthy:

```typescript
const healthy = await api.isHealthy()
console.log(healthy) // true

// For debugging: throw errors instead of returning false
try {
  const healthy = await api.isHealthy({ throwOnError: true })
} catch (error) {
  console.error('API health check failed:', error)
}
```

#### `getEndpoints()`

Get available API endpoints:

```typescript
const endpoints = await api.getEndpoints()
console.log(endpoints)
// {
//   webhooks: 'https://apis.do/webhooks',
//   ai: 'https://apis.do/ai',
//   admin: 'https://apis.do/admin/api',
//   repos: 'https://apis.do/api/repos',
//   oauth: 'https://apis.do/oauth',
//   user: 'https://apis.do/user'
// }
```

#### `sendWebhook(provider, payload, headers?)`

Send a webhook:

```typescript
await api.sendWebhook('github', {
  event: 'push',
  repository: { name: 'example' },
  commits: [{ message: 'feat: add feature' }],
})
```

#### `generateText(request)`

Generate AI text:

```typescript
const result = await api.generateText({
  prompt: 'Write a haiku about TypeScript',
  provider: 'workers-ai',
  model: 'gpt-5',
  maxTokens: 100,
  temperature: 0.7,
})

console.log(result.text)
```

#### `adminApi()`

Get admin API metadata:

```typescript
const admin = await api.adminApi()
```

#### `getRepo(owner, repo)`

Get repository information:

```typescript
const repo = await api.getRepo('dot-do', 'platform')
```

## Testing

### Unit Tests

Run unit tests using Vitest:

```bash
pnpm test
```

### End-to-End Tests

The SDK includes comprehensive E2E tests that verify functionality against deployed environments:

```bash
# Test against production (https://apis.do)
pnpm test:e2e

# Test against custom URL
TEST_URL=https://custom.example.com pnpm test:e2e

# Test against Cloudflare preview
TEST_URL=https://api.preview-branch.workers.dev pnpm test:e2e
```

## TypeScript Support

This SDK is written in TypeScript and includes full type definitions:

```typescript
import type { ApiRootResponse, UserInfo, ApiMetadata } from 'apis.do'

const health: ApiRootResponse = await api.health()
const user: UserInfo = await api.user()
```

## Error Handling

The SDK throws errors for failed requests:

```typescript
try {
  await api.health()
} catch (error) {
  console.error('API request failed:', error)
}
```

## License

MIT
