# ai-plans

[![npm version](https://img.shields.io/npm/v/ai-plans.svg)](https://www.npmjs.com/package/ai-plans)
[![License](https://img.shields.io/npm/l/ai-plans.svg)](https://github.com/drivly/primitives.org.ai/blob/main/packages/ai-plans/LICENSE)

Create and manage AI-driven plans with goals and key results.

## Installation

```bash
npm install ai-plans
# or
yarn add ai-plans
# or
pnpm add ai-plans
```

## Usage

The `ai-plans` package provides a functional API for creating plans with goals and key results.

```typescript
import { Plan } from 'ai-plans'

const myPlan = Plan({
  name: 'Increase Customer Engagement',
  description: 'A strategic plan to improve customer engagement metrics',
  goal: {
    objective: 'Create delighted customers who achieve their goals',
    keyResults: [
      'Achieve 95% customer satisfaction score by Q4',
      'Reduce average support resolution time by 30%',
      {
        description: 'Increase customer retention rate to 85%',
        target: 85,
        currentValue: 72,
        unit: '%',
      },
    ],
  },
  steps: [
    {
      name: 'Research user needs',
      description: 'Conduct user interviews and surveys',
      status: 'not_started',
    },
    {
      name: 'Develop engagement strategy',
      description: 'Create strategy based on research findings',
      status: 'not_started',
    },
  ],
})

// Save the plan to the backend
await myPlan.save()
```

## API

### Plan(options)

Creates a new plan with the provided options.

#### Options

- `name` (string, required): The name of the plan
- `description` (string, optional): A description of the plan
- `goal` (object, required): The goal of the plan
  - `objective` (string, required): The objective of the goal
  - `keyResults` (array, required): An array of key results for the goal
    - Each key result can be a string or an object with:
      - `description` (string, required): The description of the key result
      - `target` (number, optional): The target value for the key result
      - `currentValue` (number, optional): The current value of the key result
      - `unit` (string, optional): The unit of measurement for the key result
- `steps` (array, optional): An array of steps for the plan
  - Each step is an object with:
    - `name` (string, required): The name of the step
    - `description` (string, optional): A description of the step
    - `order` (number, optional): The order of the step
    - `duration` (number, optional): The duration of the step
    - `assignee` (string or object, optional): The assignee of the step
    - `status` (string, optional): The status of the step ('not_started', 'in_progress', 'completed', 'blocked')
- Additional properties can be provided and will be included in the plan

#### Returns

Returns a plan object with the following methods:

- `save()`: Saves the plan to the backend and returns the saved plan
- `updateProgress(keyResult, value)`: Updates the progress of a key result
  - `keyResult` (string or object): The key result to update (ID or object)
  - `value` (number): The new value for the key result
- `getProgress()`: Gets the progress of the plan and returns an object with:
  - `progress` (number): The overall progress of the plan (0-100)
  - `keyResults` (array): An array of key results with their progress

## Example: Updating Progress

```typescript
// Create a plan
const myPlan = Plan({
  name: 'Increase Customer Engagement',
  goal: {
    objective: 'Create delighted customers who achieve their goals',
    keyResults: [
      {
        description: 'Achieve 95% customer satisfaction score by Q4',
        target: 95,
        currentValue: 80,
      },
    ],
  },
})

// Save the plan
const savedPlan = await myPlan.save()

// Update the progress of a key result
await myPlan.updateProgress(savedPlan.goals[0].keyResults[0], 85)

// Get the progress of the plan
const progress = await myPlan.getProgress()
console.log(`Overall progress: ${progress.progress}%`)
```

## License

MIT
