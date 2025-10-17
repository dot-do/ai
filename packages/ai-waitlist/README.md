# ai-waitlist

[![npm version](https://img.shields.io/npm/v/ai-waitlist.svg)](https://www.npmjs.com/package/ai-waitlist)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

AI-powered landing page generator with authentication and onboarding flow for product-solution fit assessment.

Built on the primitives.org.ai platform, this package helps you quickly create a professional landing page with waitlist functionality for your project.

## Features

- Generate an AI-powered landing page using content from a project's README and the `.ai` folder
- Implement authentication using oauth.do
- Create an onboarding flow with questions to identify product-solution fit

## Installation

```bash
npm install ai-waitlist
```

## Usage

### CLI

```bash
npx ai-waitlist
```

This will:

1. Parse your project's README.md and .ai folder
2. Generate an AI-powered landing page
3. Set up authentication using oauth.do
4. Create an onboarding flow questionnaire

### API

```typescript
import { generateLandingPage, setupAuth, createOnboardingFlow } from 'ai-waitlist'

// Generate a landing page
const landingPage = await generateLandingPage({
  projectDir: process.cwd(),
  options: {
    theme: 'light',
    primaryColor: '#0070f3',
    secondaryColor: '#6366f1',
  },
})

// Set up authentication
const authConfig = setupAuth({
  providers: ['github', 'google'],
  callbackUrl: '/onboarding',
})

// Create onboarding flow
const onboardingFlow = createOnboardingFlow({
  questions: [
    { id: 'useCase', question: 'What is your primary use case?' },
    { id: 'painPoints', question: 'What problems are you trying to solve?' },
  ],
  onComplete: (answers) => {
    // Process answers
    console.log('Onboarding completed:', answers)
  },
})
```

#### Using Components Directly

```tsx
import { LandingPage, Auth, Onboarding } from 'ai-waitlist/components'
import { useAuth } from 'ai-waitlist/auth'

// In your React component
function MyWaitlistPage() {
  const { user, isAuthenticated, signIn } = useAuth()

  return (
    <div>
      {!isAuthenticated ? (
        <>
          <LandingPage aiContext={myContext} showAuthButton={true} authButtonText="Join Waitlist" authButtonLink="/auth" />
          <Auth providers={['github', 'google']} />
        </>
      ) : (
        <Onboarding user={user} onComplete={(answers) => console.log(answers)} />
      )}
    </div>
  )
}
```

## Configuration

### .ai Folder Structure

You can customize the landing page by creating a `.ai` folder in your project root with the following files:

- `features.md` - List of features (one per line, starting with - or \*)
- `benefits.md` - List of benefits (one per line, starting with - or \*)
- `cta.md` - Call to action text or JSON with `{ "text": "Join Waitlist", "link": "/auth" }`
- `questions.md` - Onboarding questions (one per line, starting with - or \*)
- `config.json` - Configuration options for theme, colors, and content priority

Example `config.json`:

```json
{
  "theme": "light",
  "primaryColor": "#0070f3",
  "secondaryColor": "#6366f1",
  "prioritizeAiContent": true
}
```

If the `.ai` folder doesn't exist, a default one will be created with sample content.

### Custom Themes

You can customize the theme by passing options to the `generateLandingPage` function:

```typescript
const landingPage = await generateLandingPage({
  projectDir: process.cwd(),
  options: {
    theme: 'dark',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
  },
})
```

## Advanced Usage

### Custom Onboarding Questions

You can customize the onboarding questions by creating a `.ai/questions.md` file or by passing them directly to the `createOnboardingFlow` function:

```typescript
const customQuestions = [
  {
    id: 'useCase',
    question: 'What is your primary use case?',
    type: 'text',
    required: true,
  },
  {
    id: 'painPoints',
    question: 'What problems are you trying to solve?',
    type: 'text',
    required: true,
  },
  {
    id: 'teamSize',
    question: 'How large is your team?',
    type: 'select',
    options: ['1-5', '6-20', '21-100', '100+'],
    required: true,
  },
]

const onboardingFlow = createOnboardingFlow({ questions: customQuestions })
```

### Integrating with Existing Next.js Apps

To integrate with an existing Next.js application:

1. Install the package: `npm install ai-waitlist`
2. Add the auth API routes to your Next.js app:

```typescript
// pages/api/auth/[...auth].ts
import { authHandler } from 'ai-waitlist/auth'

export default authHandler
```

3. Add the onboarding API route:

```typescript
// pages/api/onboarding/submit.ts
import { onboardingHandler } from 'ai-waitlist/onboarding'

export default onboardingHandler
```

4. Import and use the components in your pages:

```tsx
// pages/index.tsx
import { LandingPage } from 'ai-waitlist/components'
import { useProjectContext } from 'ai-waitlist/context'

export default function Home() {
  const { aiContext } = useProjectContext()

  return <LandingPage aiContext={aiContext} showAuthButton={true} />
}
```

## Dependencies

- [ai-props](https://github.com/drivly/primitives.org.ai/tree/main/packages/ai-props) - AI-powered props for React components
- [better-auth](https://github.com/drivly/oauth.do) - Authentication library from oauth.do
- [mdxe](https://github.com/drivly/mdx) - Zero-Config Executable MDX

## About

Part of the [.do](https://dotdo.ai) platform by Drivly.
