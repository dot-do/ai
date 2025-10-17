#!/usr/bin/env node
/**
 * Workflow Compiler CLI
 *
 * Usage:
 *   workflow-compiler compile <input.yaml> [output.ts]
 *   workflow-compiler validate <input.yaml>
 *   workflow-compiler compile-all <input-dir> <output-dir>
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'fs'
import { join, basename, dirname, extname } from 'path'
import { parseWorkflow, validateWorkflow, compileWorkflow } from './index.js'
import { deploy } from './deploy.js'

// Parse command line arguments
const args = process.argv.slice(2)
const command = args[0]

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function error(message: string) {
  console.error(`${colors.red}✗ ${message}${colors.reset}`)
}

function success(message: string) {
  log(`✓ ${message}`, 'green')
}

function info(message: string) {
  log(`ℹ ${message}`, 'blue')
}

function warn(message: string) {
  log(`⚠ ${message}`, 'yellow')
}

/**
 * Compile a single workflow file
 */
function compileFile(inputPath: string, outputPath?: string): boolean {
  try {
    // Read YAML file
    const yaml = readFileSync(inputPath, 'utf-8')

    // Parse
    const parseResult = parseWorkflow(yaml)

    if (parseResult.errors.length > 0) {
      error(`Parse errors in ${inputPath}:`)
      parseResult.errors.forEach((err) => log(`  - ${err}`, 'red'))
      return false
    }

    success(`Parsed ${inputPath}`)

    // Validate
    const validation = validateWorkflow(parseResult.workflow)

    if (!validation.valid) {
      error(`Validation errors in ${inputPath}:`)
      validation.errors.forEach((err) => log(`  - ${err}`, 'red'))
      return false
    }

    success('Validated workflow')

    // Show warnings
    if (parseResult.warnings.length > 0 || validation.warnings.length > 0) {
      const allWarnings = [...parseResult.warnings, ...validation.warnings]
      allWarnings.forEach((w) => warn(w))
    }

    // Compile
    const compileResult = compileWorkflow(parseResult.workflow, {
      pretty: true,
      debug: false,
    })

    if (compileResult.errors.length > 0) {
      error('Compilation errors:')
      compileResult.errors.forEach((err) => log(`  - ${err}`, 'red'))
      return false
    }

    // Determine output path
    const output = outputPath || inputPath.replace(/\.yaml$/, '.ts')

    // Ensure output directory exists
    const outputDir = dirname(output)
    mkdirSync(outputDir, { recursive: true })

    // Write output
    writeFileSync(output, compileResult.code)
    success(`Compiled to ${output}`)

    return true
  } catch (err) {
    error(`Failed to compile ${inputPath}: ${err instanceof Error ? err.message : String(err)}`)
    return false
  }
}

/**
 * Validate a workflow file
 */
function validateFile(inputPath: string): boolean {
  try {
    const yaml = readFileSync(inputPath, 'utf-8')
    const parseResult = parseWorkflow(yaml)

    if (parseResult.errors.length > 0) {
      error('Parse errors:')
      parseResult.errors.forEach((err) => log(`  - ${err}`, 'red'))
      return false
    }

    const validation = validateWorkflow(parseResult.workflow)

    if (!validation.valid) {
      error('Validation errors:')
      validation.errors.forEach((err) => log(`  - ${err}`, 'red'))
      return false
    }

    success(`Workflow is valid: ${parseResult.workflow.name}`)

    // Show warnings
    const allWarnings = [...parseResult.warnings, ...validation.warnings]
    if (allWarnings.length > 0) {
      allWarnings.forEach((w) => warn(w))
    }

    // Show workflow info
    info(`Workflow ID: ${parseResult.workflow.$id}`)
    info(`Version: ${parseResult.workflow.version}`)
    info(`Triggers: ${parseResult.workflow.triggers.length}`)
    info(`Steps: ${parseResult.workflow.steps.length}`)

    return true
  } catch (err) {
    error(`Failed to validate ${inputPath}: ${err instanceof Error ? err.message : String(err)}`)
    return false
  }
}

/**
 * Compile all YAML files in a directory
 */
