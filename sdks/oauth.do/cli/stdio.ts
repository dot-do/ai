/**
 * Stdio authentication helper for MCP servers
 *
 * Provides utilities for passing authentication credentials via stdio transport
 */

import { getAuthToken } from './keychain.js'

export interface StdioAuthConfig {
  /**
   * Service name for keychain lookup (e.g., 'mcp', 'apis', 'sdk')
   */
  service: string

  /**
   * Environment variable names to check for tokens
   * Priority order: first in array has highest priority
   */
  envVars?: string[]

  /**
   * Whether to require authentication
   * If true, throws error if no token found
   */
  required?: boolean
}

/**
 * Get authentication environment variables for stdio transport
 *
 * Returns environment variables with authentication token, ready to pass to stdio transport
 */
export async function getStdioAuth(config: StdioAuthConfig): Promise<Record<string, string>> {
  const { service, envVars = [], required = false } = config

  // Check environment variables first (highest priority)
  for (const envVar of envVars) {
    const value = process.env[envVar]
    if (value) {
      return { [envVar]: value }
    }
  }

  // Check keychain for service-specific token
  const authToken = await getAuthToken(service)

  if (authToken) {
    // Use first env var name if provided, otherwise use uppercase service name
    const envVarName = envVars[0] || `${service.toUpperCase()}_TOKEN`
    return { [envVarName]: authToken.token }
  }

  if (required) {
    throw new Error(
      `Authentication required for ${service}. ` +
        `Set ${envVars.join(' or ')} or run: ${service} auth login`
    )
  }

  return {}
}

/**
 * Create stdio command configuration with authentication
 *
 * Helper to create stdio transport config with auth env vars
 */
export async function createAuthenticatedStdioConfig(
  command: string,
  args: string[],
  authConfig: StdioAuthConfig,
  additionalEnv?: Record<string, string>
): Promise<{ command: string; args: string[]; env: Record<string, string> }> {
  const authEnv = await getStdioAuth(authConfig)

  const env: Record<string, string> = {}

  // Copy process.env, filtering out undefined values
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) {
      env[key] = value
    }
  }

  // Add additional env vars
  if (additionalEnv) {
    Object.assign(env, additionalEnv)
  }

  // Add auth env vars
  Object.assign(env, authEnv)

  return {
    command,
    args,
    env,
  }
}
