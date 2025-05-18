# [APIs.do](https://apis.do) SDK

[![npm version](https://img.shields.io/npm/v/apis.do.svg)](https://www.npmjs.com/package/apis.do)
[![npm downloads](https://img.shields.io/npm/dm/apis.do.svg)](https://www.npmjs.com/package/apis.do)
[![License](https://img.shields.io/npm/l/apis.do.svg)](https://github.com/drivly/ai/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)

A TypeScript SDK for interacting with the APIs.do platform.

## Installation

```bash
npm install apis.do
# or
yarn add apis.do
# or
pnpm add apis.do
```

## Usage

```typescript
import { API } from 'apis.do';

// Initialize with options
const api = API({
  baseUrl: 'https://apis.do',
  apiKey: 'your-api-key'
});

// Or use the default instance
import { api } from 'apis.do';

// Use the API
const result = await api.functions.findBySlug({
  slug: 'function-name'
});
```

## API Reference

### Types

```typescript
import type { APIs, LLMs } from 'apis.do';
```

### Configuration

```typescript
import { API } from 'apis.do';

const api = API({
  baseUrl?: string; // Default: 'https://do.mw'
  apiKey?: string;  // Default: process.env.DO_TOKEN
});
```

## License

MIT
