import { Hero } from '@/components/Hero'
import { ScrollyLayout, Selectable } from '@/components/ScrollyCode'
import { CodePlayground } from '@/components/CodePlayground'

const examples = [
  {
    title: 'Authorization Flow',
    code: `import { $ } from '@dotdo/sdk.do'

// Start OAuth 2.0 authorization flow
const authUrl = await $.oauth.authorize({
  clientId: 'your_client_id',
  redirectUri: 'https://your-app.com/callback',
  scope: ['read:profile', 'write:data'],
  state: 'random_state_string',
  responseType: 'code'
})

// Redirect user to authorization URL
console.log('Authorize at:', authUrl)
// https://oauth.provider.com/authorize?client_id=...&scope=...

// User approves, provider redirects to:
// https://your-app.com/callback?code=AUTH_CODE&state=random_state_string`,
  },
  {
    title: 'Token Exchange',
    code: `import { $ } from '@dotdo/sdk.do'

// Exchange authorization code for access token
const tokens = await $.oauth.token({
  code: 'AUTH_CODE',
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  redirectUri: 'https://your-app.com/callback',
  grantType: 'authorization_code'
})

console.log({
  accessToken: tokens.access_token,
  refreshToken: tokens.refresh_token,
  expiresIn: tokens.expires_in, // seconds
  tokenType: tokens.token_type, // Bearer
  scope: tokens.scope
})

// Store tokens securely
await $.db.create('user_tokens', {
  userId: currentUserId,
  accessToken: tokens.access_token,
  refreshToken: tokens.refresh_token,
  expiresAt: new Date(Date.now() + tokens.expires_in * 1000)
})`,
  },
  {
    title: 'Refresh Tokens',
    code: `import { $ } from '@dotdo/sdk.do'

// Refresh expired access token
const refreshedTokens = await $.oauth.refresh({
  refreshToken: 'REFRESH_TOKEN',
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret'
})

console.log({
  accessToken: refreshedTokens.access_token,
  expiresIn: refreshedTokens.expires_in
})

// Automatic token refresh
const tokens = await $.oauth.getTokens({
  userId: 'user_123',
  autoRefresh: true // Automatically refresh if expired
})

// Use the access token
const response = await fetch('https://api.provider.com/user', {
  headers: {
    'Authorization': \`Bearer \${tokens.access_token}\`
  }
})`,
  },
  {
    title: 'PKCE Flow',
    code: `import { $ } from '@dotdo/sdk.do'

// Generate PKCE verifier and challenge (for mobile/SPA)
const pkce = await $.oauth.generatePKCE()

console.log({
  codeVerifier: pkce.codeVerifier, // Store securely
  codeChallenge: pkce.codeChallenge, // Send to server
  codeChallengeMethod: pkce.method // 'S256'
})

// Start authorization with PKCE
const authUrl = await $.oauth.authorize({
  clientId: 'your_client_id',
  redirectUri: 'https://your-app.com/callback',
  scope: ['read:profile'],
  codeChallenge: pkce.codeChallenge,
  codeChallengeMethod: 'S256'
})

// Exchange code with verifier
const tokens = await $.oauth.token({
  code: 'AUTH_CODE',
  clientId: 'your_client_id',
  redirectUri: 'https://your-app.com/callback',
  codeVerifier: pkce.codeVerifier, // Prove you started the flow
  grantType: 'authorization_code'
})`,
  },
  {
    title: 'API Keys',
    code: `import { $ } from '@dotdo/sdk.do'

// Generate API key for user
const apiKey = await $.oauth.createApiKey({
  userId: 'user_123',
  name: 'Production API Key',
  scopes: ['read:data', 'write:data'],
  expiresIn: '90d' // 90 days
})

console.log({
  key: apiKey.key, // Show once, then hash
  keyId: apiKey.id,
  createdAt: apiKey.createdAt,
  expiresAt: apiKey.expiresAt
})

// Validate API key
const validation = await $.oauth.validateApiKey({
  key: 'api_key_from_request'
})

if (validation.valid) {
  console.log('User:', validation.userId)
  console.log('Scopes:', validation.scopes)
} else {
  throw new Error('Invalid API key')
}

// List user's API keys
const keys = await $.oauth.listApiKeys({
  userId: 'user_123'
})`,
  },
  {
    title: 'Session Management',
    code: `import { $ } from '@dotdo/sdk.do'

// Create session after successful authentication
const session = await $.oauth.createSession({
  userId: 'user_123',
  metadata: {
    ipAddress: request.headers.get('CF-Connecting-IP'),
    userAgent: request.headers.get('User-Agent'),
    loginMethod: 'oauth'
  },
  expiresIn: '7d'
})

// Set session cookie
setCookie('session_id', session.id, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60
})

// Get current user from session
const user = await $.oauth.getCurrentUser({
  sessionId: getCookie('session_id')
})

// Revoke session (logout)
await $.oauth.revokeSession({
  sessionId: session.id
})`,
  },
  {
    title: 'Permissions & Scopes',
    code: `import { $ } from '@dotdo/sdk.do'

// Check user permissions
const hasPermission = await $.oauth.checkPermission({
  userId: 'user_123',
  permission: 'write:products'
})

if (!hasPermission) {
  throw new Error('Insufficient permissions')
}

// Get user scopes
const scopes = await $.oauth.getScopes({
  userId: 'user_123'
})

console.log('User scopes:', scopes)
// ['read:profile', 'write:data', 'admin:users']

// Grant additional scopes
await $.oauth.grantScopes({
  userId: 'user_123',
  scopes: ['admin:billing']
})

// Revoke scopes
await $.oauth.revokeScopes({
  userId: 'user_123',
  scopes: ['admin:users']
})

// Check multiple permissions
const permissions = await $.oauth.checkPermissions({
  userId: 'user_123',
  permissions: ['read:data', 'write:data', 'admin:users']
})

console.log(permissions)
// { 'read:data': true, 'write:data': true, 'admin:users': false }`,
  },
  {
    title: 'OAuth Providers',
    code: `import { $ } from '@dotdo/sdk.do'

// Configure OAuth providers
const providers = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    scopes: ['profile', 'email']
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    scopes: ['user:email']
  },
  microsoft: {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    scopes: ['User.Read']
  }
}

// Sign in with OAuth provider
const authUrl = await $.oauth.provider('google').authorize({
  redirectUri: 'https://your-app.com/auth/google/callback',
  state: 'random_state'
})

// Handle callback
const user = await $.oauth.provider('google').callback({
  code: 'AUTH_CODE',
  state: 'random_state'
})

console.log({
  id: user.id,
  email: user.email,
  name: user.name,
  picture: user.picture,
  provider: 'google'
})

// Link account to existing user
await $.oauth.linkAccount({
  userId: 'user_123',
  provider: 'google',
  providerId: user.id,
  accessToken: user.accessToken
})`,
  },
]

