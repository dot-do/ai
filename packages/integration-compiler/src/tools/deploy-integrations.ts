#!/usr/bin/env node

/**
 * Deploy Integrations to Workers for Platforms
 *
 * Deploys compiled integration workers to the 'integrations' dispatch namespace
 * and registers them in the database.
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { spawn } from 'child_process'

interface DeployOptions {
  integrationsDir: string
  namespace: string
  version: string
  batchSize: number
  dryRun: boolean
  services?: string[] // Optional: deploy specific services only
}

interface DeployResult {
  service: string
  version: string
  workerName: string
  success: boolean
  error?: string
  duration: number
}

class IntegrationDeployer {
  private results: DeployResult[] = []

  constructor(private options: DeployOptions) {}

  /**
   * Deploy all integrations
   */
  async deployAll(): Promise<{
    total: number
    successful: number
    failed: number
    duration: number
    results: DeployResult[]
  }> {
    const startTime = Date.now()

    console.log('Integration Deployment')
    console.log('=====================\n')
    console.log(`Namespace: ${this.options.namespace}`)
    console.log(`Version: ${this.options.version}`)
    console.log(`Batch size: ${this.options.batchSize}`)
    console.log(`Dry run: ${this.options.dryRun}`)
    console.log()

    // Get list of integrations to deploy
    const integrations = await this.getIntegrations()
    console.log(`Found ${integrations.length} integrations to deploy\n`)

    // Deploy in batches
    const batches = this.createBatches(integrations, this.options.batchSize)

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      console.log(`\nDeploying batch ${i + 1}/${batches.length} (${batch.length} integrations)...`)

      const batchResults = await Promise.all(batch.map((service) => this.deployIntegration(service)))

      this.results.push(...batchResults)

      // Progress update
      const successful = batchResults.filter((r) => r.success).length
      const failed = batchResults.filter((r) => !r.success).length
      console.log(`Batch complete: ${successful} successful, ${failed} failed`)
    }

    const duration = Date.now() - startTime
    const successful = this.results.filter((r) => r.success).length
    const failed = this.results.filter((r) => !r.success).length

    return {
      total: this.results.length,
      successful,
      failed,
      duration,
      results: this.results,
    }
  }

  /**
   * Get list of integrations to deploy
   */
  private async getIntegrations(): Promise<string[]> {
    // If specific services specified, use those
    if (this.options.services && this.options.services.length > 0) {
      return this.options.services
    }

    // Otherwise, find all compiled integrations
    const files = await fs.readdir(this.options.integrationsDir)

    // Filter to directories only (each integration is a directory)
    const integrations: string[] = []
    for (const file of files) {
      const stat = await fs.stat(path.join(this.options.integrationsDir, file))
      if (stat.isDirectory() && !file.startsWith('.') && !file.startsWith('_')) {
        integrations.push(file)
      }
    }

    return integrations.sort()
  }

  /**
   * Create batches of integrations
   */
  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = []
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize))
    }
    return batches
  }

  /**
   * Deploy a single integration
   */
  private async deployIntegration(service: string): Promise<DeployResult> {
    const startTime = Date.now()
    const workerName = `${service}-${this.options.version}`

    try {
      const integrationDir = path.join(this.options.integrationsDir, service)

      // Check if client.ts exists (integration is compiled)
      const clientPath = path.join(integrationDir, 'client.ts')
      try {
        await fs.access(clientPath)
      } catch {
        return {
          service,
          version: this.options.version,
          workerName,
          success: false,
          error: 'Integration not compiled (client.ts not found)',
          duration: Date.now() - startTime,
        }
      }

      if (this.options.dryRun) {
        console.log(`  [DRY RUN] Would deploy ${workerName}`)
        return {
          service,
          version: this.options.version,
          workerName,
          success: true,
          duration: Date.now() - startTime,
        }
      }

      // Deploy using wrangler
      await this.runWrangler(['deploy', '--dispatch-namespace', this.options.namespace, '--name', workerName, path.join(integrationDir, 'worker.js')])

      console.log(`  ✓ ${workerName}`)

      return {
        service,
        version: this.options.version,
        workerName,
        success: true,
        duration: Date.now() - startTime,
      }
    } catch (error) {
      console.error(`  ✗ ${workerName}: ${error instanceof Error ? error.message : String(error)}`)

      return {
        service,
        version: this.options.version,
        workerName,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime,
      }
    }
  }

  /**
   * Run wrangler command
   */
  private runWrangler(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const proc = spawn('wrangler', args, {
        stdio: ['ignore', 'pipe', 'pipe'],
      })

      let stdout = ''
      let stderr = ''

      proc.stdout?.on('data', (data) => {
        stdout += data.toString()
      })

      proc.stderr?.on('data', (data) => {
        stderr += data.toString()
      })

      proc.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`wrangler exited with code ${code}: ${stderr || stdout}`))
        }
      })

      proc.on('error', (error) => {
        reject(error)
      })
    })
  }

  /**
   * Generate database registration SQL
   */
  generateRegistrationSQL(): string {
    const successful = this.results.filter((r) => r.success)

    if (successful.length === 0) {
      return '-- No integrations to register'
    }

    const values = successful
      .map(
        (r) => `  ('${r.service}', '${r.version}', '${r.workerName}', 'active', NULL)` // metadata will be populated separately
      )
      .join(',\n')

    return `-- Register deployed integrations
INSERT INTO integrations (service, version, worker_name, status, metadata)
VALUES
${values}
ON CONFLICT (service, version) DO UPDATE
SET
  worker_name = EXCLUDED.worker_name,
  status = EXCLUDED.status,
  updated_at = NOW();
`
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2)

  // Parse command line arguments
  const options: DeployOptions = {
    integrationsDir: process.env.INTEGRATIONS_DIR || '../sdk.do/src/integrations',
    namespace: process.env.DISPATCH_NAMESPACE || 'integrations',
    version: process.env.VERSION || 'v1',
    batchSize: parseInt(process.env.BATCH_SIZE || '50', 10),
    dryRun: args.includes('--dry-run') || process.env.DRY_RUN === 'true',
    services: args.filter((arg) => !arg.startsWith('--')),
  }

  // Resolve paths
  options.integrationsDir = path.resolve(process.cwd(), options.integrationsDir)

  const deployer = new IntegrationDeployer(options)

  try {
    const summary = await deployer.deployAll()

    console.log('\n\n' + '='.repeat(50))
    console.log('Deployment Complete')
    console.log('='.repeat(50))
    console.log(`Total integrations: ${summary.total}`)
    console.log(`✓ Successful: ${summary.successful}`)
    console.log(`✗ Failed: ${summary.failed}`)
    console.log(`Duration: ${(summary.duration / 1000).toFixed(1)}s`)
    console.log(`Success rate: ${((summary.successful / summary.total) * 100).toFixed(1)}%`)

    if (summary.failed > 0) {
      console.log('\nFailed integrations:')
      summary.results
        .filter((r) => !r.success)
        .forEach((r) => {
          console.log(`  - ${r.workerName}: ${r.error}`)
        })
    }

    // Generate SQL for database registration
    if (!options.dryRun && summary.successful > 0) {
      const sql = deployer.generateRegistrationSQL()
      const sqlPath = path.join(process.cwd(), 'deployed-integrations.sql')
      await fs.writeFile(sqlPath, sql, 'utf-8')
      console.log(`\nDatabase registration SQL written to: ${sqlPath}`)
      console.log('Run this SQL to register integrations in the database.')
    }

    process.exit(summary.failed > 0 ? 1 : 0)
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

export type { DeployOptions, DeployResult }
export { IntegrationDeployer }

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
