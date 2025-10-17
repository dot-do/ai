# API Interface Documentation

The `api` interface in `sdk.do` provides comprehensive access to:

1. **`.do` Platform Primitives** - Core platform services (database, workflows, agents, etc.)
2. **Third-Party Integrations** - Popular APIs (Stripe, GitHub, Twilio, etc.) via RPC
3. **Zapier Integrations** - All Zapier triggers, actions, and searches
4. **Webhook Callbacks** - Event handlers for webhooks and triggers

## Table of Contents

- [Quick Start](#quick-start)
- [.do Platform Primitives](#do-platform-primitives)
- [Third-Party Integrations](#third-party-integrations)
- [Zapier Integrations](#zapier-integrations)
- [Webhook Event Handlers](#webhook-event-handlers)
- [Generic Integration API](#generic-integration-api)

## Quick Start

```typescript
import { $ } from 'sdk.do'

// Access platform primitives
const workflows = await $.api.workflows.list()
const agents = await $.api.agents.list()

// Access third-party integrations
const customer = await $.api.stripe.customers.create({
  email: 'customer@example.com',
  name: 'John Doe',
})

// Access Zapier integrations
const gmailIntegration = $.api.zapier.integration('gmail')
const triggers = await gmailIntegration.triggers()

// Register webhook handlers
$.api.on.stripe['customer.created'](async (data) => {
  console.log('New customer created:', data)
})
```

## .do Platform Primitives

### Database API

```typescript
// Query with SQL
const results = await $.api.database.query('SELECT * FROM users WHERE active = ?', [true])

// CRUD operations
const user = await $.api.database.get('users', 'user_123')
const users = await $.api.database.list('users', { limit: 10 })
const newUser = await $.api.database.create('users', { name: 'John', email: 'john@example.com' })
await $.api.database.update('users', 'user_123', { name: 'Jane' })
await $.api.database.delete('users', 'user_123')

// Search
const searchResults = await $.api.database.search('users', 'john', { limit: 5 })

// Relations
await $.api.database.relate('users', 'user_123', 'order_456', 'placed')
```

### Workflows API

```typescript
// Create a workflow
const workflow = await $.api.workflows.create({
  name: 'Order Processing',
  description: 'Process new orders',
  steps: [
    { id: 'validate', type: 'validate_order', params: {} },
    { id: 'charge', type: 'charge_payment', params: {} },
    { id: 'fulfill', type: 'fulfill_order', params: {} },
  ],
})

// Execute workflow
const execution = await $.api.workflows.execute(workflow.id, { orderId: 'order_123' })

// Monitor execution
const status = await $.api.workflows.getExecution(execution.id)

// Control execution
await $.api.workflows.pause(execution.id)
await $.api.workflows.resume(execution.id)
await $.api.workflows.cancel(execution.id)
```

### Agents API

```typescript
// Create an agent
const agent = await $.api.agents.create({
  name: 'Customer Support Agent',
  description: 'Handles customer support inquiries',
  model: 'claude-sonnet-4.5',
  instructions: 'You are a helpful customer support agent...',
  tools: ['search_knowledge_base', 'create_ticket'],
})

// Deploy agent
const deployment = await $.api.agents.deploy(agent.id)

// Invoke agent
const response = await $.api.agents.invoke(agent.id, {
  message: 'How do I reset my password?',
})

// Get logs
const logs = await $.api.agents.getLogs(agent.id, { limit: 100 })
```

### LLM API

```typescript
// Generate text
const { text } = await $.api.llm.generateText('Write a product description for a blue t-shirt')

// Generate with schema
const product = await $.api.llm.generate('Extract product info from: Blue cotton t-shirt, size M, $19.99', {
  schema: {
    name: 'string',
    size: 'string',
    price: 'number',
  },
})

// Chat
const chatResponse = await $.api.llm.chat(
  [
    { role: 'system', content: 'You are a helpful assistant' },
    { role: 'user', content: 'What is the capital of France?' },
  ],
  { model: 'gpt-5' }
)

// Embeddings
const embedding = await $.api.llm.embed('This is a sample text')
const embeddings = await $.api.llm.embed(['Text 1', 'Text 2', 'Text 3'])

// List models
const models = await $.api.llm.models()
```

### Triggers, Actions, Searches

```typescript
// Create a trigger
const trigger = await $.api.triggers.create({
  integration: 'stripe',
  name: 'New Payment',
  key: 'payment_intent.succeeded',
  type: 'webhook',
  config: { events: ['payment_intent.succeeded'] },
})

// Test trigger
const testData = await $.api.triggers.test(trigger.id)

// Execute action
const result = await $.api.actions.execute('stripe_create_customer', {
  email: 'customer@example.com',
  name: 'John Doe',
})

// Execute search
const results = await $.api.searches.execute('github_find_repo', {
  owner: 'dot-do',
  repo: 'platform',
})
```

### Analytics, Evals, Experiments

```typescript
// Track analytics
await $.api.analytics.track('user_signed_up', { plan: 'pro' })
await $.api.analytics.identify('user_123', { name: 'John Doe', email: 'john@example.com' })

// Query analytics
const data = await $.api.analytics.query({
  metric: 'user_signups',
  dimensions: ['plan', 'source'],
  dateRange: { start: new Date('2025-01-01'), end: new Date('2025-01-31') },
})

// Run evaluation
const evalResult = await $.api.evals.run('response_quality', {
  prompt: 'What is AI?',
  response: 'AI is...',
})

// Create experiment
const experiment = await $.api.experiments.create({
  name: 'Model Comparison',
  description: 'Compare GPT-5 vs Claude Sonnet 4.5',
  variants: [
    { id: 'gpt5', name: 'GPT-5', config: { model: 'gpt-5' }, weight: 0.5 },
    { id: 'claude', name: 'Claude', config: { model: 'claude-sonnet-4.5' }, weight: 0.5 },
  ],
  metrics: ['response_quality', 'latency', 'cost'],
})

// Start experiment
await $.api.experiments.start(experiment.id)

// Get results
const results = await $.api.experiments.getResults(experiment.id)
```

### Utilities

```typescript
// Emails
await $.api.emails.send({
  to: 'customer@example.com',
  from: 'support@example.com',
  subject: 'Welcome!',
  html: '<h1>Welcome to our platform!</h1>',
})

// Embeddings / Vector Search
const vectors = await $.api.embeddings.create(['Text 1', 'Text 2'])
await $.api.embeddings.upsert('documents', [
  { id: 'doc1', values: vectors[0], metadata: { title: 'Document 1' } },
])
const searchResults = await $.api.embeddings.search('query text', 'documents', { topK: 5 })

// Extract data
const { text } = await $.api.extract.text('https://example.com/article')
const { html } = await $.api.extract.html('https://example.com')
const data = await $.api.extract.structured('https://example.com/product', {
  name: 'string',
  price: 'number',
})

// Browse
const page = await $.api.browse.navigate('https://example.com')
const screenshot = await $.api.browse.screenshot('https://example.com', { fullPage: true })

// Queue
await $.api.queue.send('orders', { orderId: 'order_123', items: [...] })
const messages = await $.api.queue.receive('orders', { maxMessages: 10 })
```

## Third-Party Integrations

All third-party integrations are accessed via RPC, not by bundling native SDKs. This keeps the client lightweight while providing full API access.

### Stripe

```typescript
// Customers
const customer = await $.api.stripe.customers.create({
  email: 'customer@example.com',
  name: 'John Doe',
  description: 'Premium customer',
})

const retrievedCustomer = await $.api.stripe.customers.retrieve('cus_123')

await $.api.stripe.customers.update('cus_123', {
  metadata: { vip: 'true' },
})

const customers = await $.api.stripe.customers.list({ limit: 10 })

// Charges
const charge = await $.api.stripe.charges.create({
  amount: 2000,
  currency: 'usd',
  source: 'tok_visa',
  description: 'Order #123',
})

// Payment Intents
const paymentIntent = await $.api.stripe.paymentIntents.create({
  amount: 2000,
  currency: 'usd',
  payment_method_types: ['card'],
})

await $.api.stripe.paymentIntents.confirm(paymentIntent.id, {
  payment_method: 'pm_123',
})

// Subscriptions
const subscription = await $.api.stripe.subscriptions.create({
  customer: 'cus_123',
  items: [{ price: 'price_123' }],
})

// Webhooks
$.api.on.stripe['customer.created'](async (customer) => {
  console.log('New customer:', customer)
  await $.api.database.create('customers', customer)
})

$.api.on.stripe['payment_intent.succeeded'](async (paymentIntent) => {
  console.log('Payment succeeded:', paymentIntent)
  await $.api.workflows.execute('fulfill_order', { paymentIntent })
})
```

### GitHub

```typescript
// Repositories
const repo = await $.api.github.repos.get('dot-do', 'platform')
const repos = await $.api.github.repos.list({ type: 'public' })

const newRepo = await $.api.github.repos.create({
  name: 'my-new-repo',
  description: 'A new repository',
  private: false,
})

// Issues
const issues = await $.api.github.issues.list('dot-do', 'platform', {
  state: 'open',
  labels: 'bug',
})

const issue = await $.api.github.issues.create('dot-do', 'platform', {
  title: 'Bug: API not working',
  body: 'The API endpoint returns 500 error',
  labels: ['bug'],
})

// Pull Requests
const prs = await $.api.github.pulls.list('dot-do', 'platform', { state: 'open' })

const pr = await $.api.github.pulls.create('dot-do', 'platform', {
  title: 'Fix API bug',
  head: 'fix-api-bug',
  base: 'main',
  body: 'This PR fixes the API bug',
})

await $.api.github.pulls.merge('dot-do', 'platform', pr.number)

// Webhooks
$.api.on.github.push(async (event) => {
  console.log('Push to:', event.repository.full_name)
  await $.api.workflows.execute('ci_cd_pipeline', { event })
})

$.api.on.github.pull_request(async (event) => {
  if (event.action === 'opened') {
    await $.api.agents.invoke('code_reviewer', { pr: event.pull_request })
  }
})
```

### Twilio

```typescript
// Send SMS
const message = await $.api.twilio.messages.create({
  to: '+1234567890',
  from: '+0987654321',
  body: 'Your verification code is 123456',
})

// Make call
const call = await $.api.twilio.calls.create({
  to: '+1234567890',
  from: '+0987654321',
  url: 'https://example.com/voice.xml',
})

// Webhooks
$.api.on.twilio['message.received'](async (message) => {
  console.log('SMS received:', message.body)
  // Auto-reply
  await $.api.twilio.messages.create({
    to: message.from,
    from: message.to,
    body: 'Thanks for your message!',
  })
})
```

### SendGrid

```typescript
// Send email
await $.api.sendgrid.send({
  to: 'customer@example.com',
  from: 'noreply@example.com',
  subject: 'Welcome!',
  html: '<h1>Welcome to our platform!</h1>',
})

// Send to multiple recipients
await $.api.sendgrid.sendMultiple({
  to: ['user1@example.com', 'user2@example.com'],
  from: 'noreply@example.com',
  subject: 'Newsletter',
  html: '<p>Monthly newsletter</p>',
})

// Track events
$.api.on.sendgrid['email.delivered'](async (event) => {
  console.log('Email delivered:', event.email)
})

$.api.on.sendgrid['email.opened'](async (event) => {
  await $.api.analytics.track('email_opened', { email: event.email })
})
```

### Slack

```typescript
// Post message
await $.api.slack.chat.postMessage({
  channel: '#general',
  text: 'Hello from sdk.do!',
  blocks: [
    {
      type: 'section',
      text: { type: 'mrkdwn', text: '*Hello* from sdk.do!' },
    },
  ],
})

// List users
const users = await $.api.slack.users.list()

// Get user info
const user = await $.api.slack.users.info('U123456')

// Webhooks
$.api.on.slack.message(async (message) => {
  if (message.text.includes('help')) {
    await $.api.slack.chat.postMessage({
      channel: message.channel,
      text: 'How can I help you?',
    })
  }
})
```

### Other Integrations

Similar patterns for:

- **Google Sheets**: `$.api.googleSheets`
- **Salesforce**: `$.api.salesforce`
- **HubSpot**: `$.api.hubspot`
- **Trello**: `$.api.trello`
- **Asana**: `$.api.asana`
- **Mailchimp**: `$.api.mailchimp`

See full type definitions in [`api.ts`](./src/api.ts).

## Zapier Integrations

The Zapier API provides access to 7,000+ third-party apps with 30,000+ actions.

### List Integrations

```typescript
// List all available integrations
const integrations = await $.api.zapier.integrations()

// Get specific integration
const gmail = $.api.zapier.integration('gmail')
const info = await gmail.info()
```

### Triggers

```typescript
// List triggers for an integration
const triggers = await gmail.triggers()

// Get specific trigger
const newEmailTrigger = gmail.trigger('new_email')
const triggerInfo = await newEmailTrigger.info()

// Test trigger
const sampleData = await newEmailTrigger.test()

// Subscribe to webhook trigger
const subscription = await newEmailTrigger.subscribe('https://example.com/webhook', {
  folder: 'INBOX',
})
```

### Actions

```typescript
// List actions
const actions = await gmail.actions()

// Execute action
const sendEmailAction = gmail.action('send_email')
const result = await sendEmailAction.execute({
  to: 'recipient@example.com',
  subject: 'Hello',
  body: 'This is a test email',
})

// Test action
const testResult = await sendEmailAction.test({
  to: 'test@example.com',
  subject: 'Test',
  body: 'Test email',
})
```

### Searches

```typescript
// List searches
const searches = await gmail.searches()

// Execute search
const findEmailSearch = gmail.search('find_email')
const results = await findEmailSearch.execute({
  query: 'from:example@example.com',
  maxResults: 10,
})
```

### Integration Examples

```typescript
// Slack integration
const slack = $.api.zapier.integration('slack')

// Trigger: New message in channel
const newMessageTrigger = slack.trigger('new_message')
await newMessageTrigger.subscribe('https://example.com/webhook', {
  channel: '#general',
})

// Action: Send message
const sendMessageAction = slack.action('send_message')
await sendMessageAction.execute({
  channel: '#general',
  text: 'Hello from Zapier integration!',
})

// Google Sheets integration
const sheets = $.api.zapier.integration('google-sheets')

// Trigger: New row
const newRowTrigger = sheets.trigger('new_spreadsheet_row')

// Action: Create row
const createRowAction = sheets.action('create_spreadsheet_row')
await createRowAction.execute({
  spreadsheetId: '123456',
  worksheet: 'Sheet1',
  values: { name: 'John', email: 'john@example.com' },
})
```

## Webhook Event Handlers

Register event handlers for webhooks and triggers using the `on` interface.

### Platform Events

```typescript
// Workflow events
$.api.on['workflow.completed'](async (data) => {
  console.log('Workflow completed:', data.workflowId)
  await $.api.analytics.track('workflow_completed', data)
})

$.api.on['workflow.failed'](async (data) => {
  console.log('Workflow failed:', data.workflowId, data.error)
  await $.api.emails.send({
    to: 'admin@example.com',
    subject: 'Workflow Failed',
    text: `Workflow ${data.workflowId} failed: ${data.error}`,
  })
})

// Database events
$.api.on['database.record.created'](async (data) => {
  if (data.namespace === 'orders') {
    await $.api.workflows.execute('process_order', { orderId: data.id })
  }
})
```

### Third-Party Events

```typescript
// Stripe events
$.api.on.stripe['customer.created'](async (customer) => {
  await $.api.database.create('customers', customer)
  await $.api.emails.sendTemplate('welcome_email', customer.email, { customer })
})

$.api.on.stripe['payment_intent.succeeded'](async (paymentIntent) => {
  await $.api.workflows.execute('fulfill_order', { paymentIntent })
})

// GitHub events
$.api.on.github.push(async (event) => {
  await $.api.workflows.execute('ci_cd_pipeline', { event })
})

$.api.on.github.pull_request(async (event) => {
  if (event.action === 'opened') {
    await $.api.agents.invoke('code_reviewer', { pr: event.pull_request })
  }
})

// Twilio events
$.api.on.twilio['message.received'](async (message) => {
  const response = await $.api.agents.invoke('sms_responder', {
    from: message.from,
    body: message.body,
  })

  await $.api.twilio.messages.create({
    to: message.from,
    from: message.to,
    body: response.output.text,
  })
})
```

## Generic Integration API

For integrations not explicitly typed, use the generic integration API:

```typescript
// Get generic integration
const customIntegration = $.api.integration('custom-api')

// HTTP methods
const data = await customIntegration.get('/users', { limit: 10 })
const newUser = await customIntegration.post('/users', { name: 'John', email: 'john@example.com' })
await customIntegration.put('/users/123', { name: 'Jane' })
await customIntegration.patch('/users/123', { email: 'jane@example.com' })
await customIntegration.delete('/users/123')

// Custom request
const response = await customIntegration.request({
  method: 'POST',
  url: '/users/batch',
  headers: { 'X-Custom-Header': 'value' },
  data: { users: [...] },
  timeout: 5000,
})
```

## Type Safety

All API methods are fully typed with TypeScript:

```typescript
import type { APIService, StripeAPI, GitHubAPI, ZapierAPI, WorkflowDefinition, AgentDefinition, EmailMessage } from 'sdk.do'

// Full type inference
const workflow: WorkflowDefinition = {
  name: 'Order Processing',
  steps: [
    // TypeScript will validate step structure
    { id: 'validate', type: 'validate_order', params: {} },
  ],
}

// Type-safe API calls
const customer = await $.api.stripe.customers.create({
  email: 'customer@example.com', // TypeScript validates required fields
  name: 'John Doe',
})

// customer is fully typed as Stripe.Customer
console.log(customer.id, customer.email)
```

## Implementation Notes

### RPC vs Native SDKs

Third-party integrations (Stripe, GitHub, etc.) are accessed via **RPC**, not by bundling native SDKs like `stripe-node` or `octokit`. This approach:

1. **Keeps the client lightweight** - No heavy dependencies
2. **Centralizes API calls** - All requests go through the `.do` platform
3. **Enables security & monitoring** - API keys stored server-side, all calls logged
4. **Provides unified interface** - Consistent API across all integrations

However, the types are designed to match the native SDK interfaces closely, so developers familiar with those SDKs will find the API intuitive.

### Zapier Integration

Zapier integrations are dynamically loaded from the platform's integration database, which is synced from Zapier's public app directory. The types provide a structured interface to:

- **Triggers**: Events that start workflows (polling, webhook, realtime, scheduled)
- **Actions**: Operations to perform (create, update, delete, send, notify, process)
- **Searches**: Query operations to find records

### Webhook Callbacks

The `on` interface provides type-safe webhook handlers. When you register a handler:

```typescript
$.api.on.stripe['customer.created'](async (customer) => {
  // customer is typed as Stripe.Customer
})
```

The platform:

1. Validates the event type exists
2. Registers the webhook with the integration
3. Routes incoming webhooks to your handler
4. Provides type-safe event data

## Future Enhancements

Planned improvements to the API interface:

1. **Real-time Subscriptions**: WebSocket/SSE support for live events
2. **Batch Operations**: Bulk API calls with automatic rate limiting
3. **Caching**: Configurable response caching for frequently accessed data
4. **Retry Logic**: Automatic retry with exponential backoff for failed requests
5. **More Integrations**: Add support for 100+ more popular APIs
6. **GraphQL Support**: Query multiple integrations with a single GraphQL query

## See Also

- [SDK Documentation](./README.md)
- [Type Definitions](./src/api.ts)
- [Integration List](../../INTEGRATIONS.md)
- [Zapier Apps Directory](https://zapier.com/apps)
