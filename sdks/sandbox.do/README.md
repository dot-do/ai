# sandbox.do SDK

TypeScript SDK for accessing the Cloudflare Sandbox API.

## Installation

```bash
pnpm add sandbox.do
```

## Usage

### Basic Setup

```typescript
import { createSandboxClient } from 'sandbox.do'

const sandbox = createSandboxClient({
  baseUrl: 'https://sandbox.example.com',
  apiKey: 'your-api-key', // optional
})
```

### Execute Code

```typescript
// Simple execution
const result = await sandbox.do({
  script: '2 + 2',
  captureConsole: true,
})

console.log(result.result) // 4

// With SDK primitives
const aiResult = await sandbox.do({
  script: 'return await ai.generateText({ prompt: "Hello!" })',
  bindings: {
    AI_SERVICE: aiServiceFetcher,
  },
})

console.log(aiResult.result)
console.log(aiResult.console)
```

### Worker Management

```typescript
// Create a worker
await sandbox.createWorker({
  id: 'my-worker',
  params: {
    compatibilityDate: '2025-10-04',
    mainModule: 'main.js',
    modules: {
      'main.js': `
        export default {
          async fetch(request) {
            return new Response('Hello from worker!')
          }
        }
      `,
    },
  },
})

// Get worker info
const info = await sandbox.getWorker('my-worker')
console.log(info)

// List all workers
const workers = await sandbox.listWorkers()
console.log(workers)

// Execute on a worker
const response = await sandbox.executeWorker('my-worker', new Request('http://worker/test'))
const text = await response.text()
console.log(text)

// Delete a worker
await sandbox.deleteWorker('my-worker')
```

### Health Check

```typescript
const health = await sandbox.health()
console.log(health)
// {
//   service: 'sandbox',
//   status: 'healthy',
//   timestamp: 1234567890,
//   version: '0.1.0'
// }
```

## API Reference

### `createSandboxClient(config: SandboxConfig): SandboxClient`

Create a new Sandbox SDK client.

**Config:**

- `baseUrl: string` - Base URL of the sandbox API
- `apiKey?: string` - Optional API key for authentication
- `headers?: Record<string, string>` - Optional custom headers

### `SandboxClient`

#### `do(request: SandboxExecuteRequest): Promise<SandboxExecuteResponse>`

Execute code with SDK primitives.

**Request:**

- `script: string` - Code to execute
- `module?: string` - Optional module code
- `env?: Record<string, any>` - Environment variables
- `captureConsole?: boolean` - Capture console output
- `bindings?: Record<string, Fetcher>` - Service bindings

**Response:**

- `result?: any` - Execution result
- `exports?: Record<string, any>` - Module exports
- `console?: string[]` - Console output
- `error?: string` - Error message if failed

#### `createWorker(request: CreateWorkerRequest): Promise<void>`

Create a new worker.

**Request:**

- `id: string` - Worker ID
- `params: WorkerParams` - Worker parameters

#### `getWorker(id: string): Promise<WorkerInfo>`

Get worker information.

#### `deleteWorker(id: string): Promise<void>`

Delete a worker.

#### `listWorkers(): Promise<WorkerInfo[]>`

List all workers.

#### `executeWorker(id: string, request: Request): Promise<Response>`

Execute a request on a worker.

#### `health(): Promise<HealthResponse>`

Check sandbox health.

## Types

All types are re-exported from `ai-sandbox`:

```typescript
import type { SandboxExecuteRequest, SandboxExecuteResponse, CreateWorkerRequest, WorkerParams } from 'sandbox.do'
```

## Examples

### With Environment Variables

```typescript
const result = await sandbox.do({
  script: 'return process.env.MY_VAR',
  env: {
    MY_VAR: 'Hello World',
  },
})
```

### With Module Code

```typescript
const result = await sandbox.do({
  script: 'return add(2, 3)',
  module: `
    function add(a, b) {
      return a + b
    }
    module.exports = { add }
  `,
})
```

### Error Handling

```typescript
try {
  const result = await sandbox.do({
    script: 'throw new Error("Test error")',
  })
} catch (error) {
  console.error('Execution failed:', error)
}
```

## Architecture

```
┌─────────────────────────────────────┐
│ Your Application                    │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ sandbox.do SDK               │  │
│  │ - SandboxClient              │  │
│  │ - Type definitions           │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
              ↓ HTTP/HTTPS
┌─────────────────────────────────────┐
│ Sandbox Worker (workers/sandbox)    │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ REST API                     │  │
│  └──────────────────────────────┘  │
│              ↓                      │
│  ┌──────────────────────────────┐  │
│  │ ai-sandbox Package           │  │
│  └──────────────────────────────┘  │
│              ↓                      │
│  ┌──────────────────────────────┐  │
│  │ Cloudflare Worker Loaders    │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Related Packages

- `ai-sandbox` - Core sandbox implementation
- `workers/sandbox` - Sandbox worker implementation
- `sdk.do` - Main platform SDK

## License

MIT
