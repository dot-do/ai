# AI Projects

AI-driven project management with human approval workflows.

## Overview

The `ai-projects` package enables project planning and management functionality using AI with these key capabilities:

- Dispatching tasks to either AI agents or humans based on task type
- Orchestrating workflows where AI agents perform most tasks and humans primarily serve as approvers
- Implementing approval workflows via Slack and GitHub PRs
- Planning, orchestrating, and tracking tasks according to Objectives and Key Results
- Supporting the "Business-as-Code" paradigm for project management

## Installation

```bash
npm install ai-projects
# or
yarn add ai-projects
# or
pnpm add ai-projects
```

## Usage

### Project Definition

```typescript
import { Project } from 'ai-projects'

const projectManagement = Project({
  name: 'New Feature Development',
  description: 'Develop and launch new features for Q2',
  objectives: {
    // Define objectives similar to ai-management
  },
  workstreams: [
    {
      name: 'Design',
      assigneeType: 'human',
      roles: ['designer'],
    },
    {
      name: 'Development',
      assigneeType: 'mixed',
      roles: ['developer'],
      agentTypes: ['coder'],
    },
    {
      name: 'Testing',
      assigneeType: 'ai',
      agentTypes: ['tester'],
    },
  ],
})
```

### Task Assignment

```typescript
// Assign a task with intelligent routing
const task = await projectManagement.createTask({
  title: 'Implement new UI component',
  description: 'Create a new React component for the dashboard',
  workstream: 'Development',
  // System determines if this goes to human or AI based on workstream config
})

// Explicitly assign to an agent
const aiTask = await projectManagement.createTask({
  title: 'Generate unit tests',
  description: 'Create unit tests for the new component',
  workstream: 'Testing',
  assignTo: 'agent',
})

// Explicitly assign to a human
const humanTask = await projectManagement.createTask({
  title: 'Review design mockups',
  description: 'Review and approve the new design mockups',
  workstream: 'Design',
  assignTo: 'human',
})
```

### Approval Workflows

```typescript
// Configure approval methods
projectManagement.configureApprovals({
  methods: ['slack', 'github'],
  slackChannel: 'project-approvals',
  githubRepo: 'org/repo',
  defaultApprovers: ['user1', 'user2'],
})

// Get approval for a task result
const result = await aiTask.getResult()
const approved = await projectManagement.requestApproval({
  taskId: aiTask.id,
  result,
  method: 'slack',
  approvers: ['tech-lead'],
  message: 'Please review these unit tests',
})
```

### Progress Tracking

```typescript
// Track progress
await projectManagement.updateProgress({
  objectiveKey: 'launch-feature',
  keyResultIndex: 0,
  progress: 0.75,
})

// Get overall project status
const status = await projectManagement.getStatus()
```

## License

MIT
