# verbs.do SDK

TypeScript SDK for verbs.do - Semantic action execution with O*NET work activities, Schema.org Action types, and custom verb definitions.

## Features

- 🎯 **Semantic Action Execution** - Execute actions using natural language verbs
- 📊 **O*NET Integration** - Access 923 occupations and 19,000+ work activities
- 🔗 **Schema.org Actions** - Use standardized Schema.org Action types
- 🤖 **LLM Integration** - Convert verbs to OpenAI, Anthropic, and LangChain tool formats
- 🔍 **Discovery & Search** - Find verbs by category, source, or semantic similarity
- 📦 **Type-Safe** - Full TypeScript support with comprehensive types
- ⚡ **Lightweight** - Zero runtime dependencies

## Installation

```bash
npm install verbs.do
# or
pnpm add verbs.do
# or
yarn add verbs.do
```

## Quick Start

```typescript
import { verbs } from 'verbs.do'

// List all verbs
const allVerbs = await verbs.list({ limit: 100 })

// Search verbs
const results = await verbs.search('manage')

// Get verb details
const verb = await verbs.get('manage')
console.log(verb.onetSkills) // O*NET work activities
console.log(verb.relatedNouns) // Related nouns (objects)
console.log(verb.relatedVerbs) // Related verbs (similar actions)

// Get related entities
const related = await verbs.related('manage')
console.log(related.nouns) // Objects this verb can act on
console.log(related.verbs) // Similar verbs

// Create custom verb
const custom = await verbs.create({
  name: 'orchestrate',
  description: 'Coordinate multiple activities',
  category: 'Management',
  relatedNouns: ['team', 'project', 'workflow']
})
```

## API Reference

### Client Creation

```typescript
import { createClient, VerbsClient } from 'verbs.do'

// Use default client (convenience functions use https://verbs.do)
import * as verbs from 'verbs.do'

// Or create custom client with configuration
const client = createClient({
  baseUrl: 'https://verbs.do',  // Production URL
  // Or use development URL: 'https://verbs.dotdo.workers.dev'
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer token'
  }
})
```

**Note:** The default client is created at module load time with `baseUrl: 'https://verbs.do'`. If you need to use a different base URL (e.g., for testing or staging), create a custom client instance using `createClient()`.

### List Verbs

```typescript
interface ListVerbsOptions {
  category?: string
  source?: 'onet' | 'schema.org' | 'custom'
  limit?: number
  offset?: number
}

const response = await verbs.list({
  category: 'Communication',
  source: 'onet',
  limit: 50,
  offset: 0
})

console.log(response.verbs)     // Verb[]
console.log(response.total)     // Total count
console.log(response.limit)     // Limit used
console.log(response.offset)    // Offset used
```

### Get Verb

```typescript
const verb = await verbs.get('manage')

if (verb) {
  console.log(verb.name)          // 'manage'
  console.log(verb.label)         // 'Manage'
  console.log(verb.description)   // Description
  console.log(verb.category)      // Category
  console.log(verb.source)        // 'onet' | 'schema.org' | 'custom'
  console.log(verb.relatedNouns)  // ['team', 'project', ...]
  console.log(verb.relatedVerbs)  // ['organize', 'coordinate', ...]
  console.log(verb.aliases)       // Alternative names
  console.log(verb.metadata)      // Additional metadata
}
```

### Create Verb

```typescript
const verb = await verbs.create({
  name: 'orchestrate',
  label: 'Orchestrate',
  description: 'Coordinate multiple activities or teams',
  category: 'Management',
  relatedNouns: ['team', 'project', 'workflow'],
  aliases: ['coordinate', 'arrange'],
  metadata: {
    difficulty: 'advanced',
    frequency: 50
  }
})
```

### Update Verb

```typescript
const updated = await verbs.update('orchestrate', {
  description: 'Coordinate and harmonize multiple activities',
  relatedNouns: ['team', 'project', 'workflow', 'system']
})
```

### Delete Verb

```typescript
await verbs.deleteVerb('orchestrate')
```

### Search Verbs

```typescript
const results = await verbs.search('manage', 20)

results.results.forEach(result => {
  console.log(result.name)        // Verb name
  console.log(result.label)       // Display label
  console.log(result.description) // Description
  console.log(result.relevance)   // Relevance score (0-1)
})
```

