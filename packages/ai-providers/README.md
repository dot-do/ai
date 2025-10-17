# AI Providers

Provider router for AI models including OpenAI, Anthropic, Google, and more.

Unified access to 24+ AI providers with support for:

- Model aliasing and short names
- Capability-based model selection
- Provider constraint filtering
- Automatic provider resolution

## Installation

```bash
pnpm add ai-providers
```

## Usage

### Basic Usage

```typescript
import { languageModel } from 'ai-providers'

// Using full provider/model format
const model = languageModel('openai/gpt-5')
const response = await model.generate({
  prompt: 'Hello, world!',
})
```

### Using Aliases

Short names are automatically resolved to full provider/model identifiers:

```typescript
import { languageModel } from 'ai-providers'

// Using alias (resolves to 'openai/gpt-5')
const model = languageModel('gpt-5')

// Using other aliases
const claude = languageModel('claude-sonnet') // → anthropic/claude-sonnet-4.5
const gemini = languageModel('gemini') // → google/gemini-2.5-pro
```

### Capability-Based Selection

Request models with specific capabilities:

```typescript
import { languageModel } from 'ai-providers'

// Request model with vision and function calling
const model = languageModel('gpt-5(vision,function-calling)')

// Request model with specific constraints
const fastModel = languageModel('anthropic/claude-sonnet(latency<100)')
const cheapModel = languageModel('openai/gpt-5(cost<0.001)')
```

### Parser API

Parse and analyze model references programmatically:

```typescript
import { parse, getModelId } from 'ai-providers'

// Parse a model reference
const parsed = parse('gpt-5(vision,function-calling)')
console.log(parsed)
// {
//   original: 'gpt-5(vision,function-calling)',
//   author: 'openai',
//   model: 'gpt-5',
//   capabilities: { vision: true, 'function-calling': true }
// }

// Get full model ID
const modelId = getModelId(parsed) // "openai/gpt-5"
```

### Provider Names

Get human-readable provider names:

```typescript
import { getProviderName } from 'ai-providers'

console.log(getProviderName('openai')) // "OpenAI"
console.log(getProviderName('anthropic')) // "Anthropic"
console.log(getProviderName('google')) // "Google AI Studio"
```

## Available Providers

### Language Models

- OpenAI (`openai/...`)
- Anthropic (`anthropic/...`)
- Google (`google/...`)
- Google Vertex (`googleVertex/...`)
- XAI (`xai/...`)
- Groq (`groq/...`)
- Amazon Bedrock (`bedrock/...`)
- Perplexity (`perplexity/...`)
- Azure OpenAI (`azure/...`)
- Fal (`fal/...`)
- DeepInfra (`deepinfra/...`)
- Mistral AI (`mistral/...`)
- Cohere (`cohere/...`)
- Fireworks (`fireworks/...`)
- DeepSeek (`deepseek/...`)
- Cerebras (`cerebras/...`)
- Replicate (`replicate/...`)
- Luma (`luma/...`)

### Planned Providers

- Together.ai (`together/...`) - Not yet available in npm registry
