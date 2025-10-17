# @dotdo/eslint-config

Shared ESLint configurations for the .do platform monorepo using ESLint v9 flat config format.

## Usage

### Cloudflare Workers

```js
import dotdoConfig from '@dotdo/eslint-config/workers.js'

export default dotdoConfig
```

### Next.js Applications

```js
import dotdoConfig from '@dotdo/eslint-config/nextjs.js'

export default dotdoConfig
```

### React Libraries/Packages

```js
import dotdoConfig from '@dotdo/eslint-config/react-library.js'

export default dotdoConfig
```

### Base Configuration

For non-React packages:

```js
import dotdoConfig from '@dotdo/eslint-config/base.js'

export default dotdoConfig
```

### Extending Configurations

You can extend any configuration with additional rules:

```js
import dotdoConfig from '@dotdo/eslint-config/workers.js'

export default [
  ...dotdoConfig,
  {
    rules: {
      // Your custom rules
    },
  },
]
```

## Available Configurations

- **base.js** - Base ESLint configuration with TypeScript support
- **workers.js** - Cloudflare Workers specific configuration
- **nextjs.js** - Next.js applications configuration
- **react-library.js** - React libraries/packages configuration

## Features

- ESLint v9 flat config format
- TypeScript support with @typescript-eslint
- Consistent rules across the monorepo
- Environment-specific configurations