### Get Related Entities

```typescript
// Get all related entities
const all = await verbs.related('manage')
console.log(all.related.nouns)  // Related nouns (objects)
console.log(all.related.verbs)  // Related verbs (similar actions)

// Get only related nouns
const nouns = await verbs.related('manage', 'nouns')
console.log(nouns.related.nouns)

// Get only related verbs
const verbs = await verbs.related('manage', 'verbs')
console.log(verbs.related.verbs)
```

### List Categories

```typescript
const response = await verbs.categories()

response.categories.forEach(category => {
  console.log(category.name)        // Category name
  console.log(category.count)       // Number of verbs
  console.log(category.description) // Description
})
```

## LLM Integration

Convert verbs to tool formats for various LLM providers:

### OpenAI Function Calling

```typescript
import { toOpenAITool, toOpenAITools } from 'verbs.do'

const verb = await verbs.get('send')
const tool = toOpenAITool(verb)

// Use with OpenAI
import OpenAI from 'openai'
const openai = new OpenAI()

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Send an email to john@example.com' }],
  tools: [tool]
})
```

### Anthropic Tools

```typescript
import { toAnthropicTool, toAnthropicTools } from 'verbs.do'

const verb = await verbs.get('send')
const tool = toAnthropicTool(verb)

// Use with Anthropic
import Anthropic from '@anthropic-ai/sdk'
const anthropic = new Anthropic()

const response = await anthropic.messages.create({
  model: 'claude-3-opus-20240229',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Send an email to john@example.com' }],
  tools: [tool]
})
```

### LangChain Tools

```typescript
import { toLangChainTool, toLangChainTools } from 'verbs.do'
import { DynamicTool } from 'langchain/tools'

const verb = await verbs.get('send')
const toolSpec = toLangChainTool(verb)

const tool = new DynamicTool({
  name: toolSpec.name,
  description: toolSpec.description,
  func: async (input) => {
    // Implementation
    return 'Email sent'
  }
})
```

### Convert Multiple Verbs

```typescript
import { toOpenAITools, toAnthropicTools, toLangChainTools } from 'verbs.do'

const communicationVerbs = await verbs.list({
  category: 'Communication',
  limit: 10
})

// Convert all to OpenAI tools
const openaiTools = toOpenAITools(communicationVerbs.verbs)

// Convert all to Anthropic tools
const anthropicTools = toAnthropicTools(communicationVerbs.verbs)

// Convert all to LangChain tools
const langchainTools = toLangChainTools(communicationVerbs.verbs)
```

## O*NET Integration

Work with O*NET (Occupational Information Network) work activities:

```typescript
import {
  getONETVerbs,
  getVerbsByONETCode,
  getVerbsByCategory
} from 'verbs.do'

// Get all O*NET verbs
const onetVerbs = await getONETVerbs()

// Get verbs by O*NET code
const managementVerbs = await getVerbsByONETCode('11-1021.00')

// Get verbs by category
const communicationVerbs = await getVerbsByCategory('Communication')
```

## Schema.org Integration

Work with Schema.org Action types:

```typescript
import { getVerbsBySchemaOrgType } from 'verbs.do'

// Get verbs for Schema.org CommunicateAction
const communicateVerbs = await getVerbsBySchemaOrgType('CommunicateAction')

// Get verbs for Schema.org TradeAction
const tradeVerbs = await getVerbsBySchemaOrgType('TradeAction')
```

## Type Definitions

### Verb

```typescript
interface Verb {
  id: string
  type: 'Verb'
  name: string
  label: string
  description: string
  category: string
  source: 'onet' | 'schema.org' | 'custom'
  relatedNouns: string[]
  relatedVerbs: string[]
  aliases: string[]
  metadata: {
    onetCode?: string
    schemaOrgType?: string
    frequency?: number
    difficulty?: string
    [key: string]: any
  }
}
```

### VerbSearchResult

```typescript
interface VerbSearchResult {
  id: string
  name: string
  label: string
  description: string
  category: string
  source: 'onet' | 'schema.org' | 'custom'
  relevance: number // 0-1
}
```

