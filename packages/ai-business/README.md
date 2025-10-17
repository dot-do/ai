# ai-business

[![npm version](https://img.shields.io/npm/v/ai-business.svg)](https://www.npmjs.com/package/ai-business)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> Business types and functions for AI applications

## Overview

`ai-business` is a package that exports commonly used business types and functions, including Goals (Objectives & Key Results), Plans, Lean Canvas, StoryBrand, and more.

## Installation

```bash
npm install ai-business
# or
yarn add ai-business
# or
pnpm add ai-business
```

## Usage

### Goals and OKRs

```typescript
import { Goal, Objective, KeyResult } from 'ai-business'

// Example of defining an objective with key results
const objective: Objective = {
  description: 'Improve user acquisition',
  keyResults: [
    {
      description: 'Increase website traffic by 20%',
      target: 20,
      currentValue: 5,
      unit: '%',
    },
    'Launch 3 new marketing campaigns',
  ],
}
```

### Plans

```typescript
import { Plan, PlanStep } from 'ai-business'

// Example of defining a plan with steps
const plan: Plan = {
  id: '1',
  name: 'Product Launch Plan',
  description: 'Step-by-step plan for launching our new product',
  status: 'draft',
  steps: [
    {
      id: '1',
      name: 'Market Research',
      description: 'Conduct market research to validate product fit',
      order: 1,
      status: 'in_progress',
    },
    {
      id: '2',
      name: 'Marketing Materials',
      description: 'Create all marketing materials',
      order: 2,
      status: 'not_started',
    },
  ],
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}
```

### StoryBrand Framework

```typescript
import { storyBrand } from 'ai-business'

// Generate a StoryBrand framework
const result = await storyBrand({ company: 'Example Inc', product: 'AI Assistant' })

console.log(result)
// {
//   productName: 'AI Assistant',
//   hero: 'Busy professionals who struggle with productivity',
//   problem: {
//     external: 'Too many tasks and not enough time',
//     internal: 'Feeling overwhelmed and inefficient',
//     philosophical: 'Work should enable life, not consume it',
//     villain: 'Fragmented tools and disorganized workflows'
//   },
//   guide: 'AI Assistant positions itself as an experienced guide with deep expertise in productivity',
//   plan: ['Sign up for a free trial', 'Connect your existing tools', 'Let AI learn your workflow'],
//   callToAction: 'Start your free trial today',
//   success: 'Reclaim hours of your day with streamlined workflows and automated task management',
//   failure: 'Continue struggling with fragmented tools and mounting to-do lists',
//   messagingExamples: ['Your AI productivity partner', 'Work smarter, not harder', 'Let AI handle the routine so you can focus on what matters']
// }
```

### Lean Canvas

```typescript
import { leanCanvas } from 'ai-business'

// Generate a Lean Canvas
const canvas = await leanCanvas({ company: 'Example Inc', product: 'AI Assistant' })

console.log(canvas)
// {
//   productName: 'AI Assistant',
//   problem: ['Information overload', 'Task management complexity', 'Meeting scheduling inefficiency'],
//   solution: ['Smart task prioritization', 'Automated scheduling', 'Context-aware information filtering'],
//   uniqueValueProposition: 'Reclaim 10 hours per week with AI that truly understands your work',
//   unfairAdvantage: 'Proprietary context-aware AI that learns individual work patterns',
//   customerSegments: ['Knowledge workers', 'Executives', 'Small business owners'],
//   keyMetrics: ['User engagement time', 'Tasks automated', 'Time saved per user'],
//   channels: ['Direct website', 'App stores', 'Partner integrations'],
//   costStructure: ['AI infrastructure', 'Development team', 'Marketing'],
//   revenueStreams: ['Freemium subscriptions', 'Enterprise licenses', 'API access']
// }
```

## API Reference

### Types

- `Goal` - Definition of a goal with metrics and status
- `Milestone` - Definition of a goal milestone
- `KeyResult` - Definition of a key result for objectives
- `Objective` - Definition of an objective with key results
- `Plan` - Definition of a strategic plan
- `PlanStep` - Definition of a step within a plan

### Functions

- `storyBrand(input, config?)` - Generate a StoryBrand framework
- `leanCanvas(input, config?)` - Generate a Lean Canvas business model

## Dependencies

- [ai-providers](https://github.com/drivly/primitives.org.ai/tree/main/packages/ai-providers) - Abstraction layer for different AI service providers
- [payload](https://payloadcms.com/) - Headless CMS for collection models
- [zod](https://github.com/colinhacks/zod) - TypeScript-first schema validation
