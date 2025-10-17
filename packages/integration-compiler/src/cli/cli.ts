#!/usr/bin/env node

/**
 * Integration Compiler CLI
 *
 * Command-line interface for compiling MDXLD Integration definitions.
 *
 * Usage:
 *   integration-compiler compile <mdx-file> --output <dir>
 *   integration-compiler compile-all <integrations-dir> --output <dir>
 *   integration-compiler validate <mdx-file>
 */

import { IntegrationCompiler } from '../compiler/integration-compiler.js'

/**
 * Parse CLI arguments
 */
function parseArgs(args: string[]): {
  command: string
  input?: string
  output?: string
  help?: boolean
} {
  const command = args[0]
  const input = args[1]
  let output: string | undefined

  // Parse flags
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--output' || args[i] === '-o') {
      output = args[i + 1]
      i++
    } else if (args[i] === '--help' || args[i] === '-h') {
      return { command: 'help', help: true }
    }
  }

  return { command, input, output }
}

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
Integration Compiler CLI

Compile MDXLD Integration definitions into TypeScript code.

USAGE:
  integration-compiler <command> [options]

COMMANDS:
  compile <mdx-file> --output <dir>         Compile single Integration
  compile-all <dir> --output <dir>          Compile all Integrations in directory
  validate <mdx-file>                       Validate Integration definition
  help                                       Show this help message

OPTIONS:
  --output, -o <dir>                        Output directory
  --help, -h                                Show help

EXAMPLES:
  # Compile single Integration
  integration-compiler compile integrations/stripe.mdx --output src/integrations/stripe

  # Compile all Integrations
  integration-compiler compile-all integrations/ --output src/integrations/

  # Validate Integration
  integration-compiler validate integrations/stripe.mdx
`)
}

/**
 * Run compile command
 */
async function runCompile(input: string, output: string): Promise<void> {
  console.log(`Compiling Integration: ${input}`)
  console.log(`Output directory: ${output}`)
  console.log('')

  const compiler = new IntegrationCompiler()
  const result = await compiler.compile(input, output)

  if (result.success) {
    console.log(`✓ Successfully compiled ${result.integration.name}`)
    console.log('')
    console.log(`Files generated (${result.filesGenerated.length}):`)
    for (const file of result.filesGenerated) {
      console.log(`  - ${file}`)
    }
    console.log('')
    console.log(`Total lines of code: ${result.linesOfCode}`)
  } else {
    console.error(`✗ Compilation failed: ${result.error}`)
    process.exit(1)
  }
}

/**
 * Run compile-all command
 */
async function runCompileAll(input: string, output: string): Promise<void> {
  console.log(`Compiling all Integrations in: ${input}`)
  console.log(`Output directory: ${output}`)
  console.log('')

  const compiler = new IntegrationCompiler()
  const results = await compiler.compileAll(input, output)

  IntegrationCompiler.printReport(results)

  const failed = results.filter((r) => !r.success)
  if (failed.length > 0) {
    process.exit(1)
  }
}

/**
 * Run validate command
 */
async function runValidate(input: string): Promise<void> {
  console.log(`Validating Integration: ${input}`)
  console.log('')

  const compiler = new IntegrationCompiler()
  const result = await compiler.validate(input)

  if (result.valid && result.integration) {
    console.log('✓ Integration is valid')
    console.log('')

    const summary = await compiler.getSummary(input)
    console.log('Integration Summary:')
    console.log(`  Name: ${summary.name}`)
    console.log(`  Service: ${summary.service}`)
    console.log(`  Category: ${summary.category}`)
    console.log(`  Auth Type: ${summary.authType}`)
    console.log(`  Resources: ${summary.resourceCount}`)
    console.log(`  Operations: ${summary.operationCount}`)
    console.log(`  Webhooks: ${summary.hasWebhooks ? 'Yes' : 'No'}`)
    console.log(`  Tests: ${summary.hasTests ? 'Yes' : 'No'}`)
  } else {
    console.error('✗ Integration is invalid')
    console.error('')
    if (result.errors) {
      console.error('Validation Errors:')
      for (const error of result.errors) {
        console.error(`  - ${error}`)
      }
    }
    process.exit(1)
  }
}

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    printHelp()
    return
  }

  const { command, input, output, help } = parseArgs(args)

  if (help || command === 'help') {
    printHelp()
    return
  }

  try {
    switch (command) {
      case 'compile':
        if (!input || !output) {
          console.error('Error: compile requires <mdx-file> and --output <dir>')
          process.exit(1)
        }
        await runCompile(input, output)
        break

      case 'compile-all':
        if (!input || !output) {
          console.error('Error: compile-all requires <integrations-dir> and --output <dir>')
          process.exit(1)
        }
        await runCompileAll(input, output)
        break

      case 'validate':
        if (!input) {
          console.error('Error: validate requires <mdx-file>')
          process.exit(1)
        }
        await runValidate(input)
        break

      default:
        console.error(`Error: Unknown command '${command}'`)
        console.error('Run "integration-compiler help" for usage information')
        process.exit(1)
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

// Run CLI
main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
