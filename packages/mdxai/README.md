# mdxai

AI-powered MDX development tool with agentic architecture, built on OpenRouter and React Ink.

## Overview

`mdxai` is an intelligent tool for building, testing, and managing MDX applications with AI assistance. Unlike traditional CLIs with fixed commands, mdxai uses an **agentic architecture** where an AI agent has access to tools and can autonomously decide how to accomplish your requests.

### Key Features

- **Agentic Architecture** - AI agent with tool access (no fixed command structure)
- **Natural Language Interface** - Describe what you want, the AI figures out how
- **AI SDK with OpenRouter** - Defaults to GPT-5 for intelligent decision-making
- **Tool System** - mdxe, mdxdb, todo, list, forEach, and recursive generation
- **React Ink CLI** - Beautiful command-line interface
- **Schema-Aware Generation** - Detects schemas in frontmatter for structured output
- **Recursive Capabilities** - AI can call sub-tasks and iterate

### Integrated Tools

- **mdxe** - compile, render, validate MDX files
- **mdxdb** - read/write markdown/MDX files with frontmatter parsing
- **list** - list files in directories with filtering
- **todo** - task management (add, list, complete, remove)
- **forEach** - iterate over items for batch operations
- **generate** - recursive generation with schema support

## Installation

```bash
pnpm add mdxai
```

Or install globally:

```bash
pnpm add -g mdxai
```

## Configuration

Set your OpenRouter API key:

```bash
export OPENROUTER_API_KEY=your-api-key-here
```

Or pass it programmatically:

```typescript
import { createAgent } from 'mdxai'

const agent = createAgent({
  apiKey: 'your-api-key',
  model: 'openai/gpt-5', // or any OpenRouter model
})
```

## CLI Usage

The CLI accepts natural language requests - no need to memorize commands!

### Basic Usage

```bash
mdxai <your request in natural language>
```

### Examples

```bash
# Generate content
mdxai generate a blog post about AI in web development

# Compile files
mdxai compile all MDX files in ./content

# Validate and fix
mdxai validate the MDX files and fix any syntax errors

# Task management
mdxai create a todo list for: compile, test, and deploy

# Read and summarize
mdxai read README.mdx and generate a summary

# Batch operations
mdxai list all .mdx files in ./content then validate each one

# Complex multi-step tasks
mdxai analyze all MDX files, create todos for issues, then generate a report
```

The AI agent will:

1. Understand your request
2. Break it down into steps
3. Use appropriate tools
4. Show you what it's doing
5. Return the results

## Programmatic Usage

### Using the Agent

```typescript
import { createAgent } from 'mdxai'

const agent = createAgent()

// Run a task with tools
const result = await agent.run({
  prompt: 'Compile all MDX files and create a report',
  maxSteps: 20,
})

console.log(result.text)
console.log('Steps taken:', result.steps.length)

// Access step details
result.steps.forEach((step) => {
  if (step.type === 'tool-call') {
    console.log(`Tool: ${step.toolName}`)
    console.log(`Args:`, step.toolArgs)
    console.log(`Result:`, step.toolResult)
  }
})
```

### Simple Generation

```typescript
import { createAgent } from 'mdxai'

const agent = createAgent()

// Generate text
const text = await agent.generateText({
  prompt: 'Write a haiku about coding',
})

console.log(text)
```

### Structured Generation

```typescript
import { createAgent } from 'mdxai'
import { z } from 'zod'

const agent = createAgent()

// Generate with schema
const person = await agent.generateObject({
  prompt: 'Create a person profile for John Doe, age 30',
  schema: z.object({
    name: z.string(),
    age: z.number(),
    email: z.string().email(),
    bio: z.string(),
  }),
})

console.log(person)
// { name: "John Doe", age: 30, email: "...", bio: "..." }
```

### Schema-Aware Generation

```typescript
import { createAgent } from 'mdxai'

const agent = createAgent()

// Automatically detects schema from frontmatter
const result = await agent.generate({
  prompt: 'Generate a blog post',
  schemaPath: './templates/blog-post.mdx', // Has schema in frontmatter
})

// Returns structured object if schema found, otherwise markdown text
```

## Tool System

The agent has access to these tools:

### mdxe Tools

```typescript
// Compile MDX to JavaScript
await agent.run({ prompt: 'compile ./content/post.mdx' })

// Render MDX to HTML
await agent.run({ prompt: 'render ./content/post.mdx' })

// Validate MDX syntax
await agent.run({ prompt: 'validate all MDX files in ./content' })
```

### mdxdb Tools

```typescript
// Read file with frontmatter
await agent.run({ prompt: 'read ./content/post.mdx and show the frontmatter' })

// Write file with frontmatter
await agent.run({
  prompt: 'create a new blog post at ./content/new.mdx with title "Hello World"',
})
```

### Task Management

```typescript
// Create todos
await agent.run({ prompt: 'create todos: compile, test, deploy' })

// List todos
await agent.run({ prompt: 'list all todos' })

// Complete todo
await agent.run({ prompt: 'complete the compile todo' })

// Remove todo
await agent.run({ prompt: 'remove the deploy todo' })
```

