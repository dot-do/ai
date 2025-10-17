# ai-management

[![npm version](https://img.shields.io/npm/v/ai-management.svg)](https://www.npmjs.com/package/ai-management)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A function-based Manager API for defining Objectives and Key Results, creating Plans, and delegating tasks to Agent instances. This package provides a simple, elegant way to create and manage OKRs, plans, and delegate tasks to autonomous agents.

## Purpose

The `ai-management` package enables the management of objectives and key results (OKRs) by providing a function-based API that:

- Simplifies OKR creation and tracking
- Enables plan creation and iteration
- Facilitates task delegation to autonomous agents
- Monitors progress of objectives and key results
- Handles errors gracefully in a management context

## Installation

```bash
# Using npm
npm install ai-management

# Using yarn
yarn add ai-management

# Using pnpm
pnpm add ai-management
```

## Usage

### Basic Usage

```typescript
import { Manager } from 'ai-management'
import { Agent } from 'autonomous-agents'

// Create a product manager
const productManager = Manager({
  name: 'Product Manager',
  description: 'Manages product development objectives and plans',
  objectives: {
    'increase-user-engagement': {
      description: 'Increase user engagement by 30% in Q2',
      keyResults: [
        'Launch 3 new features that improve user retention',
        'Reduce churn rate by 15%',
        {
          description: 'Increase daily active users by 30%',
          target: 30,
          currentValue: 0,
          unit: '%',
          progress: 0,
        },
      ],
    },
  },
  agents: {
    'dev-team-lead': {
      name: 'Dev Team Lead',
      url: 'https://dev-team-lead.agents.do',
      role: 'Development Team Lead',
      objective: 'Implement new features and fix bugs',
      keyResults: ['feature-completion-rate', 'bug-fix-rate', 'code-quality-score'],
      integrations: ['github', 'jira', 'slack'],
      triggers: ['onTaskAssigned', 'onPrReviewed'],
      searches: ['Codebase', 'Documentation', 'Issues'],
      actions: ['createPR', 'reviewCode', 'assignTask', 'reportProgress'],
    },
  },
})
```

### Managing Objectives

```typescript
// Update an objective
await productManager.updateObjective('increase-user-engagement', {
  description: 'Increase user engagement by 40% in Q2',
  keyResults: [
    'Launch 4 new features that improve user retention',
    'Reduce churn rate by 20%',
    {
      description: 'Increase daily active users by 40%',
      target: 40,
      currentValue: 5,
      unit: '%',
      progress: 0.125, // 5/40 = 0.125
    },
  ],
})

// Get objective progress
const progress = await productManager.getObjectiveProgress('increase-user-engagement')
console.log(`Current progress: ${progress * 100}%`)

// Update key result progress
await productManager.updateKeyResultProgress('increase-user-engagement', 2, 0.25) // 10/40 = 0.25
```

### Creating and Managing Plans

```typescript
// Create a new plan
const plan = await productManager.createPlan({
  name: 'Q2 Feature Development',
  description: 'Plan for developing and launching new features in Q2',
  status: 'active',
  steps: [
    {
      id: '1',
      name: 'Research user needs',
      description: 'Conduct user interviews and analyze usage data',
      order: 1,
      status: 'completed',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Design new features',
      description: 'Create wireframes and prototypes for new features',
      order: 2,
      status: 'in_progress',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ],
})
```

### Delegating Tasks to Agents

```typescript
// Assign a task to an agent
const result = await productManager.assignTask('dev-team-lead', {
  action: 'createPR',
  feature: 'user-engagement-dashboard',
  description: 'Implement a dashboard showing user engagement metrics',
  priority: 'high',
})
```

## API Reference

### Manager(config)

Creates a new manager with the provided configuration.

**Parameters:**

- `config` (ManagerConfig): The configuration for the manager

**Returns:**

- (ManagerInstance): A manager instance

### ManagerConfig

The configuration object for creating a manager.

| Property     | Type                        | Description                         |
| ------------ | --------------------------- | ----------------------------------- |
| name         | string                      | The name of the manager             |
| description  | string (optional)           | The description of the manager      |
| objectives   | Record<string, Objective>   | The objectives to be managed        |
| initialPlans | Plan[] (optional)           | Initial plans to be managed         |
| agents       | Record<string, AgentConfig> | Agent configurations for delegation |

### ManagerInstance

The manager instance returned by the Manager function.

| Property/Method         | Type                                                                              | Description                                  |
| ----------------------- | --------------------------------------------------------------------------------- | -------------------------------------------- |
| id                      | string                                                                            | Unique identifier for the manager            |
| objectives              | Record<string, Objective>                                                         | Objectives being managed                     |
| plans                   | Plan[]                                                                            | Plans created by the manager                 |
| agents                  | Record<string, AutonomousAgent>                                                   | Agents managed by the manager                |
| updateObjective         | (key: string, objective: Objective) => Promise<void>                              | Updates an objective                         |
| createPlan              | (plan: Omit<Plan, 'id'>) => Promise<Plan>                                         | Creates a new plan                           |
| assignTask              | (agentId: string, task: any) => Promise<any>                                      | Assigns a task to an agent                   |
| getObjectiveProgress    | (key: string) => Promise<number>                                                  | Gets the progress of an objective            |
| getOverallProgress      | () => Promise<number>                                                             | Gets the overall progress of all objectives  |
| updateKeyResultProgress | (objectiveKey: string, keyResultIndex: number, progress: number) => Promise<void> | Updates the progress of a key result         |
| getAgentsForObjective   | (objectiveKey: string) => Record<string, AutonomousAgent>                         | Gets agents assigned to a specific objective |

## Dependencies

- autonomous-agents: For agent creation and management
- ai-business: For objective and plan type definitions
- TypeScript: For type safety and developer experience

## License

MIT
