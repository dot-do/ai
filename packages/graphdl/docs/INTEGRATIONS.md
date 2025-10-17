# Integration Types - Triggers, Searches, Actions

This document describes the integration types for Zapier, n8n, and O\*NET tools/technology used in the `.do` platform.

## Overview

The integration system provides unified types and semantic patterns for:

- **Zapier**: ~7,000 apps with triggers, searches, and actions
- **n8n**: ~400+ nodes with operations
- **O\*NET**: Tools and technology used by occupations

## Type Definitions

### Integration

The main integration type represents an app, node, or tool:

```typescript
interface Integration {
  $type: 'Integration'
  $id: string
  key: string
  name: string
  description: string
  platform: 'zapier' | 'n8n' | 'onet'
  category: string
  triggers: IntegrationTrigger[]
  searches: IntegrationSearch[]
  actions: IntegrationAction[]
}
```

### Trigger

Triggers start workflows when events occur:

```typescript
interface IntegrationTrigger {
  $type: 'Trigger'
  $id: string
  key: string
  name: string
  description: string
  inputFields: IntegrationField[]
  outputFields: IntegrationField[]
  polling?: boolean
  webhook?: boolean
}
```

### Search

Searches find existing records:

```typescript
interface IntegrationSearch {
  $type: 'Search'
  $id: string
  key: string
  name: string
  description: string
  inputFields: IntegrationField[]
  outputFields: IntegrationField[]
}
```

### Action

Actions perform operations:

```typescript
interface IntegrationAction {
  $type: 'Action'
  $id: string
  key: string
  name: string
  description: string
  inputFields: IntegrationField[]
  outputFields: IntegrationField[]
}
```

### Field

Fields define inputs and outputs:

```typescript
interface IntegrationField {
  key: string
  label: string
  type: string
  required: boolean
  description?: string
  default?: string | number | boolean | null
  choices?: string[]
}
```

## Semantic Path Patterns

Integration capabilities are accessed using semantic paths following the `$.Subject.predicate.Object` pattern:

### Zapier Patterns

```typescript
// Triggers
$.Gmail.triggers.newEmail
$.Slack.triggers.messageReceived
$.Stripe.triggers.paymentSucceeded

// Searches
$.Gmail.searches.findEmail
$.Slack.searches.findUser
$.Stripe.searches.findCustomer

// Actions
$.Gmail.actions.sendEmail
$.Slack.actions.postMessage
$.Stripe.actions.createCharge
```

### n8n Patterns

```typescript
// Triggers
$.n8n.Webhook.triggers.webhook
$.n8n.Gmail.triggers.newEmail

// Actions
$.n8n.HTTP.actions.request
$.n8n.GoogleSheets.actions.append
$.n8n.Postgres.actions.query
```

### O\*NET Patterns

```typescript
// Tools by occupation
$.SoftwareDeveloper.usesTool.Git
$.SoftwareDeveloper.usesTechnology.TypeScript
$.SoftwareDeveloper.usesSoftware.VSCode

$.DataScientist.usesTool.Python
$.DataScientist.usesTechnology.TensorFlow
$.DataScientist.usesSoftware.JupyterNotebook
```

## SDK Integration

### Using Triggers

Triggers are registered with the `on` function:

```typescript
export default ($: BusinessContext) => {
  const { on } = $

  // Gmail new email trigger
  on.Gmail.newEmail(async (email) => {
    console.log('New email:', email.subject)
  })

  // Stripe payment succeeded trigger
  on.Stripe.paymentSucceeded(async (payment) => {
    console.log('Payment received:', payment.amount)
  })
}
```

### Using Actions

Actions are called with the `api` function:

```typescript
export default ($: BusinessContext) => {
  const { api } = $

  // Send email via Gmail
  await api.Gmail.sendEmail({
    to: 'user@example.com',
    subject: 'Hello',
    body: 'Welcome!',
  })

  // Post message to Slack
  await api.Slack.postMessage({
    channel: '#general',
    text: 'Task completed!',
  })
}
```

### Using Searches

Searches are called with the `api` function:

