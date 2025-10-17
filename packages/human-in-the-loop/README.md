# Human-in-the-Loop

A strongly-typed interface for human functions across multiple platforms, powered by Cloudflare Workers and Durable Objects.

## Installation

```bash
npm install human-in-the-loop
# or
yarn add human-in-the-loop
# or
pnpm add human-in-the-loop
```

## Features

- **Multi-Platform Support** - Execute human functions across multiple platforms:
  - ✅ **Slack** - BlockKit messages with interactive components
  - ✅ **Discord** - Rich embeds with button components
  - ✅ **Microsoft Teams** - Adaptive Cards v1.5
  - ✅ **Web UI** - HTML5 forms with modern styling
  - ✅ **Email** - Beautiful HTML emails via Resend
- **Automatic Reminders** - Smart reminder system with platform-optimized delivery
- **Durable Execution** - Powered by Cloudflare Durable Objects for reliable state management
- **Type-Safe** - Strongly-typed inputs and outputs with TypeScript generics
- **Timeout Handling** - Automatic timeout detection and fallback strategies
- **Webhook Callbacks** - Secure callback handling with signature verification

## Architecture

Human Functions are powered by the **Human Worker** (`workers/human`), a Cloudflare Worker that provides:

1. **Execution Engine** - Routes human function requests to appropriate platforms
2. **State Management** - Durable Objects track pending responses and handle timeouts
3. **Reminder System** - Automatic reminder scheduling with platform-specific delivery
4. **Webhook Integration** - Secure callback endpoints for each platform

See `workers/human/README.md` for complete worker documentation.

## Usage

### Basic Example

```typescript
import { createHumanFunction } from 'human-in-the-loop'

// Define a strongly-typed human function for approval
const getApproval = createHumanFunction<{ documentTitle: string; documentUrl: string }, { approved: boolean; comments?: string }>({
  platform: 'slack',
  title: 'Document Approval Request',
  description: 'Please review and approve the following document:',
  options: [
    { value: 'approve', label: 'Approve' },
    { value: 'reject', label: 'Reject' },
  ],
  freeText: true,
  // Slack-specific options
  channel: 'approvals',
})

// Request human input
const task = await getApproval.request({
  documentTitle: 'Q2 Financial Report',
  documentUrl: 'https://example.com/docs/q2-finance',
})

console.log(`Task created with ID: ${task.taskId}`)

// Later, get the response
const response = await getApproval.getResponse(task.taskId)
if (response?.approved) {
  console.log('Document was approved!')
  if (response.comments) {
    console.log(`Comments: ${response.comments}`)
  }
} else {
  console.log('Document was rejected or pending')
}
```

### Working with the Human Worker

The `human-in-the-loop` package is a TypeScript client that communicates with the Human Worker service:

```typescript
// The package makes HTTP requests to the Human Worker
const response = await fetch('https://human.do/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    functionDef: {
      type: 'human',
      name: 'Document Approval',
      description: 'Please review and approve',
      uiType: 'slack',
      timeout: 3600000, // 1 hour
      reminderInterval: 900000, // 15 minutes
      outputSchema: {
        /* Zod schema */
      },
    },
    input: { documentTitle: 'Q2 Report', documentUrl: 'https://...' },
    executionId: 'exec_123',
  }),
})
```

### Reminder System

All platforms support automatic reminders:

- **Slack**: Thread-based reminders in the original conversation
- **Discord**: Reply reminders to the original message
- **Teams**: New Adaptive Cards with reminder indicator
- **Web**: HTML email reminders via Resend

Configure reminders when creating the function:

```typescript
const approvalRequest = createHumanFunction({
  platform: 'slack',
  timeout: 86400000, // 24 hours
  reminderInterval: 3600000, // 1 hour - send reminder every hour
  title: 'Urgent Approval Required',
  description: 'Please respond as soon as possible',
})
```

### Platform-Specific Examples

#### Slack

```typescript
import { createHumanFunction } from 'human-in-the-loop'

const slackFeedback = createHumanFunction<{ featureDescription: string }, { rating: number; feedback?: string }>({
  platform: 'slack',
  title: 'Feature Feedback Request',
  description: 'Please provide feedback on our new feature:',
  options: [
    { value: '1', label: '⭐ Poor' },
    { value: '2', label: '⭐⭐ Fair' },
    { value: '3', label: '⭐⭐⭐ Good' },
    { value: '4', label: '⭐⭐⭐⭐ Very Good' },
    { value: '5', label: '⭐⭐⭐⭐⭐ Excellent' },
  ],
  freeText: true,
  channel: 'product-feedback',
})
```

#### Microsoft Teams

```typescript
import { createHumanFunction } from 'human-in-the-loop'

const teamsApproval = createHumanFunction<{ requestDetails: string }, { approved: boolean }>({
  platform: 'teams',
  title: 'Approval Request',
  description: 'Please review and approve this request:',
  options: [
    { value: 'approve', label: 'Approve' },
    { value: 'reject', label: 'Reject' },
  ],
  webhookUrl: process.env.TEAMS_WEBHOOK_URL,
  useAdaptiveCards: true,
})
```

#### Discord

```typescript
import { createHumanFunction } from 'human-in-the-loop'

const discordPoll = createHumanFunction<{ question: string; options: string[] }, { choice: string; userId: string }>({
  platform: 'discord',
  title: 'Team Poll',
  description: 'Please vote on the following question:',
  channel: process.env.DISCORD_CHANNEL_ID,
  options: [
    { value: 'option1', label: 'Option 1', style: 'Primary' },
    { value: 'option2', label: 'Option 2', style: 'Secondary' },
    { value: 'option3', label: 'Option 3', style: 'Success' },
  ],
  timeout: 86400000, // 24 hours
  reminderInterval: 21600000, // 6 hours
})

// Execute
const task = await discordPoll.request({
  question: 'Which feature should we prioritize?',
  options: ['Dashboard redesign', 'Mobile app', 'API improvements'],
})
```

