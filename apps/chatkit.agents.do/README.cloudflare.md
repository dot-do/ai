# ChatKit on Cloudflare Workers

This is the OpenAI ChatKit starter app configured for deployment on Cloudflare Workers using OpenNext.

## What is ChatKit?

ChatKit is OpenAI's starter application for building AI chat experiences. It provides:

- A clean, modern chat interface
- OpenAI API integration
- Cookie-based session management
- Next.js 15 with App Router
- Edge runtime compatibility

## Cloudflare Workers Deployment

This app has been configured to run on Cloudflare Workers using the `@opennextjs/cloudflare` adapter.

### Why Cloudflare Workers?

- **Global Edge Network**: Deploy to 300+ cities worldwide
- **Zero Cold Starts**: Instant response times
- **Cost Effective**: Pay only for what you use
- **Edge Runtime Compatible**: ChatKit already uses edge runtime

### Architecture

The ChatKit app is already well-suited for Cloudflare Workers:

- ✅ Uses Next.js 15 App Router
- ✅ API routes use `export const runtime = "edge"`
- ✅ Cookie-based session management (Workers-compatible)
- ✅ No Node.js-specific APIs
- ✅ Streaming responses supported

## Setup

### Prerequisites

1. **Cloudflare Account**: Sign up at https://dash.cloudflare.com
2. **OpenAI API Key**: Get your key from https://platform.openai.com
3. **Wrangler CLI**: Installed via dependencies

### Environment Variables

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

For production deployment, set secrets in Cloudflare:

```bash
cd ai/apps/chatkit
wrangler secret put OPENAI_API_KEY
```

## Development

### Local Development

```bash
# From repository root
pnpm install

# Start dev server
cd ai/apps/chatkit
pnpm dev
```

Visit http://localhost:3000

### Testing Edge Runtime

Test with Wrangler's local dev server:

```bash
cd ai/apps/chatkit
pnpm preview
```

## Deployment

### Deploy to Cloudflare Workers

```bash
cd ai/apps/chatkit
pnpm deploy
```

This will:

1. Build the Next.js app
2. Transform it for Cloudflare Workers
3. Deploy to your Cloudflare account

### Manual Deployment

If you need more control:

```bash
# Build the app
pnpm build

# Deploy with OpenNext
npx @opennextjs/cloudflare@latest deploy
```

## Configuration

### OpenNext Configuration

The `open-next.config.ts` file contains Cloudflare-specific settings. The default configuration works out of the box since ChatKit uses edge runtime.

### Next.js Configuration

ChatKit's API routes already specify edge runtime:

```typescript
// app/api/chat/route.ts
export const runtime = 'edge'
```

No additional configuration needed!

## Features

### What Works on Workers

- ✅ Chat interface
- ✅ OpenAI API streaming
- ✅ Session management
- ✅ Static assets
- ✅ API routes
- ✅ Server-side rendering

### Limitations

- No file system access (Workers don't have a file system)
- No native Node.js modules
- 10ms CPU limit per request (sufficient for most use cases)

## Troubleshooting

### Build Errors

If you encounter build errors, try:

```bash
# Clean build artifacts
rm -rf .next .open-next

# Rebuild
pnpm build
```

### Deployment Issues

Check your Cloudflare account:

```bash
# View recent deployments
wrangler pages deployments list

# View logs
wrangler pages deployments tail
```

### OpenAI API Errors

Verify your API key is set:

```bash
wrangler secret list
```

## Resources

- [ChatKit Documentation](https://github.com/openai/openai-chatkit-starter-app)
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Next.js Edge Runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)

## License

Same as the original ChatKit starter app.