function compileDirectory(inputDir: string, outputDir: string): boolean {
  try {
    // Ensure output directory exists
    mkdirSync(outputDir, { recursive: true })

    // Find all .yaml files
    const files = findYamlFiles(inputDir)

    if (files.length === 0) {
      warn(`No YAML files found in ${inputDir}`)
      return false
    }

    info(`Found ${files.length} workflow(s)`)

    let compiled = 0
    let failed = 0

    for (const file of files) {
      const relativePath = file.substring(inputDir.length + 1)
      const outputPath = join(outputDir, relativePath.replace(/\.yaml$/, '.ts'))

      log(`\nCompiling ${relativePath}...`, 'cyan')

      if (compileFile(file, outputPath)) {
        compiled++
      } else {
        failed++
      }
    }

    log('\n' + '='.repeat(50), 'gray')
    info(`Compiled: ${compiled}`)
    if (failed > 0) {
      error(`Failed: ${failed}`)
    }

    return failed === 0
  } catch (err) {
    error(`Failed to compile directory: ${err instanceof Error ? err.message : String(err)}`)
    return false
  }
}

/**
 * Recursively find all .yaml files in a directory
 */
function findYamlFiles(dir: string): string[] {
  const files: string[] = []

  const entries = readdirSync(dir)

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...findYamlFiles(fullPath))
    } else if (stat.isFile() && extname(entry) === '.yaml') {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
${colors.cyan}Workflow Compiler CLI${colors.reset}

${colors.green}Usage:${colors.reset}
  workflow-compiler compile <input.yaml> [output.ts]
  workflow-compiler validate <input.yaml>
  workflow-compiler compile-all <input-dir> <output-dir>
  workflow-compiler help

${colors.green}Commands:${colors.reset}
  ${colors.blue}compile${colors.reset}       Compile a single YAML workflow to TypeScript
  ${colors.blue}validate${colors.reset}      Validate a YAML workflow without compiling
  ${colors.blue}compile-all${colors.reset}   Compile all YAML workflows in a directory
  ${colors.blue}help${colors.reset}          Show this help message

${colors.green}Examples:${colors.reset}
  # Compile a single workflow
  workflow-compiler compile order-fulfillment.yaml

  # Compile with custom output path
  workflow-compiler compile order-fulfillment.yaml dist/workflows/order.ts

  # Validate a workflow
  workflow-compiler validate order-fulfillment.yaml

  # Compile all workflows in a directory
  workflow-compiler compile-all ./workflows ./dist/workflows

${colors.green}Options:${colors.reset}
  --help, -h    Show this help message
  --version     Show version number
`)
}

// Main CLI logic
switch (command) {
  case 'compile': {
    const inputPath = args[1]
    const outputPath = args[2]

    if (!inputPath) {
      error('Input file required')
      showHelp()
      process.exit(1)
    }

    const success = compileFile(inputPath, outputPath)
    process.exit(success ? 0 : 1)
    break
  }

  case 'validate': {
    const inputPath = args[1]

    if (!inputPath) {
      error('Input file required')
      showHelp()
      process.exit(1)
    }

    const success = validateFile(inputPath)
    process.exit(success ? 0 : 1)
    break
  }

  case 'compile-all': {
    const inputDir = args[1]
    const outputDir = args[2]

    if (!inputDir || !outputDir) {
      error('Input and output directories required')
      showHelp()
      process.exit(1)
    }

    const success = compileDirectory(inputDir, outputDir)
    process.exit(success ? 0 : 1)
    break
  }

  case 'deploy': {
    const inputPath = args[1]

    if (!inputPath) {
      error('Input path required')
      showHelp()
      process.exit(1)
    }

    // Parse options
    const options = {
      worker: args.find((arg, i) => args[i - 1] === '--worker'),
      dryRun: args.includes('--dry-run'),
      watch: args.includes('--watch'),
      payloadUrl: args.find((arg, i) => args[i - 1] === '--payload-url') || process.env.PAYLOAD_API_URL,
      apiKey: args.find((arg, i) => args[i - 1] === '--api-key') || process.env.PAYLOAD_API_KEY,
    }

    await deploy(inputPath, options)
    break
  }

  case 'help':
  case '--help':
  case '-h':
    showHelp()
    process.exit(0)
    break

  default:
    if (command) {
      error(`Unknown command: ${command}`)
    }
    showHelp()
    process.exit(1)
}