### List and Iterate

```typescript
// List files
await agent.run({ prompt: 'list all .mdx files in ./content' })

// Iterate over items
await agent.run({ prompt: 'for each .mdx file in ./content, validate it' })
```

### Recursive Generation

```typescript
// The AI can call generate for sub-tasks
await agent.run({
  prompt: 'generate a blog post, then generate a summary, then generate social media posts for it',
})
```

## API Reference

### `createAgent(config?: MdxAIConfig): MdxAgent`

Create a new AI agent instance.

**Config Options:**

- `apiKey?: string` - OpenRouter API key (or use OPENROUTER_API_KEY env var)
- `model?: string` - Model to use (default: 'openai/gpt-5')
- `baseURL?: string` - OpenRouter API base URL
- `temperature?: number` - Temperature for generation (0-1, default: 0.7)
- `maxTokens?: number` - Maximum tokens to generate (default: 4000)

### `agent.run(options: AgentOptions): Promise<AgentResult>`

Run the agent with tool support.

**Options:**

- `prompt: string` - Your request in natural language
- `system?: string` - Custom system message
- `temperature?: number` - Temperature override
- `maxTokens?: number` - Max tokens override
- `maxSteps?: number` - Maximum tool calls/steps (default: 10)

**Returns:** `AgentResult` with:

- `text: string` - Final response
- `steps: Array` - Steps taken (tool calls and text)
- `usage?: object` - Token usage information

### `agent.generateText(options): Promise<string>`

Simple text generation without tools.

**Options:**

- `prompt: string` - Generation prompt
- `system?: string` - System message
- `temperature?: number` - Temperature override
- `maxTokens?: number` - Max tokens override

### `agent.generateObject<T>(options): Promise<T>`

Generate structured data with a Zod schema.

**Options:**

- `prompt: string` - Generation prompt
- `schema: z.ZodSchema<T>` - Zod schema for validation
- `system?: string` - System message
- `temperature?: number` - Temperature override
- `maxTokens?: number` - Max tokens override

### `agent.generate(options): Promise<string | object>`

Smart generation that detects schema from file frontmatter.

**Options:**

- `prompt: string` - Generation prompt
- `schemaPath?: string` - Path to file with schema in frontmatter
- `system?: string` - System message

## How It Works

### Agentic Architecture

Unlike traditional CLIs with predefined commands, mdxai uses an agentic approach:

1. **You describe what you want** in natural language
2. **AI analyzes the request** and plans the steps
3. **AI uses tools** to accomplish the task (mdxe, mdxdb, todo, etc.)
4. **AI can iterate** and make multiple tool calls
5. **Results are returned** with a summary of what was done

### Tool Execution

The agent decides which tools to use based on your request:

```
User: "compile all MDX files and create a todo for any that fail"
  ↓
AI analyzes request
  ↓
AI calls: list tool (find .mdx files)
  ↓
AI calls: mdxe_compile tool (for each file)
  ↓
AI calls: todo tool (add failed files)
  ↓
AI returns: summary and results
```

### Schema Detection

When generating content, the agent can detect schemas:

```typescript
// template.mdx frontmatter:
// ---
// schema:
//   type: object
//   properties:
//     title: string
//     author: string
// ---

await agent.generate({
  prompt: 'Generate a blog post',
  schemaPath: './template.mdx',
})
// Returns: { title: "...", author: "..." }
```

## Security Considerations

The tool implements several security measures:

- **Path Validation**: File operations validate paths to prevent directory traversal attacks
- **Path Normalization**: All file paths are normalized and resolved to absolute paths
- **Restricted Access**: Paths containing `..` or starting with `/etc` or `/sys` are rejected

However, note that:

- The AI agent can read and write files within your project directory
- Always review generated content before committing to version control
- Be cautious when running the tool with elevated privileges

## Limitations

### Todo Storage

The `todo` tool stores tasks **in memory only**. This means:

- ✅ Great for tracking tasks during a single session
- ❌ Todos are lost when the process exits
- ❌ Not suitable for persistent task management
- 💡 For persistent todos, use a proper task management system or file-based storage

### Incomplete Features

Some features are marked as "not yet implemented":

- **Watch Mode**: Build and test watch mode (use a file watcher like `chokidar` separately)
- **Deploy**: Deployment functionality (planned for integration with Cloudflare Workers)

When these features are requested, the tool will provide a clear error message.

## Examples

See the `examples/` directory for complete examples:

- `examples/agent.ts` - Agent with tools
- `examples/basic.ts` - Legacy API (backward compatible)

## Legacy API

The package maintains backward compatibility with the original API:

```typescript
import { createAI, build, test, deploy } from 'mdxai'

// Old AI API
const ai = createAI()
const result = await ai.generate({ prompt: 'hello' })

// Build/test/deploy functions
await build({ path: './src' })
await test({ path: './src' })
await deploy({ path: './dist' })
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## License

MIT
