/**
 * API Commands
 *
 * Commands for interacting with apis.do endpoints
 */

import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { createClient } from '../index.js'
import { getAuthToken } from 'oauth.do/cli'

export function createApiCommands(): Command {
  const apiCommand = new Command('api').description('Interact with APIs.do endpoints')

  /**
   * Health check
   */
  apiCommand
    .command('health')
    .description('Check API health status')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      const spinner = ora('Checking API health...').start()

      try {
        const authInfo = await getAuthToken()
        const client = createClient({
          apiKey: authInfo?.token,
        })

        const health = await client.health()
        spinner.succeed('API is healthy')

        if (options.json) {
          console.log(JSON.stringify(health, null, 2))
        } else {
          console.log()
          console.log(chalk.green('  Status:'), health.api.status)
          console.log(chalk.cyan('  Environment:'), health.api.environment)
          console.log(chalk.cyan('  Host:'), health.api.host)
          console.log(chalk.cyan('  Protocol:'), health.api.protocol)
          console.log()
        }
      } catch (error) {
        spinner.fail('Health check failed')
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  /**
   * Get user information
   */
  apiCommand
    .command('user')
    .description('Get current user information')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      const spinner = ora('Fetching user info...').start()

      try {
        const authInfo = await getAuthToken()
        const client = createClient({
          apiKey: authInfo?.token,
        })

        const user = await client.user()
        spinner.succeed('User info retrieved')

        if (options.json) {
          console.log(JSON.stringify(user, null, 2))
        } else {
          console.log()
          console.log(chalk.cyan('  Authenticated:'), user.authenticated ? chalk.green('Yes') : chalk.red('No'))
          console.log(chalk.cyan('  IP:'), user.ip)
          console.log(chalk.cyan('  Country:'), user.country)
          console.log(chalk.cyan('  Colo:'), user.colo)
          if (user.login) {
            console.log(chalk.cyan('  Login:'), user.login)
          }
          console.log()
        }
      } catch (error) {
        spinner.fail('Failed to fetch user info')
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  /**
   * List API endpoints
   */
  apiCommand
    .command('endpoints')
    .description('List available API endpoints')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      const spinner = ora('Fetching endpoints...').start()

      try {
        const authInfo = await getAuthToken()
        const client = createClient({
          apiKey: authInfo?.token,
        })

        const endpoints = await client.getEndpoints()
        spinner.succeed('Endpoints retrieved')

        if (options.json) {
          console.log(JSON.stringify(endpoints, null, 2))
        } else {
          console.log()
          Object.entries(endpoints).forEach(([name, url]) => {
            console.log(chalk.cyan(`  ${name}:`), url)
          })
          console.log()
        }
      } catch (error) {
        spinner.fail('Failed to fetch endpoints')
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  /**
   * Generate AI text
   */
  apiCommand
    .command('generate <prompt>')
    .description('Generate AI text using APIs.do')
    .option('-p, --provider <provider>', 'AI provider to use')
    .option('-m, --model <model>', 'Model to use')
    .option('--max-tokens <number>', 'Maximum tokens to generate', parseInt)
    .option('--temperature <number>', 'Temperature for generation', parseFloat)
    .option('--json', 'Output as JSON')
    .action(async (prompt: string, options) => {
      const spinner = ora('Generating text...').start()

      try {
        const authInfo = await getAuthToken()
        const client = createClient({
          apiKey: authInfo?.token,
        })

        const result = await client.generateText({
          prompt,
          provider: options.provider,
          model: options.model,
          maxTokens: options.maxTokens,
          temperature: options.temperature,
        })

        spinner.succeed('Text generated')

        if (options.json) {
          console.log(JSON.stringify(result, null, 2))
        } else {
          console.log()
          console.log(result.text)
          console.log()
          if (result.usage) {
            console.log(chalk.gray('  Usage:'))
            console.log(chalk.gray(`    Prompt tokens: ${result.usage.promptTokens}`))
            console.log(chalk.gray(`    Completion tokens: ${result.usage.completionTokens}`))
            console.log(chalk.gray(`    Total tokens: ${result.usage.totalTokens}`))
          }
          console.log()
        }
      } catch (error) {
        spinner.fail('Generation failed')
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  /**
   * Get repository information
   */
  apiCommand
    .command('repo <owner> <repo>')
    .description('Get GitHub repository information')
    .option('--json', 'Output as JSON')
    .action(async (owner: string, repo: string, options) => {
      const spinner = ora(`Fetching ${owner}/${repo}...`).start()

      try {
        const authInfo = await getAuthToken()
        const client = createClient({
          apiKey: authInfo?.token,
        })

        const repoInfo = await client.getRepo(owner, repo)
        spinner.succeed('Repository info retrieved')

        if (options.json) {
          console.log(JSON.stringify(repoInfo, null, 2))
        } else {
          console.log()
          console.log(repoInfo)
          console.log()
        }
      } catch (error) {
        spinner.fail('Failed to fetch repository')
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  return apiCommand
}
