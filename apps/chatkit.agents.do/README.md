# ChatKit Starter Template

This repository is the simplest way to bootstrap a [ChatKit](http://openai.github.io/chatkit-js/) application. It ships with a minimal Next.js UI, the ChatKit web component, and a ready-to-use session endpoint so you can experiment with OpenAI-hosted workflows built using [Agent Builder](https://platform.openai.com/agent-builder).

## What You Get

- Next.js app with `<openai-chatkit>` web component and theming controls
- API endpoint for creating a session at [`app/api/create-session/route.ts`](app/api/create-session/route.ts)
- Quick examples for starter prompts, placeholder text, and greating message

## Getting Started

Follow every step below to run the app locally and configure it for your preferred backend.

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

Copy the example file and fill in the required values:

```bash
cp .env.example .env.local
```

### 3. Configure ChatKit credentials

Update `.env.local` with the variables that match your setup.

- `OPENAI_API_KEY` — API key created **within the same org & project as your Agent Builder**
- `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` — the workflow you created in [Agent Builder](https://platform.openai.com/agent-builder)
- (optional) `CHATKIT_API_BASE` - customizable base URL for the ChatKit API endpoint

### 4. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000` and start chatting. Use the prompts on the start screen to verify your workflow connection, then customize the UI or prompt list in [`lib/config.ts`](lib/config.ts) and [`components/ChatKitPanel.tsx`](components/ChatKitPanel.tsx).

### 5. Build for production (optional)

```bash
npm run build
npm start
```

## Customization Tips

- Adjust starter prompts, greeting text, and placeholder copy in [`lib/config.ts`](lib/config.ts).
- Update the theme defaults or event handlers inside[`components/ChatKitPanel.tsx`](components/ChatKitPanel.tsx) to integrate with your product analytics or storage.

## References

- [ChatKit JavaScript Library](http://openai.github.io/chatkit-js/)
- [Advanced Self-Hosting Examples](https://github.com/openai/openai-chatkit-advanced-samples)
