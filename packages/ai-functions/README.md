# ai-functions

Function registry, execution, and management for Business-as-Code with AI-delivered Services-as-Software.

## Overview

`ai-functions` provides an open-source implementation of the [functions.do](https://functions.do) SDK interface, enabling:

- **Function Registration**: Register and version functions with metadata
- **Function Execution**: Execute functions in isolated sandboxes
- **Function Discovery**: Search and filter functions by name, tags, author
- **Function Management**: Deploy, archive, and manage function lifecycle

## Installation

```bash
pnpm add ai-functions
```

## Usage

### Register a Function

```typescript
import { registerFunction } from 'ai-functions'

const func = await registerFunction({
  metadata: {
    id: 'hello-world',
    name: 'Hello World',
    description: 'A simple greeting function',
    version: '1.0.0',
    author: 'you@example.com',
    tags: ['example', 'greeting'],
    runtime: 'typescript',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  source: {
    code: `export default function handler(input) {
      return { message: \`Hello, \${input.name}!\` }
    }`,
    language: 'typescript',
    handler: 'handler',
  },
})

console.log('Function registered:', func.definition.metadata.id)
```

### Execute a Function

```typescript
import { executeFunction } from 'ai-functions'

const result = await executeFunction('hello-world', {
  params: {
    name: 'World',
  },
  options: {
    sandbox: true,
    timeout: 30,
  },
})

if (result.success) {
  console.log('Result:', result.data)
  console.log('Execution time:', result.execution.duration, 'ms')
} else {
  console.error('Error:', result.error)
}
```

### Search Functions

```typescript
import { searchFunctions } from 'ai-functions'

const results = await searchFunctions({
  tags: ['greeting'],
  status: 'deployed',
  limit: 10,
})

console.log(`Found ${results.total} functions`)
results.functions.forEach((func) => {
  console.log(`- ${func.definition.metadata.name} (${func.definition.metadata.version})`)
})
```

### Deploy a Function

```typescript
import { deployFunction } from 'ai-functions'

const deployed = await deployFunction('hello-world', 'https://functions.do/hello-world')

console.log('Function deployed:', deployed?.endpoint)
```

## Core Foundation

This package follows the `.do` platform's three-tier architecture:

1. **SDK Interface**: Defined in `ai/sdks/functions.do/`
2. **Open-Source Implementation**: This package (`ai-functions`)
3. **Worker Runtime**: Implemented in `workers/functions/`

### Required Dependencies

All `ai-*` packages MUST use:

- **graphdl**: Core SDK interfaces ($, ai, api, db, on, every, send)
- **business-as-code**: Business abstractions and patterns
- **services-as-software**: Service-oriented architecture patterns
- **ai-sandbox**: Isolated function execution (for runtime)

## API

### Registry Functions

- `registerFunction(definition)` - Register a new function
- `getFunction(id)` - Get function by ID
- `listFunctions(filters)` - List functions with optional filters
- `searchFunctions(query)` - Search functions by criteria
- `updateFunction(id, updates)` - Update function metadata
- `deleteFunction(id)` - Delete function from registry
- `deployFunction(id, endpoint)` - Mark function as deployed
- `archiveFunction(id)` - Archive a function

### Execution Functions

- `executeFunction(functionId, input)` - Execute function synchronously
- `executeFunctionAsync(functionId, input)` - Execute function asynchronously
- `getExecutionStatus(executionId)` - Get async execution status
- `cancelExecution(executionId)` - Cancel running execution

### Utility Functions

- `generateFunctionId(name)` - Generate unique function ID
- `generateExecutionId()` - Generate unique execution ID
- `validateFunctionDefinition(definition)` - Validate function definition
- `parseFunctionCode(code)` - Parse function code for metadata
- `formatVersion(major, minor, patch)` - Format version string
- `parseVersion(version)` - Parse version string
- `incrementVersion(version, type)` - Increment version
- `calculateFunctionSize(definition)` - Calculate function size

## Types

See `src/types.ts` for complete type definitions:

- `FunctionDefinition` - Complete function with metadata and source
- `FunctionMetadata` - Function metadata (name, version, author, etc.)
- `FunctionSource` - Function source code and dependencies
- `FunctionInput` - Execution input parameters and context
- `FunctionResult` - Execution result with success/error
- `FunctionContext` - Execution context (IDs, env, limits)
- `FunctionRegistryEntry` - Registry entry with deployment status
- `FunctionSearchQuery` - Search query filters
- `FunctionSearchResult` - Search results with pagination

## Examples

See `examples/` directory for complete examples:

- `basic.ts` - Basic function registration and execution
- `search.ts` - Function discovery and search
- `versioning.ts` - Function versioning and updates
- `async.ts` - Async function execution

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## Architecture

### Function Registry

Functions are stored in a registry (in-memory for development, database-backed in production) with:

- Unique ID
- Metadata (name, version, author, tags, etc.)
- Source code
- Deployment status (draft, deployed, archived)
- Deployment endpoint (if deployed)

### Function Execution

Functions are executed in isolated sandboxes with:

- Resource limits (memory, timeout)
- Environment variables
- Context (function ID, execution ID, request ID)
- Execution logging and monitoring

**Note**: The current implementation uses a simplified execution model. In production, `ai-sandbox` should be used for true isolated execution with separate V8 isolates and resource limits.

## Related Packages

- **graphdl**: Core SDK interfaces
- **ai-sandbox**: Isolated execution environment
- **ai-workflows**: Workflow orchestration
- **ai-database**: Semantic database operations

## Workers

This package is used by:

- **workers/functions** - functions.do runtime
- **workers/ai** - AI function execution
- **workers/workflows** - Workflow function steps

## License

MIT

## Links

- **Homepage**: https://functions.do
- **Repository**: https://github.com/dot-do/platform
- **Documentation**: https://functions.do/docs
