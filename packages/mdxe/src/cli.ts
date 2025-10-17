#!/usr/bin/env node

/**
 * mdxe CLI
 * Execute MDXLD Workers with wrangler integration
 */

import { Command } from 'commander'
import chalk from 'chalk'
import { spawn } from 'child_process'
import { dirname } from 'path'
import { parseWorker, validateWorkerConfig } from './parser.js'
import { runWrangler } from './wrangler.js'
import { createAuthCommands } from './commands/auth.js'
import type { CommandOptions } from './types.js'

/**
 * Custom error class for CLI errors
 */
export class CLIError extends Error {
  constructor(
    message: string,
    public exitCode: number = 1
  ) {
    super(message)
    this.name = 'CLIError'
  }
}

/**
 * Run vitest in the worker directory
 */
async function runTests(workerDir: string, verbose: boolean): Promise<{ success: boolean; output: string; error?: string }> {
  return new Promise((resolve) => {
    const proc = spawn('npx', ['vitest', 'run'], {
      cwd: workerDir,
      stdio: verbose ? 'inherit' : 'pipe',
    })

    let stdout = ''
    let stderr = ''

    if (!verbose) {
      proc.stdout?.on('data', (data) => {
        stdout += data.toString()
      })

      proc.stderr?.on('data', (data) => {
        stderr += data.toString()
      })
    }

    proc.on('close', (code) => {
      resolve({
        success: code === 0,
        output: stdout,
        error: code !== 0 ? stderr || 'Tests failed' : undefined,
      })
    })

    proc.on('error', (error) => {
      resolve({
        success: false,
        output: stdout,
        error: error.message,
      })
    })
  })
}

const program = new Command()

program.name('mdxe').description('MDX Execution Engine - Execute MDXLD Workers with wrangler integration').version('0.1.0')

// Auth commands
program.addCommand(createAuthCommands())

// Dev command
program
  .command('dev')
  .description('Start development server for MDXLD worker')
  .argument('<file>', 'Path to MDXLD worker file')
  .option('-e, --env <env>', 'Environment to use')
  .option('-v, --verbose', 'Verbose output')
  .option('-a, --assets <path>', 'Path to static assets directory')
  .action(async (file: string, options: CommandOptions) => {
    console.log(chalk.blue('🔧 Starting development server...'))

    const worker = await parseWorker(file)
    console.log(chalk.green(`✓ Parsed worker: ${worker.frontmatter.name}`))

    const validation = validateWorkerConfig(worker.frontmatter)
    if (!validation.valid) {
      const errorMsg = 'Invalid worker configuration:\n' + validation.errors.map((e) => `  - ${e}`).join('\n')
      throw new CLIError(errorMsg)
    }

    console.log(chalk.blue('Starting wrangler dev...'))
    const result = await runWrangler('dev', worker, options)

    if (!result.success) {
      const errorMsg = `Development server failed:\n${result.error || result.output}`
      throw new CLIError(errorMsg)
    }
  })

// Build command
program
  .command('build')
  .description('Build MDXLD worker')
  .argument('<file>', 'Path to MDXLD worker file')
  .option('-e, --env <env>', 'Environment to use')
  .option('-v, --verbose', 'Verbose output')
  .action(async (file: string, options: CommandOptions) => {
    console.log(chalk.blue('🔨 Building worker...'))

    const worker = await parseWorker(file)
    console.log(chalk.green(`✓ Parsed worker: ${worker.frontmatter.name}`))

    const validation = validateWorkerConfig(worker.frontmatter)
    if (!validation.valid) {
      const errorMsg = 'Invalid worker configuration:\n' + validation.errors.map((e) => `  - ${e}`).join('\n')
      throw new CLIError(errorMsg)
    }

    console.log(chalk.blue('Running wrangler build...'))
    // Note: wrangler doesn't have a standalone build command, but we can use deploy --dry-run
    const result = await runWrangler('deploy', worker, { ...options, dryRun: true })

    if (!result.success) {
      const errorMsg = `Build failed:\n${result.error || result.output}`
      throw new CLIError(errorMsg)
    }

    console.log(chalk.green('✓ Build complete'))
    console.log(result.output)
  })

