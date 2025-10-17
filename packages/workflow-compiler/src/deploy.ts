#!/usr/bin/env node
/**
 * Workflow Deployment Script
 *
 * Compiles YAML workflows and deploys them to the workflows worker.
 *
 * Usage:
 *   workflow-compiler deploy <input-dir> [options]
 *   workflow-compiler deploy <input.yaml> [options]
 *
 * Options:
 *   --worker <name>       Workflow worker name (default: workflows)
 *   --dry-run            Compile but don't deploy
 *   --watch              Watch for changes and auto-deploy
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'fs'
import { join, basename, extname } from 'path'
import { parseWorkflow, validateWorkflow, compileWorkflow } from './index.js'

interface DeployOptions {
  worker?: string
  dryRun?: boolean
  watch?: boolean
  payloadUrl?: string
  apiKey?: string
}

interface DeployResult {
  workflow: string
  success: boolean
  compiled: boolean
  deployed: boolean
  error?: string
}

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
 * Deploy a single workflow
 */
async function deployWorkflow(filePath: string, options: DeployOptions): Promise<DeployResult> {
  const workflowName = basename(filePath, '.yaml')

  try {
    // Read and parse YAML
    const yaml = readFileSync(filePath, 'utf-8')
    const parseResult = parseWorkflow(yaml)

    if (parseResult.errors.length > 0) {
      error(`Parse errors in ${filePath}:`)
      parseResult.errors.forEach((err) => log(`  - ${err}`, 'red'))
      return {
        workflow: workflowName,
        success: false,
        compiled: false,
        deployed: false,
        error: 'Parse errors',
      }
    }

    // Validate
    const validation = validateWorkflow(parseResult.workflow)

    if (!validation.valid) {
      error(`Validation errors in ${filePath}:`)
      validation.errors.forEach((err) => log(`  - ${err}`, 'red'))
      return {
        workflow: workflowName,
        success: false,
        compiled: false,
        deployed: false,
        error: 'Validation errors',
      }
    }

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
      return {
        workflow: workflowName,
        success: false,
        compiled: false,
        deployed: false,
        error: 'Compilation errors',
      }
    }

    success(`Compiled ${workflowName}`)

    // Deploy to Payload CMS
    if (!options.dryRun) {
      const payloadUrl = options.payloadUrl || process.env.PAYLOAD_API_URL || 'https://admin.do.co'
      const apiKey = options.apiKey || process.env.PAYLOAD_API_KEY

      if (!apiKey) {
        warn('No API key provided - skipping deployment (use --dry-run to compile only)')
        return {
          workflow: workflowName,
          success: true,
          compiled: true,
          deployed: false,
          error: 'No API key',
        }
      }

      // Create or update workflow in Payload
      const workflowData = {
        $id: parseResult.workflow.$id,
        $type: parseResult.workflow.$type,
        name: parseResult.workflow.name,
        description: parseResult.workflow.description,
        version: parseResult.workflow.version,
        definition: yaml, // Store original YAML
        compiled: compileResult.code, // Store compiled TypeScript
        triggers: parseResult.workflow.triggers,
        steps: parseResult.workflow.steps,
        metadata: parseResult.workflow.metadata,
        status: 'active',
      }

      try {
        // Check if workflow exists
        const checkResponse = await fetch(`${payloadUrl}/api/workflows?where[slug][equals]=${parseResult.workflow.$id}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        })

        const existingWorkflows = (await checkResponse.json()) as { docs?: Array<{ id: string }> }
        const exists = existingWorkflows.docs && existingWorkflows.docs.length > 0

        // Create or update
        const method = exists ? 'PATCH' : 'POST'
        const url = exists && existingWorkflows.docs ? `${payloadUrl}/api/workflows/${existingWorkflows.docs[0].id}` : `${payloadUrl}/api/workflows`

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workflowData),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Deployment failed: ${response.status} - ${errorText}`)
        }

        success(`Deployed ${workflowName} to Payload`)

        return {
          workflow: workflowName,
          success: true,
          compiled: true,
          deployed: true,
        }
      } catch (deployError) {
        error(`Deployment failed: ${deployError instanceof Error ? deployError.message : String(deployError)}`)
        return {
          workflow: workflowName,
          success: false,
          compiled: true,
          deployed: false,
          error: deployError instanceof Error ? deployError.message : String(deployError),
        }
      }
    }

    return {
      workflow: workflowName,
      success: true,
      compiled: true,
      deployed: false,
    }
  } catch (err) {
    error(`Failed to deploy ${filePath}: ${err instanceof Error ? err.message : String(err)}`)
    return {
      workflow: workflowName,
      success: false,
      compiled: false,
      deployed: false,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

/**
 * Find all YAML files in directory
 */
function findYamlFiles(dir: string): string[] {
  const files: string[] = []

  if (!existsSync(dir)) {
    throw new Error(`Directory not found: ${dir}`)
  }

  const stat = statSync(dir)

  // If it's a file, return it
  if (stat.isFile()) {
    if (extname(dir) === '.yaml') {
      return [dir]
    }
    throw new Error(`Not a YAML file: ${dir}`)
  }

  // Otherwise recurse through directory
  const entries = readdirSync(dir)

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const entryStat = statSync(fullPath)

    if (entryStat.isDirectory()) {
      files.push(...findYamlFiles(fullPath))
    } else if (entryStat.isFile() && extname(entry) === '.yaml') {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Deploy all workflows in a directory
 */
async function deployDirectory(inputPath: string, options: DeployOptions): Promise<void> {
  log('', 'reset')
  log('='.repeat(60), 'cyan')
  log('Workflow Deployment', 'cyan')
  log('='.repeat(60), 'cyan')
  log('', 'reset')

  if (options.dryRun) {
    warn('DRY RUN MODE - Workflows will be compiled but not deployed')
    log('', 'reset')
  }

  try {
    // Find all workflow files
    const files = findYamlFiles(inputPath)

    if (files.length === 0) {
      warn(`No YAML files found in ${inputPath}`)
      return
    }

    info(`Found ${files.length} workflow(s) to deploy`)
    log('', 'reset')

    // Deploy each workflow
    const results: DeployResult[] = []

    for (const file of files) {
      log(`Processing ${basename(file)}...`, 'cyan')
      const result = await deployWorkflow(file, options)
      results.push(result)
      log('', 'reset')
    }

    // Summary
    log('='.repeat(60), 'gray')
    log('Deployment Summary', 'cyan')
    log('='.repeat(60), 'gray')
    log('', 'reset')

    const successful = results.filter((r) => r.success).length
    const compiled = results.filter((r) => r.compiled).length
    const deployed = results.filter((r) => r.deployed).length
    const failed = results.filter((r) => !r.success).length

    info(`Total workflows: ${results.length}`)
    success(`Successful: ${successful}`)
    info(`Compiled: ${compiled}`)
    info(`Deployed: ${deployed}`)

    if (failed > 0) {
      error(`Failed: ${failed}`)
      log('', 'reset')
      error('Failed workflows:')
      results
        .filter((r) => !r.success)
        .forEach((r) => {
          log(`  - ${r.workflow}: ${r.error}`, 'red')
        })
    }

    log('', 'reset')

    // Exit with error code if any failed
    if (failed > 0) {
      process.exit(1)
    }
  } catch (err) {
    error(`Deployment failed: ${err instanceof Error ? err.message : String(err)}`)
    process.exit(1)
  }
}

/**
 * Main deployment function
 */
export async function deploy(inputPath: string, options: DeployOptions = {}): Promise<void> {
  if (options.watch) {
    warn('Watch mode is not yet implemented - deploying once')
  }
  await deployDirectory(inputPath, options)
}

// Export for programmatic use
export { DeployOptions, DeployResult }
