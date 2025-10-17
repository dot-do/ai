# Linear Integration

Issue tracking and project management for high-performance teams

**Category**: developer-tools
**Service**: Linear
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/linear](https://integrations.do/linear)

## Installation

```bash
npm install @dotdo/integration-linear
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-linear
```

## Quick Start

```typescript
import { LinearClient } from '@dotdo/integration-linear'

// Initialize client
const client = new LinearClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new LinearClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Issue

Issues are the core work items in Linear

#### `issue.create()`

Create a new issue

```typescript
const result = await client.issue.create({
  input: value, // Issue creation parameters including teamId, title, description, priority, assigneeId
})
```

#### `issue.get()`

Get an issue by ID

```typescript
const result = await client.issue.get({
  id: 'example', // Issue ID
})
```

#### `issue.update()`

Update an issue

```typescript
const result = await client.issue.update({
  id: 'example', // Issue ID
  input: value, // Issue update parameters
})
```

#### `issue.delete()`

Delete (archive) an issue

```typescript
const result = await client.issue.delete({
  id: 'example', // Issue ID
})
```

#### `issue.list()`

List issues with optional filters

```typescript
const result = await client.issue.list({
  options: value, // Pagination and filter options
})
```

#### `issue.search()`

Search issues with query and filters

```typescript
const result = await client.issue.search({
  options: value, // Search query and filter options
})
```

### Project

Projects group issues and track progress toward goals

#### `project.create()`

Create a new project

```typescript
const result = await client.project.create({
  input: value, // Project creation parameters including name, teamIds, description
})
```

#### `project.get()`

Get a project by ID

```typescript
const result = await client.project.get({
  id: 'example', // Project ID
})
```

#### `project.update()`

Update a project

```typescript
const result = await client.project.update({
  id: 'example', // Project ID
  input: value, // Project update parameters
})
```

#### `project.delete()`

Delete (archive) a project

```typescript
const result = await client.project.delete({
  id: 'example', // Project ID
})
```

#### `project.list()`

List projects

```typescript
const result = await client.project.list({
  options: value, // Pagination options
})
```

### Team

Teams organize work and members in Linear

#### `team.get()`

Get a team by ID

```typescript
const result = await client.team.get({
  id: 'example', // Team ID
})
```

#### `team.list()`

List all teams

```typescript
const result = await client.team.list({
  options: value, // Pagination options
})
```

#### `team.getMembers()`

Get team members

```typescript
const result = await client.team.getMembers({
  teamId: 'example', // Team ID
})
```

### User

Users are members of the organization

#### `user.get()`

Get a user by ID

```typescript
const result = await client.user.get({
  id: 'example', // User ID
})
```

#### `user.list()`

List all users

```typescript
const result = await client.user.list({
  options: value, // Pagination options
})
```

#### `user.me()`

Get the authenticated user

```typescript
const result = await client.user.me()
```

### Comment

Comments on issues

#### `comment.create()`

Create a new comment

```typescript
const result = await client.comment.create({
  input: value, // Comment creation parameters including issueId and body
})
```

#### `comment.get()`

Get a comment by ID

```typescript
const result = await client.comment.get({
  id: 'example', // Comment ID
})
```

#### `comment.update()`

Update a comment

```typescript
const result = await client.comment.update({
  id: 'example', // Comment ID
  input: value, // Comment update parameters
})
```

#### `comment.delete()`

Delete a comment

```typescript
const result = await client.comment.delete({
  id: 'example', // Comment ID
})
```

### Label

Labels categorize and organize issues

#### `label.create()`

Create a new label

```typescript
const result = await client.label.create({
  input: value, // Label creation parameters including teamId, name, color
})
```

#### `label.get()`

Get a label by ID

```typescript
const result = await client.label.get({
  id: 'example', // Label ID
})
```

#### `label.update()`

Update a label

```typescript
const result = await client.label.update({
  id: 'example', // Label ID
  input: value, // Label update parameters
})
```

#### `label.delete()`

Delete a label

```typescript
const result = await client.label.delete({
  id: 'example', // Label ID
})
```

#### `label.list()`

List labels

```typescript
const result = await client.label.list({
  teamId: 'example', // Team ID to filter by
  options: value, // Pagination options
})
```

### WorkflowState

Workflow states define the stages of issue progress

#### `workflowState.get()`

Get a workflow state by ID

```typescript
const result = await client.workflowState.get({
  id: 'example', // Workflow state ID
})
```

#### `workflowState.list()`

List workflow states

```typescript
const result = await client.workflowState.list({
  teamId: 'example', // Team ID to filter by
  options: value, // Pagination options
})
```

### Cycle

Cycles are time-boxed iterations for planning work

#### `cycle.get()`

Get a cycle by ID

```typescript
const result = await client.cycle.get({
  id: 'example', // Cycle ID
})
```

#### `cycle.list()`

List cycles

```typescript
const result = await client.cycle.list({
  filter: value, // Cycle filter options
  options: value, // Pagination options
})
```

#### `cycle.active()`

Get the active cycle for a team

```typescript
const result = await client.cycle.active({
  teamId: 'example', // Team ID
})
```

### Milestone

Milestones mark significant points in project timelines

#### `milestone.create()`

Create a new milestone

```typescript
const result = await client.milestone.create({
  input: value, // Milestone creation parameters
})
```

#### `milestone.get()`

Get a milestone by ID

```typescript
const result = await client.milestone.get({
  id: 'example', // Milestone ID
})
```

#### `milestone.update()`

Update a milestone

```typescript
const result = await client.milestone.update({
  id: 'example', // Milestone ID
  input: value, // Milestone update parameters
})
```

#### `milestone.delete()`

Delete a milestone

```typescript
const result = await client.milestone.delete({
  id: 'example', // Milestone ID
})
```

## Error Handling

All errors are thrown as `LinearError` instances with additional metadata:

```typescript
try {
  const result = await client.issue.list()
} catch (error) {
  if (error instanceof LinearError) {
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
import { LinearWebhookHandler, WebhookEventRouter } from '@dotdo/integration-linear'

// Initialize webhook handler
const handler = new LinearWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onIssueCreated(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `Issue.create` - Occurs when a new issue is created
- `Issue.update` - Occurs when an issue is updated
- `Issue.remove` - Occurs when an issue is deleted
- `Comment.create` - Occurs when a comment is created
- `Comment.update` - Occurs when a comment is updated
- `Comment.remove` - Occurs when a comment is deleted
- `Project.create` - Occurs when a project is created
- `Project.update` - Occurs when a project is updated
- `Project.remove` - Occurs when a project is deleted
- `Cycle.create` - Occurs when a cycle is created
- `Cycle.update` - Occurs when a cycle is updated
- `Cycle.remove` - Occurs when a cycle is deleted
- `IssueLabel.create` - Occurs when a label is created
- `IssueLabel.update` - Occurs when a label is updated
- `IssueLabel.remove` - Occurs when a label is deleted
- `User.create` - Occurs when a user is added to the organization
- `User.update` - Occurs when a user is updated
- `User.remove` - Occurs when a user is removed from the organization

## License

MIT
