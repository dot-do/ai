# ai-site

[![npm version](https://img.shields.io/npm/v/ai-site.svg)](https://www.npmjs.com/package/ai-site)
[![License](https://img.shields.io/npm/l/ai-site.svg)](https://github.com/drivly/primitives.org.ai/blob/main/packages/ai-site/LICENSE)

Zero-config solution for creating AI-powered Next.js websites using `ai-functions` and `ai-props`.

## Features

- Zero-config setup requiring only a `site.config.{ts|js}` file
- Automatic integration with `ai-functions` and `ai-props`
- Pass-through commands to Next.js (dev/build/start)
- Default Next.js configuration and app directory templates
- Support for custom Next.js configuration and app directory

## Installation

```bash
npm install ai-site
# or
pnpm add ai-site
# or
yarn add ai-site
```

## Quick Start

1. Install the package:

```bash
npm install ai-site
```

2. Create a minimal `site.config.ts` in your project root:

```typescript
export default {
  name: 'My AI-Powered Site',
  description: 'Generated with ai-site',
  // other configuration options
}
```

3. Run Next.js commands:

```bash
npx ai-site dev   # Start development server
npx ai-site build # Build for production
npx ai-site start # Start production server
```

## Configuration

The `site.config.{ts|js}` file supports the following options:

```typescript
export default {
  // Basic site information
  name: 'My AI-Powered Site',
  description: 'Generated with ai-site',

  // Custom Next.js configuration (optional)
  nextConfig: {
    // Your custom Next.js configuration
  },

  // Custom app directory path (optional)
  appDir: './custom-app',

  // AI functions configuration (optional)
  aiFunctions: {
    // AI functions configuration
  },

  // AI props configuration (optional)
  aiProps: {
    // AI props configuration
  },
}
```

## Custom Next.js Configuration

By default, `ai-site` provides a standard Next.js configuration. If you need to customize it, you can:

1. Add a `nextConfig` object in your `site.config.{ts|js}` file
2. Create a `next.config.js` or `next.config.mjs` file in your project root

## Custom App Directory

By default, `ai-site` uses a template app directory. If you need to customize it, you can:

1. Specify an `appDir` path in your `site.config.{ts|js}` file
2. Create an `app` directory in your project root

## CLI Commands

The `ai-site` CLI supports the following commands:

- `npx ai-site dev` - Start the development server
- `npx ai-site build` - Build for production
- `npx ai-site start` - Start the production server

## Dependencies

- [ai-functions](https://www.npmjs.com/package/ai-functions)
- [ai-props](https://www.npmjs.com/package/ai-props)
- [next](https://www.npmjs.com/package/next)
