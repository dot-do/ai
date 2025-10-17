/**
 * Wrangler Integration
 * Converts MDXLD Worker to wrangler.jsonc and delegates to wrangler CLI
 */

import { writeFile, unlink } from 'fs/promises'
import { dirname, join, resolve } from 'path'
import { spawn } from 'child_process'
import which from 'which'
import type { MDXLDWorker, WranglerConfig, CommandOptions } from './types.js'
import { bundleAssets, validateManifest, printManifestSummary } from './assets.js'

// Default timeout for wrangler commands (10 minutes for dev/deploy)
const DEFAULT_TIMEOUT = 10 * 60 * 1000

/**
 * Check if wrangler CLI is installed and available
 *
 * @returns True if wrangler is installed, false otherwise
 *
 * @example
 * ```typescript
 * if (!await checkWranglerInstalled()) {
 *   throw new Error('wrangler CLI not found. Install with: npm install -g wrangler')
 * }
 * ```
 */
export async function checkWranglerInstalled(): Promise<boolean> {
  try {
    await which('wrangler')
    return true
  } catch {
    return false
  }
}

/**
 * Extract wrangler configuration from worker frontmatter
 *
 * @param worker - Parsed MDXLD worker
 * @returns Wrangler configuration object with $schema reference
 *
 * @remarks
 * Extracts only wrangler-specific fields from the frontmatter,
 * ignoring linked data properties like $type, $id, $context
 *
 * @example
 * ```typescript
 * const config = extractWranglerConfig(worker)
 * console.log(config.name) // 'my-worker'
 * ```
 */
export function extractWranglerConfig(worker: MDXLDWorker): WranglerConfig {
  const { frontmatter } = worker
  const config: WranglerConfig = {}

  // Copy all wrangler-specific properties
  const wranglerKeys = [
    'name',
    'main',
    'compatibility_date',
    'compatibility_flags',
    'account_id',
    'workers_dev',
    'observability',
    'services',
    'durable_objects',
    'kv_namespaces',
    'r2_buckets',
    'd1_databases',
    'vectorize',
    'ai',
    'analytics_engine_datasets',
    'worker_loaders',
    'tail_consumers',
    'migrations',
    'routes',
    'vars',
    'queues',
    'pipelines',
    'dispatch_namespaces',
    'assets',
    'env',
  ] as const

  for (const key of wranglerKeys) {
    if (key in frontmatter) {
      const typedKey = key as keyof WranglerConfig
      const value = frontmatter[typedKey]
      if (value !== undefined) {
        // Type-safe assignment using Record type for dynamic property access
        ;(config as Record<string, unknown>)[typedKey] = value
      }
    }
  }

  config.$schema = 'node_modules/wrangler/config-schema.json'
  return config
}

/**
 * Generate temporary wrangler.jsonc configuration file
 *
 * @param worker - Parsed MDXLD worker
 * @param options - Command options (for assets path override)
 * @returns Path to the generated temporary config file
 *
 * @remarks
 * Creates a `.wrangler.mdxe.jsonc` file in the worker's directory.
 * This file should be cleaned up after use with {@link cleanupWranglerConfig}
 *
 * @example
 * ```typescript
 * const configPath = await generateWranglerConfig(worker)
 * // Use config...
 * await cleanupWranglerConfig(configPath)
 * ```
 */
export async function generateWranglerConfig(
  worker: MDXLDWorker,
  options: CommandOptions = {}
): Promise<string> {
  const config = extractWranglerConfig(worker)
  const workerDir = dirname(worker.filePath)

  // Handle static assets if provided via CLI or frontmatter
  const assetsPath = options.assets || config.assets?.directory
  if (assetsPath) {
    const absoluteAssetsPath = resolve(workerDir, assetsPath)

    // Bundle and validate assets
    console.log(`\n📦 Bundling static assets from: ${assetsPath}`)
    const manifest = bundleAssets(absoluteAssetsPath)

    // Validate manifest
    const validation = validateManifest(manifest)
    if (!validation.valid) {
      throw new Error(`Asset validation failed:\n${validation.errors.join('\n')}`)
    }

    // Print summary
    printManifestSummary(manifest)

    // Update config with assets
    if (!config.assets) {
      config.assets = {}
    }
    config.assets.directory = assetsPath
    config.assets.binding = config.assets.binding || 'ASSETS'
  }

  const configPath = join(workerDir, '.wrangler.mdxe.jsonc')

  const configJson = JSON.stringify(config, null, 2)
  await writeFile(configPath, configJson, 'utf-8')

  return configPath
}

