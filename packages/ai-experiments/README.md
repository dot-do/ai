# ai-experiments

A minimalistic experiment runner for AI tasks.

## Installation

```bash
npm install ai-experiments
# or
yarn add ai-experiments
# or
pnpm add ai-experiments
```

## Usage

### Basic Example

```typescript
import { Experiment } from 'ai-experiments'

const result = await Experiment('simple-test', {
  models: ['gpt-4o'],
  temperature: 0.7,
  prompt: 'What is the capital of France?',
})

console.log(result)
```

### Using Parameter Combinations

```typescript
import { Experiment } from 'ai-experiments'

const result = await Experiment('temperature-comparison', {
  models: ['gpt-4o', 'gpt-4o-mini'],
  temperature: [0, 0.3, 0.7, 1.0],
  prompt: 'Generate a creative story about a robot.',
})

// This will run 8 combinations (2 models × 4 temperatures)
console.log(result)
```

### Using the Cartesian Function Directly

```typescript
import { cartesian } from 'ai-experiments'

const combinations = cartesian({
  model: ['gpt-4o', 'gpt-4o-mini'],
  temperature: [0, 0.7],
  maxTokens: [100, 500],
})

// Returns:
// [
//   { model: 'gpt-4o', temperature: 0, maxTokens: 100 },
//   { model: 'gpt-4o', temperature: 0, maxTokens: 500 },
//   { model: 'gpt-4o', temperature: 0.7, maxTokens: 100 },
//   { model: 'gpt-4o', temperature: 0.7, maxTokens: 500 },
//   { model: 'gpt-4o-mini', temperature: 0, maxTokens: 100 },
//   { model: 'gpt-4o-mini', temperature: 0, maxTokens: 500 },
//   { model: 'gpt-4o-mini', temperature: 0.7, maxTokens: 100 },
//   { model: 'gpt-4o-mini', temperature: 0.7, maxTokens: 500 }
// ]
```

### Using the Runner

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { createRunner } from 'ai-experiments'

export default createRunner({
  outputDir: '.ai/experiments',
  testMatch: ['**/*experiment*.(js|ts|mjs|cjs)'],
  watch: false,
})
```

## API Reference

### Experiment

```typescript
function Experiment<T = any, E = any>(name: string, config: ExperimentConfig<T, E>): Promise<ExperimentResult>
```

#### Parameters

- `name`: Name of the experiment
- `config`: Configuration object with the following properties:
  - `models`: Array of model names to use
  - `temperature`: Number or array of temperature values
  - `seed` (optional): Number or array of seed values
  - `prompt` (optional): String or function that generates prompts
  - `inputs` (optional): Array or function that returns input values
  - `expected` (optional): Expected output for validation
  - `schema` (optional): Schema for structured output

#### Returns

Promise that resolves to an `ExperimentResult` object with:

- `name`: Name of the experiment
- `results`: Array of results for each parameter combination
- `totalTime`: Total time taken for the experiment
- `timestamp`: ISO string of when the experiment was run

### cartesian

```typescript
function cartesian<T extends Record<string, readonly any[]>>(spec: T): Array<{ [K in keyof T]: T[K][number] }>
```

#### Parameters

- `spec`: Object with keys mapping to arrays of values

#### Returns

Array of objects representing all possible combinations of the input values.

### createRunner

```typescript
function createRunner(config?: RunnerConfig): VitestConfig
```

#### Parameters

- `config` (optional): Configuration object with the following properties:
  - `outputDir` (optional): Directory where experiment results will be saved
  - `testMatch` (optional): Custom test matcher pattern
  - `watch` (optional): Whether to watch for file changes

#### Returns

A Vitest configuration function that can be used in `vitest.config.ts`.
