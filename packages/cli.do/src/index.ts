#!/usr/bin/env node

/**
 * cli.do - Command-line interface for sdk.do
 *
 * Execute SDK functions from the terminal with semantic syntax.
 *
 * @example
 * ```bash
 * do db list Business
 * do ai generate "Write a haiku about code"
 * do functions execute fn_add_numbers '{"a": 5, "b": 3}'
 * do workflows run processOrder '{"orderId": "123"}'
 * ```
 */

import { Command } from 'commander'
import { config } from 'dotenv'
import { create$ } from '@dotdo/sdk.do'
import { execute } from 'functions.do'
import pkg from '../package.json' with { type: 'json' }
import { createAuthCommands } from './commands/auth.js'
import { createOrchestrationCommands } from './commands/orchestrate.js'
import { getAuthToken } from 'oauth.do/cli'
import chalk from 'chalk'
import ora from 'ora'

// Load environment variables
config()

// Create program
const program = new Command()

program.name('do').description('Command-line interface for sdk.do - Execute SDK functions from terminal').version(pkg.version)

// Initialize SDK with authentication
async function getSDK() {
  const baseUrl = process.env.DO_BASE_URL || 'https://rpc.do'

  // Try to get auth token from keychain or environment
  const auth = await getAuthToken()

  if (!auth && !process.env.DO_ALLOW_ANONYMOUS) {
    console.error(chalk.red('Error: Not authenticated'))
    console.error(chalk.yellow('\nAuthenticate using one of these methods:'))
    console.error(chalk.cyan('  • OAuth:    do auth login'))
    console.error(chalk.cyan('  • API Key:  export DO_TOKEN=sk_xxx'))
    console.error(chalk.cyan('  • Admin:    export DO_ADMIN_TOKEN=sk_admin_xxx\n'))
    process.exit(1)
  }

  return create$({ apiKey: auth?.token, baseUrl })
}

// Utility to parse JSON arguments
function parseJSON(value: string): any {
  try {
    return JSON.parse(value)
  } catch (error) {
    console.error(chalk.red(`Invalid JSON: ${value}`))
    process.exit(1)
  }
}

// Utility to format output
function formatOutput(result: any, options: { pretty?: boolean; json?: boolean } = {}) {
  if (options.json) {
    console.log(JSON.stringify(result, null, options.pretty ? 2 : 0))
  } else if (options.pretty) {
    console.log(chalk.green(JSON.stringify(result, null, 2)))
  } else {
    console.log(result)
  }
}

// Database commands
const db = program.command('db').description('Database operations with semantic types')

db.command('list <type>')
  .description('List entities of a semantic type')
  .option('-w, --where <json>', 'Filter conditions as JSON')
  .option('-l, --limit <number>', 'Limit results')
  .option('-o, --offset <number>', 'Offset results')
  .option('--json', 'Output as JSON')
  .option('--pretty', 'Pretty-print output')
  .action(async (type, options) => {
    const spinner = ora(`Listing ${type}...`).start()
    try {
      const $ = await getSDK()
      const where = options.where ? parseJSON(options.where) : undefined
      const limit = options.limit ? parseInt(options.limit) : undefined
      const offset = options.offset ? parseInt(options.offset) : undefined

      const results = await $.db.list($[type], { where, limit, offset })
      spinner.succeed(`Found ${results.length} ${type} entities`)
      formatOutput(results, options)
    } catch (error) {
      spinner.fail('Failed to list entities')
      console.error(chalk.red(error instanceof Error ? error.message : String(error)))
      process.exit(1)
    }
  })

db.command('get <type> <id>')
  .description('Get entity by semantic type and ID')
  .option('--json', 'Output as JSON')
  .option('--pretty', 'Pretty-print output')
  .action(async (type, id, options) => {
    const spinner = ora(`Getting ${type}:${id}...`).start()
    try {
      const $ = await getSDK()
      const result = await $.db.get($[type], id)
      spinner.succeed(`Retrieved ${type}:${id}`)
      formatOutput(result, options)
    } catch (error) {
      spinner.fail('Failed to get entity')
      console.error(chalk.red(error instanceof Error ? error.message : String(error)))
      process.exit(1)
    }
  })

