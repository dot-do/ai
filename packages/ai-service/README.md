# AI Service

A package for wrapping AI entities (Functions, Workflows, or Agents) with pricing capabilities and Stripe integration for billing.

## Installation

```bash
pnpm add ai-service
```

## Usage

```typescript
import { Service } from 'ai-service'
import { ai } from 'ai-functions'

// Create a priced function service
const pricedFunction = Service({
  entity: ai.generateText,
  type: 'function',
  pricing: {
    model: 'payPerUse',
    pricePerUse: 0.05, // $0.05 per use
  },
})

// Use the function as normal
const result = await pricedFunction('Generate a summary of this text...')

// Calculate the price for usage
const price = await pricedFunction.calculatePrice({
  inputs: 10,
  outputs: 5,
})

// Record usage for billing
const usage = await pricedFunction.recordUsage({
  inputs: 10,
  outputs: 5,
})

// Create a subscription for a customer
const subscription = await pricedFunction.createSubscription('cus_123456')
```

## Pricing Models

The Service function supports various pricing models:

- **Pay Per Use**: Fixed price per function call
- **Prepaid**: Pay for a fixed amount of usage in advance
- **Postpaid**: Pay for usage after the fact
- **Subscription**: Recurring billing (per user or per instance)
- **Outcome**: Price based on the outcome of the function call

## Stripe Integration

The package integrates with Stripe for billing. Make sure to set the `STRIPE_API_KEY` environment variable.
