# opengraph-edge

Generate Open Graph images from JSX using Satori and resvg on Cloudflare Workers.

## Features

- 🎨 **JSX to PNG** - Write images as React components
- ⚡ **Edge Runtime** - Optimized for Cloudflare Workers
- 🚀 **Fast** - WASM-powered rendering with Satori + resvg
- 💾 **Cacheable** - Built-in font caching for performance
- 🎯 **Type-safe** - Full TypeScript support

## Installation

```bash
pnpm add opengraph-edge
```

## Usage

### Basic Example

```typescript
import { init, generateOGImageResponse, fetchFont } from 'opengraph-edge'

// Initialize WASM modules once
await init()

// Load fonts
const fontData = await fetchFont(
  'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff',
  'inter-regular'
)

// Generate image
const response = await generateOGImageResponse(
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      backgroundColor: '#1e293b',
      color: 'white',
      padding: 80,
    }}
  >
    <h1 style={{ fontSize: 72, fontWeight: 'bold' }}>
      Hello World
    </h1>
    <p style={{ fontSize: 32, opacity: 0.8 }}>
      Dynamic Open Graph images with JSX
    </p>
  </div>,
  {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        data: fontData,
        weight: 400,
        style: 'normal',
      },
    ],
  }
)

// Return as Response
export default { fetch: () => response }
```

### Cloudflare Workers Example

```typescript
import { Hono } from 'hono'
import { init, generateOGImageResponse, fetchFont } from 'opengraph-edge'

const app = new Hono()

// Initialize on worker startup
let initialized = false
let fonts: { name: string; data: ArrayBuffer }[] = []

async function ensureInit() {
  if (initialized) return

  await init()

  // Load and cache fonts
  const interRegular = await fetchFont(
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff',
    'inter-regular'
  )

  const interBold = await fetchFont(
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff',
    'inter-bold'
  )

  fonts = [
    { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
    { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
  ]

  initialized = true
}

app.get('/og-image', async (c) => {
  await ensureInit()

  const title = c.req.query('title') || 'Hello World'
  const description = c.req.query('description') || 'Generated with opengraph-edge'

  return generateOGImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#1e293b',
        color: 'white',
        padding: 80,
      }}
    >
      <h1 style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 20 }}>
        {title}
      </h1>
      <p style={{ fontSize: 32, opacity: 0.8 }}>
        {description}
      </p>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts,
    }
  )
})

export default app
```

## API

### `init(options?)`

Initialize Satori and resvg WASM modules. Must be called once before generating images.

**Options:**
- `yogaWasmUrl?: string` - Custom yoga WASM URL (default: jsDelivr CDN)
- `resvgWasmUrl?: string` - Custom resvg WASM URL (default: jsDelivr CDN)

### `generateOGImage(jsx, options?)`

Generate PNG image from JSX element.

**Parameters:**
- `jsx: React.ReactElement` - JSX element to render
- `options: OGImageOptions` - Satori options

**Returns:** `Promise<Uint8Array>` - PNG image data

### `generateOGImageResponse(jsx, options?)`

Generate Cloudflare Workers Response with PNG image.

**Parameters:**
- `jsx: React.ReactElement` - JSX element to render
- `options: OGImageOptions` - Satori options

**Returns:** `Promise<Response>` - Response with PNG image

### `fetchFont(url, cacheKey?)`

Fetch and optionally cache font data.

**Parameters:**
- `url: string` - Font URL
- `cacheKey?: string` - Cache key (for Cloudflare Workers Cache API)

**Returns:** `Promise<ArrayBuffer>` - Font data

## Performance Tips

1. **Initialize once** - Call `init()` during worker startup, not on every request
2. **Cache fonts** - Use `fetchFont()` with cache keys to avoid repeated downloads
3. **Cloudflare Cache API** - Cache final images for maximum performance
4. **Optimize images** - Use appropriate dimensions (1200x630 is standard for OG images)

## Supported JSX Features

Satori supports a subset of HTML/CSS:
- Flexbox layout
- Text, images, backgrounds
- Borders, shadows, transforms
- Custom fonts

See [Satori documentation](https://github.com/vercel/satori) for full list of supported features.

## License

MIT

## Related

- [satori](https://github.com/vercel/satori) - Convert JSX to SVG
- [@resvg/resvg-wasm](https://github.com/yisibl/resvg-js) - Convert SVG to PNG
- [schema.org.ai](https://schema.org.ai) - Schema.org documentation with OG images
