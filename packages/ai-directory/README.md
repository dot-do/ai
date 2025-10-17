# ai-directory

A zero-config solution for creating AI-powered directory applications with Next.js.

## Features

- 🚀 Zero-config setup for directory applications
- 📋 Directory listing with filtering and search
- 🔍 Detail views for individual items
- 📱 Responsive grid and list views
- 🔄 Multiple data sources (database, API, local)
- 🎨 Customizable styling and layout

## Installation

```bash
npm install ai-directory
# or
yarn add ai-directory
# or
pnpm add ai-directory
```

## Quick Start

1. Create a new directory for your project and initialize it:

```bash
mkdir my-directory
cd my-directory
npm init -y
```

2. Install the required dependencies:

```bash
npm install ai-directory next react react-dom
```

3. Create a `site.config.js` file in the root of your project:

```js
// site.config.js
export default {
  name: 'My Directory',
  description: 'A collection of items',

  // Data source configuration
  dataSource: {
    // Example with local items
    items: [
      {
        id: '1',
        name: 'Item 1',
        description: 'Description for item 1',
        category: 'Category A',
      },
      {
        id: '2',
        name: 'Item 2',
        description: 'Description for item 2',
        category: 'Category B',
      },
    ],
  },
}
```

4. Add scripts to your `package.json`:

```json
"scripts": {
  "dev": "ai-directory dev",
  "build": "ai-directory build",
  "start": "ai-directory start"
}
```

5. Start the development server:

```bash
npm run dev
```

## Configuration

The `site.config.js` file supports the following options:

```typescript
{
  // Basic site information
  name: string;
  description: string;

  // Data source (one required)
  dataSource: {
    // Database connection
    database?: {
      uri?: string;
      instance?: any;
      collection?: string;
    };

    // API endpoints
    api?: {
      endpoint?: string;
      listEndpoint?: string;
      detailEndpoint?: string;
      searchEndpoint?: string;
    };

    // Local data
    items?: Array<{
      id: string;
      name: string;
      description?: string;
      image?: string;
      category?: string;
      tags?: string[];
      [key: string]: any;
    }>;

    categories?: Array<{
      id: string;
      name: string;
      description?: string;
      count?: number;
    }>;
  };

  // Directory display options
  searchFields?: string[];
  defaultSortField?: string;
  defaultSortOrder?: 'asc' | 'desc';
  itemsPerPage?: number;

  // UI Customization
  layoutOptions?: {
    showSearch?: boolean;
    showCategories?: boolean;
    showFilters?: boolean;
    gridColumns?: number;
    listView?: boolean;
  };

  // Next.js configuration (optional)
  nextConfig?: Record<string, any>;
}
```

## Advanced Usage

### Custom App Directory

You can provide your own app directory to customize the templates:

```js
// site.config.js
export default {
  name: 'My Directory',
  description: 'A collection of items',
  appDir: './my-app-directory',
  // ...
}
```

### Database Connection

Connect to a database using a connection URI:

```js
// site.config.js
export default {
  name: 'My Directory',
  description: 'A collection of items',
  dataSource: {
    database: {
      uri: process.env.DATABASE_URI,
      collection: 'items',
    },
  },
  // ...
}
```

### API Endpoints

Use external API endpoints:

```js
// site.config.js
export default {
  name: 'My Directory',
  description: 'A collection of items',
  dataSource: {
    api: {
      endpoint: 'https://api.example.com/items',
      // Or use specific endpoints
      listEndpoint: 'https://api.example.com/items',
      detailEndpoint: 'https://api.example.com/items/:id',
      searchEndpoint: 'https://api.example.com/items/search',
    },
  },
  // ...
}
```

## License

MIT
