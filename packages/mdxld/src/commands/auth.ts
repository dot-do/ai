/**
 * Authentication Commands for mdxld CLI
 *
 * Manages CLI authentication for MDX linked data operations.
 * Uses oauth.do/cli for shared authentication with OAuth and API keys.
 */

import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import {
  login,
  validateToken,
  isKeychainAvailable,
  getAuthToken,
  deleteAllTokens,
  setToken,
  getToken,
  TokenType,
} from 'oauth.do/cli'

export function createAuthCommands(): Command {
  const authCommand = new Command('auth').description('Manage mdxld authentication')

  /**
   * Login via OAuth (WorkOS Device Flow)
   */
  authCommand
    .command('login')
    .description('Authenticate via OAuth using browser')
    .option('--no-browser', 'Do not open browser automatically')
    .action(async (options) => {
      try {
        if (!isKeychainAvailable()) {
          console.error(chalk.red('Error: Keychain not available on this system'))
          console.error(chalk.yellow('Alternative: Use API key authentication via DO_TOKEN'))
          process.exit(1)
        }

        await login({ openBrowser: options.browser !== false })
      } catch (error) {
        console.error(chalk.red('Login failed:', error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  /**
   * Logout - Clear all stored credentials
   */
  authCommand
    .command('logout')
    .description('Clear stored authentication credentials')
    .action(async () => {
      const spinner = ora('Clearing credentials...').start()

      try {
        await deleteAllTokens()
        spinner.succeed('Credentials cleared')
        console.log(chalk.gray('\nYou have been logged out.\n'))
      } catch (error) {
        spinner.fail('Failed to clear credentials')
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  /**
   * Status - Show current authentication status
   */
  authCommand
    .command('status')
    .description('Show authentication status')
    .action(async () => {
      try {
        const authInfo = await getAuthToken()

        if (!authInfo) {
          console.log(chalk.yellow('⚠ Not authenticated'))
          console.log(chalk.gray('\nAuthenticate using one of these methods:'))
          console.log(chalk.cyan('  • OAuth:    mdxld auth login'))
          console.log(chalk.cyan('  • API Key:  export DO_TOKEN=sk_xxx'))
          console.log(chalk.cyan('  • Admin:    export DO_ADMIN_TOKEN=sk_admin_xxx\n'))
          process.exit(1)
        }

        console.log(chalk.green('\n✓ Authenticated\n'))
        console.log(chalk.bold('  Auth Type:'), formatAuthType(authInfo.type))
        console.log(chalk.bold('  Source:'), authInfo.source === 'env' ? 'Environment Variable' : 'Keychain')

        if (authInfo.type === 'oauth') {
          const oauthToken = await getToken(TokenType.OAUTH)
          if (oauthToken) {
            console.log(chalk.bold('  User:'), oauthToken.email || 'Unknown')
            if (oauthToken.expiresAt) {
              const expiresDate = new Date(oauthToken.expiresAt)
              const isExpiringSoon = oauthToken.expiresAt - Date.now() < 24 * 60 * 60 * 1000
              console.log(
                chalk.bold('  Expires:'),
                isExpiringSoon ? chalk.yellow(expiresDate.toLocaleString()) : expiresDate.toLocaleString()
              )
            }
            if (oauthToken.scopes) {
              console.log(chalk.bold('  Scopes:'), oauthToken.scopes.join(', '))
            }
          }
        }

        console.log() // Empty line
      } catch (error) {
        console.error(chalk.red('Error checking status:', error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  /**
   * Set API Key (MCP_TOKEN)
   */
  authCommand
    .command('set-token <token>')
    .description('Store API key for authentication')
    .action(async (token: string) => {
      if (!token.startsWith('sk_') && !token.startsWith('do_')) {
        console.error(chalk.red('Error: Invalid token format'))
        console.error(chalk.yellow('API keys should start with "sk_" or "do_"'))
        process.exit(1)
      }

      const spinner = ora('Storing API key...').start()

      try {
        await setToken(TokenType.API_KEY, token)
        spinner.succeed('API key stored in keychain')
        console.log(chalk.gray('\nYou can now use mdxld CLI commands with this API key.\n'))
      } catch (error) {
        spinner.fail('Failed to store API key')
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  /**
   * Set Admin Token (MCP_ADMIN_TOKEN)
   */
  authCommand
    .command('set-admin-token <token>')
    .description('Store admin token for elevated permissions')
    .action(async (token: string) => {
      if (!token.startsWith('sk_admin_') && !token.startsWith('do_admin_')) {
        console.error(chalk.red('Error: Invalid admin token format'))
        console.error(chalk.yellow('Admin tokens should start with "sk_admin_" or "do_admin_"'))
        process.exit(1)
      }

      const spinner = ora('Storing admin token...').start()

      try {
        await setToken(TokenType.ADMIN_TOKEN, token)
        spinner.succeed('Admin token stored in keychain')
        console.log(chalk.yellow('\n⚠ Admin tokens have elevated permissions'))
        console.log(chalk.gray('Use with caution.\n'))
      } catch (error) {
        spinner.fail('Failed to store admin token')
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  /**
   * Validate current token
   */
  authCommand
    .command('validate')
    .description('Validate current authentication token')
    .action(async () => {
      const spinner = ora('Validating token...').start()

      try {
        const authInfo = await getAuthToken()

        if (!authInfo) {
          spinner.fail('Not authenticated')
          console.log(chalk.yellow('\nRun "mdxld auth login" to authenticate.\n'))
          process.exit(1)
        }

        // Validate token with oauth.do introspection
        const validation = await validateToken(authInfo.token)

        if (!validation.active) {
          spinner.fail('Token is invalid or expired')
          console.log(chalk.yellow('\nRun "mdxld auth login" to re-authenticate.\n'))
          process.exit(1)
        }

        spinner.succeed('Token is valid')
        console.log(chalk.green('\n✓ Authentication is active\n'))

        if (validation.email) {
          console.log(chalk.bold('  User:'), validation.email)
        }
        if (validation.scope) {
          console.log(chalk.bold('  Scopes:'), validation.scope)
        }
        if (validation.exp) {
          const expiresDate = new Date(validation.exp * 1000)
          console.log(chalk.bold('  Expires:'), expiresDate.toLocaleString())
        }

        console.log() // Empty line
      } catch (error) {
        spinner.fail('Validation failed')
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  return authCommand
}

/**
 * Format auth type for display
 */
function formatAuthType(type: 'admin' | 'oauth' | 'apikey'): string {
  switch (type) {
    case 'admin':
      return chalk.red('Admin Token (DO_ADMIN_TOKEN)')
    case 'oauth':
      return chalk.green('OAuth (WorkOS)')
    case 'apikey':
      return chalk.blue('API Key (DO_TOKEN)')
    default:
      return type
  }
}