db.command('create <type> <data>')
  .description('Create entity with semantic type')
  .option('--json', 'Output as JSON')
  .option('--pretty', 'Pretty-print output')
  .action(async (type, data, options) => {
    const spinner = ora(`Creating ${type}...`).start()
    try {
      const $ = await getSDK()
      const parsed = parseJSON(data)
      const result = await $.db.create($[type], parsed)
      spinner.succeed(`Created ${type}`)
      formatOutput(result, options)
    } catch (error) {
      spinner.fail('Failed to create entity')
      console.error(chalk.red(error instanceof Error ? error.message : String(error)))
      process.exit(1)
    }
  })

db.command('update <type> <id> <data>')
  .description('Update entity by semantic type and ID')
  .option('--json', 'Output as JSON')
  .option('--pretty', 'Pretty-print output')
  .action(async (type, id, data, options) => {
    const spinner = ora(`Updating ${type}:${id}...`).start()
    try {
      const $ = await getSDK()
      const parsed = parseJSON(data)
      const result = await $.db.update($[type], id, parsed)
      spinner.succeed(`Updated ${type}:${id}`)
      formatOutput(result, options)
    } catch (error) {
      spinner.fail('Failed to update entity')
      console.error(chalk.red(error instanceof Error ? error.message : String(error)))
      process.exit(1)
    }
  })

db.command('delete <type> <id>')
  .description('Delete entity by semantic type and ID')
  .action(async (type, id) => {
    const spinner = ora(`Deleting ${type}:${id}...`).start()
    try {
      const $ = await getSDK()
      await $.db.delete($[type], id)
      spinner.succeed(`Deleted ${type}:${id}`)
    } catch (error) {
      spinner.fail('Failed to delete entity')
      console.error(chalk.red(error instanceof Error ? error.message : String(error)))
      process.exit(1)
    }
  })

// AI commands
const ai = program.command('ai').description('AI generation and embeddings')

ai.command('generate <prompt>')
  .description('Generate text with AI')
  .option('-m, --model <model>', 'AI model to use', 'gpt-5')
  .option('-t, --temperature <temp>', 'Sampling temperature')
  .option('-s, --schema <json>', 'JSON schema for structured output')
  .option('--json', 'Output as JSON')
  .option('--pretty', 'Pretty-print output')
  .action(async (prompt, options) => {
    const spinner = ora('Generating...').start()
    try {
      const $ = await getSDK()
      const schema = options.schema ? parseJSON(options.schema) : undefined
      const temperature = options.temperature ? parseFloat(options.temperature) : undefined

      const result = await $.ai.generate({
        prompt,
        model: options.model,
        temperature,
        schema,
      })

      spinner.succeed('Generated')
      formatOutput(result, options)
    } catch (error) {
      spinner.fail('Failed to generate')
      console.error(chalk.red(error instanceof Error ? error.message : String(error)))
      process.exit(1)
    }
  })

ai.command('embed <text>')
  .description('Create embeddings for text')
  .option('-m, --model <model>', 'Embedding model to use')
  .option('--json', 'Output as JSON')
  .option('--pretty', 'Pretty-print output')
  .action(async (text, options) => {
    const spinner = ora('Creating embeddings...').start()
    try {
      const $ = await getSDK()
      const result = await $.ai.embed(text, { model: options.model })
      spinner.succeed('Created embeddings')
      formatOutput(result, options)
    } catch (error) {
      spinner.fail('Failed to create embeddings')
      console.error(chalk.red(error instanceof Error ? error.message : String(error)))
      process.exit(1)
    }
  })

// Functions commands
const functions = program.command('functions').alias('fn').description('Execute functions and workflows')

functions
  .command('execute <functionId> [input]')
  .description('Execute a function by ID')
  .option('-t, --timeout <ms>', 'Timeout in milliseconds')
  .option('-r, --retries <count>', 'Number of retry attempts')
  .option('--trace-id <id>', 'Trace ID for distributed tracing')
  .option('--json', 'Output as JSON')
  .option('--pretty', 'Pretty-print output')
  .action(async (functionId, input, options) => {
    const spinner = ora(`Executing ${functionId}...`).start()
    try {
      const $ = await getSDK()
      const parsed = input ? parseJSON(input) : {}
      const timeout = options.timeout ? parseInt(options.timeout) : undefined
      const retries = options.retries ? parseInt(options.retries) : undefined

      const result = await $.functions.execute(functionId, parsed, {
        timeout,
        retries,
        traceId: options.traceId,
      })

      spinner.succeed(`Executed ${functionId}`)
      formatOutput(result, options)
    } catch (error) {
      spinner.fail('Failed to execute function')
      console.error(chalk.red(error instanceof Error ? error.message : String(error)))
      process.exit(1)
    }
  })

