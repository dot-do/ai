# ai-sandbox

Open-source primitive for creating isolated execution sandboxes using Cloudflare Worker Loaders.

## Features

- **Dynamic Worker Loader**: Create and execute code in isolated Cloudflare Workers
- **SDK Injection**: Automatically inject SDK primitives (`$`, `ai`, `api`, `db`, etc.) into sandbox context
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Cloudflare Sandbox SDK**: Abstract interface to all Cloudflare sandbox methods
- **Code Wrapping**: Utilities for wrapping user code with auto-return and console capture
- **Security**: Execute untrusted code safely in isolated worker contexts

## Installation

```bash
pnpm add ai-sandbox
```

## Usage

### Basic Execution

```typescript
import { executeInSandbox } from 'ai-sandbox'

// Execute code with SDK primitives
const result = await executeInSandbox(
  {
    script: 'await ai.generateText({ prompt: "Hello!" })',
    captureConsole: true,
  },
  env.LOADER // Your Worker Loader binding
)

console.log(result.result)
console.log(result.console)
```

### Using the Sandbox SDK

```typescript
import { createSandbox } from 'ai-sandbox'

const sandbox = createSandbox(env.LOADER)

// Execute code
const result = await sandbox.do({
  script: '2 + 2',
  captureConsole: true,
})

// Create a custom worker
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

// Execute on a worker
const response = await sandbox.executeWorker('my-worker', new Request('http://worker'))

// List all workers
const workers = await sandbox.listWorkers()

// Delete a worker
await sandbox.deleteWorker('my-worker')
```

### With Service Bindings

```typescript
import { executeInSandbox } from 'ai-sandbox'

const result = await executeInSandbox(
  {
    script: `
      const text = await ai.generateText({ prompt: "Write a haiku" })
      const users = await db.list('users')
      return { text, users }
    `,
    bindings: {
      AI_SERVICE: env.AI,
      MCP_SERVICE: env.MCP,
      API_SERVICE: env.API,
    },
    captureConsole: true,
  },
  env.LOADER
)
```

### Code Wrapping Utilities

```typescript
import { wrapModule, wrapCode, createSDKGlobals } from 'ai-sandbox'

// Wrap module code with SDK primitives
const wrapped = wrapModule('return await ai.generateText({ prompt: "Hello" })', undefined, {
  captureConsole: true,
  autoReturn: true,
  sdkGlobals: createSDKGlobals({ AI_SERVICE: env.AI }),
})

// Wrap simple code
const simpleWrapped = wrapCode('console.log("Hello")', true)
```

## Configuration

Add a Worker Loader binding to your `wrangler.jsonc`:

```jsonc
{
  "name": "my-worker",
  "worker_loaders": [
    {
      "binding": "LOADER",
    },
  ],
}
```

## API Reference

### Types

- `SandboxExecuteRequest` - Request to execute code in sandbox
- `SandboxExecuteResponse` - Response from sandbox execution
- `WorkerParams` - Parameters for creating a worker
- `CreateWorkerRequest` - Request to create a worker
- `CloudflareSandbox` - Complete sandbox interface
- `WrapOptions` - Options for code wrapping

### Functions

#### Execution

- `executeInSandbox(request, loaderBinding)` - Execute code with SDK primitives
- `executeCode(code, loaderBinding, options)` - Execute code (legacy/simple)

#### Worker Management

- `createWorker(id, params, loaderBinding)` - Create a worker
- `getWorker(id, loaderBinding)` - Get worker information
- `deleteWorker(id, loaderBinding)` - Delete a worker
- `listWorkers(loaderBinding)` - List all workers
- `executeWorker(id, request, loaderBinding)` - Execute request on worker

#### Code Wrapping

- `wrapModule(script, module, options)` - Wrap module code
- `wrapCode(code, captureConsole)` - Wrap simple code
- `createSDKGlobals(bindings)` - Create SDK globals injection code

#### Sandbox SDK

- `createSandbox(loaderBinding)` - Create a sandbox instance with all methods

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Your Worker                                             │
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │ ai-sandbox                                     │   │
│  │                                                │   │
│  │  ┌──────────────┐  ┌──────────────────────┐  │   │
│  │  │   Sandbox    │  │   Dynamic Worker     │  │   │
│  │  │     SDK      │→ │      Loader          │  │   │
│  │  └──────────────┘  └──────────────────────┘  │   │
│  │                            ↓                  │   │
│  │                    ┌──────────────────────┐  │   │
│  │                    │   Code Wrappers      │  │   │
│  │                    └──────────────────────┘  │   │
│  └────────────────────────────────────────────────┘   │
│                            ↓                           │
│                  ┌─────────────────────┐              │
│                  │  LOADER (Fetcher)   │              │
│                  └─────────────────────┘              │
└─────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────┐
        │  Cloudflare Worker Loaders           │
        │                                      │
        │  ┌────────────────────────────────┐ │
        │  │ Isolated Worker Context        │ │
        │  │  • User code execution         │ │
        │  │  • SDK primitives injected     │ │
        │  │  • Console capture             │ │
        │  │  • Service bindings            │ │
        │  └────────────────────────────────┘ │
        └──────────────────────────────────────┘
```

## Security

- Code executes in isolated Worker context
- No access to parent worker environment
- Controlled bindings and permissions
- Safe for untrusted user code

## Related Packages

- `sdk.do` - TypeScript SDK with semantic primitives
- `mcp.do` - Model Context Protocol server
- `cli.do` - Command-line interface

## License

MIT
