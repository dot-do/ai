# ai-props

[![npm version](https://img.shields.io/npm/v/ai-props.svg)](https://www.npmjs.com/package/ai-props)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

React component for generating AI-powered props for your components.

## Installation

```bash
npm install ai-props
# or
pnpm add ai-props
# or
yarn add ai-props
```

## Features

- 🧩 **Component-Friendly**: Spreads AI-generated properties to your React components
- 🔄 **Real-time Streaming**: Stream AI-generated content for immediate feedback
- 🔌 **Provider Flexibility**: Support for multiple AI providers through string-based names or provider objects
- 📊 **Schema-based Generation**: Define the structure of your AI-generated content using simple objects or Zod schemas

## Usage

### Basic Usage

```tsx
import { AI } from 'ai-props'

// Simple string-based OpenAI model
;<AI
  model="gpt-4.1"
  schema={{
    title: 'SEO-optimized title',
    content: 'string',
  }}
  prompt="Generate content"
>
  {(props) => (
    <article>
      <h1>{props.title}</h1>
      <div>{props.content}</div>
    </article>
  )}
</AI>
```

### With Provider-specific Model Object

```tsx
import { AI } from 'ai-props'
import { model } from 'ai-providers'

const customModel = model('claude-3.7-sonnet')

<AI
  model={customModel}
  schema={{
    title: 'SEO-optimized title',
    content: 'string'
  }}
  prompt='Generate content'
>
  {(props) => (
    <article>
      <h1>{props.title}</h1>
      <div>{props.content}</div>
    </article>
  )}
</AI>
```

### With Streaming Support

```tsx
import { AI } from 'ai-props'
;<AI
  model="gpt-4.1"
  stream={true}
  schema={{
    title: 'SEO-optimized title',
    content: 'string',
  }}
  prompt="Generate an article about React"
>
  {(props, { isStreaming }) => (
    <article className={isStreaming ? 'animate-pulse' : ''}>
      <h1>{props.title}</h1>
      <div>{props.content}</div>
      {isStreaming && <div className="text-gray-500">Generating content...</div>}
    </article>
  )}
</AI>
```

### With Enum Options

```tsx
import { AI } from 'ai-props'
;<AI
  model="gpt-4.1"
  schema={{
    productType: 'App | API | Marketplace | Platform',
    profile: {
      customer: 'customer description',
      solution: 'solution description',
    },
  }}
  prompt="Generate a product profile"
>
  {(props) => (
    <div>
      <h2>Product Type: {props.productType}</h2>
      <h3>Customer</h3>
      <p>{props.profile.customer}</p>
      <h3>Solution</h3>
      <p>{props.profile.solution}</p>
    </div>
  )}
</AI>
```

### With Array Output

```tsx
import { AI } from 'ai-props'
;<AI
  model="gpt-4.1"
  output="array"
  cols={3}
  schema={{
    name: 'SEO-optimized title',
    description: 'string',
  }}
  prompt="Generate 6 product ideas"
>
  {(props) => (
    <div>
      <h2>{props.name}</h2>
      <p>{props.description}</p>
    </div>
  )}
</AI>
```

## API Reference

### AI Component Props

| Prop          | Type                                                      | Default                     | Description                                                                            |
| ------------- | --------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `model`       | `string \| ModelObject`                                   | `'gpt-4o'`                  | AI model to use. Can be a string (e.g., 'gpt-4.1') or a model object from ai-providers |
| `schema`      | `Record<string, any> \| z.ZodType`                        | Required                    | Schema defining the structure of the generated content                                 |
| `prompt`      | `string`                                                  | Required                    | Prompt to send to the AI model                                                         |
| `stream`      | `boolean`                                                 | `false`                     | Whether to stream the AI response in real-time                                         |
| `output`      | `'object' \| 'array'`                                     | `'object'`                  | Output format for the generated content                                                |
| `cols`        | `number`                                                  | `1`                         | Number of columns for array output (only used when output='array')                     |
| `children`    | `(props: any, state: { isStreaming: boolean; error: Error | null }) => React.ReactNode` | Required                                                                               | Render function that receives the generated props |
| `apiEndpoint` | `string`                                                  | `undefined`                 | Optional API endpoint for proxy implementation                                         |

## Dependencies

- [ai-functions](https://www.npmjs.com/package/ai-functions)
- [ai-providers](https://www.npmjs.com/package/ai-providers)
- [react](https://www.npmjs.com/package/react)
- [zod](https://www.npmjs.com/package/zod)
