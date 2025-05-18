# [functions.do](https://functions.do)

Strongly-typed AI functions for the [.do](https://dotdo.ai) platform.

## Installation

```bash
npm install functions.do
```

## Usage

### Quick calls with `ai`

```ts
import { ai } from 'functions.do'

const tagline = await ai`Write a short tagline for ${'functions.do'}`
```

### Defining functions with `AI`

```ts
import { AI } from 'functions.do'

export const ai = AI({
  storyBrand: {
    productName: 'name of the product',
    problem: 'problem your product solves',
  },
})
```
