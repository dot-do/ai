# AI Observability

A Payload CMS instance for observability of AI operations with support for multiple database types.

## Features

- Multiple database support (MongoDB, PostgreSQL, SQLite)
- Collections for tracking AI operations:
  - Completions - Records of AI model completion requests and responses
  - Functions - AI function definitions
  - Executions - Records of function executions
  - Batches - Batches of completions
  - Evals - Evaluation metrics
  - Experiments - A/B testing experiments

## Installation

```bash
npm install ai-observability
# or
yarn add ai-observability
# or
pnpm add ai-observability
```

## Usage

```typescript
import { payloadConfig } from 'ai-observability'
import { getPayload } from 'payload'

// Initialize Payload CMS with the provided configuration
const payload = await getPayload({ config: payloadConfig })

// Use Payload's local API to interact with collections
const completions = await payload.find({
  collection: 'completions',
  where: {
    status: {
      equals: 'success',
    },
  },
})
```

## Database Configuration

By default, ai-observability uses SQLite. You can configure the database connection using the `DATABASE_URI` environment variable:

```
# MongoDB
DATABASE_URI=mongodb://username:password@localhost:27017/database

# PostgreSQL
DATABASE_URI=postgresql://username:password@localhost:5432/database

# SQLite (default)
DATABASE_URI=sqlite://.data/ai-observability.db
```

## Collections

### Completions

Records of AI model completion requests and responses.

### Functions

AI function definitions.

### Executions

Records of function executions.

### Batches

Batches of completions.

### Evals

Evaluation metrics for AI operations.

### Experiments

A/B testing experiments for AI operations.

## License

MIT