#### React

```tsx
import { createHumanFunction, ReactHumanFunction } from 'human-in-the-loop'
import React, { useState } from 'react'

// Create the human function
const reactFeedback = createHumanFunction<{ productName: string }, { rating: number; comments?: string }>({
  platform: 'react',
  title: 'Product Feedback',
  description: 'Please rate this product and provide any comments:',
  options: [
    { value: '1', label: '1 - Poor' },
    { value: '2', label: '2 - Fair' },
    { value: '3', label: '3 - Good' },
    { value: '4', label: '4 - Very Good' },
    { value: '5', label: '5 - Excellent' },
  ],
  freeText: true,
  theme: 'light',
}) as ReactHumanFunction<{ productName: string }, { rating: number; comments?: string }>

// In your React component
function FeedbackComponent() {
  const [taskId, setTaskId] = useState<string | null>(null)

  const handleRequestFeedback = async () => {
    const task = await reactFeedback.request({ productName: 'Super Product' })
    setTaskId(task.taskId)
  }

  return (
    <div>
      <button onClick={handleRequestFeedback}>Request Feedback</button>

      {taskId && reactFeedback.getComponent(taskId, { productName: 'Super Product' })}
    </div>
  )
}
```

#### Email

```typescript
import { createHumanFunction, EmailHumanFunction } from 'human-in-the-loop'
import React from 'react'
import { render } from 'react-email'

// Create the human function
const emailSurvey = createHumanFunction<{ surveyTopic: string }, { response: string }>({
  platform: 'email',
  title: 'Customer Survey',
  description: 'Please complete our customer satisfaction survey:',
  options: [
    { value: 'very-satisfied', label: 'Very Satisfied' },
    { value: 'satisfied', label: 'Satisfied' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'dissatisfied', label: 'Dissatisfied' },
    { value: 'very-dissatisfied', label: 'Very Dissatisfied' },
  ],
  to: 'customer@example.com',
  from: 'surveys@company.com',
  callbackUrl: 'https://example.com/api/survey-response',
}) as EmailHumanFunction<{ surveyTopic: string }, { response: string }>

// Get the email template as HTML
const taskId = 'task-123'
const emailComponent = emailSurvey.getEmailComponent(taskId)
const emailHtml = render(emailComponent)
```

## API Reference

### `createHumanFunction<TInput, TOutput>(options)`

Creates a strongly-typed human function with the specified input and output types.

#### Options

- `platform`: The platform to use ('slack', 'discord', 'teams', 'web', or 'email')
- `title`: Title of the request shown to humans
- `description`: Description of the task for humans
- `options`: Array of options for the human to choose from
- `freeText`: Whether to allow free text input
- `timeout`: Timeout in milliseconds after which the task is marked as timed out
- `reminderInterval`: Interval in milliseconds between reminder messages

Platform-specific options are also available based on the selected platform.

### `HumanFunction<TInput, TOutput>`

The interface for human functions.

#### Methods

- `request(input: TInput): Promise<HumanTaskRequest>`: Request human input with the given input data
- `getResponse(taskId: string): Promise<TOutput | null>`: Get the human response for a given task

## Platform Implementation Details

### Slack

- **UI**: BlockKit messages with interactive components
- **Webhooks**: HMAC-SHA256 signature verification
- **Reminders**: Thread-based messages
- **Features**: Modals, buttons, select menus, rich text

### Discord

- **UI**: Rich embeds with button components
- **Webhooks**: Ed25519 signature verification
- **Reminders**: Message replies
- **Features**: Embeds, buttons (Primary, Secondary, Success, Danger), ephemeral messages

### Microsoft Teams

- **UI**: Adaptive Cards v1.5
- **Webhooks**: Incoming webhooks
- **Reminders**: New adaptive cards
- **Features**: Input fields, action buttons, facts, images

### Web UI

- **UI**: HTML5 forms with modern CSS
- **Webhooks**: Direct HTTP callbacks
- **Reminders**: Email reminders via Resend
- **Features**: Responsive design, validation, custom renderers

### Email

- **UI**: Beautiful HTML emails
- **Service**: Resend API
- **Reminders**: Follow-up emails with form link
- **Features**: Responsive templates, CTA buttons, timeout warnings

## Worker Configuration

The Human Worker requires the following environment variables:

```bash
# Slack
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...

# Discord
DISCORD_BOT_TOKEN=...

# Teams
TEAMS_WEBHOOK_URL=https://...

# Web/Email
WEB_CALLBACK_URL=https://...
RESEND_API_KEY=re_...
HUMAN_WORKER_URL=https://human.do
```

See `workers/human/README.md` for complete setup instructions.

## Related Documentation

- **Worker Implementation**: `workers/human/README.md`
- **Implementation Notes**:
  - Phase 6: `notes/2025-10-11/phase-6-webhook-callbacks.md`
  - Phase 7: `notes/2025-10-11/phase-7-reminder-system.md`
  - Phase 8: `notes/2025-10-11/phase-8-multi-platform-reminders.md`
  - Phase 9: `notes/2025-10-11/phase-9-email-reminders.md`
- **Functions.do Package**: `ai/packages/functions.do`
- **SDK Documentation**: `ai/sdks/functions.do`

## License

MIT
