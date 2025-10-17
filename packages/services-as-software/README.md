# services-as-software

Services-as-Software abstractions for building and deploying autonomous microservices on the `.do` platform.

## Installation

```bash
pnpm add services-as-software
```

## Overview

Services-as-Software is a paradigm for defining, deploying, and managing services as code. This package provides TypeScript types and API clients for building autonomous microservices that integrate seamlessly with the `.do` platform.

## Core Concepts

### Service Definition

Define services with operations, dependencies, and configuration.

```typescript
import type { Service } from 'services-as-software'

const emailService: Service = {
  id: 'email-service',
  name: 'Email Service',
  version: '1.0.0',
  description: 'Send and manage emails',
  operations: [
    {
      name: 'send',
      method: 'POST',
      path: '/send',
      input: {
        to: 'string',
        subject: 'string',
        body: 'string',
      },
      output: {
        id: 'string',
        status: 'string',
      },
      auth: true,
    },
    {
      name: 'getStatus',
      method: 'GET',
      path: '/status/:id',
      output: {
        id: 'string',
        status: 'string',
        deliveredAt: 'string',
      },
    },
  ],
  metadata: {
    owner: 'platform-team',
    tags: ['email', 'communication'],
    sla: {
      uptime: 99.9,
      responseTime: 200,
    },
  },
}
```

### Service Deployment

Deploy services to different environments.

```typescript
import { createServicesApi } from 'services-as-software'

const api = createServicesApi({ apiKey: process.env.API_KEY })

// Create the service
const service = await api.services.create(emailService)

// Deploy to production
const deployment = await api.deployments.deploy('email-service', 'production', {
  region: 'us-west-2',
  replicas: 3,
  resources: {
    cpu: '500m',
    memory: '512Mi',
  },
})

console.log(`Deployed to: ${deployment.url}`)
```

### Service Invocation

Call service operations programmatically.

```typescript
// Direct service invocation
const response = await api.invoke.call('email-service', 'send', {
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Thanks for signing up.',
})

console.log(response.data) // { id: 'msg-123', status: 'sent' }

// Via API Gateway
const result = await api.invoke.gateway('POST', '/email/send', {
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Thanks for signing up.',
})
```

### Service Registry

Discover and register services.

```typescript
// Register a service
await api.registry.register({
  serviceId: 'email-service',
  name: 'Email Service',
  version: '1.0.0',
  url: 'https://email.apis.do',
  health: 'healthy',
})

// Discover services
const emailService = await api.registry.discover('Email Service')
console.log(emailService.url) // https://email.apis.do

// Keep service alive with heartbeats
setInterval(() => {
  await api.registry.heartbeat('email-service')
}, 30000)
```

### Service Integrations

Connect services together.

```typescript
import type { ServiceIntegration } from 'services-as-software'

// Create integration from payment service to email service
const integration: ServiceIntegration = {
  id: 'payment-to-email',
  source: 'payment-service',
  target: 'email-service',
  type: 'event',
  mapping: {
    input: {
      'payment.email': 'email.to',
      'payment.amount': 'email.context.amount',
    },
  },
  enabled: true,
}

await api.integrations.create(integration)
```

### API Gateway Routes

Configure API Gateway routes for services.

```typescript
import type { GatewayRoute } from 'services-as-software'

const route: GatewayRoute = {
  path: '/api/v1/email/send',
  method: 'POST',
  service: 'email-service',
  operation: 'send',
  auth: {
    required: true,
    type: 'bearer',
  },
  rateLimit: {
    requests: 100,
    window: '1m',
  },
  cache: {
    ttl: 300,
  },
}

await api.gateway.createRoute(route)
```

## Complete Example

Here's a complete example of building and deploying a service:

```typescript
import { createServicesApi, type Service } from 'services-as-software'

const api = createServicesApi({ apiKey: process.env.API_KEY })

// 1. Define the service
const notificationService: Service = {
  id: 'notification-service',
  name: 'Notification Service',
  version: '1.0.0',
  description: 'Multi-channel notifications (email, SMS, push)',
  operations: [
    {
      name: 'notify',
      method: 'POST',
      path: '/notify',
      input: {
        userId: 'string',
        channel: 'email | sms | push',
        message: 'string',
      },
      handler: async (input) => {
        // Implementation
        return { notificationId: 'notif-123', status: 'sent' }
      },
    },
  ],
  dependencies: ['email-service', 'sms-service', 'push-service'],
}

// 2. Create the service
const service = await api.services.create(notificationService)

// 3. Deploy to staging first
const stagingDeploy = await api.deployments.deploy('notification-service', 'staging', {
  region: 'us-east-1',
  replicas: 1,
})

// Wait for deployment
while (stagingDeploy.status !== 'deployed') {
  await new Promise((resolve) => setTimeout(resolve, 5000))
  stagingDeploy = await api.deployments.get(stagingDeploy.id)
}

// 4. Deploy to production
const prodDeploy = await api.deployments.deploy('notification-service', 'production', {
  region: 'us-west-2',
  replicas: 5,
  resources: {
    cpu: '1000m',
    memory: '1Gi',
  },
})

// 5. Register with service registry
await api.registry.register({
  serviceId: 'notification-service',
  name: 'Notification Service',
  version: '1.0.0',
  url: prodDeploy.url!,
  health: 'healthy',
})

// 6. Create gateway route
await api.gateway.createRoute({
  path: '/api/v1/notify',
  method: 'POST',
  service: 'notification-service',
  operation: 'notify',
  auth: {
    required: true,
    type: 'bearer',
  },
  rateLimit: {
    requests: 1000,
    window: '1m',
  },
})

// 7. Invoke the service
const response = await api.invoke.call('notification-service', 'notify', {
  userId: 'user-123',
  channel: 'email',
  message: 'Your order has shipped!',
})

console.log('Notification sent:', response.data)
```