/**
 * Clean up temporary wrangler configuration file
 *
 * @param configPath - Path to the temporary config file to remove
 *
 * @remarks
 * Silently ignores ENOENT errors if the file doesn't exist.
 * Logs other errors to stderr but doesn't throw.
 * Should be called in a finally block to ensure cleanup.
 *
 * @example
 * ```typescript
 * try {
 *   const configPath = await generateWranglerConfig(worker)
 *   // Use config...
 * } finally {
 *   await cleanupWranglerConfig(configPath)
 * }
 * ```
 */
export async function cleanupWranglerConfig(configPath: string): Promise<void> {
  try {
    await unlink(configPath)
  } catch (error) {
    // Ignore ENOENT errors (file doesn't exist)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return
    }
    // Log other errors but don't throw
    console.error('Warning: Failed to clean up wrangler config:', error instanceof Error ? error.message : error)
  }
}

/**
 * Execute a wrangler CLI command with the worker configuration
 *
 * @param command - Wrangler command to run (dev, deploy, etc.)
 * @param worker - Parsed MDXLD worker
 * @param options - Command options (env, verbose, etc.)
 * @returns Result object with success flag, output, and optional error
 *
 * @remarks
 * - Automatically creates and cleans up temporary wrangler config
 * - Spawns wrangler CLI as child process
 * - Captures stdout/stderr for verbose mode
 * - Adds --minify flag for deploy command
 *
 * @example
 * ```typescript
 * const result = await runWrangler('dev', worker, { verbose: true })
 * if (!result.success) {
 *   console.error('Failed:', result.error)
 * }
 * ```
 */
export async function runWrangler(
  command: string,
  worker: MDXLDWorker,
  options: CommandOptions = {}
): Promise<{ success: boolean; output: string; error?: string }> {
  // Check if wrangler is installed
  if (!(await checkWranglerInstalled())) {
    return {
      success: false,
      output: '',
      error: 'wrangler CLI not found. Install with: npm install -g wrangler',
    }
  }

  let configPath: string | undefined

  try {
    // Generate temporary wrangler config (includes asset bundling)
    configPath = await generateWranglerConfig(worker, options)

    const workerDir = dirname(worker.filePath)
    const args = [command]

    // Add config flag
    args.push('--config', configPath)

    // Add environment flag
    if (options.env) {
      args.push('--env', options.env)
    }

    // Add verbose flag
    if (options.verbose) {
      args.push('--verbose')
    }

    // Add dispatch namespace for Workers for Platforms deployment
    if (command === 'deploy' && options.namespace) {
      args.push('--dispatch-namespace', options.namespace)
      console.log(`\n🚀 Deploying to Workers for Platforms namespace: ${options.namespace}`)
    }

    // Add minify for deploy
    if (command === 'deploy') {
      args.push('--minify')

      // Add dry-run flag if requested
      if (options.dryRun) {
        args.push('--dry-run')
      }
    }

    // Run wrangler with timeout
    return await new Promise((resolve) => {
      const proc = spawn('wrangler', args, {
        cwd: workerDir,
        stdio: ['inherit', 'pipe', 'pipe'],
      })

      let stdout = ''
      let stderr = ''
      let isResolved = false

      // Set timeout (skip for dev command which runs indefinitely)
      const timeout =
        command === 'dev'
          ? undefined
          : setTimeout(() => {
              if (!isResolved) {
                isResolved = true
                proc.kill('SIGTERM')
                resolve({
                  success: false,
                  output: stdout,
                  error: `Command timed out after ${DEFAULT_TIMEOUT / 1000}s`,
                })
              }
            }, DEFAULT_TIMEOUT)

      proc.stdout?.on('data', (data) => {
        stdout += data.toString()
        if (options.verbose) {
          process.stdout.write(data)
        }
      })

      proc.stderr?.on('data', (data) => {
        stderr += data.toString()
        if (options.verbose) {
          process.stderr.write(data)
        }
      })

      proc.on('close', (code) => {
        if (!isResolved) {
          isResolved = true
          if (timeout) clearTimeout(timeout)
          resolve({
            success: code === 0,
            output: stdout,
            error: code !== 0 ? stderr : undefined,
          })
        }
      })

      proc.on('error', (error) => {
        if (!isResolved) {
          isResolved = true
          if (timeout) clearTimeout(timeout)
          resolve({
            success: false,
            output: stdout,
            error: error.message,
          })
        }
      })
    })
  } finally {
    // Clean up temporary config
    if (configPath) {
      await cleanupWranglerConfig(configPath)
    }
  }
}
