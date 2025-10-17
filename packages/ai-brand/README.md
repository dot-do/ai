# ai-brand

[![npm version](https://img.shields.io/npm/v/ai-brand.svg)](https://www.npmjs.com/package/ai-brand)
[![License](https://img.shields.io/npm/l/ai-brand.svg)](https://github.com/drivly/primitives.org.ai/blob/main/packages/ai-brand/LICENSE)

AI-powered brand messaging and visual identity generation.

## Overview

`ai-brand` provides a unified API for generating complete brand identities, combining messaging and positioning with visual elements. It leverages AI to create cohesive brand experiences that align with your business goals.

## Installation

```bash
npm install ai-brand
```

## Usage

```typescript
import { Brand } from 'ai-brand'

// Generate a complete brand identity
const brand = await Brand({
  name: 'Horizon',
  description: 'A modern SaaS platform for team collaboration',
  industry: 'technology',
  values: ['innovation', 'simplicity', 'reliability'],
})

// Access brand components
console.log(brand.positioning.messaging.tagline)
// => "Collaborate without boundaries"

console.log(brand.visual.colors.primary)
// => "#4285F4"

console.log(brand.assets.logo.url)
// => "https://example.com/generated-logo.png"
```

## API

### Brand(input, options)

The main function that generates a complete brand identity.

#### Parameters

- `input`: Brand input data
  - `name`: Brand name
  - `description`: Brief description of the brand
  - `industry`: (optional) Industry category
  - `values`: (optional) Core brand values
  - `customPrompt`: (optional) Additional context for AI generation

- `options`: Configuration options
  - `modelName`: AI model to use
  - `temperature`: Creativity level (0.0-1.0)
  - `system`: Custom system prompt
  - `imageModel`: Model for image generation
  - `imageStyle`: Style for generated images
  - `imageQuality`: Quality of generated images
  - `colorScheme`: 'light', 'dark', or 'both'
  - `iconStyle`: Preferred icon style

#### Returns

- `positioning`: Brand positioning information
  - `story`: Brand story elements
  - `voice`: Brand voice characteristics
  - `messaging`: Key messages and taglines

- `visual`: Visual identity elements
  - `colors`: Color palette
  - `typography`: Font recommendations
  - `themes`: Light and dark mode themes

- `assets`: Brand assets
  - `logo`: Generated logo
  - `icons`: Icon set
  - `images`: Open graph and other images

## Examples

### Custom Configuration

```typescript
import { Brand } from 'ai-brand'

const brand = await Brand(
  {
    name: 'GreenLeaf',
    description: 'Sustainable gardening products',
    industry: 'home and garden',
    values: ['sustainability', 'quality', 'community'],
  },
  {
    modelName: 'google/gemini-2.5-flash-preview',
    temperature: 0.8,
    imageModel: 'dall-e-3',
    imageStyle: 'vivid',
    colorScheme: 'both',
  }
)
```

### Tailwind Integration

```typescript
import { Brand } from 'ai-brand'
import { generateTailwindConfig } from 'ai-brand/integrations/tailwind'

const brand = await Brand({
  name: 'Quantum',
  description: 'Next-generation quantum computing solutions',
})

// Generate Tailwind config
const tailwindConfig = generateTailwindConfig(brand.visual.colors)

// Use in your tailwind.config.js
module.exports = {
  // ...your existing config
  theme: {
    extend: {
      colors: tailwindConfig.colors,
    },
  },
}
```

### Iconify Integration

```typescript
import { Brand } from 'ai-brand'
import { getBrandIconSet } from 'ai-brand/integrations/iconify'

const brand = await Brand({
  name: 'MediCare',
  description: 'Healthcare management platform',
  industry: 'health',
})

// Get recommended icons for the brand
const icons = getBrandIconSet(brand.input, brand.positioning, { iconStyle: 'lucide' })

// Use icons in your application
console.log(icons)
// => ['lucide:heart', 'lucide:activity', ...]
```

## Key Features

- **Declarative API**: Simple, intuitive interface for generating complex brand assets
- **Deep Customization**: Configure every aspect of your brand identity
- **Extensible System**: Built on a default style system that can be extended
- **Multi-format Support**: Generate assets in various formats (SVG, PNG, etc.)
- **Error Handling**: Robust fallbacks ensure you always get usable results
- **Framework Agnostic**: Use with any frontend framework or design system

## Dependencies

- [ai](https://www.npmjs.com/package/ai) - Core AI functionality
- [ai-business](https://github.com/drivly/primitives.org.ai/tree/main/packages/ai-business) - Business-focused AI functions
- [ai-providers](https://github.com/drivly/primitives.org.ai/tree/main/packages/ai-providers) - AI provider integrations
- [zod](https://www.npmjs.com/package/zod) - Schema validation