```typescript
export default ($: BusinessContext) => {
  const { api } = $

  // Find email in Gmail
  const email = await api.Gmail.findEmail({
    subject: 'Invoice',
    from: 'billing@company.com',
  })

  // Find user in Slack
  const user = await api.Slack.findUser({
    email: 'user@example.com',
  })
}
```

## Workflow Examples

### Example 1: Email to Slack Notification

```typescript
export default ($: BusinessContext) => {
  const { on, api } = $

  on.Gmail.newEmail(async (email) => {
    await api.Slack.postMessage({
      channel: '#inbox',
      text: `New email from ${email.from}: ${email.subject}`,
    })
  })
}
```

### Example 2: Payment to Thank You Email

```typescript
export default ($: BusinessContext) => {
  const { on, api } = $

  on.Stripe.paymentSucceeded(async (payment) => {
    await api.Gmail.sendEmail({
      to: payment.customer.email,
      subject: 'Thank you!',
      body: `Payment received: ${payment.amount}`,
    })
  })
}
```

### Example 3: Multi-Step Integration

```typescript
export default ($: BusinessContext) => {
  const { on, api, send } = $

  on.Slack.messageReceived(async (message) => {
    if (message.text.includes('/invoice')) {
      // Create invoice
      await api.Stripe.createCharge({
        amount: 10000,
        currency: 'usd',
        customer: message.user,
      })

      // Notify user
      await api.Slack.postMessage({
        channel: message.channel,
        text: 'Invoice created!',
      })

      // Track event
      await send('invoice.created', {
        user: message.user,
        amount: 10000,
      })
    }
  })
}
```

## Data Storage

Integration data is stored as MDX files in the `.db` directory:

```
.db/
├── Zapier/
│   ├── gmail.mdx
│   ├── slack.mdx
│   └── stripe.mdx
├── n8n/
│   ├── http-request.mdx
│   ├── google-sheets.mdx
│   └── postgres.mdx
└── ONet/
    └── Tools/
        ├── git.mdx
        ├── typescript.mdx
        └── python.mdx
```

### MDX Format

Each integration is stored with frontmatter and markdown content:

```mdx
---
$id: zapier:gmail
$type: Integration
name: Gmail
platform: zapier
category: Email
triggers:
  - newEmail
  - newAttachment
actions:
  - sendEmail
  - createDraft
---

# Gmail Integration

Gmail is Google's email service with powerful triggers and actions.

## Triggers

### New Email

Triggers when a new email arrives...
```

## Ingestion Scripts

### Run All Ingestions

```bash
cd ai/packages/graphdl
npm run ingest
```

### Run Specific Ingestion

```bash
npm run ingest zapier
npm run ingest n8n
npm run ingest onet
```

### Script Locations

- `scripts/ingest/zapier.ts` - Zapier apps ingestion
- `scripts/ingest/n8n.ts` - n8n nodes ingestion
- `scripts/ingest/onet.ts` - O\*NET tools ingestion

## Future Enhancements

### Zapier

- [ ] Fetch from Zapier Platform API
- [ ] Detailed field definitions for triggers/actions
- [ ] Authentication configuration
- [ ] Rate limiting information

### n8n

- [ ] Scrape from n8n GitHub repository
- [ ] Parse node definitions programmatically
- [ ] Extract credential requirements
- [ ] Version compatibility info

### O\*NET

- [ ] Fetch from O\*NET database API
- [ ] Complete occupation taxonomy
- [ ] Tool-to-tool relationships
- [ ] Skill requirements for tools

## Testing

Tests for integration types are located in:

```
src/types/integrations.test.ts
```

Run tests with:

```bash
npm test integrations
```

## Related Documentation

- [GraphDL Semantics](../SEMANTICS.md)
- [SDK Integration](../../sdk.do/README.md)
- [Workflow Examples](../examples/integrations.ts)

## Support

For questions or issues with integration types:

- GitHub Issues: [dot-do/platform](https://github.com/dot-do/platform/issues)
- Documentation: [docs.do](https://docs.do)
