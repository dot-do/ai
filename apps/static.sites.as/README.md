# static.sites.as

Minimal, Obsidian-style documentation template for **semantic proxy sites** built with HonoX and Tailwind CSS v4. Perfect for building view-based documentation sites in the .sites.as ecosystem.

## What is .sites.as?

The `.sites.as` domain family provides **semantic proxy views** of data:

- `database.sites.as` - View databases as JSON, SQL, GraphQL, REST
- `api.sites.as` - View APIs as OpenAPI, Postman, SDK
- `schema.sites.as` - View schemas as JSON Schema, TypeScript, GraphQL

This template powers these semantic view sites with the same beautiful Fumadocs-inspired layout as `.org.ai` knowledge bases.

## Features

- **3-Column Layout** - Fixed header, collapsible sidebar, main content, table of contents
- **[[Wikilinks]]** - Cross-package references to .org.ai and .sites.as domains
- **Dark Mode** - Beautiful light/dark theme with smooth transitions
- **Tree Navigation** - File tree structure for different view formats
- **Ultra-Fast** - 12KB bundle size, ~0.5ms CPU per request
- **View Transformations** - Dynamic rendering of data in different formats
- **Workers Static Assets** - Native Cloudflare Workers deployment

## Getting Started

```bash
cd ai/apps/static.sites.as
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173)

## Semantic Patterns

The `.sites.as` family follows the **View-based pattern**:

```
{subject}.sites.as/{view}
```

Examples:
- `database.sites.as/json` - View database as JSON
- `api.sites.as/openapi` - View API as OpenAPI spec
- `schema.sites.as/graphql` - View schema as GraphQL

## Related Templates

- **static.org.ai** - Knowledge base template for .org.ai packages
- **dynamic.sites.as** - React Router v7 template for complex views
- **dynamic.org.ai** - React Router v7 template for massive knowledge bases

## License

MIT
