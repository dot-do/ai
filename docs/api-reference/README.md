---
title: API Reference
description: Complete API documentation for the .do platform
keywords: [api, reference, documentation, sdk]
author: .do Team
lastUpdated: 2025-10-12
readingTime: 2 min
---

# API Reference

Complete API documentation for the `.do` platform.

## SDK Primitives

Core functions available in `@dotdo/sdk.do`:

- **[$](/api-reference/sdk/semantic-proxy.mdx)** - Semantic context proxy for creating `$.Subject.predicate.Object` patterns
- **[ai](/api-reference/sdk/ai.mdx)** - AI services (generate, embed, batch processing)
- **[api](/api-reference/sdk/api.mdx)** - External API integration with semantic context
- **[db](/api-reference/sdk/db.mdx)** - Semantic database operations (list, get, create, update, delete, relate)
- **[on](/api-reference/sdk/on.mdx)** - Event listeners with semantic patterns
- **[send](/api-reference/sdk/send.mdx)** - Event publishing to semantic queues/streams
- **[every](/api-reference/sdk/every.mdx)** - Scheduled workflows (cron, semantic intervals)
- **[user](/api-reference/sdk/user.mdx)** - User context (current user, session, permissions)

## Collections

Type-safe collections from standardized vocabularies:

### Schema.org (800+ types)

- **[Organization](/api-reference/collections/organization.mdx)** - Companies, nonprofits, institutions
- **[Person](/api-reference/collections/person.mdx)** - People, employees, contacts
- **[Product](/api-reference/collections/product.mdx)** - Products, services, offerings
- **[Order](/api-reference/collections/order.mdx)** - Orders, purchases, transactions
- **[Event](/api-reference/collections/event.mdx)** - Events, meetings, appointments
- **[Place](/api-reference/collections/place.mdx)** - Locations, addresses, venues
- **[CreativeWork](/api-reference/collections/creative-work.mdx)** - Content, articles, media
- [View all Schema.org types →](/api-reference/collections/schema-org.mdx)

### GS1 Supply Chain

- **[ObjectEvent](/api-reference/collections/object-event.mdx)** - EPCIS object events
- **[AggregationEvent](/api-reference/collections/aggregation-event.mdx)** - Aggregation events
- **[TransactionEvent](/api-reference/collections/transaction-event.mdx)** - Transaction events
- **[TransformationEvent](/api-reference/collections/transformation-event.mdx)** - Transformation events
- [View all GS1 types →](/api-reference/collections/gs1.mdx)

### O\*NET Occupations

- **[JobPosting](/api-reference/collections/job-posting.mdx)** - Job postings and listings
- **[Occupation](/api-reference/collections/occupation.mdx)** - SOC occupation codes
- **[Skill](/api-reference/collections/skill.mdx)** - Skills and competencies
- [View all O\*NET types →](/api-reference/collections/onet.mdx)

## Workers

Cloudflare Workers powering the platform:

### Core Services

- **[api.do](/api-reference/workers/api.mdx)** - HTTP gateway routing to all workers via RPC
- **[ai.do](/api-reference/workers/ai.mdx)** - AI inference, batch processing, embeddings
- **[auth.do](/api-reference/workers/auth.mdx)** - Authentication & authorization
- **[database.do](/api-reference/workers/database.mdx)** - Direct database access + background jobs
- **[oauth.do](/api-reference/workers/oauth.mdx)** - OAuth 2.0 provider

### Specialized Workers

- **[mcp.do](/api-reference/workers/mcp.mdx)** - Model Context Protocol server
- **[webhooks.do](/api-reference/workers/webhooks.mdx)** - Webhook ingestion & validation
- **[pipeline.do](/api-reference/workers/pipeline.mdx)** - Event stream processing
- **[markdown.do](/api-reference/workers/markdown.mdx)** - Markdown/MDX rendering
- **[mdx.do](/api-reference/workers/mdx.mdx)** - MDX compilation and execution
- **[esbuild.do](/api-reference/workers/esbuild.mdx)** - JavaScript/TypeScript compilation
- **[browser.do](/api-reference/workers/browser.mdx)** - Browser automation (Puppeteer)
- **[sessions.do](/api-reference/workers/sessions.mdx)** - Session management
- **[vault.do](/api-reference/workers/vault.mdx)** - Secrets management
- **[analytics.do](/api-reference/workers/analytics.mdx)** - Analytics tracking
- **[workflows.do](/api-reference/workers/workflows.mdx)** - Workflow orchestration

## SDKs

