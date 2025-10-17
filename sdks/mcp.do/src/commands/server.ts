/**
 * MCP Server Commands
 *
 * Commands for interacting with MCP servers (list tools, resources, prompts, etc.)
 */

import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { createClient } from '../index.js'
import { getStdioAuth } from 'oauth.do/cli'

export function createServerCommands(): Command {
  const serverCommand = new Command('server').description('Interact with MCP servers')

  /**
   * List available tools from an MCP server
   */
  serverCommand
    .command('tools <command>')
    .description('List available tools from an MCP server')
    .option('-a, --args <args...>', 'Arguments to pass to the server command')
    .option('--json', 'Output as JSON')
    .action(async (command: string, options) => {
      const spinner = ora('Connecting to MCP server...').start()

      try {
        // Get auth environment variables
        const authEnv = await getStdioAuth({
          service: 'mcp',
          envVars: ['MCP_TOKEN', 'MCP_ADMIN_TOKEN', 'DO_TOKEN', 'DO_ADMIN_TOKEN'],
          required: false,
        })

        const client = createClient({
          command,
          args: options.args || [],
          env: { ...process.env, ...authEnv } as Record<string, string>,
        })

        await client.connect()
        spinner.text = 'Listing tools...'

        const tools = await client.listTools()
        await client.disconnect()

        spinner.succeed(`Found ${tools.length} tools`)

        if (options.json) {
          console.log(JSON.stringify(tools, null, 2))
        } else {
          console.log()
          tools.forEach((tool) => {
            console.log(chalk.cyan(`  ${tool.name}`))
            if (tool.description) {
              console.log(chalk.gray(`    ${tool.description}`))
            }
            console.log()
          })
        }
      } catch (error) {
        spinner.fail('Failed to list tools')
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  /**
   * List available resources from an MCP server
   */
  serverCommand
    .command('resources <command>')
    .description('List available resources from an MCP server')
    .option('-a, --args <args...>', 'Arguments to pass to the server command')
    .option('--json', 'Output as JSON')
    .action(async (command: string, options) => {
      const spinner = ora('Connecting to MCP server...').start()

      try {
        const authEnv = await getStdioAuth({
          service: 'mcp',
          envVars: ['MCP_TOKEN', 'MCP_ADMIN_TOKEN', 'DO_TOKEN', 'DO_ADMIN_TOKEN'],
          required: false,
        })

        const client = createClient({
          command,
          args: options.args || [],
          env: { ...process.env, ...authEnv } as Record<string, string>,
        })

        await client.connect()
        spinner.text = 'Listing resources...'

        const resources = await client.listResources()
        await client.disconnect()

        spinner.succeed(`Found ${resources.length} resources`)

        if (options.json) {
          console.log(JSON.stringify(resources, null, 2))
        } else {
          console.log()
          resources.forEach((resource) => {
            console.log(chalk.cyan(`  ${resource.name}`))
            console.log(chalk.gray(`    URI: ${resource.uri}`))
            if (resource.description) {
              console.log(chalk.gray(`    ${resource.description}`))
            }
            console.log()
          })
        }
      } catch (error) {
        spinner.fail('Failed to list resources')
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  /**
   * List available prompts from an MCP server
   */
  serverCommand
    .command('prompts <command>')
    .description('List available prompts from an MCP server')
    .option('-a, --args <args...>', 'Arguments to pass to the server command')
    .option('--json', 'Output as JSON')
    .action(async (command: string, options) => {
      const spinner = ora('Connecting to MCP server...').start()

      try {
        const authEnv = await getStdioAuth({
          service: 'mcp',
          envVars: ['MCP_TOKEN', 'MCP_ADMIN_TOKEN', 'DO_TOKEN', 'DO_ADMIN_TOKEN'],
          required: false,
        })

        const client = createClient({
          command,
          args: options.args || [],
          env: { ...process.env, ...authEnv } as Record<string, string>,
        })

        await client.connect()
        spinner.text = 'Listing prompts...'

        const prompts = await client.listPrompts()
        await client.disconnect()

        spinner.succeed(`Found ${prompts.length} prompts`)

        if (options.json) {
          console.log(JSON.stringify(prompts, null, 2))
        } else {
          console.log()
          prompts.forEach((prompt) => {
            console.log(chalk.cyan(`  ${prompt.name}`))
            if (prompt.description) {
              console.log(chalk.gray(`    ${prompt.description}`))
            }
            if (prompt.arguments && prompt.arguments.length > 0) {
              console.log(chalk.gray(`    Arguments: ${prompt.arguments.map((a) => a.name).join(', ')}`))
            }
            console.log()
          })
        }
      } catch (error) {
        spinner.fail('Failed to list prompts')
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  /**
   * Execute a tool on an MCP server
   */
  serverCommand
    .command('execute <command> <tool> <args>')
    .description('Execute a tool on an MCP server')
    .option('-a, --server-args <args...>', 'Arguments to pass to the server command')
    .option('--json', 'Output as JSON')
    .action(async (command: string, tool: string, argsJson: string, options) => {
      const spinner = ora('Connecting to MCP server...').start()

      try {
        const authEnv = await getStdioAuth({
          service: 'mcp',
          envVars: ['MCP_TOKEN', 'MCP_ADMIN_TOKEN', 'DO_TOKEN', 'DO_ADMIN_TOKEN'],
          required: false,
        })

        const client = createClient({
          command,
          args: options.serverArgs || [],
          env: { ...process.env, ...authEnv } as Record<string, string>,
        })

        await client.connect()
        spinner.text = `Executing tool: ${tool}...`

        const args = JSON.parse(argsJson)
        const result = await client.executeTool(tool, args)
        await client.disconnect()

        spinner.succeed('Tool executed successfully')

        if (options.json) {
          console.log(JSON.stringify(result, null, 2))
        } else {
          console.log()
          result.content.forEach((item) => {
            if (item.text) {
              console.log(item.text)
            }
          })
          console.log()
        }
      } catch (error) {
        spinner.fail('Failed to execute tool')
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  /**
   * Health check for an MCP server
   */
  serverCommand
    .command('health <command>')
    .description('Check health of an MCP server')
    .option('-a, --args <args...>', 'Arguments to pass to the server command')
    .action(async (command: string, options) => {
      const spinner = ora('Checking MCP server health...').start()

      try {
        const authEnv = await getStdioAuth({
          service: 'mcp',
          envVars: ['MCP_TOKEN', 'MCP_ADMIN_TOKEN', 'DO_TOKEN', 'DO_ADMIN_TOKEN'],
          required: false,
        })

        const client = createClient({
          command,
          args: options.args || [],
          env: { ...process.env, ...authEnv } as Record<string, string>,
        })

        await client.connect()
        const health = await client.health()
        await client.disconnect()

        spinner.succeed('Server is healthy')

        console.log()
        console.log(chalk.green('  Status:'), health.status)
        console.log(chalk.cyan('  Tools:'), health.tools)
        console.log(chalk.cyan('  Resources:'), health.resources)
        console.log(chalk.cyan('  Prompts:'), health.prompts)
        console.log()
      } catch (error) {
        spinner.fail('Server health check failed')
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  return serverCommand
}