// Deploy command
program
  .command('deploy')
  .description('Deploy MDXLD worker')
  .argument('<file>', 'Path to MDXLD worker file')
  .option('-e, --env <env>', 'Environment to use')
  .option('-v, --verbose', 'Verbose output')
  .option('-n, --namespace <namespace>', 'Workers for Platforms dispatch namespace')
  .option('-a, --assets <path>', 'Path to static assets directory')
  .action(async (file: string, options: CommandOptions) => {
    console.log(chalk.blue('🚀 Deploying worker...'))

    const worker = await parseWorker(file)
    console.log(chalk.green(`✓ Parsed worker: ${worker.frontmatter.name}`))

    const validation = validateWorkerConfig(worker.frontmatter)
    if (!validation.valid) {
      const errorMsg = 'Invalid worker configuration:\n' + validation.errors.map((e) => `  - ${e}`).join('\n')
      throw new CLIError(errorMsg)
    }

    console.log(chalk.blue('Running wrangler deploy...'))
    const result = await runWrangler('deploy', worker, options)

    if (!result.success) {
      const errorMsg = `Deployment failed:\n${result.error || result.output}`
      throw new CLIError(errorMsg)
    }

    console.log(chalk.green('✓ Deployment complete'))
    console.log(result.output)
  })

// Test command
program
  .command('test')
  .description('Test MDXLD worker')
  .argument('<file>', 'Path to MDXLD worker file')
  .option('-e, --env <env>', 'Environment to use')
  .option('-v, --verbose', 'Verbose output')
  .action(async (file: string, options: CommandOptions) => {
    console.log(chalk.blue('🧪 Testing worker...'))

    const worker = await parseWorker(file)
    console.log(chalk.green(`✓ Parsed worker: ${worker.frontmatter.name}`))

    const validation = validateWorkerConfig(worker.frontmatter)
    if (!validation.valid) {
      const errorMsg = 'Invalid worker configuration:\n' + validation.errors.map((e) => `  - ${e}`).join('\n')
      throw new CLIError(errorMsg)
    }

    console.log(chalk.blue('Running tests with vitest...'))

    const workerDir = dirname(file)
    const result = await runTests(workerDir, options.verbose || false)

    if (!result.success) {
      const errorMsg = `Tests failed:\n${result.error || result.output}`
      throw new CLIError(errorMsg)
    }

    console.log(chalk.green('✓ Tests complete'))
    if (!options.verbose && result.output) {
      console.log(result.output)
    }
  })

// Validate command
program
  .command('validate')
  .description('Validate MDXLD worker configuration')
  .argument('<file>', 'Path to MDXLD worker file')
  .action(async (file: string) => {
    console.log(chalk.blue('🔍 Validating worker...'))

    const worker = await parseWorker(file)
    console.log(chalk.green(`✓ Parsed worker: ${worker.frontmatter.name}`))

    const validation = validateWorkerConfig(worker.frontmatter)
    if (!validation.valid) {
      const errorMsg = 'Invalid worker configuration:\n' + validation.errors.map((e) => `  - ${e}`).join('\n')
      throw new CLIError(errorMsg)
    }

    console.log(chalk.green('✓ Worker configuration is valid'))

    // Display summary
    console.log(chalk.blue('\nWorker Summary:'))
    console.log(`  Name: ${worker.frontmatter.name}`)
    console.log(`  Main: ${worker.frontmatter.main}`)
    console.log(`  Compatibility Date: ${worker.frontmatter.compatibility_date}`)
    if (worker.frontmatter.$id) {
      console.log(`  ID: ${worker.frontmatter.$id}`)
    }
  })

/**
 * Global error handler for CLI
 * Catches errors thrown by commands and exits with appropriate code
 */
async function runCLI() {
  try {
    await program.parseAsync()
  } catch (error) {
    if (error instanceof CLIError) {
      console.error(chalk.red('✗ Error:'), error.message)
      process.exit(error.exitCode)
    } else if (error instanceof Error) {
      console.error(chalk.red('✗ Error:'), error.message)
      process.exit(1)
    } else {
      console.error(chalk.red('✗ Unknown error:'), error)
      process.exit(1)
    }
  }
}

// Only run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  runCLI()
}
