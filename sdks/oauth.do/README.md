# oauth.do

Open-source OAuth and authentication client SDK for React and JavaScript applications.

## Features

- 🔐 **Type-safe authentication** - Full TypeScript support
- ⚛️ **React hooks** - `useAuth()` hook for easy React integration
- 🌐 **Universal** - Works in browser and Node.js
- 🎯 **Simple API** - Intuitive authentication methods
- 🔄 **Session management** - Automatic token refresh and storage
- 🚀 **Lightweight** - Minimal dependencies

## Installation

```bash
npm install oauth.do
# or
pnpm add oauth.do
# or
yarn add oauth.do
```

## Quick Start

### React Hook

```tsx
import { createOAuthClient, useAuth } from 'oauth.do/react'

const client = createOAuthClient({
  apiUrl: 'https://api.example.com',
})

function App() {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth(client)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={() =>
          signIn({
            email: 'user@example.com',
            password: 'password',
          })
        }
      >
        Sign In
      </button>
    )
  }

  return (
    <div>
      <p>Welcome, {user?.name || user?.email}!</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}
```

### Vanilla JavaScript

```typescript
import { createOAuthClient } from 'oauth.do/client'

const client = createOAuthClient({
  apiUrl: 'https://api.example.com',
})

// Sign in
const session = await client.signIn({
  email: 'user@example.com',
  password: 'password',
})

// Get current user
const user = await client.getUser()

// Sign out
await client.signOut()
```

## API Reference

### `createOAuthClient(config)`

Creates a new OAuth client instance.

```typescript
interface AuthConfig {
  apiUrl: string
  clientId?: string
  redirectUri?: string
  scopes?: string[]
}

const client = createOAuthClient({
  apiUrl: 'https://api.example.com',
})
```

### `useAuth(client)`

React hook for authentication state and methods.

```typescript
const {
  user,              // Current user or null
  session,           // Current session or null
  isLoading,         // Loading state
  isAuthenticated,   // Authentication status
  error,             // Last error or null
  signIn,            // Sign in method
  signUp,            // Sign up method
  signOut,           // Sign out method
  refreshSession,    // Refresh session method
} = useAuth(client)
```

### Client Methods

#### `signIn(options)`

Sign in with email and password.

```typescript
const session = await client.signIn({
  email: 'user@example.com',
  password: 'password',
  callbackUrl?: '/dashboard', // Optional redirect URL
})
```

#### `signUp(options)`

Create a new account.

```typescript
const session = await client.signUp({
  email: 'user@example.com',
  password: 'password',
  name?: 'John Doe', // Optional display name
  callbackUrl?: '/dashboard', // Optional redirect URL
})
```

#### `signOut(options)`

Sign out the current user.

```typescript
await client.signOut({
  callbackUrl?: '/login', // Optional redirect URL
})
```

#### `getSession()`

Get the current session.

```typescript
const session = await client.getSession()
// Returns Session | null
```

#### `getUser()`

Get the current user.

```typescript
const user = await client.getUser()
// Returns User | null
```

#### `refreshSession()`

Refresh the current session token.

```typescript
const session = await client.refreshSession()
// Returns Session | null
```

## Types

```typescript
interface User {
  id: string
  email: string
  name?: string
  image?: string
  emailVerified?: boolean
  createdAt: Date
  updatedAt: Date
}

interface Session {
  id: string
  userId: string
  expiresAt: Date
  createdAt: Date
  token: string
}

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  error: Error | null
}
```

## Server Integration

For Next.js API routes or server-side authentication:

```typescript
import { createOAuthClient } from 'oauth.do/server'

const client = createOAuthClient({
  apiUrl: process.env.API_URL!,
})

// Verify session from request
const session = await client.getSession()
```

## Examples

### Protected Route Component

```tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from 'oauth.do/react'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth(client)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}
```

### Login Form

```tsx
import { useState } from 'react'
import { useAuth } from 'oauth.do/react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, isLoading, error } = useAuth(client)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn({ email, password })
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
      {error && <p className="error">{error.message}</p>}
    </form>
  )
}
```

## Integration with Better Auth

This SDK is designed to work seamlessly with [Better Auth](https://www.better-auth.com/):

```typescript
// Server setup with Better Auth
import { betterAuth } from 'better-auth'

const auth = betterAuth({
  database: {
    provider: 'postgres',
    url: process.env.DATABASE_URL,
  },
  // ... other config
})

// Client integration
const client = createOAuthClient({
  apiUrl: 'https://api.example.com',
})
```

## License

MIT © .do Platform

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## Related

- [Better Auth](https://www.better-auth.com/) - The authentication framework we integrate with
- [sdk.do](../sdk.do/) - Main .do platform SDK
- [platform.do](https://platform.do/) - Platform documentation