### RelatedEntity

```typescript
interface RelatedEntity {
  id: string
  name: string
  label: string
  relationship?: string
  similarity?: number
  frequency?: number
}
```

## Error Handling

```typescript
try {
  const verb = await verbs.get('nonexistent')
  if (!verb) {
    console.log('Verb not found')
  }
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message)
  }
}

// With custom client
const client = createClient({
  timeout: 5000 // 5 second timeout
})

try {
  const result = await client.search('manage')
} catch (error) {
  if (error instanceof Error && error.message.includes('timeout')) {
    console.error('Request timed out')
  }
}
```

## Advanced Usage

### Custom Base URL

```typescript
const client = createClient({
  baseUrl: 'https://custom-verbs-instance.do'
})
```

### Authentication

```typescript
const client = createClient({
  headers: {
    'Authorization': 'Bearer your-api-token'
  }
})
```

### Timeout Configuration

```typescript
const client = createClient({
  timeout: 30000 // 30 seconds
})
```

## Best Practices

1. **Use Default Client for Simple Cases**
   ```typescript
   import * as verbs from 'verbs.do'
   const result = await verbs.search('manage')
   ```

2. **Create Custom Client for Configuration**
   ```typescript
   const client = createClient({
     baseUrl: process.env.VERBS_URL,
     timeout: 10000
   })
   ```

3. **Cache Frequently Used Verbs**
   ```typescript
   const cache = new Map<string, Verb>()

   async function getCachedVerb(name: string): Promise<Verb | null> {
     if (cache.has(name)) {
       return cache.get(name)!
     }
     const verb = await verbs.get(name)
     if (verb) cache.set(name, verb)
     return verb
   }
   ```

4. **Use Type Guards**
   ```typescript
   const verb = await verbs.get('manage')
   if (verb && verb.source === 'onet') {
     console.log('O*NET Code:', verb.metadata.onetCode)
   }
   ```

5. **Handle Errors Gracefully**
   ```typescript
   const verb = await verbs.get(userInput).catch(() => null)
   if (!verb) {
     return 'Verb not found. Try searching instead.'
   }
   ```

## Examples

### Building a Verb Explorer

```typescript
import * as verbs from 'verbs.do'

async function exploreVerbs() {
  // Get all categories
  const { categories } = await verbs.categories()

  for (const category of categories) {
    console.log(`\n${category.name} (${category.count} verbs)`)

    // Get verbs in this category
    const { verbs: categoryVerbs } = await verbs.list({
      category: category.name,
      limit: 5
    })

    for (const verb of categoryVerbs) {
      console.log(`  - ${verb.label}: ${verb.description}`)
    }
  }
}
```

### Building an AI Agent with Tools

```typescript
import * as verbs from 'verbs.do'
import { toOpenAITools } from 'verbs.do'
import OpenAI from 'openai'

async function createAgentWithVerbs() {
  // Get communication verbs
  const { verbs: communicationVerbs } = await verbs.list({
    category: 'Communication',
    limit: 10
  })

  // Convert to OpenAI tools
  const tools = toOpenAITools(communicationVerbs)

  // Use with OpenAI
  const openai = new OpenAI()
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'user', content: 'Send a welcome email to new users' }
    ],
    tools
  })

  console.log(response.choices[0].message)
}
```

### Semantic Verb Discovery

```typescript
import * as verbs from 'verbs.do'

async function findSimilarActions(verbName: string) {
  // Get the verb
  const verb = await verbs.get(verbName)
  if (!verb) return []

  // Get related verbs
  const { related } = await verbs.related(verbName, 'verbs')

  // Sort by similarity
  return related.verbs
    ?.sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
    ?.slice(0, 5) || []
}

// Usage
const similar = await findSimilarActions('manage')
console.log('Similar to "manage":', similar.map(v => v.name))
```

## Contributing

Contributions are welcome! Please see the [main repository](https://github.com/dot-do/platform) for contribution guidelines.

## License

MIT

## Links

- [Platform](https://platform.do)
- [Worker API](https://verbs.do)
- [Documentation](https://docs.do/verbs)
- [GitHub](https://github.com/dot-do/platform/tree/main/ai/sdks/verbs.do)
