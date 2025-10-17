/**
 * auth.do - Shared authentication package for .do platform CLIs
 *
 * Provides secure credential storage, OAuth flows, and authentication utilities
 * for all SDK CLIs (cli.do, mcp.do, apis.do, sdk.do)
 */

// Keychain storage
export { setToken, getToken, deleteToken, deleteAllTokens, isKeychainAvailable, getAuthToken } from './keychain.js'

// OAuth flows (WorkOS device authorization)
export { initiateDeviceAuth, pollForToken, getUserInfo, login, validateToken, refreshToken } from './oauth.js'

// Stdio helpers for MCP
export { getStdioAuth, createAuthenticatedStdioConfig, type StdioAuthConfig } from './stdio.js'

// API key management
export { setApiKey, getApiKey, deleteApiKey, validateApiKeyFormat, maskApiKey, type ApiKeyConfig } from './apikey.js'

// Enum (value export)
export { TokenType } from './types.js'

// Types
export type {
  StoredToken,
  DeviceAuthorizationResponse,
  TokenResponse,
  UserInfo,
  TokenValidationResult,
  AuthToken,
} from './types.js'