Client libraries for different languages:

### TypeScript/JavaScript

- **[@dotdo/sdk.do](/api-reference/sdks/typescript.mdx)** - Official TypeScript SDK
- **Installation**: `pnpm add @dotdo/sdk.do`
- **Package**: https://www.npmjs.com/package/@dotdo/sdk.do

### Python

- **[do-sdk](/api-reference/sdks/python.mdx)** - Official Python SDK (Coming Soon)
- **Installation**: `pip install do-sdk`
- **Package**: https://pypi.org/project/do-sdk/

### Go

- **[do-sdk-go](/api-reference/sdks/go.mdx)** - Official Go SDK (Coming Soon)
- **Installation**: `go get github.com/dot-do/sdk-go`
- **Package**: https://pkg.go.dev/github.com/dot-do/sdk-go

### REST API

- **[REST API](/api-reference/rest-api/)** - HTTP REST endpoints
- **Base URL**: https://api.platform.do
- **Format**: JSON

### GraphQL API

- **[GraphQL API](/api-reference/graphql/)** - GraphQL endpoint
- **Endpoint**: https://api.platform.do/graphql
- **Playground**: https://api.platform.do/graphql/playground

## CLI

Command-line interface:

```bash
# Installation
npm install -g @dotdo/cli.do

# Usage
do db list Business
do ai generate "content"
do send Order.created --data order.json
```

**Documentation**: [CLI Reference](/api-reference/cli/README.md)

## Authentication

### API Keys

```typescript
import { configure } from '@dotdo/sdk.do'

configure({
  apiKey: process.env.DO_API_KEY,
})
```

### OAuth 2.0

```typescript
import { authenticate } from '@dotdo/sdk.do'

const token = await authenticate.oauth({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  scope: 'read write',
})
```

### Session Management

```typescript
import { user } from '@dotdo/sdk.do'

const session = await user.session.create({
  userId: 'user-123',
  expiresIn: '7d',
})
```

**Documentation**: [Authentication Guide](/docs/core-concepts/security-model.mdx)

## Rate Limits

- **Free Tier**: 1,000 requests/hour
- **Pro Tier**: 10,000 requests/hour
- **Enterprise**: Custom limits

**Documentation**: [Rate Limiting Guide](/docs/core-concepts/rate-limiting.mdx)

## Error Codes

| Code | Description                               |
| ---- | ----------------------------------------- |
| 400  | Bad Request - Invalid parameters          |
| 401  | Unauthorized - Invalid or missing API key |
| 403  | Forbidden - Insufficient permissions      |
| 404  | Not Found - Resource doesn't exist        |
| 429  | Too Many Requests - Rate limit exceeded   |
| 500  | Internal Server Error                     |
| 503  | Service Unavailable - Temporary outage    |

**Documentation**: [Error Handling Guide](/docs/guides/error-handling.mdx)

## Webhooks

Subscribe to events via webhooks:

```typescript
import { webhooks } from '@dotdo/sdk.do'

await webhooks.create({
  url: 'https://example.com/webhooks',
  events: ['$.Order.created', '$.Payment.succeeded', '$.Shipment.delivered'],
  secret: process.env.WEBHOOK_SECRET,
})
```

**Documentation**: [Webhooks Guide](/docs/guides/webhooks.mdx)

## OpenAPI Specification

Download the OpenAPI spec for API exploration:

- **[OpenAPI 3.1 Spec](/openapi.json)** - JSON format
- **[OpenAPI 3.1 Spec](/openapi.yaml)** - YAML format
- **[Swagger UI](/api/docs)** - Interactive API explorer

## Code Generation

Generate client code from OpenAPI spec:

```bash
# TypeScript
npx @openapitools/openapi-generator-cli generate \
  -i https://api.platform.do/openapi.json \
  -g typescript-fetch \
  -o ./generated

# Python
openapi-generator-cli generate \
  -i https://api.platform.do/openapi.json \
  -g python \
  -o ./generated

# Go
openapi-generator-cli generate \
  -i https://api.platform.do/openapi.json \
  -g go \
  -o ./generated
```

## Support

- **[Discord Community](https://discord.gg/dotdo)** - Get help from the community
- **[GitHub Issues](https://github.com/dot-do/platform/issues)** - Report bugs
- **[Email Support](mailto:support@platform.do)** - Enterprise support
- **[Status Page](https://status.platform.do)** - Service status

---

**Auto-Generated**: This API reference is automatically generated from TypeScript types and runtime introspection.

**Last Updated**: 2025-10-11
