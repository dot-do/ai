# .org.ai & .sites.as App Templates

Production-ready app templates for building knowledge bases and semantic proxy sites with Fumadocs-inspired layouts.

## 🎯 Choose Your Template

| Template | Framework | Best For | Bundle | CPU | Use When |
|----------|-----------|----------|--------|-----|----------|
| **static.org.ai** | HonoX | Small-medium .org.ai packages | 12KB | 0.5ms | < 20K pages |
| **static.sites.as** | HonoX | Simple semantic views | 12KB | 0.5ms | Static transforms |
| **dynamic.org.ai** | React Router v7 | Massive knowledge bases | 45KB | 1-2ms | > 20K pages |
| **dynamic.sites.as** | React Router v7 | Complex transformations | 45KB | 1-2ms | Dynamic views |

## 📦 Templates

### static.org.ai (HonoX)

Ultra-lightweight template for small to medium .org.ai knowledge bases.

```bash
cd ai/apps/static.org.ai
pnpm install && pnpm dev
```

[Full Documentation →](./static.org.ai/README.md)

### static.sites.as (HonoX)

Semantic proxy template for simple view transformations.

```bash
cd ai/apps/static.sites.as
pnpm install && pnpm dev
```

[Full Documentation →](./static.sites.as/README.md)

### dynamic.org.ai (React Router v7)

SSR-enabled template for massive knowledge bases.

```bash
cd ai/apps/dynamic.org.ai
pnpm install && pnpm dev
```

[Full Documentation →](./dynamic.org.ai/README.md)

### dynamic.sites.as (React Router v7)

SSR-enabled template for complex semantic transformations.

```bash
cd ai/apps/dynamic.sites.as
pnpm install && pnpm dev
```

[Full Documentation →](./dynamic.sites.as/README.md)

## 🎨 Shared Features

✅ Fumadocs-inspired 3-column layout
✅ Tailwind CSS v4 with `@theme`
✅ Dark mode support
✅ [[Wikilinks]] with cross-package support
✅ Mobile-responsive navigation
✅ Cloudflare Workers deployment

## 🚀 Quick Start

```bash
# 1. Choose template based on package size
cd ai/apps/static.org.ai  # or dynamic.org.ai

# 2. Install
pnpm install

# 3. Develop
pnpm dev

# 4. Deploy
pnpm deploy
```

## 📊 Performance

| Metric | Static (HonoX) | Dynamic (React Router) |
|--------|----------------|------------------------|
| Bundle Size | 12KB | 45KB |
| Cold Start | 1-2ms | 2-5ms |
| Warm Request | 0.3-0.5ms | 1-2ms |

## 🎯 Use Cases

- **tech.org.ai** (135) → static.org.ai
- **soc.org.ai** (923) → static.org.ai
- **tasks.org.ai** (19K) → static.org.ai or dynamic.org.ai
- **wikipedia.org.ai** (6M) → dynamic.org.ai
- **vc.org.ai** (1M) → dynamic.org.ai

## 📝 License

MIT
