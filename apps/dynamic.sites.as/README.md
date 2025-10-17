# dynamic.sites.as

Dynamic, SSR-enabled template for **semantic proxy sites** built with **React Router v7** and **Tailwind CSS v4**. Perfect for complex view transformations and data proxies at scale.

## What is .sites.as?

The `.sites.as` domain family provides **semantic proxy views** of data with dynamic transformations:

- `database.sites.as` - View databases as JSON, SQL, GraphQL, REST APIs
- `api.sites.as` - View APIs as OpenAPI, Postman collections, SDK code
- `schema.sites.as` - View schemas as JSON Schema, TypeScript, GraphQL, Protocol Buffers

This template powers these semantic view sites with the same React Router v7 architecture as `dynamic.org.ai`.

## When to Use This Template

Use `dynamic.sites.as` for **complex transformations**:

| Use Case | Template | Why |
|----------|----------|-----|
| Simple views | `static.sites.as` | Static generation |
| **Complex transformations** | **dynamic.sites.as** | SSR with data queries |
| **Large datasets** | **dynamic.sites.as** | R2 SQL integration |
| **Real-time** | **dynamic.sites.as** | On-demand rendering |

## Features

- **Server-Side Rendering** - On-demand transformations
- **React Router v7** - Full-stack React with Cloudflare support
- **R2 SQL Integration** - Query large datasets
- **Vectorize Search** - Semantic search across views
- **shadcn/ui** - Beautiful component library
- **Dark Mode** - Smooth theme transitions
- **Streaming SSR** - Fast initial loads with Suspense

## Getting Started

```bash
cd ai/apps/dynamic.sites.as
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

## View Transformations

### Example: Database as JSON

```typescript
// app/routes/json.tsx
export async function loader({ context }: Route.LoaderArgs) {
  const { env } = context.cloudflare

  // Query R2 SQL for database content
  const result = await env.DB.prepare(
    'SELECT * FROM tables'
  ).all()

  return { data: result.results }
}

export default function JSONView({ loaderData }: Route.ComponentProps) {
  return (
    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
      <code>{JSON.stringify(loaderData.data, null, 2)}</code>
    </pre>
  )
}
```

### Example: API as OpenAPI

```typescript
// app/routes/openapi.tsx
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const apiUrl = url.searchParams.get('api')

  // Fetch API metadata and generate OpenAPI spec
  const spec = await generateOpenAPISpec(apiUrl)

  return { spec }
}
```

## Related Templates

- **static.sites.as** - HonoX template for simple views
- **dynamic.org.ai** - React Router v7 template for knowledge bases
- **static.org.ai** - HonoX template for small-medium packages

## License

MIT
