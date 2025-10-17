# CLI Authentication

The `cli.do` CLI supports multiple authentication methods with automatic priority ordering.

## Authentication Methods

### 1. OAuth (Recommended)

OAuth authentication uses WorkOS Device Authorization Flow for a secure, user-friendly experience.

**Login via OAuth:**

```bash
do auth login
```

This will:
1. Generate a unique device code
2. Display a verification URL and code
3. Automatically open your browser (optional)
4. Wait for you to authorize in the browser
5. Store the access token securely in your system keychain

**Browser-free login:**

```bash
do auth login --no-browser
```

This skips the automatic browser opening. You'll need to manually visit the verification URL.

### 2. API Key (DO_TOKEN)

Standard API key authentication for programmatic access.

**Set via environment variable:**

```bash
export DO_TOKEN=sk_your_api_key_here
```

**Store in keychain:**

```bash
do auth set-token sk_your_api_key_here
```

This stores the API key securely in your system keychain so you don't need to export it in every session.

### 3. Admin Token (DO_ADMIN_TOKEN)

Admin tokens have elevated permissions for administrative operations.

**Set via environment variable:**

```bash
export DO_ADMIN_TOKEN=sk_admin_your_admin_token_here
```

**Store in keychain:**

```bash
do auth set-admin-token sk_admin_your_admin_token_here
```

## Authentication Priority

The CLI checks authentication sources in this order:

1. **DO_ADMIN_TOKEN** (environment variable) - Highest privilege
2. **OAuth token** (keychain) - Secure, user-friendly
3. **DO_TOKEN** (environment variable) - Standard API key
4. **API key** (keychain) - Stored API key
5. **Admin token** (keychain) - Stored admin token

This priority ensures admin tokens always take precedence when present.

## Managing Authentication

### Check Authentication Status

```bash
do auth status
```

Shows:
- Current authentication type (OAuth, API Key, Admin)
- Token source (environment variable or keychain)
- User email (for OAuth)
- Expiration time (for OAuth)
- Granted scopes (for OAuth)

### Validate Token

```bash
do auth validate
```

Validates your current token with the oauth.do introspection endpoint (RFC 7662).

Shows:
- Token validity (active/inactive)
- User information
- Scopes
- Expiration time

### Logout

```bash
do auth logout
```

Clears all stored credentials from the keychain. Does not affect environment variables.

## Secure Storage

Tokens are stored securely using your system's native keychain:

- **macOS**: Keychain Access
- **Windows**: Credential Manager
- **Linux**: Secret Service API (gnome-keyring, kwallet)

All tokens are encrypted by your operating system and never stored in plaintext.

## Environment Variables

You can override keychain-stored credentials with environment variables:

```bash
# Use a specific token for this session
export DO_TOKEN=sk_session_specific_key
do db list Business

# Use admin token for elevated operations
export DO_ADMIN_TOKEN=sk_admin_elevated_key
do admin deploy-worker
```

Environment variables take precedence over keychain-stored credentials (for DO_ADMIN_TOKEN and DO_TOKEN).

## OAuth Flow Details

The OAuth flow uses the WorkOS Device Authorization Grant (RFC 8628):

1. **Device Code Request**: CLI requests a device code from WorkOS
2. **User Authorization**: User visits verification URL and enters code
3. **Token Polling**: CLI polls WorkOS for authorization confirmation
4. **Token Storage**: Access token is stored securely in keychain
5. **Token Refresh**: Tokens are automatically refreshed when expired

## Troubleshooting

### "Not authenticated" error

Run one of these commands:

```bash
do auth login              # OAuth (recommended)
do auth set-token <token>  # API key
export DO_TOKEN=<token>    # Environment variable
```

### "Token is invalid or expired"

For OAuth tokens:

```bash
do auth logout
do auth login
```

For API keys, set a new token:

```bash
do auth set-token <new-token>
```

### Keychain access denied

On macOS, you may need to grant keychain access:

1. Open **Keychain Access** app
2. Find entries for `cli.do`
3. Double-click and check "Allow access by these apps"

### Multiple accounts

The CLI supports one active authentication at a time. To switch accounts:

```bash
do auth logout
do auth login  # Login with different account
```

Or use environment variables for session-specific authentication:

```bash
# Session 1
export DO_TOKEN=sk_account_1
do db list Business

# Session 2 (different terminal)
export DO_TOKEN=sk_account_2
do ai generate "Hello"
```

## Security Best Practices

1. **Use OAuth when possible** - Most secure, no token management needed
2. **Never commit tokens** - Add `.env` files to `.gitignore`
3. **Rotate tokens regularly** - Especially API keys
4. **Use admin tokens sparingly** - Only for administrative operations
5. **Logout on shared machines** - Run `do auth logout` before leaving

## API Reference

### Authentication Commands

- `do auth login` - Authenticate via OAuth
- `do auth logout` - Clear all stored credentials
- `do auth status` - Show current authentication status
- `do auth validate` - Validate current token
- `do auth set-token <token>` - Store API key
- `do auth set-admin-token <token>` - Store admin token

### Using Authentication in Scripts

```bash
#!/bin/bash

# Check authentication before running commands
if ! do auth validate > /dev/null 2>&1; then
  echo "Not authenticated. Please run: do auth login"
  exit 1
fi

# Run authenticated commands
do db list Business
do ai generate "Hello world"
```

## Related Documentation

- [WorkOS Device Authorization Flow](https://workos.com/docs/authkit/cli-auth)
- [OAuth 2.0 RFC 8628](https://datatracker.ietf.org/doc/html/rfc8628)
- [Token Introspection RFC 7662](https://datatracker.ietf.org/doc/html/rfc7662)
