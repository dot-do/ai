# Functions Service (functions.do)

The Functions Service provides a complete SDK for deploying and executing serverless functions on Cloudflare Workers via the `.do` platform.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Worker Integration](#worker-integration)
- [Best Practices](#best-practices)

## Installation

The functions service is included in the `sdk.do` package:

```bash
pnpm add sdk.do
```

## Quick Start

```typescript
import { $, defineFunction } from 'sdk.do'

// Define a function
const processPayment = defineFunction({
  name: 'process-payment',
  handler: async (event) => {
    const { amount, currency } = event
    return {
      success: true,
      transactionId: 'txn_' + Date.now(),
      amount,
      currency,
    }
  },
  timeout: 30000, // 30 seconds
  memory: 256, // 256 MB
})

// Deploy the function
const fn = await $.functions.deploy('process-payment', processPayment.handler, {
  timeout: processPayment.timeout,
  memory: processPayment.memory,
})

// Execute the function
const result = await fn.execute({
  amount: 1000,
  currency: 'usd',
})

console.log('Result:', result)
```

## API Reference

### `defineFunction()`

Define a function without deploying it. This is useful for organizing function definitions.

```typescript
interface FunctionDefinition {
  name: string
  handler: (event: any) => any | Promise<any>
  timeout?: number // milliseconds, default: 30000
  memory?: number // MB, default: 256
  env?: Record<string, string>
  description?: string
  runtime?: 'workers' | 'durable-object' | 'workflow'
  language?: 'javascript' | 'typescript'
}

const myFunction = defineFunction({
  name: 'my-function',
  handler: async (event) => {
    // Function logic
    return { success: true }
  },
  timeout: 10000,
  memory: 512,
})
```

### `$.functions.deploy()`

Deploy a function to the platform.

```typescript
const fn = await $.functions.deploy(
  'function-name',
  async (event) => {
    // Handler implementation
    return { result: 'success' }
  },
  {
    timeout: 30000,
    memory: 256,
    env: {
      API_KEY: 'secret',
    },
    description: 'My serverless function',
  }
)
```

**Returns**: `DeployedFunction` instance

### `$.functions.execute()`

Execute a deployed function by name.

```typescript
const result = await $.functions.execute('function-name', {
  // Function parameters
  param1: 'value1',
  param2: 'value2',
})
```

**Parameters**:

- `name` (string): Function name
- `params` (any): Parameters to pass to the function

**Returns**: Function execution result

### `$.functions.list()`

List all deployed functions.

```typescript
const functions = await $.functions.list({
  limit: 10,
  offset: 0,
  runtime: 'workers', // Optional filter
})

console.log(`Found ${functions.length} functions`)
```

**Options**:

- `limit` (number): Maximum number of results
- `offset` (number): Pagination offset
- `runtime` (string): Filter by runtime type

**Returns**: Array of `FunctionMetadata`

### `$.functions.get()`

Get a deployed function by name.

```typescript
const fn = await $.functions.get('function-name')

// Execute it
const result = await fn.execute({ param: 'value' })

// Get metadata
const metadata = await fn.getMetadata()
```

**Returns**: `DeployedFunction` instance

### `$.functions.delete()`

Delete a function by name.

```typescript
await $.functions.delete('function-name')
```

### `$.functions.schedule()`

Schedule a function to run on a cron schedule.

```typescript
await $.functions.schedule('function-name', {
  cron: '0 0 * * *', // Daily at midnight
  timezone: 'America/New_York',
  description: 'Daily report generation',
})
```

**Options**:

- `cron` (string): Cron expression (required)
- `timezone` (string): Timezone for schedule
- `description` (string): Human-readable description

### `$.functions.logs()`

Retrieve execution logs for a function.

```typescript
const logs = await $.functions.logs('function-name', {
  limit: 100,
  level: 'info',
  startDate: '2025-10-11T00:00:00Z',
  endDate: '2025-10-11T23:59:59Z',
})

logs.forEach((log) => {
  console.log(`[${log.timestamp}] ${log.level}: ${log.message}`)
})
```

**Options**:

- `limit` (number): Maximum number of log entries
- `offset` (number): Pagination offset
- `level` (string): Filter by log level ('info' | 'warn' | 'error' | 'debug')
- `startDate` (string): ISO 8601 start date
- `endDate` (string): ISO 8601 end date

## DeployedFunction Class

The `DeployedFunction` class provides methods for interacting with a deployed function.

### Methods

#### `execute(params)`

Execute the function with parameters.

```typescript
const result = await fn.execute({ input: 'test' })
```

#### `getMetadata()`

Get function metadata including configuration and status.

```typescript
const metadata = await fn.getMetadata()
console.log(metadata.name, metadata.timeout, metadata.memory)
```

#### `delete()`

Delete the function.

```typescript
await fn.delete()
```

#### `schedule(config)`

Schedule the function to run on a cron schedule.

```typescript
await fn.schedule({
  cron: '0 0 * * *',
  timezone: 'UTC',
})
```

#### `logs(options)`

Retrieve execution logs.

```typescript
const logs = await fn.logs({ limit: 50 })
```

## Examples

### Example 1: Payment Processing Function

```typescript
import { $, defineFunction } from 'sdk.do'

const processPayment = defineFunction({
  name: 'process-payment',
  handler: async (event) => {
    const { amount, currency, customerId } = event

    // Validate input
    if (!amount || !currency || !customerId) {
      throw new Error('Missing required fields')
    }

    // Process payment (mock)
    return {
      success: true,
      transactionId: 'txn_' + Date.now(),
      amount,
      currency,
      customerId,
    }
  },
  timeout: 30000,
  memory: 256,
  env: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  },
})

// Deploy
const fn = await $.functions.deploy('process-payment', processPayment.handler, processPayment)

// Execute
const result = await fn.execute({
  amount: 1000,
  currency: 'usd',
  customerId: 'cus_123',
})

console.log('Payment processed:', result)
```

### Example 2: Scheduled Report Generation

```typescript
import { $ } from 'sdk.do'

// Deploy a report generation function
const reportFn = await $.functions.deploy(
  'daily-report',
  async (event) => {
    // Generate report
    return {
      reportDate: new Date().toISOString(),
      metrics: {
        revenue: 12500,
        orders: 45,
        customers: 32,
      },
    }
  },
  {
    description: 'Generates daily business reports',
  }
)

// Schedule it to run daily at midnight
await reportFn.schedule({
  cron: '0 0 * * *',
  timezone: 'UTC',
  description: 'Daily at midnight',
})
```

### Example 3: Batch Processing

```typescript
import { $ } from 'sdk.do'

const batchFn = await $.functions.deploy(
  'process-batch',
  async (event) => {
    const { items } = event

    const results = []
    for (const item of items) {
      // Process each item
      results.push({
        id: item.id,
        status: 'processed',
        timestamp: Date.now(),
      })
    }

    return {
      total: items.length,
      processed: results.length,
      results,
    }
  },
  {
    timeout: 60000, // 1 minute
    memory: 512, // More memory for batch operations
  }
)

// Execute batch processing
const result = await batchFn.execute({
  items: [
    { id: 1, data: 'item1' },
    { id: 2, data: 'item2' },
    { id: 3, data: 'item3' },
  ],
})

console.log('Batch processing complete:', result)
```

### Example 4: TypeScript Type Safety

```typescript
import { $ } from 'sdk.do'

interface PaymentInput {
  amount: number
  currency: string
  customerId: string
}

interface PaymentResult {
  success: boolean
  transactionId: string
  amount: number
  currency: string
}

// Execute with type safety
const result = await $.functions.execute<PaymentResult>('process-payment', {
  amount: 1000,
  currency: 'usd',
  customerId: 'cus_123',
} as PaymentInput)

// TypeScript knows the shape of result
console.log(`Transaction ${result.transactionId}: ${result.amount} ${result.currency}`)
```

### Example 5: Error Handling and Retries

```typescript
import { $ } from 'sdk.do'

async function executeWithRetry<T>(fnName: string, params: any, maxAttempts = 3): Promise<T> {
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      return await $.functions.execute<T>(fnName, params)
    } catch (error) {
      attempts++
      if (attempts >= maxAttempts) {
        throw error
      }
      console.log(`Attempt ${attempts} failed, retrying...`)
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempts))
    }
  }

  throw new Error('Max attempts reached')
}

// Use it
const result = await executeWithRetry('unreliable-api', { data: 'test' })
```

### Example 6: Monitoring and Logs

```typescript
import { $ } from 'sdk.do'

const fn = await $.functions.get('process-payment')

// Get recent logs
const logs = await fn.logs({ limit: 100 })

// Filter errors
const errors = logs.filter((log) => log.level === 'error')

if (errors.length > 0) {
  console.error(`Found ${errors.length} errors:`)
  errors.forEach((log) => {
    console.error(`  [${log.timestamp}] ${log.message}`)
  })
}
```

## Worker Integration

The Functions service connects to the `workers/function/` worker on the `.do` platform:

### Endpoints

- `POST /functions` - Deploy a new function
- `POST /functions/:name/execute` - Execute a function
- `GET /functions` - List all functions
- `GET /functions/:name` - Get function metadata
- `DELETE /functions/:name` - Delete a function
- `POST /functions/:name/schedule` - Schedule a function
- `GET /functions/:name/logs` - Get execution logs

### Worker Configuration

The function worker is configured in `workers/function/wrangler.jsonc`:

```jsonc
{
  "name": "function",
  "main": "src/index.ts",
  "compatibility_date": "2025-02-11",
  "durable_objects": {
    "bindings": [
      {
        "name": "FUNCTION_EXECUTOR",
        "class_name": "FunctionExecutor",
      },
    ],
  },
}
```

## Best Practices

### 1. Use TypeScript Types

Define input and output types for type safety:

```typescript
interface MyInput {
  userId: string
  action: string
}

interface MyOutput {
  success: boolean
  result: any
}

const result = await $.functions.execute<MyOutput>('my-function', {
  userId: '123',
  action: 'process',
} as MyInput)
```

### 2. Set Appropriate Timeouts

Choose timeouts based on function complexity:

- Simple operations: 5-10 seconds
- API calls: 10-30 seconds
- Batch processing: 30-60 seconds
- Heavy computation: 60+ seconds

```typescript
await $.functions.deploy('my-function', handler, {
  timeout: 30000, // 30 seconds
})
```

### 3. Configure Memory Based on Workload

- Lightweight functions: 128-256 MB
- Medium complexity: 256-512 MB
- Data processing: 512-1024 MB

```typescript
await $.functions.deploy('batch-processor', handler, {
  memory: 512, // 512 MB for batch processing
})
```

### 4. Use Environment Variables for Secrets

Never hardcode secrets in function code:

```typescript
await $.functions.deploy('secure-function', handler, {
  env: {
    API_KEY: process.env.API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
  },
})
```

### 5. Implement Error Handling

Always handle errors gracefully:

```typescript
const handler = async (event) => {
  try {
    // Function logic
    return { success: true }
  } catch (error) {
    console.error('Function error:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}
```

### 6. Monitor with Logs

Use the logs API to monitor function health:

```typescript
const logs = await $.functions.logs('my-function', {
  level: 'error',
  limit: 10,
})

if (logs.length > 0) {
  // Alert on errors
  console.error('Function has errors:', logs)
}
```

### 7. Clean Up Unused Functions

Regularly audit and delete unused functions:

```typescript
const functions = await $.functions.list()

for (const fn of functions) {
  const ageInDays = (Date.now() - new Date(fn.createdAt).getTime()) / (1000 * 60 * 60 * 24)

  if (ageInDays > 30 && !fn.lastExecuted) {
    console.log(`Deleting unused function: ${fn.name}`)
    await $.functions.delete(fn.name)
  }
}
```

## Related Documentation

- [SDK.do Documentation](../README.md)
- [Workers.do Architecture](../../../../workers/CLAUDE.md)
- [Function Worker](../../../../workers/function/README.md)
- [API Reference](./api.md)
