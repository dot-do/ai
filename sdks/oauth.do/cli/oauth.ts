/**
 * WorkOS CLI Authentication
 *
 * Implements OAuth 2.0 Device Authorization Flow for CLI authentication.
 * Reference: https://workos.com/docs/authkit/cli-auth
 */

import chalk from 'chalk'
import ora from 'ora'
import open from 'open'
import { setToken, TokenType } from './keychain.js'
import type { StoredToken, DeviceAuthorizationResponse, TokenResponse, UserInfo, TokenValidationResult } from './types.js'

const WORKOS_API_URL = process.env.WORKOS_API_URL || 'https://api.workos.com'
const OAUTH_BASE_URL = process.env.OAUTH_BASE_URL || 'https://oauth.do'
const CLIENT_ID = process.env.WORKOS_CLIENT_ID

/**
 * Initiate OAuth Device Authorization Flow
 */
export async function initiateDeviceAuth(): Promise<DeviceAuthorizationResponse> {
  if (!CLIENT_ID) {
    throw new Error('WORKOS_CLIENT_ID environment variable is required')
  }

  const response = await fetch(`${WORKOS_API_URL}/user_management/device/authorize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Device authorization failed: ${error}`)
  }

  return (await response.json()) as DeviceAuthorizationResponse
}

/**
 * Poll for token after user authorization
 */
export async function pollForToken(deviceCode: string, interval: number = 5): Promise<TokenResponse> {
  if (!CLIENT_ID) {
    throw new Error('WORKOS_CLIENT_ID environment variable is required')
  }

  const pollInterval = interval * 1000 // Convert to milliseconds
  const maxAttempts = 120 // 10 minutes with 5 second intervals

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, pollInterval))

    const response = await fetch(`${WORKOS_API_URL}/user_management/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        device_code: deviceCode,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      }),
    })

    if (response.ok) {
      return (await response.json()) as TokenResponse
    }

    const error = (await response.json()) as any

    if (error?.error === 'authorization_pending') {
      // Continue polling
      continue
    }

    if (error?.error === 'slow_down') {
      // Increase polling interval
      await new Promise((resolve) => setTimeout(resolve, pollInterval))
      continue
    }

    if (error?.error === 'access_denied' || error?.error === 'expired_token') {
      throw new Error(`Authorization ${error.error}`)
    }

    throw new Error(`Token request failed: ${error?.error_description || error?.error}`)
  }

  throw new Error('Authorization timeout - please try again')
}

/**
 * Get user info from access token
 */
export async function getUserInfo(accessToken: string): Promise<UserInfo> {
  const response = await fetch(`${WORKOS_API_URL}/user_management/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to get user info')
  }

  return (await response.json()) as UserInfo
}

/**
 * Complete CLI login flow
 */
export async function login(options: { openBrowser?: boolean } = {}): Promise<void> {
  console.log(chalk.bold('\n🔐 Logging in to .do platform...\n'))

  // Step 1: Request device code
  const spinner = ora('Requesting authorization...').start()
  let deviceAuth: DeviceAuthorizationResponse

  try {
    deviceAuth = await initiateDeviceAuth()
    spinner.succeed('Authorization requested')
  } catch (error) {
    spinner.fail('Failed to request authorization')
    throw error
  }

  // Step 2: Display user code and verification URL
  console.log(chalk.bold('\n📱 To complete sign-in:\n'))
  console.log(chalk.cyan(`  Visit: ${deviceAuth.verification_uri}`))
  console.log(chalk.yellow(`  Enter code: ${chalk.bold(deviceAuth.user_code)}\n`))

  if (options.openBrowser !== false) {
    // Open browser automatically with pre-filled code
    const verificationUrl = deviceAuth.verification_uri_complete || deviceAuth.verification_uri
    try {
      await open(verificationUrl)
      console.log(chalk.gray('  (Browser opened automatically)\n'))
    } catch {
      // Ignore error if browser can't be opened
    }
  }

  console.log(chalk.gray(`  Code expires in ${Math.floor(deviceAuth.expires_in / 60)} minutes\n`))

  // Step 3: Poll for token
  const pollSpinner = ora('Waiting for authorization...').start()

  try {
    const tokenResponse = await pollForToken(deviceAuth.device_code, deviceAuth.interval)
    pollSpinner.succeed('Authorization confirmed')

    // Step 4: Get user info
    const userInfo = await getUserInfo(tokenResponse.access_token)

    // Step 5: Store token in keychain
    const expiresAt = Date.now() + tokenResponse.expires_in * 1000

    await setToken(TokenType.OAUTH, tokenResponse.access_token, {
      expiresAt,
      userId: userInfo.id,
      email: userInfo.email,
      scopes: tokenResponse.scope?.split(' '),
    })

    console.log(chalk.green('\n✓ Successfully authenticated'))
    console.log(chalk.gray(`  User: ${userInfo.email}`))
    console.log(chalk.gray(`  Token expires: ${new Date(expiresAt).toLocaleString()}\n`))
  } catch (error) {
    pollSpinner.fail('Authorization failed')
    throw error
  }
}

/**
 * Validate token with oauth.do introspection endpoint
 */
export async function validateToken(token: string): Promise<TokenValidationResult> {
  const response = await fetch(`${OAUTH_BASE_URL}/oauth2/introspect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ token }),
  })

  if (!response.ok) {
    throw new Error('Token validation failed')
  }

  return (await response.json()) as TokenValidationResult
}

/**
 * Refresh OAuth token
 */
export async function refreshToken(refreshToken: string): Promise<TokenResponse> {
  if (!CLIENT_ID) {
    throw new Error('WORKOS_CLIENT_ID environment variable is required')
  }

  const response = await fetch(`${WORKOS_API_URL}/user_management/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    throw new Error('Token refresh failed')
  }

  return (await response.json()) as TokenResponse
}