## Service Patterns

### Microservices Architecture

```typescript
// Define multiple small, focused services
const userService = await api.services.create({...})
const authService = await api.services.create({...})
const orderService = await api.services.create({...})

// Connect them with integrations
await api.integrations.create({
  source: 'auth-service',
  target: 'user-service',
  type: 'sync',
})
```

### Event-Driven Services

```typescript
const integration = await api.integrations.create({
  source: 'order-service',
  target: 'notification-service',
  type: 'event',
  mapping: {
    input: {
      'order.id': 'notification.context.orderId',
      'order.user.email': 'notification.email',
    },
  },
})
```

### Service Mesh

```typescript
import type { ServiceMesh } from 'services-as-software'

const mesh: ServiceMesh = {
  services: ['user-service', 'order-service', 'payment-service'],
  policies: {
    retry: {
      attempts: 3,
      backoff: 'exponential',
    },
    timeout: 5000,
    circuitBreaker: {
      threshold: 5,
      timeout: 30000,
    },
  },
  discovery: {
    enabled: true,
    registry: 'consul',
  },
  observability: {
    tracing: true,
    metrics: true,
    logging: true,
  },
}
```

## Integration with Business-as-Code

Services-as-Software integrates seamlessly with Business-as-Code:

```typescript
import { createBusinessApi } from 'business-as-code'
import { createServicesApi } from 'services-as-software'

const businessApi = createBusinessApi({ apiKey: process.env.API_KEY })
const servicesApi = createServicesApi({ apiKey: process.env.API_KEY })

// Deploy a service
const service = await servicesApi.services.create(emailService)
const deployment = await servicesApi.deployments.deploy('email-service', 'production')

// Use the service in a workflow
const workflow = await businessApi.workflows.create({
  id: 'onboarding-workflow',
  name: 'Customer Onboarding',
  steps: [
    {
      id: 'send-welcome-email',
      type: 'function',
      function: 'email-service.send',
      config: {
        to: '{{customer.email}}',
        subject: 'Welcome!',
      },
    },
  ],
})
```

## API Reference

### Services API

- `services.create(service)` - Create a new service
- `services.list()` - List all services
- `services.get(id)` - Get a service by ID
- `services.update(id, updates)` - Update a service
- `services.delete(id)` - Delete a service

### Deployments API

- `deployments.deploy(serviceId, environment, config)` - Deploy a service
- `deployments.list(serviceId?)` - List deployments
- `deployments.get(id)` - Get deployment status
- `deployments.rollback(id)` - Rollback a deployment

### Invocation API

- `invoke.call(serviceId, operation, input)` - Invoke a service operation
- `invoke.gateway(method, path, body)` - Invoke via API Gateway

### Integrations API

- `integrations.create(integration)` - Create an integration
- `integrations.list()` - List all integrations
- `integrations.toggle(id, enabled)` - Enable/disable an integration

### Registry API

- `registry.register(entry)` - Register a service
- `registry.list()` - List all registered services
- `registry.discover(name)` - Discover a service by name
- `registry.heartbeat(serviceId)` - Send heartbeat
- `registry.unregister(serviceId)` - Unregister a service

### Gateway API

- `gateway.createRoute(route)` - Create a gateway route
- `gateway.listRoutes()` - List all routes
- `gateway.updateRoute(path, updates)` - Update a route
- `gateway.deleteRoute(path)` - Delete a route

## Security Best Practices

When using the API client, follow these security guidelines:

### API Key Management

- **Never commit API keys** to version control
- **Use environment variables** to store sensitive credentials
- **Rotate keys regularly** to minimize exposure risk
- **Use different keys** for development, staging, and production environments

```typescript
// ✅ Good: Use environment variables
const api = createServicesApi({
  apiKey: process.env.API_KEY,
})

// ❌ Bad: Never hardcode keys
const api = createServicesApi({
  apiKey: 'sk_live_abc123...', // NEVER DO THIS
})
```

### Environment Configuration

Create a `.env` file (and add it to `.gitignore`):

```bash
API_KEY=your_api_key_here
API_BASE_URL=https://apis.do
```

Load environment variables securely:

```typescript
import 'dotenv/config'

const api = createServicesApi({
  apiKey: process.env.API_KEY,
  baseUrl: process.env.API_BASE_URL,
})
```

### Additional Security Measures

- **Validate inputs** before passing to services to prevent injection attacks
- **Implement rate limiting** in your application to prevent abuse
- **Use HTTPS** for all API communications (enabled by default)
- **Monitor API usage** for unusual patterns that may indicate compromise
- **Restrict API key permissions** to only what's necessary for your use case
- **Secure service endpoints** with authentication and authorization
- **Encrypt sensitive data** in service configurations and environment variables

## Integration

Works seamlessly with:

- **business-as-code** - Business logic and workflows
- **do.industries** - Domain definitions
- **graphdl** - Semantic relationships
- **schema.org.ai** - Entity schemas

## License

MIT