export default function OAuthPage() {
  return (
    <main className="min-h-screen">
      <Hero
        title="OAuth & Authentication"
        description="Complete OAuth 2.0 implementation with PKCE, token management, API keys, sessions, and permission handling."
        packageName="@dotdo/sdk.do"
        gradient="from-indigo-500 to-purple-600"
      />

      <div className="max-w-7xl mx-auto px-6 py-24">
        <ScrollyLayout
          steps={[
            <Selectable key={0} index={0}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Authorization Flow</h2>
                <p className="text-xl text-gray-400">Start OAuth 2.0 authorization with scopes and state. Get authorization code from provider.</p>
              </div>
            </Selectable>,

            <Selectable key={1} index={1}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Token Exchange</h2>
                <p className="text-xl text-gray-400">Exchange authorization code for access and refresh tokens. Store securely with expiration tracking.</p>
              </div>
            </Selectable>,

            <Selectable key={2} index={2}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Automatic Token Refresh</h2>
                <p className="text-xl text-gray-400">Refresh expired tokens automatically. No manual token management needed.</p>
              </div>
            </Selectable>,

            <Selectable key={3} index={3}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">PKCE for Mobile & SPAs</h2>
                <p className="text-xl text-gray-400">
                  Proof Key for Code Exchange for secure authorization without client secrets. Perfect for mobile and single-page apps.
                </p>
              </div>
            </Selectable>,

            <Selectable key={4} index={4}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">API Key Management</h2>
                <p className="text-xl text-gray-400">Generate, validate, and manage API keys. Scoped permissions and expiration included.</p>
              </div>
            </Selectable>,

            <Selectable key={5} index={5}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Session Handling</h2>
                <p className="text-xl text-gray-400">Create and manage user sessions with metadata. Secure cookies and automatic expiration.</p>
              </div>
            </Selectable>,

            <Selectable key={6} index={6}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Granular Permissions</h2>
                <p className="text-xl text-gray-400">Check and manage user permissions and scopes. Grant and revoke access dynamically.</p>
              </div>
            </Selectable>,

            <Selectable key={7} index={7}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">OAuth Providers</h2>
                <p className="text-xl text-gray-400">Sign in with Google, GitHub, Microsoft, and more. Account linking and unified user profiles.</p>
              </div>
            </Selectable>,
          ]}
          code={
            <div className="sticky top-24 h-[600px]">
              <CodePlayground examples={examples} />
            </div>
          }
        />
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-800">
        <h2 className="text-4xl font-bold text-center mb-16">Authentication Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard title="OAuth 2.0 & OIDC" description="Full OAuth 2.0 and OpenID Connect implementation with all grant types." />
          <FeatureCard title="Multi-Provider" description="Google, GitHub, Microsoft, Apple, and custom OAuth providers supported." />
          <FeatureCard title="PKCE Support" description="Secure authorization for mobile and single-page applications without secrets." />
          <FeatureCard title="Token Management" description="Automatic token refresh, validation, and secure storage." />
          <FeatureCard title="API Keys" description="Generate and manage long-lived API keys with scoped permissions." />
          <FeatureCard title="Session Security" description="Secure session management with HttpOnly cookies and CSRF protection." />
        </div>
      </div>
    </main>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-lg border border-gray-800">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
