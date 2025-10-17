# ai-startups

[![npm version](https://img.shields.io/npm/v/ai-startups.svg)](https://www.npmjs.com/package/ai-startups)
[![License](https://img.shields.io/npm/l/ai-startups.svg)](https://github.com/drivly/primitives.org.ai/blob/main/packages/ai-startups/LICENSE)

AI Startup types and functions for creating AI businesses that combine the Business and Service patterns to enable selling Functions, Workflows, and Agents while generating both a website and database.

## Installation

```bash
npm install ai-startups
# or
yarn add ai-startups
# or
pnpm add ai-startups
```

## Usage

The `ai-startups` package provides a `Startup` function that combines functionality from the `Business` (from ai-business) and `Service` (from ai-service) patterns:

```typescript
import { Startup } from 'ai-startups'

const myStartup = Startup({
  name: 'AI Solutions',
  vision: 'Make AI accessible to everyone',
  goals: [{ objective: 'Market Growth', keyResults: ['100K users by Q4', '20% MoM growth'] }],
  services: [
    {
      name: 'Text Analysis API',
      objective: 'Provide advanced text analysis',
      pricing: {
        model: 'activity-based',
        activities: [{ name: 'analysis', rate: 0.01 }],
      },
      implementation: {
        type: 'function',
        id: 'text-analyzer',
      },
    },
  ],
})

// Generate site and DB
const site = myStartup.generateSite()
const db = myStartup.generateDatabase()
```

## Features

### Business Foundation

The `Startup` function builds on the `Business` pattern to provide:

- Business identity (name, vision)
- Goal tracking with objectives and key results
- Business strategy and planning

### Service Offerings

Integrate services using the `Service` pattern:

- Define service offerings with clear objectives
- Configure pricing models (subscription, activity-based, usage-based, tiered)
- Link to implementation (Functions, Workflows, Agents)

### Site Generation

Automatically generate a website for your startup:

- Landing page with vision and service overview
- Services marketplace page
- Pricing page with dynamic pricing models
- About page with goals and key results

### Database Schema Generation

Generate a database schema for your startup:

- Collections for startup info, services, customers
- Subscription and usage tracking
- Proper relationships and indexes

## API Reference

### Startup Function

```typescript
Startup({
  name: string,
  vision: string,
  goals: Goal[],
  services?: ServiceDefinition[],
  ...businessConfig
}): StartupInstance
```

#### Parameters

- `name`: Name of the startup
- `vision`: Vision statement
- `goals`: Array of goals with objectives and key results
- `services`: Array of service definitions
- `businessConfig`: Additional business configuration

#### Returns

Returns a `StartupInstance` with:

- All business properties and methods
- Array of service instances
- `generateSite()`: Method to generate a website
- `generateDatabase()`: Method to generate a database schema
- `createStoryBrand()`: Method to create a StoryBrand
- `createLeanCanvas()`: Method to create a Lean Canvas

### Types

#### Goal

```typescript
interface Goal {
  objective: string
  keyResults: string[]
}
```

#### ServiceDefinition

```typescript
interface ServiceDefinition {
  name: string
  objective: string
  pricing: {
    model: 'subscription' | 'activity-based' | 'usage-based' | 'tiered'
    activities?: Array<{
      name: string
      rate: number
    }>
    tiers?: Array<{
      name: string
      price: number
      limit?: number
    }>
    subscription?: {
      price: number
      interval: 'month' | 'year'
    }
  }
  implementation: {
    type: 'function' | 'workflow' | 'agent'
    id: string
    entity?: any
  }
  metadata?: Record<string, any>
}
```

## Dependencies

- [ai-business](https://github.com/drivly/primitives.org.ai/tree/main/packages/ai-business)
- [ai-service](https://github.com/drivly/primitives.org.ai/tree/main/packages/ai-service)
