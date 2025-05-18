# APIs.do SDK

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