functions
  .command('list')
  .description('List all registered functions')
  .option('-t, --type <type>', 'Filter by function type (code, generative, agentic, human)')
  .option('--json', 'Output as JSON')
  .option('--pretty', 'Pretty-print output')
  .action(async (options) => {
    const spinner = ora('Listing functions...').start()
    try {
      // This would call an API endpoint that lists functions
      const response = await fetch(`${process.env.DO_BASE_URL || 'https://rpc.do'}/functions`)
      const result = await response.json()

      spinner.succeed('Listed functions')
      formatOutput(result, options)
    } catch (error) {
      spinner.fail('Failed to list functions')
      console.error(chalk.red(error instanceof Error ? error.message : String(error)))
      process.exit(1)
    }
  })

// Workflows commands
const workflows = program.command('workflows').alias('wf').description('Execute and manage workflows')

workflows
  .command('run <workflowName> [input]')
  .description('Execute a workflow')
  .option('-e, --engine <engine>', 'Workflow engine (cloudflare, payload, dotdo)')
  .option('--json', 'Output as JSON')
  .option('--pretty', 'Pretty-print output')
  .action(async (workflowName, input, options) => {
    const spinner = ora(`Running workflow ${workflowName}...`).start()
    try {
      const $ = await getSDK()
      const parsed = input ? parseJSON(input) : {}

      const result = await $.functions.workflow(workflowName, parsed, {
        engine: options.engine,
      })

      spinner.succeed(`Completed workflow ${workflowName}`)
      formatOutput(result, options)
    } catch (error) {
      spinner.fail('Failed to run workflow')
      console.error(chalk.red(error instanceof Error ? error.message : String(error)))
      process.exit(1)
    }
  })

// Send commands
program
  .command('send <event> <payload>')
  .description('Send semantic event')
  .action(async (event, payload) => {
    const spinner = ora(`Sending ${event}...`).start()
    try {
      const $ = await getSDK()
      const parsed = parseJSON(payload)

      // Parse event path (e.g., "Order.created" -> $.Order.created)
      const [object, action] = event.split('.')
      await $.send[object][action](parsed)

      spinner.succeed(`Sent ${event}`)
    } catch (error) {
      spinner.fail('Failed to send event')
      console.error(chalk.red(error instanceof Error ? error.message : String(error)))
      process.exit(1)
    }
  })

// Auth commands
program.addCommand(createAuthCommands())

// Orchestration commands - master CLI orchestrator for all .do CLIs
program.addCommand(createOrchestrationCommands())

// Config commands
const configCmd = program.command('config').description('Manage CLI configuration')

configCmd
  .command('set <key> <value>')
  .description('Set configuration value')
  .action((key, value) => {
    console.log(chalk.green(`Set ${key} = ${value}`))
    console.log(chalk.yellow('Note: Configuration persistence not yet implemented'))
  })

configCmd
  .command('get <key>')
  .description('Get configuration value')
  .action((key) => {
    const value = process.env[key]
    if (value) {
      console.log(chalk.green(`${key} = ${value}`))
    } else {
      console.log(chalk.yellow(`${key} is not set`))
    }
  })

configCmd
  .command('list')
  .description('List all configuration')
  .action(() => {
    console.log(chalk.cyan('Environment Configuration:'))
    console.log(chalk.white(`  DO_API_KEY: ${process.env.DO_API_KEY ? '***' : 'not set'}`))
    console.log(chalk.white(`  DO_BASE_URL: ${process.env.DO_BASE_URL || 'https://rpc.do (default)'}`))
  })

// Health check
program
  .command('health')
  .description('Check API health')
  .action(async () => {
    const spinner = ora('Checking API health...').start()
    try {
      const baseUrl = process.env.DO_BASE_URL || 'https://rpc.do'
      const response = await fetch(`${baseUrl}/health`)
      const result = await response.json()

      spinner.succeed('API is healthy')
      console.log(chalk.green(JSON.stringify(result, null, 2)))
    } catch (error) {
      spinner.fail('API is unhealthy')
      console.error(chalk.red(error instanceof Error ? error.message : String(error)))
      process.exit(1)
    }
  })

// Parse arguments
program.parse()
