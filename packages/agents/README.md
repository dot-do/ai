# agents

Universal agent configuration format with CLI/SDK and React components.

## Features

- ✨ Single source of truth for agent configurations
- 🔄 Convert between multiple formats (agents.md, .cursorrules, CLAUDE.md, windsurf, JSON)
- 📦 TypeScript SDK for parsing and rendering
- 🎨 React components for displaying agent configs
- 🛠️ CLI for converting and validating configs
- 🎯 Optimized rendering for each AI model format

## Installation

```bash
pnpm add agents
```

## Usage

### CLI

```bash
# Parse an agent config
agents parse agents.md

# Render to different format
agents render agents.md --to cursor > .cursorrules

# Convert between formats
agents convert .cursorrules agents.md

# Validate a config
agents validate CLAUDE.md
```

### SDK

```typescript
import { parse, render } from 'agents'

// Parse from any format
const config = parse(content)

// Render to specific format
const cursorRules = render(config, { format: 'cursor' })
const claudeMd = render(config, { format: 'claude' })
```

### React Components

```tsx
import { AgentConfigComponent, AgentCard } from 'agents/react'

function MyApp() {
  return (
    <div>
      <AgentConfigComponent config={config} />
      <AgentCard config={config} />
    </div>
  )
}
```

## Supported Formats

- **agents.md** - Universal markdown format
- **.cursorrules** - Cursor IDE rules
- **CLAUDE.md** - Claude AI instructions
- **windsurf** - Windsurf format
- **JSON** - Structured JSON format

## Config Schema

```typescript
interface AgentConfig {
  name: string
  version?: string
  description?: string
  model?: string
  instructions?: string
  systemPrompt?: string
  context?: string[]
  tools?: Tool[]
  rules?: Rule[]
  capabilities?: string[]
  examples?: Example[]
  metadata?: Record<string, any>
}
```

## Examples

See the [examples](./examples) directory for sample agent configurations.

## License

MIT
